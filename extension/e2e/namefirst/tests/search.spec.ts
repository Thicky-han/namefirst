// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import {
  expect,
  test as base,
  type BrowserContext,
  type Page,
} from "@playwright/test";

import { launchNameFirst, projectRoot } from "../browser.ts";

const identity = JSON.parse(
  await fs.readFile(
    path.join(projectRoot, "config/extension-identity.json"),
    "utf8",
  ),
) as { manifestKey: string };
const extensionId = createHash("sha256")
  .update(Buffer.from(identity.manifestKey, "base64"))
  .digest("hex")
  .slice(0, 32)
  .split("")
  .map((digit) => String.fromCharCode(97 + Number.parseInt(digit, 16)))
  .join("");
const engines = {
  bing: {
    id: "bing",
    base: "https://www.bing.com/search",
    key: "q",
    container: "#b_results",
    containerTag: "ol",
    input: "#sb_form_q",
    cardTag: "LI",
  },
  baidu: {
    id: "baidu",
    base: "https://www.baidu.com/s",
    key: "wd",
    container: "#content_left",
    containerTag: "div",
    input: "#kw",
    cardTag: "DIV",
  },
} as const;
type Engine = (typeof engines)[keyof typeof engines];
function href(engine: Engine, query: string) {
  return `${engine.base}?${engine.key}=${encodeURIComponent(query)}`;
}
function fixture(engine: Engine) {
  const results =
    engine.id === "bing"
      ? '<ol id="b_results"><li class="b_ad" id="ad">广告示例：第三方充值网站</li><li class="b_algo" id="original"><h2><a href="https://unrelated.example/">无关第三方结果</a></h2><cite class="b_attribution">unrelated.example</cite></li></ol>'
      : '<div id="content_left"><div class="result c-container" id="ad">广告示例：第三方充值网站</div><div class="result c-container" id="original"><h3><a href="https://unrelated.example/">无关第三方结果</a></h3><span>unrelated.example</span></div></div>';
  return `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>${engine.id} 受控验收页面</title><style>body{font:16px system-ui;margin:32px;background:white;color:#202124}main{max-width:680px}ol{padding:0;list-style:none}#original,#ad{padding:20px;border-bottom:1px solid #ddd}input{padding:12px;width:400px}</style><main><h1>${engine.id} 搜索 · 受控验收</h1><input id="${engine.input.slice(1)}" value="Steam">${results}</main></html>`;
}

const test = base.extend<{
  context: BrowserContext;
  engine: Engine;
  searchPage: Page;
}>({
  engine: async ({ browserName }, use, testInfo) => {
    expect(browserName).toBe("chromium");
    await use(
      testInfo.project.name.endsWith("baidu") ? engines.baidu : engines.bing,
    );
  },
  context: async ({ engine }, use, testInfo) => {
    const target = testInfo.project.name.startsWith("edge") ? "edge" : "chrome";
    const {
      context,
      extensionId: loadedId,
      version,
    } = await launchNameFirst(target);
    try {
      expect(loadedId).toBe(extensionId);
      await testInfo.attach("browser", {
        body: JSON.stringify({
          target,
          version,
          extensionId: loadedId,
          engine: engine.id,
        }),
        contentType: "application/json",
      });
      for (const domain of ["bing.com", "baidu.com"]) {
        await context.route(`https://*.${domain}/**`, (route) =>
          route.fulfill({
            contentType: "text/html; charset=utf-8",
            body: fixture(engine),
          }),
        );
      }
      await use(context);
    } finally {
      await context.close();
    }
  },
  searchPage: async ({ context, engine }, use) => {
    const page = await context.newPage();
    await page.goto(href(engine, "Steam"));
    await expect(page.locator("[data-namefirst-card]")).toBeVisible();
    await use(page);
  },
});

