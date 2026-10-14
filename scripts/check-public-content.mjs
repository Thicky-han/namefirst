// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.
// Report categories and relative locations only; never echo matched secrets.
import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import os from "node:os";

const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, ".cache/public-content-check.json");
const names = execFileSync("git", ["-c", "core.quotepath=false", "-C", root,
  "ls-files", "--cached", "--others", "--exclude-standard", "-z", "--", "."],
  { encoding: "utf8", maxBuffer: 10_000_000 }).split("\0").filter(Boolean);
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
  if (localName.length >= 4) {
    const escaped = localName.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
    rules.push(["local-user-identity", new RegExp(`\\b${escaped}\\b`, "giu")]);
  }
}
const syntheticCredentialFixtures = new Map([
  ["extension/src/scripts/namefirst/memory.test.ts", ["user", "password", "/"]],
  ["extension/src/scripts/namefirst/resolve.test.ts", ["user", "pass", "/"]],
  ["extension/src/scripts/sync-backends/webdav.test.ts", ["u", "p", "/dav/"]],
]);
const syntheticAuthorityFixtures = new Map([
  ["extension/src/scripts/namefirst/baidu.test.ts", ["user", "www.baidu.com", "/s"]],
  ["extension/src/scripts/namefirst/bing-urls.test.ts", ["user", "www.bing.com", "/search"]],
]);
const forbiddenName = /^(?:dist|release|\.cache)\/|(?:^|\/)(?:\.git|dist|node_modules|test-results|legal\/private)(?:\/|$)|(?:^|\/)(?:\.env(?:\..*)?|Thumbs\.db|Desktop\.ini|\.DS_Store)$|\.(?:pem|key|p12|pfx|log|tmp|bak)$/iu;
const findings = [];
const reviewed = [];
const syntheticFixtures = [];
let bytes = 0;
for (const name of [...new Set(names)].sort()) {
  const full = path.resolve(root, name);
  if (!full.startsWith(root + path.sep)) throw Error("Source path escaped project");
  let stat;
  try { stat = await fs.lstat(full); } catch (error) { if (error.code === "ENOENT") continue; throw error; }
  if (!stat.isFile() || stat.isSymbolicLink()) {
    findings.push({ file: name, category: "unexpected-file-type" });
    continue;
  }
  if (forbiddenName.test(name) && !name.endsWith(".env.example")) {
    findings.push({ file: name, category: "private-or-generated-file" });
    continue;
  }
  const buffer = await fs.readFile(full);
  bytes += buffer.length;
  reviewed.push({ file: name, sha256: crypto.createHash("sha256").update(buffer).digest("hex") });
  if (/\.(?:png|jpg|jpeg|gif|ico|woff2?)$/iu.test(name)) continue;
  const content = buffer.toString("utf8");
  for (const [category, regex] of rules) {
    for (const match of content.matchAll(regex)) {
      const line = content.slice(0, match.index).split("\n").length;
      if (category === "credential-assignment" && /^<[A-Z0-9_]+ not set>$/u.test(match[1])) continue;
      // Imported upstream author/security addresses and attributed LICENSE
      // contacts are already public provenance; do not remove legal notices.
      if (category === "private-contact" && name.startsWith("extension/")) {
        const authority = syntheticAuthorityFixtures.get(name);
        if (authority && content.slice(match.index - 8, match.index) === "https://") {
          const literal = content.slice(match.index - 8).match(/^https?:\/\/[^\s"'<>]+/u)?.[0];
          const url = literal && new URL(literal);
          if (url && url.username === authority[0] && !url.password && url.hostname === authority[1] && url.pathname === authority[2]) {
            syntheticFixtures.push({ file: name, line, reason: "explicit credential-authority rejection fixture; not private contact data" });
            continue;
          }
        }
        try {
          const baseline = execFileSync("git", ["-C", root, "show", `212384b330002a4c727b034806826e2eb352d7d5:${name.slice(10)}`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
          if (baseline.includes(match[0])) continue;
        } catch {}
      }
      if (category === "credential-in-url" && syntheticCredentialFixtures.has(name)) {
        const expected = syntheticCredentialFixtures.get(name);
        const literal = content.slice(match.index).match(/^https?:\/\/[^\s"'<>]+/u)?.[0];
        if (literal) {
          const url = new URL(literal);
          if (url.hostname === "example.com" && url.username === expected[0] && url.password === expected[1] && url.pathname === expected[2]) {
            syntheticFixtures.push({ file: name, line, reason: "explicit example.com rejection fixture; not a real credential" });
            continue;
          }
        }
      }
      findings.push({ file: name, line, category });
    }
  }
}
const report = { schemaVersion: 1, sourceFiles: reviewed.length, bytes,
  outcome: findings.length ? "review-required" : "passed", findings,
  syntheticFixtures,
  publicMetadataExceptions: ["manifest public key", "attributed upstream public contacts", "GitHub username and noreply author"],
  reviewed };
await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, JSON.stringify(report, null, 2) + "\n");
console.log(`Public source check: ${reviewed.length} files; ${findings.length} items to review. Matched values are not printed.`);
if (findings.length) {
  for (const item of findings) console.log(`${item.file}:${item.line ?? 0}: ${item.category}`);
  process.exitCode = 1;
}
