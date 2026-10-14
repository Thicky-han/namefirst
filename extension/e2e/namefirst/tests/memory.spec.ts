// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

import fs from "node:fs/promises";
import path from "node:path";

import {
  expect,
  test as base,
  type BrowserContext,
  type Page,
} from "@playwright/test";

import {
  MEMORY_KEY,
  readMemory,
} from "../../../src/scripts/namefirst/memory.ts";
import {
  launchNameFirst,
  projectRoot,
  type BrowserTarget,
} from "../browser.ts";

const engines = {
  bing: {
    base: "https://www.bing.com/search",
    key: "q",
    otherBase: "https://www.baidu.com/s",
    otherKey: "wd",
  },
  baidu: {
    base: "https://www.baidu.com/s",
    key: "wd",
    otherBase: "https://www.bing.com/search",
    otherKey: "q",
  },
};
type Engine = typeof engines.bing;
async function routeSearch(context: BrowserContext) {
  for (const domain of ["bing.com", "baidu.com"]) {
    await context.route(`https://*.${domain}/**`, (route) => {
      const bing = route.request().url().includes("bing.com");
      return route.fulfill({
        contentType: "text/html; charset=utf-8",
        body: `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><style>body{font:16px system-ui;padding:30px;max-width:700px}ol{list-style:none;padding:0}</style><h1>个人记忆受控验收</h1><${bing ? 'ol id="b_results"' : 'div id="content_left"'}><${bing ? 'li class="b_algo"' : 'div class="result c-container"'}><${bing ? "h2" : "h3"}><a href="https://nebula.example/">NebulaDesk 社区</a></${bing ? "h2" : "h3"}></${bing ? "li" : "div"}></${bing ? "ol" : "div"}></html>`,
      });
    });
  }
}
const test = base.extend<{
  context: BrowserContext;
  page: Page;
  engine: Engine;
  target: BrowserTarget;
  profile: string;
  extensionId: string;
}>({
  target: async ({ browserName }, use, testInfo) => {
    expect(browserName).toBe("chromium");
    await use(testInfo.project.name.startsWith("edge") ? "edge" : "chrome");
  },
  engine: async ({ target }, use, testInfo) => {
    expect(target).toBeTruthy();
    await use(
      testInfo.project.name.endsWith("baidu") ? engines.baidu : engines.bing,
    );
  },
  profile: async ({ target }, use) => {
    const cache = path.resolve(projectRoot, ".cache");
    await fs.mkdir(cache, { recursive: true });
    const directory = await fs.mkdtemp(
      path.join(cache, `stage4-memory-${target}-`),
    );
    const resolved = path.resolve(directory);
    if (
      !resolved.startsWith(cache + path.sep) ||
      !path.basename(resolved).startsWith("stage4-memory-")
    ) {
      throw new Error("Refusing to remove an unexpected test profile.");
    }
    try {
      await use(directory);
    } finally {
      await fs.rm(resolved, {
        recursive: true,
        force: true,
        maxRetries: 3,
        retryDelay: 100,
      });
    }
  },
  context: async ({ target, profile }, use, testInfo) => {
    const { context, version, extensionId } = await launchNameFirst(
      target,
      profile,
    );
    try {
      await testInfo.attach("browser", {
        body: JSON.stringify({ target, version, extensionId }),
        contentType: "application/json",
      });
      await routeSearch(context);
      await use(context);
    } finally {
      await context.close();
    }
  },
  extensionId: async ({ context }, use) => {
    const manifest = JSON.parse(
      await fs.readFile(
        path.join(projectRoot, "dist/chrome/manifest.json"),
        "utf8",
      ),
    ) as { key: string };
    // Ask the actual browser for the loaded ID, avoiding a hardcoded test identity.
    const session = await context.browser()!.newBrowserCDPSession();
    const extensions = await session.send("Extensions.getExtensions");
    await session.detach();
    const extension = extensions.extensions.find(
      (item) => item.name === "NameFirst",
    );
    expect(manifest.key).toBeTruthy();
    expect(extension).toBeTruthy();
    await use(extension!.id);
  },
  page: async ({ context }, use) => {
    await use(await context.newPage());
  },
});