test("fresh extension adds the official site before ads when original results have no official site", async ({
  searchPage: page,
  engine,
}, testInfo) => {
  const card = page.locator("[data-namefirst-card]");
  await expect(card).toHaveCount(1);
  expect(await card.evaluate((element) => element.tagName)).toBe(
    engine.cardTag,
  );
  await expect(
    page.locator(`${engine.container} > :first-child`),
  ).toHaveAttribute("data-namefirst-card", "");
  const official = card.getByRole("link", { name: "Steam", exact: true });
  await expect(official).toHaveAttribute(
    "href",
    "https://store.steampowered.com/",
  );
  await expect(official).toHaveAttribute("rel", "noopener noreferrer");
  await expect(card).toContainText("已核实官方入口");
  await expect(page.locator("#ad")).toHaveText("广告示例：第三方充值网站");
  await expect(page.locator("#original a")).toHaveAttribute(
    "href",
    "https://unrelated.example/",
  );
  await card.locator("details:not(.feedback) > summary").click();
  await expect(card.locator("details:not(.feedback)")).toHaveAttribute(
    "open",
    "",
  );
  await expect(card).toContainText("2026-10-13");
  await page.screenshot({ path: testInfo.outputPath("steam-card.png") });
});

test("release catalog recalls new exact names and verified aliases without personal memory", async ({
  searchPage: page,
  engine,
}) => {
  for (const [query, url] of [
    ["Google", "https://www.google.com/"],
    ["Discord", "https://discord.com/"],
    ["VS Code", "https://code.visualstudio.com/"],
    ["7-Zip", "https://www.7-zip.org/"],
    ["MDN", "https://developer.mozilla.org/en-US/"],
    ["Hugging Face", "https://huggingface.co/"],
  ]) {
    await page.goto(href(engine, query!));
    const card = page.locator("[data-namefirst-card]");
    await expect(card).toHaveCount(1);
    await expect(card).toContainText("已核实官方入口");
    await expect(card.locator("h2 a")).toHaveAttribute("href", url!);
    await expect(
      page.locator(`${engine.container} > :first-child`),
    ).toHaveAttribute("data-namefirst-card", "");
    await expect(page.locator("#original")).toBeVisible();
  }
});

test("student names and official downloads are first on an otherwise unrelated result page", async ({
  searchPage: page,
  engine,
}) => {
  for (const [query, url] of [
    ["可画", "https://www.canva.cn/zh_cn/"],
    ["Canva可画下载", "https://www.canva.cn/download/windows/"],
    ["中国大学MOOC", "https://www.icourse163.org/"],
    ["知网", "https://www.cnki.net/"],
    ["腾讯会议下载", "https://meeting.tencent.com/download/"],
    ["Zotero下载", "https://www.zotero.org/download/"],
    ["RStudio下载", "https://docs.posit.co/ide/user/download.html"],
    ["DeepL下载", "https://www.deepl.com/en/windows-app"],
    ["DeepSeek网页版", "https://chat.deepseek.com/"],
    ["Visual Studio下载", "https://visualstudio.microsoft.com/downloads/"],
  ]) {
    await page.goto(href(engine, query!));
    const card = page.locator("[data-namefirst-card]");
    await expect(card).toHaveCount(1);
    await expect(card).toContainText("已核实官方入口");
    await expect(card.locator("h2 a")).toHaveAttribute("href", url!);
    await expect(
      page.locator(`${engine.container} > :first-child`),
    ).toHaveAttribute("data-namefirst-card", "");
    await expect(page.locator("#original")).toBeVisible();
  }
});

test("URL query wins over unsubmitted input, SPA navigation and back navigation update cards", async ({
  searchPage: page,
  engine,
}) => {
  await page.locator(engine.input).fill("GitHub");
  await expect(page.locator("[data-namefirst-card] h2")).toHaveText("Steam");
  await page.evaluate(
    (url) => history.pushState({}, "", url),
    href(engine, "GitHub"),
  );
  await expect(page.locator("[data-namefirst-card] h2")).toHaveText("GitHub");
  await expect(page.locator("[data-namefirst-card] h2 a")).toHaveAttribute(
    "href",
    "https://github.com/",
  );
  await page.goBack();
  await expect(page.locator("[data-namefirst-card] h2")).toHaveText("Steam");
  await page.evaluate(
    (url) => history.pushState({}, "", url),
    href(engine, "Steam 使用教程"),
  );
  await expect(page.locator("[data-namefirst-card]")).toHaveCount(0);
  await expect(page.locator("#original")).toBeVisible();
  await page.goto(href(engine, "未知小众网站"));
  await expect(page.locator("#original")).toBeVisible();
  await expect(page.locator("[data-namefirst-card]")).toHaveCount(0);
});

