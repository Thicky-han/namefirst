// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.
// Load the extracted consumer archives, without recompiling their files.
import fs from "node:fs/promises";
import path from "node:path";

import { chromium, expect } from "@playwright/test";

import { projectRoot } from "./browser.ts";

const directory = path.resolve(process.argv[2] ?? "");
const cachePrefix = path.resolve(projectRoot, ".cache") + path.sep;
const identity = JSON.parse(
  await fs.readFile(
    path.join(projectRoot, "config/extension-identity.json"),
    "utf8",
  ),
) as { version: string };
if (
  !directory.startsWith(cachePrefix) ||
  !path.basename(directory).startsWith("stage6-unpacked-")
) {
  throw new Error(
    "Expected an explicitly prepared local package test directory.",
  );
}
const results = [];
for (const target of ["chrome", "edge"] as const) {
  const context = await chromium.launchPersistentContext("", {
    channel: target === "chrome" ? "chrome" : "msedge",
    headless: true,
    viewport: { width: 1440, height: 1000 },
    ignoreDefaultArgs: ["--disable-extensions"],
    args: ["--enable-unsafe-extension-debugging"],
  });
  try {
    const browser = context.browser()!;
    const session = await browser.newBrowserCDPSession();
    const { id } = await session.send("Extensions.loadUnpacked", {
      path: path.join(directory, target, "extension"),
    });
    await session.detach();
    expect(id).toBe("kocncgipjlmfdlhabchnbnjgahlpfjkc");
    for (const engine of ["bing", "baidu"] as const) {
      await context.route(`https://*.${engine}.com/**`, (route) =>
        route.fulfill({
          contentType: "text/html",
          body:
            engine === "bing"
              ? '<ol id="b_results"><li class="b_algo">Original result</li></ol>'
              : '<div id="content_left"><div class="result">Original result</div></div>',
        }),
      );
      const page = await context.newPage();
      for (const [query, url] of [
        ["Steam", "https://store.steampowered.com/"],
        ["可画", "https://www.canva.cn/zh_cn/"],
        ["可画下载", "https://www.canva.cn/download/windows/"],
      ]) {
        const base =
          engine === "bing"
            ? "https://www.bing.com/search?q="
            : "https://www.baidu.com/s?wd=";
        await page.goto(base + encodeURIComponent(query!));
        const card = page.locator("[data-namefirst-card]");
        await expect(card).toHaveCount(1);
        await expect(card).toContainText("已核实官方入口");
        await expect(card.locator("h2 a")).toHaveAttribute("href", url!);
      }
      await page.close();
    }
    const manager = await context.newPage();
    await manager.goto(`chrome-extension://${id}/pages/namefirst-manager.html`);
    await expect(manager.locator("#status")).toContainText("记录已载入");
    await expect(manager.locator("#count")).toContainText("共 0 条");
    const manifest = await manager.evaluate(() => chrome.runtime.getManifest());
    expect(manifest.version).toBe(identity.version);
    expect(manifest.permissions).toEqual(["storage"]);
    const iconSizes = [];
    for (const size of [16, 32, 48, 128]) {
      const iconPath = `icons/namefirst/icon-${size}.png`;
      expect(manifest.icons?.[String(size)]).toBe(iconPath);
      const dimensions = await manager.evaluate(async (asset) => {
        const response = await fetch(chrome.runtime.getURL(asset));
        const bitmap = await createImageBitmap(await response.blob());
        return { width: bitmap.width, height: bitmap.height };
      }, iconPath);
      expect(dimensions).toEqual({ width: size, height: size });
      iconSizes.push(size);
    }
    results.push({
      target,
      browserVersion: browser.version(),
      extensionId: id,
      extensionVersion: manifest.version,
      outcome: "passed",
      engines: ["bing", "baidu"],
      queries: ["Steam", "可画", "可画下载"],
      originalArchiveLoaded: true,
      personalRecordCount: 0,
      iconSizes,
    });
  } finally {
    await context.close();
  }
}
await fs.writeFile(
  path.join(projectRoot, `.cache/${identity.version}-packaged-smoke.json`),
  JSON.stringify({ results }, null, 2) + "\n",
);
console.log("Consumer archives loaded and checked in Chrome and Edge.");
