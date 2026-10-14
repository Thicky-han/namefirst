// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.
// Inspect ZIP contents in memory; never extract or print matched secrets.
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { inflateRawSync } from "node:zlib";
import { execFileSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
execFileSync(process.execPath, [path.join(root, "scripts/check-public-content.mjs")], { stdio: "inherit" });
const source = JSON.parse(await fs.readFile(path.join(root, ".cache/public-content-check.json"), "utf8"));
const version = JSON.parse(await fs.readFile(path.join(root, "config/extension-identity.json"), "utf8")).version;
const directory = path.join(root, "release", version);
const metadata = JSON.parse(await fs.readFile(path.join(directory, "release-manifest.json"), "utf8"));
const digest = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const byName = new Map(source.reviewed.map(item => [item.file, item.sha256]));
const knownHashes = new Set(byName.values());
const rules = [
  ["private-key", /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/gu],
  ["credential-token", /(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-(?:proj-)?[A-Za-z0-9_-]{24,}|AKIA[A-Z0-9]{16})/gu],
  ["bearer-literal", /\bBearer\s+[A-Za-z0-9._-]{24,}/gu],
  ["credential-assignment", /\b[A-Z0-9_]*(?:password|passwd|api[_-]?key|access[_-]?token|refresh[_-]?token|client[_-]?secret)[A-Z0-9_]*["'\s]*[:=]\s*["']([^"'\r\n]{12,})["']/giu],
  ["absolute-machine-path", /(?:^|[^A-Za-z0-9])(?:[A-Za-z]:[\\/]|\/(?:Users|home)\/)/gmu],
  ["private-contact", /\b[A-Z0-9._%+-]+@(?!example\.(?:com|org)|users\.noreply\.github\.com)[A-Z0-9.-]+\.[A-Z]{2,}\b/giu],
  ["credential-in-url", /https?:\/\/[^\s/"'<>]+:[^\s/"'<>]+@/gu],
];
for (const localName of new Set([os.userInfo().username, path.basename(os.homedir())])) {
  if (localName.length >= 4) rules.push(["local-user-identity", new RegExp(`\\b${localName.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}\\b`, "giu")]);
}
const findings = [];
const publicAttributions = [];
const archives = [];
for (const asset of metadata.archives) {
  if (!/^namefirst-(?:chrome|edge|source)-\d+\.\d+\.\d+\.zip$/u.test(asset.name)) throw Error("Unexpected asset name");
  const input = await fs.readFile(path.join(directory, asset.name));
  if (digest(input) !== asset.sha256 || input.length !== asset.bytes) throw Error("Archive checksum mismatch");
  let end = -1;
  for (let offset = input.length - 22; offset >= Math.max(0, input.length - 65557); offset--) {
    if (input.readUInt32LE(offset) === 0x06054b50 && offset + 22 + input.readUInt16LE(offset + 20) === input.length) { end = offset; break; }
  }
  if (end < 0 || input.readUInt16LE(end + 4) || input.readUInt16LE(end + 6)) throw Error("Unsupported ZIP layout");
  const count = input.readUInt16LE(end + 10);
  let cursor = input.readUInt32LE(end + 16);
  const seen = new Set();
  let sourceMatched = 0;
  for (let index = 0; index < count; index++) {
    if (input.readUInt32LE(cursor) !== 0x02014b50) throw Error("Invalid ZIP directory");
    const flags = input.readUInt16LE(cursor + 8);
    const method = input.readUInt16LE(cursor + 10);
    const size = input.readUInt32LE(cursor + 20);
    const expandedSize = input.readUInt32LE(cursor + 24);
    const nameSize = input.readUInt16LE(cursor + 28);
    const extraSize = input.readUInt16LE(cursor + 30);
    const commentSize = input.readUInt16LE(cursor + 32);
    const attributes = input.readUInt32LE(cursor + 38);
    const offset = input.readUInt32LE(cursor + 42);
    const name = input.subarray(cursor + 46, cursor + 46 + nameSize).toString("utf8");
    cursor += 46 + nameSize + extraSize + commentSize;
    if (flags & 1 || expandedSize > 20_000_000 || (attributes >>> 16 & 0xf000) === 0xa000) throw Error("Unsupported or unsafe ZIP entry");
    if (/^(?:\/|[A-Za-z]:)|\\|(?:^|\/)\.\.(?:\/|$)/u.test(name) || seen.has(name.toLowerCase())) throw Error("Unsafe or duplicate ZIP entry");
    seen.add(name.toLowerCase());
    if (input.readUInt32LE(offset) !== 0x04034b50) throw Error("Invalid ZIP local header");
    const dataStart = offset + 30 + input.readUInt16LE(offset + 26) + input.readUInt16LE(offset + 28);
    const packed = input.subarray(dataStart, dataStart + size);
    const bytes = method === 0 ? packed : method === 8 ? inflateRawSync(packed, { maxOutputLength: 20_000_000 }) : null;
    if (!bytes || bytes.length !== expandedSize) throw Error("Invalid expanded ZIP content");
    const hash = digest(bytes);
    if (asset.name.includes("-source-")) {
      const prefix = `namefirst-${version}/`;
      const relative = name.startsWith(prefix) ? name.slice(prefix.length) : "";
      if (byName.get(relative) !== hash) throw Error("Source archive contains unreviewed or changed content");
      sourceMatched++;
      continue;
    }
    if (/(?:^|\/)(?:\.git|node_modules|test-results|\.cache|private)(?:\/|$)|\.(?:pem|key|p12|pfx|log|tmp|bak|map)$/iu.test(name)) findings.push({ archive: asset.name, file: name, category: "private-or-generated-file" });
    if (/\.png$/iu.test(name)) {
      let chunk = 8;
      while (chunk + 12 <= bytes.length) {
        const length = bytes.readUInt32BE(chunk);
        const type = bytes.subarray(chunk + 4, chunk + 8).toString("ascii");
        if (["eXIf", "tEXt", "zTXt", "iTXt"].includes(type)) findings.push({ archive: asset.name, file: name, category: "image-text-metadata" });
        chunk += length + 12;
      }
      continue;
    }
    if (knownHashes.has(hash)) continue; // Byte-identical, freshly reviewed source documentation/licenses.
    if (!/\.(?:js|css|html|json|txt|md)$/iu.test(name)) { findings.push({ archive: asset.name, file: name, category: "unexpected-asset" }); continue; }
    const content = bytes.toString("utf8");
    for (const [category, regex] of rules) for (const match of content.matchAll(regex)) {
      if (category === "credential-assignment" && /^<[A-Z0-9_]+ not set>$/u.test(match[1])) continue;
      if (category === "private-contact" && name === "extension/third-party-notices.txt") {
        // Reviewed MIT attribution from the lockfile's zod-validation-error 5.0.0.
        // Require the exact full license body, not merely an allowed email/domain.
        const prefix = "zod-validation-error\n\n";
        const block = content.replace(/\r\n/g, "\n").split("\n\n\n").find(value => value.startsWith(prefix));
        const license = block?.slice(prefix.length).trimEnd();
        if (license?.includes(match[0]) && digest(Buffer.from(license)) === "2806ece4e2aaf462e6e569b40b709778c89620ad7a6bd0e132b0d92fb6360181") {
          publicAttributions.push({ archive: asset.name, file: name, dependency: "zod-validation-error@5.0.0", reason: "exact reviewed MIT license attribution" });
          continue;
        }
      }
      findings.push({ archive: asset.name, file: name, line: content.slice(0, match.index).split("\n").length, category });
    }
  }
  if (asset.name.includes("-source-") && sourceMatched !== byName.size) throw Error("Source archive is incomplete");
  archives.push({ name: asset.name, entries: count, sourceMatched });
}
const report = { outcome: findings.length ? "review-required" : "passed", archives, findings, publicAttributions, sourceFiles: byName.size };
await fs.writeFile(path.join(root, ".cache/release-content-check.json"), JSON.stringify(report, null, 2) + "\n");
console.log(`Release content check: ${archives.length} ZIPs; ${findings.length} items to review. Matched values are not printed.`);
if (findings.length) { for (const item of findings) console.log(`${item.archive}/${item.file}:${item.line ?? 0}: ${item.category}`); process.exitCode = 1; }