test("ambiguous Rust shows two choices without automatic navigation", async ({
  searchPage: page,
  engine,
}) => {
  const url =
    engine.id === "bing"
      ? "https://cn.bing.com/search?q=Rust"
      : href(engine, "Rust");
  await page.goto(url);
  const card = page.locator("[data-namefirst-card]");
  await expect(card).toContainText("同名候选，请选择");
  await expect(card.locator(".choice a")).toHaveCount(2);
  await expect(card.locator(".choice a").nth(0)).toHaveAttribute(
    "href",
    "https://rust-lang.org/",
  );
  await expect(card.locator(".choice a").nth(1)).toHaveAttribute(
    "href",
    "https://rust.facepunch.com/",
  );
  await expect(page).toHaveURL(url);
});

test("dynamic ads and replaced or delayed containers recover a single stable card", async ({
  searchPage: page,
  engine,
}) => {
  const originalCard = await page
    .locator("[data-namefirst-card]")
    .elementHandle();
  await page.evaluate(({ container, containerTag }) => {
    const target = document.querySelector(container)!;
    for (let index = 0; index < 40; index++) {
      const item = document.createElement(containerTag === "ol" ? "li" : "div");
      item.textContent = `动态广告 ${index}`;
      target.prepend(item);
    }
  }, engine);
  await expect(
    page.locator(`${engine.container} > :first-child`),
  ).toHaveAttribute("data-namefirst-card", "");
  expect(
    await originalCard!.evaluate(
      (card) => card === document.querySelector("[data-namefirst-card]"),
    ),
  ).toBe(true);
  await page.evaluate(
    ({ container }) => document.querySelector(container)!.remove(),
    engine,
  );
  await expect(page.locator("[data-namefirst-card]")).toHaveCount(0);
  await page.evaluate(({ container, containerTag }) => {
    const target = document.createElement(containerTag);
    target.id = container.slice(1);
    document.querySelector("main")!.append(target);
  }, engine);
  await expect(page.locator("[data-namefirst-card]")).toHaveCount(1);
  await expect(page.locator("[data-namefirst-card] h2")).toHaveText("Steam");
});

test("hide persists in this page lifecycle and resets on reload", async ({
  searchPage: page,
  engine,
}) => {
  await page
    .getByRole("button", { name: "隐藏本次搜索的 NameFirst 卡片" })
    .click();
  await expect(page.locator("[data-namefirst-card]")).toHaveCount(0);
  await page.evaluate(
    ({ container }) =>
      document.querySelector(container)!.append(document.createElement("div")),
    engine,
  );
  await page.evaluate(
    (url) => history.pushState({}, "", url),
    href(engine, "GitHub"),
  );
  await expect(page.locator("[data-namefirst-card] h2")).toHaveText("GitHub");
  await page.evaluate(
    (url) => history.pushState({}, "", url),
    href(engine, "Steam"),
  );
  await expect(page.locator("[data-namefirst-card]")).toHaveCount(0);
  await page.reload();
  await expect(page.locator("[data-namefirst-card] h2")).toHaveText("Steam");
});

test("one local popup switch updates both engine tabs and only stores a boolean", async ({
  searchPage: page,
  context,
}) => {
  const other = await context.newPage();
  // This fixture intentionally serves both genuine engine structures.
  await context.route("https://www.baidu.com/s?wd=Steam", (route) =>
    route.fulfill({ contentType: "text/html", body: fixture(engines.baidu) }),
  );
  await context.route("https://www.bing.com/search?q=Steam", (route) =>
    route.fulfill({ contentType: "text/html", body: fixture(engines.bing) }),
  );
  await other.goto(
    page.url().includes("baidu.com")
      ? href(engines.bing, "Steam")
      : href(engines.baidu, "Steam"),
  );
  await expect(other.locator("[data-namefirst-card]")).toBeVisible();
  const popup = await context.newPage();
  await popup.goto(
    `chrome-extension://${extensionId}/pages/namefirst-popup.html`,
  );
  const checkbox = popup.getByRole("checkbox", {
    name: "启用官网优先",
    exact: true,
  });
  await expect(checkbox).toBeChecked();
  await checkbox.uncheck();
  await expect(page.locator("[data-namefirst-card]")).toHaveCount(0);
  await expect(other.locator("[data-namefirst-card]")).toHaveCount(0);
  await expect(popup.locator("#status")).toContainText("已暂停");
  await page.reload();
  await expect(page.locator("#original")).toBeVisible();
  await expect(page.locator("[data-namefirst-card]")).toHaveCount(0);
  expect(await popup.evaluate(() => chrome.storage.local.get())).toEqual({
    namefirstEnabled: false,
  });
  await checkbox.check();
  await expect(page.locator("[data-namefirst-card]")).toBeVisible();
  await expect(other.locator("[data-namefirst-card]")).toBeVisible();
  expect(await popup.evaluate(() => chrome.storage.local.get())).toEqual({
    namefirstEnabled: true,
  });
});

