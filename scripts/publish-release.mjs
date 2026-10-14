// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.
// Run only after explicit approval of the prepared commit and release assets.
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const repository = "Thicky-han/namefirst";
function git(...args) {
  return execFileSync("git", ["-C", root, ...args], { encoding: "utf8", maxBuffer: 20_000_000 });
}
function api(endpoint, body, method) {
  const args = ["api", endpoint];
  if (body !== undefined) args.push("--input", "-");
  if (method) args.push("--method", method);
  const result = execFileSync("gh", args, { input: body === undefined ? undefined : JSON.stringify(body), encoding: "utf8", maxBuffer: 20_000_000 });
  return result.trim() ? JSON.parse(result) : null;
}
const identity = JSON.parse(await fs.readFile(path.join(root, "config/extension-identity.json"), "utf8"));
const directory = path.join(root, "release", identity.version);
const metadata = JSON.parse(await fs.readFile(path.join(directory, "release-manifest.json"), "utf8"));
const commit = git("rev-parse", "HEAD").trim();
if (!process.argv.includes("--confirm-public-release")) {
  console.log(`Prepared ${repository}, main, v${identity.version}, commit ${commit}. No public upload performed.`);
  process.exit(0);
}
const expected = process.argv.find(value => value.startsWith("--expected-commit="))?.split("=")[1];
if (expected !== commit || metadata.sourceCommit !== commit || metadata.sourceBranch !== "main") throw Error("The approved source commit must match HEAD and package metadata.");
if (git("branch", "--show-current").trim() !== "main" || git("status", "--porcelain").trim()) throw Error("Expected a clean, reviewed main branch.");
if (git("remote", "get-url", "origin").trim() !== `https://github.com/${repository}.git`) throw Error("Unexpected destination repository.");
execFileSync(process.execPath, [path.join(root, "scripts/check-public-content.mjs")], { cwd: root, stdio: "inherit" });
execFileSync("pwsh", ["-NoProfile", "-File", path.join(root, "scripts/Verify-Package.ps1")], { cwd: root, stdio: "inherit" });
execFileSync("pwsh", ["-NoProfile", "-File", path.join(root, "scripts/Audit-Runtime.ps1")], { cwd: root, stdio: "inherit" });
execFileSync(process.execPath, [path.join(root, "scripts/check-release-content.mjs")], { cwd: root, stdio: "inherit" });
const expectedFiles = ["chrome", "edge", "source"].map(target => `namefirst-${target}-${identity.version}.zip`);
if (JSON.stringify(metadata.archives.map(item => item.name).sort()) !== JSON.stringify([...expectedFiles].sort())) throw Error("Unexpected release file selection.");
for (const asset of metadata.archives) {
  const bytes = await fs.readFile(path.join(directory, asset.name));
  if (crypto.createHash("sha256").update(bytes).digest("hex") !== asset.sha256 || bytes.length !== asset.bytes) throw Error("Approved archive checksum changed.");
}
const tag = `v${identity.version}`;
const priorReleases = api(`repos/${repository}/releases`);
if (priorReleases.some(release => release.tag_name === tag)) throw Error("A release with this tag exists; inspect it before continuing.");
const refs = api(`repos/${repository}/git/matching-refs/heads/main`);
if (refs.some(ref => ref.ref === "refs/heads/main" && ref.object.sha !== commit)) throw Error("Remote main already differs; refusing to overwrite it.");
const tags = api(`repos/${repository}/git/matching-refs/tags/${tag}`);
if (tags.some(ref => ref.ref === `refs/tags/${tag}` && ref.object.sha !== commit)) throw Error("The tag points to another commit.");

