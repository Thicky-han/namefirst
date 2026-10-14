// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.
// Real network verification, no user accounts or existing browser profiles.

import fs from "node:fs/promises";
import path from "node:path";

import { expect } from "@playwright/test";

import { launchNameFirst, projectRoot } from "./browser.ts";

const output = path.join(projectRoot, ".cache/stage3-live");
await fs.mkdir(output, { recursive: true });
const reports: unknown[] = [];
for (const target of ["chrome", "edge"] as const) {
  const { context, version, extensionId } = await launchNameFirst(target);
  try {
    for (const item of [
      {
        engine: "bing",
        url: "https://www.bing.com/search?q=Steam",
        container: "#b_results",
        expected: "official",
      },
      {
        engine: "bing-cn",
        url: "https://cn.bing.com/search?q=Steam",
        container: "#b_results",
        expected: "official",
      },
      {
        engine: "bing",
        url: "https://www.bing.com/search?q=Steam+使用教程",
        container: "#b_results",
        expected: "none",
      },
      {
        engine: "bing",
        url: "https://www.bing.com/search?q=Rust",
        container: "#b_results",
        expected: "ambiguous",
      },
      {
        engine: "baidu",
        url: "https://www.baidu.com/s?wd=Steam",
        container: "#content_left",
        expected: "official",
      },
    ]) {
      const page = await context.newPage();
      let status: number | undefined;
      try {
        const response = await page.goto(item.url, {
          waitUntil: "domcontentloaded",
          timeout: 30_000,
        });
        status = response?.status();
        const title = await page.title();
        const finalUrl = new URL(page.url());
        const verifiedPage =
          title.includes("安全验证") ||
          ["wappass.baidu.com", "verify.baidu.com"].includes(finalUrl.hostname);
        if (verifiedPage) {
          await expect(page.locator("[data-namefirst-card]")).toHaveCount(0);
          const screenshot = `${target}-${item.engine}-blocked.png`;
          await page.screenshot({ path: path.join(output, screenshot) });
          reports.push({
            target,
            version,
            extensionId,
            ...item,
            status,
            outcome: "blocked",
            finalPage: finalUrl.origin + finalUrl.pathname,
            reason:
              "Search provider returned a verification page; no ordinary results available",
            cardCount: 0,
            screenshot,
          });
          continue;
        }
        await expect(page.locator(item.container)).toBeAttached({
          timeout: 10_000,
        });
        const card = page.locator("[data-namefirst-card]");
        if (item.expected === "none") {
          await expect(card).toHaveCount(0);
        } else {
          // Live pages may hide results while a regional redirect finishes.
          await expect(card).toBeVisible({ timeout: 15_000 });
          await expect(
            page.locator(`${item.container} > :first-child`),
          ).toHaveAttribute("data-namefirst-card", "");
          if (item.expected === "official") {
            await expect(card.locator("h2 a")).toHaveAttribute(
              "href",
              "https://store.steampowered.com/",
            );
          } else {
            await expect(card.locator(".choice a")).toHaveCount(2);
          }
        }
        const screenshot = `${target}-${item.engine}-${item.expected}.png`;
        await page.screenshot({ path: path.join(output, screenshot) });
        reports.push({
          target,
          version,
          extensionId,
          ...item,
          status,
          outcome: "passed",
          finalPage: finalUrl.origin + finalUrl.pathname,
          originalResults: await page
            .locator(
              item.engine.startsWith("bing")
                ? "#b_results .b_algo"
                : "#content_left .result",
            )
            .count(),
          screenshot,
        });
      } catch (error) {
        const screenshot = `${target}-${item.engine}-${item.expected}-failed.png`;
        await page
          .screenshot({ path: path.join(output, screenshot) })
          .catch(() => undefined);
        reports.push({
          target,
          version,
          extensionId,
          ...item,
          status,
          outcome: "failed",
          error: String(error),
          screenshot,
        });
      } finally {
        await page.close();
      }
    }
  } finally {
    await context.close();
  }
}
const report = { testedAt: new Date().toISOString(), results: reports };
await fs.writeFile(
  path.join(output, "report.json"),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
// A blocked provider is reported as an incomplete live check, never a pass.
if (
  reports.some((item) => (item as { outcome: string }).outcome !== "passed")
) {
  process.exitCode = 1;
}
