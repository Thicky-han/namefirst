// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.
// Optional network smoke test. Does not use or modify an installed user profile.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium, expect } from "@playwright/test";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const extensionPath = path.join(root, "dist/chrome");
const output = path.join(root, ".cache/bing-live");
await fs.mkdir(output, { recursive: true });
const executablePath = process.env.NAMEFIRST_CHROMIUM;
const context = await chromium.launchPersistentContext("", {
  ...(executablePath ? { executablePath } : { channel: "chromium" }),
  headless: true,
  viewport: { width: 1440, height: 1000 },
  args: [
    `--disable-extensions-except=${extensionPath}`,
    `--load-extension=${extensionPath}`,
  ],
});
const results: unknown[] = [];
try {
  for (const [host, query, expected] of [
    ["www.bing.com", "Steam", "official"],
    ["cn.bing.com", "Steam", "official"],
    ["www.bing.com", "Steam 使用教程", "none"],
    ["www.bing.com", "Rust", "ambiguous"],
  ] as const) {
    const page = await context.newPage();
    const url = `https://${host}/search?q=${encodeURIComponent(query)}`;
    try {
      const response = await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 30_000,
      });
      await expect(page.locator("ol#b_results")).toBeAttached({
        timeout: 15_000,
      });
      const card = page.locator("[data-namefirst-card]");
      if (expected === "none") {
        await expect(card).toHaveCount(0);
      } else {
        await expect(card).toBeVisible();
        await expect(page.locator("#b_results > :first-child")).toHaveAttribute(
          "data-namefirst-card",
          "",
        );
        if (expected === "official") {
          await expect(card.locator("h2 a")).toHaveAttribute(
            "href",
            "https://store.steampowered.com/",
          );
        } else {
          await expect(card.locator(".choice a")).toHaveCount(2);
        }
      }
      const screenshot = `${host}-${expected}.png`;
      await page.screenshot({ path: path.join(output, screenshot) });
      results.push({
        url,
        finalUrl: page.url(),
        status: response?.status(),
        passed: true,
        originalResults: await page.locator("#b_results .b_algo").count(),
        screenshot,
      });
    } catch (error) {
      results.push({
        url,
        finalUrl: page.url(),
        passed: false,
        error: String(error),
      });
    } finally {
      await page.close();
    }
  }
} finally {
  await context.close();
}
const report = {
  testedAt: new Date().toISOString(),
  browser: "Chrome for Testing / Chromium",
  results,
};
await fs.writeFile(
  path.join(output, "report.json"),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
if (results.some((result) => !(result as { passed: boolean }).passed)) {
  process.exitCode = 1;
}