test("unsupported paths, repeated parameters and missing structures preserve the original UI", async ({
  searchPage: page,
  engine,
  context,
}) => {
  const urls =
    engine.id === "bing"
      ? [
          "https://www.bing.com/images/search?q=Steam",
          "https://www.bing.com/search?q=Steam&q=GitHub",
        ]
      : [
          "https://www.baidu.com/sf/vsearch?wd=Steam",
          "https://www.baidu.com/s?wd=Steam&word=GitHub",
          "https://www.baidu.com/s?wd=Steam&tn=news",
        ];
  for (const url of urls) {
    await page.goto(url);
    await expect(page.locator("#original")).toBeVisible();
    await expect(page.locator("[data-namefirst-card]")).toHaveCount(0);
  }
  await context.route(`${engine.base}?${engine.key}=Steam`, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: '<html lang="zh-CN"><title>安全验证</title><input id="original" value="输入验证码"></html>',
    }),
  );
  await page.goto(href(engine, "Steam"));
  await expect(page.locator("#original")).toBeVisible();
  await expect(page.locator("[data-namefirst-card]")).toHaveCount(0);
});

test("cards and popup make no additional external web requests", async ({
  searchPage: page,
  context,
  engine,
}) => {
  const requests: string[] = [];
  context.on("request", (request) => requests.push(request.url()));
  await page.goto(href(engine, "GitHub"));
  await expect(page.locator("[data-namefirst-card] h2")).toHaveText("GitHub");
  const popup = await context.newPage();
  await popup.goto(
    `chrome-extension://${extensionId}/pages/namefirst-popup.html`,
  );
  await expect(
    popup.getByRole("checkbox", { name: "启用官网优先", exact: true }),
  ).toBeEnabled();
  expect(
    requests.filter(
      (url) =>
        !url.startsWith(engine.base + "?") &&
        !url.startsWith(`chrome-extension://${extensionId}/`),
    ),
  ).toEqual([]);
});

test("official link clicks open the real target without navigating the results tab", async ({
  searchPage: page,
  context,
}) => {
  await context.route("https://store.steampowered.com/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<title>Official target click fixture</title>",
    }),
  );
  const originalUrl = page.url();
  const opened = page.waitForEvent("popup");
  await page.locator("[data-namefirst-card] h2 a").click();
  const target = await opened;
  await expect(target).toHaveURL("https://store.steampowered.com/");
  await expect(page).toHaveURL(originalUrl);
});

test("confirmed aliases and purpose-specific queries are consistent across engines", async ({
  searchPage: page,
  engine,
}) => {
  await page.goto(href(engine, "Steam 支持"));
  await expect(page.locator("[data-namefirst-card] h2 a")).toHaveAttribute(
    "href",
    "https://help.steampowered.com/",
  );
  await page.goto(href(engine, "bilibili"));
  await expect(page.locator("[data-namefirst-card] h2 a")).toHaveAttribute(
    "href",
    "https://www.bilibili.com/",
  );
});

test("Baidu alternate word parameter and next results page retain the shared resolution", async ({
  searchPage: page,
  engine,
}) => {
  const url =
    engine.id === "baidu"
      ? `${engine.base}?word=Steam&pn=10`
      : `${engine.base}?q=Steam&first=11`;
  await page.goto(url);
  await expect(page.locator("[data-namefirst-card] h2 a")).toHaveAttribute(
    "href",
    "https://store.steampowered.com/",
  );
  await expect(
    page.locator(`${engine.container} > :first-child`),
  ).toHaveAttribute("data-namefirst-card", "");
});
