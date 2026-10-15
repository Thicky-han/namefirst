// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

import assert from "node:assert/strict";
import { test } from "node:test";

import catalog from "./catalog.json" with { type: "json" };
import { resolveName } from "./resolve.ts";

const current = { asOf: "2026-10-15" };
const additions = catalog.platforms.filter(
  (platform) => platform.verification.verifiedAt === current.asOf,
);

test("the student update adds exactly 68 separately identified subjects", () => {
  assert.equal(additions.length, 68);
  assert.equal(catalog.version, "2026.10.15.1");
  assert.equal(catalog.schemaVersion, 1);
});

test("new verified aliases recall their own platform without personal memory", async (t) => {
  for (const platform of additions) {
    for (const alias of platform.aliases) {
      await t.test(alias.name, () => {
        const result = resolveName(alias.name, current);
        assert.equal(result.status, "official");
        if (result.status === "official") {
          assert.equal(result.result.platformId, platform.id);
        }
      });
    }
  }
});

test("download queries select the recorded download purpose rather than a guessed address", async (t) => {
  for (const platform of additions) {
    const download = platform.entries.find(
      (entry) => entry.purpose === "download",
    );
    if (!download) {
      continue;
    }
    await t.test(platform.canonicalName, () => {
      for (const suffix of ["下载", "官方下载", " download"]) {
        const result = resolveName(platform.canonicalName + suffix, current);
        assert.equal(result.status, "official");
        if (result.status === "official") {
          assert.equal(result.result.platformId, platform.id);
          assert.equal(result.result.entry.purpose, "download");
          assert.equal(result.result.entry.url, download.url);
        }
      }
    });
  }
});

test("Chinese names and repaired download destinations select the reviewed product", () => {
  for (const [query, id, url] of [
    ["可画", "canva-cn", "https://www.canva.cn/zh_cn/"],
    ["Canva可画", "canva-cn", "https://www.canva.cn/zh_cn/"],
    ["可画下载", "canva-cn", "https://www.canva.cn/download/windows/"],
    ["RStudio下载", "rstudio", "https://docs.posit.co/ide/user/download.html"],
    ["DeepL下载", "deepl", "https://www.deepl.com/en/windows-app"],
    [
      "Adobe Creative Cloud下载",
      "adobe-creative-cloud",
      "https://www.adobe.com/download/creative-cloud",
    ],
    ["Zotero download", "zotero", "https://www.zotero.org/download/"],
    [
      "Visual Studio下载",
      "visual-studio",
      "https://visualstudio.microsoft.com/downloads/",
    ],
    ["VS Code", "vscode", "https://code.visualstudio.com/"],
    ["百度网盘下载", "baidu-netdisk", "https://pan.baidu.com/download"],
    ["DeepSeek网页版", "deepseek", "https://chat.deepseek.com/"],
  ]) {
    const result = resolveName(query!, current);
    assert.equal(result.status, "official", query!);
    if (result.status === "official") {
      assert.equal(result.result.platformId, id, query!);
      assert.equal(result.result.entry.url, url, query!);
    }
  }
});

test("a missing download entry, a tutorial, and unreviewed suite products are not certified", () => {
  const missing = resolveName("Overleaf下载", current);
  assert.equal(missing.status, "candidate");
  if (missing.status === "candidate") {
    assert.equal(missing.reason, "entry-unavailable");
  }
  assert.equal(resolveName("可画怎么用", current).status, "none");
  assert.equal(resolveName("MATLAB教程", current).status, "none");
  for (const query of ["Photoshop", "PyCharm", "Word", "Qwen"]) {
    assert.equal(resolveName(query, current).status, "none", query);
  }
});

test("new records have the same expiry gate and cannot refresh old verification dates", () => {
  const result = resolveName("可画", { asOf: "2027-10-15" });
  assert.equal(result.status, "candidate");
  if (result.status === "candidate") {
    assert.equal(result.reason, "stale-record");
  }
  assert.equal(
    catalog.platforms.find((item) => item.id === "steam")!.verification
      .verifiedAt,
    "2026-10-13",
  );
  assert.equal(
    catalog.platforms.find((item) => item.id === "vscode")!.verification
      .verifiedAt,
    "2026-10-14",
  );
});