async function go(page: Page, engine: Engine, query: string) {
  await page.goto(`${engine.base}?${engine.key}=${encodeURIComponent(query)}`);
  await expect(
    page.locator("[data-namefirst-card], [data-namefirst-feedback]"),
  ).toBeVisible();
}
async function expand(page: Page) {
  const panel = page.locator(".feedback");
  if (!(await panel.getAttribute("open"))) {
    // An open attribute is the empty string, so check its presence explicitly.
    if (!(await panel.evaluate((element) => element.hasAttribute("open")))) {
      await panel.locator("summary").click();
    }
  }
}
async function save(page: Page, name: string, url: string, aliases = "") {
  await expand(page);
  await page.getByLabel("记忆名称", { exact: true }).fill(name);
  await page
    .getByLabel("个人别名（可选，逗号分隔）", { exact: true })
    .fill(aliases);
  await page
    .getByLabel("目标 HTTPS 地址（不含参数或片段）", { exact: true })
    .fill(url);
  await page.getByRole("button", { name: "保存个人目标", exact: true }).click();
  await expect(page.locator(".feedback [role=status]")).toContainText(
    "已记住个人目标",
  );
}
async function popup(context: BrowserContext, extensionId: string) {
  const page = await context.newPage();
  await page.goto(
    `chrome-extension://${extensionId}/pages/namefirst-popup.html`,
  );
  await expect(page.locator("#memory-status")).not.toHaveText(
    "正在读取个人记忆…",
  );
  return page;
}
async function snapshot(page: Page) {
  const values = await page.evaluate(() =>
    chrome.storage.local.get("namefirstMemory"),
  );
  return readMemory(values[MEMORY_KEY]);
}

test("a selected page candidate remains unverified until explicit save and aliases survive browser restart", async ({
  page,
  context,
  engine,
  target,
  profile,
  extensionId,
}, testInfo) => {
  await go(page, engine, "NebulaDesk");
  await expect(page.locator("[data-namefirst-card]")).toHaveCount(0);
  await expand(page);
  await page.getByRole("button", { name: /^选择：NebulaDesk 社区/ }).click();
  const settings = await popup(context, extensionId);
  expect((await snapshot(settings)).records).toEqual([]);
  await save(page, "NebulaDesk", "https://nebula.example/", "我的星云");
  await expect(page.locator("[data-namefirst-card]")).toContainText(
    "个人记忆（未核实官方身份）",
  );
  await page.screenshot({ path: testInfo.outputPath("personal-edit.png") });
  await context.close();
  const restarted = await launchNameFirst(target, profile);
  try {
    await routeSearch(restarted.context);
    const fresh = await restarted.context.newPage();
    await fresh.goto(
      `${engine.otherBase}?${engine.otherKey}=${encodeURIComponent("我的星云")}`,
    );
    await expect(fresh.locator("[data-namefirst-card] h2 a")).toHaveAttribute(
      "href",
      "https://nebula.example/",
    );
    await expect(fresh.locator("[data-namefirst-card]")).toContainText(
      "未核实官方身份",
    );
    await fresh.screenshot({
      path: testInfo.outputPath("personal-recall.png"),
    });
    const reopenedSettings = await popup(
      restarted.context,
      restarted.extensionId,
    );
    expect((await snapshot(reopenedSettings)).records[0]?.aliases).toEqual([
      "我的星云",
    ]);
  } finally {
    await restarted.context.close();
  }
});

test("negative feedback waits for the replacement; correction, forgetting and undo preserve other facts", async ({
  page,
  context,
  engine,
  extensionId,
}) => {
  await go(page, engine, "NebulaDesk");
  await save(page, "NebulaDesk", "https://nebula.example/");
  const settings = await popup(context, extensionId);
  const first = (await snapshot(settings)).records[0]!;
  await page.getByRole("button", { name: "不是，选择正确网站" }).click();
  expect((await snapshot(settings)).records[0]?.revision).toBe(first.revision);
  await save(page, "NebulaDesk", "https://correct.example/");
  await expect(page.locator("[data-namefirst-card] h2 a")).toHaveAttribute(
    "href",
    "https://correct.example/",
  );
  await settings.locator("#undo-memory").click();
  await expect(page.locator("[data-namefirst-card] h2 a")).toHaveAttribute(
    "href",
    "https://nebula.example/",
  );
  await expand(page);
  await page.getByRole("button", { name: "忘记此个人记录（含别名）" }).click();
  await expect(page.locator("[data-namefirst-card]")).toHaveCount(0);
  await expect(page.locator(".feedback [role=status]")).toContainText(
    "已忘记个人记录",
  );
  await page.getByRole("button", { name: "撤销上次记忆修改" }).click();
  await expect(page.locator("[data-namefirst-card] h2 a")).toHaveAttribute(
    "href",
    "https://nebula.example/",
  );
});

test("personal third-party preferences never overwrite Steam's official entry or Rust's ambiguity", async ({
  page,
  engine,
}) => {
  await go(page, engine, "Steam");
  await save(page, "Steam", "https://steamdb.info/");
  await expect(page.locator("[data-namefirst-card] h2 a")).toHaveAttribute(
    "href",
    "https://store.steampowered.com/",
  );
  await expect(page.locator(".personal-note a")).toHaveAttribute(
    "href",
    "https://steamdb.info/",
  );
  await expect(page.locator("[data-namefirst-card]")).toContainText(
    "已核实官方入口",
  );
  await go(page, engine, "Rust");
  await expand(page);
  await page.getByRole("button", { name: /选择：Rust（.*游戏/ }).click();
  await save(page, "Rust", "https://rust.facepunch.com/");
  await expect(page.locator(".choice a")).toHaveCount(2);
  await expect(page.locator(".personal-note a")).toHaveAttribute(
    "href",
    "https://rust.facepunch.com/",
  );
});