// GitHub's Git object API is used when direct Git transport is unavailable.
// Hashes must equal the local reviewed objects before any public ref is set.
const parent = git("rev-parse", "HEAD^").trim();
const baseline = api(`repos/${repository}/git/trees/${parent}?recursive=1`);
if (baseline.truncated) throw Error("Incomplete remote baseline tree.");
const knownBlobs = new Set(baseline.tree.filter(item => item.type === "blob").map(item => item.sha));
const treeEntries = git("ls-tree", "-r", "-z", "HEAD").split("\0").filter(Boolean).map(line => {
  const [header, name] = line.split("\t");
  const [mode, type, sha] = header.split(" ");
  if (type !== "blob") throw Error("Release source must not contain Gitlinks or tree-only entries.");
  return { path: name, mode, type, sha };
});
const remoteEntries = [];
for (const entry of treeEntries) {
  if (knownBlobs.has(entry.sha)) { remoteEntries.push(entry); continue; }
  const bytes = execFileSync("git", ["-C", root, "cat-file", "blob", entry.sha], { maxBuffer: 20_000_000 });
  const content = bytes.toString("utf8");
  if (!bytes.includes(0) && Buffer.from(content).equals(bytes)) {
    remoteEntries.push({ path: entry.path, mode: entry.mode, type: "blob", content });
  } else {
    const blob = api(`repos/${repository}/git/blobs`, { content: bytes.toString("base64"), encoding: "base64" });
    if (blob.sha !== entry.sha) throw Error("Uploaded blob hash mismatch.");
    remoteEntries.push(entry);
  }
}
const tree = api(`repos/${repository}/git/trees`, { tree: remoteEntries });
if (tree.sha !== git("rev-parse", "HEAD^{tree}").trim()) throw Error("Uploaded source tree differs from the reviewed local tree.");
const rawCommit = git("cat-file", "commit", commit);
const split = rawCommit.indexOf("\n\n");
const headers = rawCommit.slice(0, split).split("\n");
function person(kind) {
  const line = headers.find(value => value.startsWith(kind + " "));
  const matched = line?.match(/^[a-z]+ (.+) <([^>]+)> (\d+) ([+-]\d{4})$/u);
  if (!matched || matched[4] !== "+0000") throw Error("Expected reviewed public UTC commit metadata.");
  return { name: matched[1], email: matched[2], date: new Date(Number(matched[3]) * 1000).toISOString() };
}
if (headers.some(line => line.startsWith("gpgsig "))) throw Error("Signed commit transport requires a separate reviewed procedure.");
const remoteCommit = api(`repos/${repository}/git/commits`, { message: rawCommit.slice(split + 2), tree: tree.sha, parents: [parent], author: person("author"), committer: person("committer") });
if (remoteCommit.sha !== commit) throw Error("Uploaded commit hash differs; public main was not changed.");
if (!refs.some(ref => ref.ref === "refs/heads/main")) api(`repos/${repository}/git/refs`, { ref: "refs/heads/main", sha: commit });
api(`repos/${repository}`, { default_branch: "main" }, "PATCH");
if (!tags.some(ref => ref.ref === `refs/tags/${tag}`)) api(`repos/${repository}/git/refs`, { ref: `refs/tags/${tag}`, sha: commit });
execFileSync("gh", ["release", "create", tag, "--repo", repository, "--draft", "--verify-tag", "--target", "main", "--title", `NameFirst ${identity.version}`, "--notes-file", path.join(root, "RELEASE_NOTES.md"), ...[...expectedFiles, "release-manifest.json", "SHA256SUMS.txt"].map(name => path.join(directory, name))], { cwd: root, stdio: "inherit" });
const release = api(`repos/${repository}/releases`).find(item => item.tag_name === tag);
const expectedAssets = [...expectedFiles, "release-manifest.json", "SHA256SUMS.txt"];
if (!release?.draft || release.assets.length !== expectedAssets.length) throw Error("Unexpected release draft asset set.");
for (const name of expectedAssets) {
  const asset = release.assets.find(item => item.name === name);
  const local = await fs.readFile(path.join(directory, name));
  const digest = "sha256:" + crypto.createHash("sha256").update(local).digest("hex");
  if (!asset || asset.size !== local.length || asset.digest !== digest) throw Error("Remote release asset checksum did not match; draft remains unpublished.");
}
execFileSync("gh", ["release", "edit", tag, "--repo", repository, "--draft=false", "--latest"], { cwd: root, stdio: "inherit" });
console.log(`Published https://github.com/${repository}/releases/tag/${tag} from reviewed main ${commit}.`);
