// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.
// Exercise the documented replace-files-and-reload update with real packages.
import fs from "node:fs/promises";
import path from "node:path";

import { chromium, expect } from "@playwright/test";

import { projectRoot } from "./browser.ts";

const directory = path.resolve(process.argv[2] ?? "");
const cachePrefix = path.resolve(projectRoot, ".cache") + path.sep;
if (
  !directory.startsWith(cachePrefix) ||
  !path.basename(directory).startsWith("stage6-unpacked-")
) {
  throw new Error(
    "Expected separately prepared previous/current packages inside the project cache.",
  );
}
const identity = JSON.parse(
  await fs.readFile(
    path.join(projectRoot, "config/extension-identity.json"),
    "utf8",
  ),
) as { version: string };
const expectedId = "kocncgipjlmfdlhabchnbnjgahlpfjkc";
const results = [];
for (const target of ["chrome", "edge"] as const) {
  const previous = path.join(directory, "previous", target, "extension");
  const current = path.join(directory, "current", target, "extension");
  const running = path.join(directory, "running", target, "extension");
  const previousManifest = JSON.parse(
    await fs.readFile(path.join(previous, "manifest.json"), "utf8"),
  ) as { version: string; key: string };
  const currentManifest = JSON.parse(
    await fs.readFile(path.join(current, "manifest.json"), "utf8"),
  ) as { version: string; key: string };
  expect(previousManifest.version).toBe("1.0.0");
  expect(currentManifest.version).toBe(identity.version);
  expect(currentManifest.key).toBe(previousManifest.key);
  await fs.cp(previous, running, {
    recursive: true,
    force: false,
    errorOnExist: true,
  });
  const context = await chromium.launchPersistentContext("", {
    channel: target === "chrome" ? "chrome" : "msedge",
    headless: true,
    ignoreDefaultArgs: ["--disable-extensions"],
    args: ["--enable-unsafe-extension-debugging"],
  });
  try {
    const browser = context.browser()!;
    // CDP can initially load an extension without enabling Developer mode,
    // but an ordinary reload respects that setting. Follow the user guide.
    const settings = await context.newPage();
    await settings.goto(
      target === "chrome" ? "chrome://extensions/" : "edge://extensions/",
    );
    const toggle = settings.locator(
      target === "chrome"
        ? "extensions-toolbar #devMode"
        : "#dev-switch:visible",
    );
    const checked = target === "chrome" ? "aria-checked" : "checked";
    await expect(toggle).toHaveAttribute(checked, "false");
    await toggle.click();
    await expect(toggle).toHaveAttribute(checked, "true");
    await settings.close();
    const session = await browser.newBrowserCDPSession();
    const loaded = await session.send("Extensions.loadUnpacked", {
      path: running,
    });
    await session.detach();
    expect(loaded.id).toBe(expectedId);
    await context.route("https://*.bing.com/**", (route) =>
      route.fulfill({
        contentType: "text/html; charset=utf-8",
        body: '<ol id="b_results"><li class="b_algo">Original result</li></ol>',
      }),
    );
    const managerUrl = `chrome-extension://${expectedId}/pages/namefirst-manager.html`;
    const manager = await context.newPage();
    await manager.goto(managerUrl);
    await expect(manager.locator("#status")).toContainText("记录已载入");
    for (const [name, alias, url] of [
      ["StudyMemo", "我的学习站", "https://study.example/"],
      ["可画", "我的个人画图站", "https://personal.example/"],
    ]) {
      await manager.locator("#new-record").click();
      await manager.locator("#record-name").fill(name!);
      await manager.locator("#record-aliases").fill(alias!);
      await manager.locator("#record-url").fill(url!);
      await manager.locator("#save-record").click();
      await expect(manager.locator("#status")).toContainText("已保存个人记录");
    }
    const before = await manager.evaluate(async () => {
      await chrome.storage.local.set({ namefirstFeedbackEnabled: false });
      return chrome.storage.local.get();
    });
    expect(
      await manager.evaluate(() => chrome.runtime.getManifest().version),
    ).toBe("1.0.0");
    const search = await context.newPage();
    await search.goto(
      "https://www.bing.com/search?q=" + encodeURIComponent("可画"),
    );
    await expect(search.locator("[data-namefirst-card]")).toContainText(
      "个人记忆",
    );
    await expect(search.locator("[data-namefirst-card] h2 a")).toHaveAttribute(
      "href",
      "https://personal.example/",
    );
    // These paths are validated above and isolated from all user profiles.
    await fs.cp(current, running, { recursive: true, force: true });
    try {
      await manager.evaluate(() => chrome.runtime.reload());
    } catch (error) {
      if (
        !(error instanceof Error) ||
        !/Execution context was destroyed|Target page, context or browser has been closed/u.test(
          error.message,
        )
      ) {
        throw error;
      }
    }
    const updatedManager = await context.newPage();
    await expect(async () => {
      await updatedManager.goto(managerUrl);
      expect(
        await updatedManager.evaluate(
          () => chrome.runtime.getManifest().version,
        ),
      ).toBe(identity.version);
      await expect(updatedManager.locator("#status")).toContainText(
        "记录已载入",
      );
    }).toPass({ timeout: 15_000 });
    const after = await updatedManager.evaluate(() =>
      chrome.storage.local.get(),
    );
    expect(after).toEqual(before);
    await expect(updatedManager.locator("#records article")).toHaveCount(2);
    await expect(updatedManager.locator("#records")).toContainText("StudyMemo");
    await search.goto(
      "https://www.bing.com/search?q=" + encodeURIComponent("可画"),
    );
    await expect(search.locator("[data-namefirst-card]")).toContainText(
      "已核实官方入口",
    );
    await expect(search.locator("[data-namefirst-card] h2 a")).toHaveAttribute(
      "href",
      "https://www.canva.cn/zh_cn/",
    );
    await search.goto(
      "https://www.bing.com/search?q=" + encodeURIComponent("我的学习站"),
    );
    await expect(search.locator("[data-namefirst-card]")).toContainText(
      "个人记忆",
    );
    await expect(search.locator("[data-namefirst-card] h2 a")).toHaveAttribute(
      "href",
      "https://study.example/",
    );
    results.push({
      target,
      browserVersion: browser.version(),
      extensionId: expectedId,
      from: "1.0.0",
      to: identity.version,
      personalRecordsPreserved: 2,
      storageAndUndoUnchanged: true,
      feedbackPreferencePreserved: true,
      newOfficialEntryWinsWithoutDeletingPersonalRecord: true,
      outcome: "passed",
    });
    console.log(
      `Existing ${target} installation updated with personal records and preferences retained.`,
    );
  } finally {
    await context.close();
  }
}
await fs.writeFile(
  path.join(projectRoot, `.cache/${identity.version}-upgrade-smoke.json`),
  JSON.stringify({ results }, null, 2) + "\n",
);