test("skip and information choices store no feedback; disabling prompts retains existing recall", async ({
  page,
  context,
  engine,
  extensionId,
}) => {
  await go(page, engine, "NebulaDesk");
  await expand(page);
  await page.getByRole("button", { name: "跳过", exact: true }).click();
  await expect(
    page.locator("[data-namefirst-card], [data-namefirst-feedback]"),
  ).toHaveCount(0);
  const settings = await popup(context, extensionId);
  expect((await snapshot(settings)).records).toEqual([]);
  await go(page, engine, "Steam");
  await expand(page);
  await page.getByRole("button", { name: "这次查资料", exact: true }).click();
  expect((await snapshot(settings)).records).toEqual([]);
  await go(page, engine, "NebulaDesk");
  await save(page, "NebulaDesk", "https://nebula.example/");
  await settings
    .getByRole("checkbox", { name: "显示个人反馈入口", exact: true })
    .uncheck();
  await expect(page.locator(".feedback")).toHaveCount(0);
  await page.reload();
  await expect(page.locator("[data-namefirst-card] h2 a")).toHaveAttribute(
    "href",
    "https://nebula.example/",
  );
  await page.goto(`${engine.base}?${engine.key}=AnotherUnknown`);
  await expect(
    page.locator("[data-namefirst-card], [data-namefirst-feedback]"),
  ).toHaveCount(0);
});

test("unsafe URLs and unsupported stored versions fail without overwriting existing memory", async ({
  page,
  context,
  engine,
  extensionId,
}) => {
  await go(page, engine, "NebulaDesk");
  await expand(page);
  await page
    .getByLabel("目标 HTTPS 地址（不含参数或片段）")
    .fill("javascript:alert(1)");
  await page.getByRole("button", { name: "保存个人目标", exact: true }).click();
  await expect(page.locator(".feedback [role=status]")).toContainText("HTTPS");
  const settings = await popup(context, extensionId);
  expect((await snapshot(settings)).records).toEqual([]);
  await settings.evaluate(() =>
    chrome.storage.local.set({
      namefirstMemory: { schemaVersion: 99, marker: "preserve" },
    }),
  );
  await expect(settings.locator("#memory-status")).toContainText("版本不支持");
  const result = await settings.evaluate(() =>
    chrome.runtime.sendMessage({
      channel: "namefirst-memory",
      action: "save",
      id: null,
      expectedRevision: null,
      name: "NebulaDesk",
      aliases: [],
      url: "https://nebula.example/",
    }),
  );
  expect(result.ok).toBe(false);
  expect(
    (await settings.evaluate(() => chrome.storage.local.get("namefirstMemory")))
      .namefirstMemory,
  ).toEqual({ schemaVersion: 99, marker: "preserve" });
  await go(page, engine, "Steam");
  await expect(page.locator("[data-namefirst-card] h2 a")).toHaveAttribute(
    "href",
    "https://store.steampowered.com/",
  );
});

test("simultaneous writes retain both records; stale undo tokens cannot erase newer operations", async ({
  context,
  extensionId,
}) => {
  const settings = await popup(context, extensionId);
  const results = await settings.evaluate(() =>
    Promise.all(
      ["AlphaDesk", "BetaDesk"].map((name) =>
        chrome.runtime.sendMessage({
          channel: "namefirst-memory",
          action: "save",
          id: null,
          expectedRevision: null,
          name,
          aliases: [],
          url: "https://example.com/",
        }),
      ),
    ),
  );
  expect(results.map((result) => result.ok)).toEqual([true, true]);
  const state = await snapshot(settings);
  expect(state.records).toHaveLength(2);
  const oldUndo = await settings.evaluate(
    (token) =>
      chrome.runtime.sendMessage({
        channel: "namefirst-memory",
        action: "undo",
        token,
      }),
    results[0].state.lastChange.token as string,
  );
  expect(oldUndo.ok).toBe(false);
  expect((await snapshot(settings)).records).toHaveLength(2);
  const sameName = await settings.evaluate(() =>
    Promise.all(
      [1, 2].map(() =>
        chrome.runtime.sendMessage({
          channel: "namefirst-memory",
          action: "save",
          id: null,
          expectedRevision: null,
          name: "Conflict",
          aliases: [],
          url: "https://example.com/",
        }),
      ),
    ),
  );
  expect(sameName.filter((result) => result.ok)).toHaveLength(1);
  expect((await snapshot(settings)).records).toHaveLength(3);
});
