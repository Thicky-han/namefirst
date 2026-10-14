// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

import {
  expect,
  test as base,
  type BrowserContext,
  type Page,
} from "@playwright/test";

import { launchNameFirst, type BrowserTarget } from "../browser.ts";

async function routes(context: BrowserContext) {
  for (const domain of ["bing.com", "baidu.com"]) {
    await context.route(`https://*.${domain}/**`, (route) =>
      route.fulfill({
        contentType: "text/html",
        body: route.request().url().includes("bing.com")
          ? '<ol id="b_results"><li class="b_algo"><h2><a href="https://example.com/">Original</a></h2></li></ol>'
          : '<div id="content_left"><div class="result"><h3><a href="https://example.com/">Original</a></h3></div></div>',
      }),
    );
  }
}
async function openManager(context: BrowserContext, extensionId: string) {
  const page = await context.newPage();
  await page.goto(
    `chrome-extension://${extensionId}/pages/namefirst-manager.html`,
  );
  await expect(page.locator("#status")).not.toHaveText("正在读取本地记录…");
  return page;
}
const test = base.extend<{
  context: BrowserContext;
  manager: Page;
  target: BrowserTarget;
  extensionId: string;
}>({
  target: async ({ browserName }, use, testInfo) => {
    expect(browserName).toBe("chromium");
    await use(testInfo.project.name.startsWith("edge") ? "edge" : "chrome");
  },
  context: async ({ target }, use, testInfo) => {
    const loaded = await launchNameFirst(target);
    try {
      await testInfo.attach("browser", {
        body: JSON.stringify({
          target,
          version: loaded.version,
          extensionId: loaded.extensionId,
        }),
        contentType: "application/json",
      });
      await routes(loaded.context);
      await use(loaded.context);
    } finally {
      await loaded.context.close();
    }
  },
  extensionId: async ({ context }, use) => {
    const session = await context.browser()!.newBrowserCDPSession();
    const result = await session.send("Extensions.getExtensions");
    await session.detach();
    await use(result.extensions.find((item) => item.name === "NameFirst")!.id);
  },
  manager: async ({ context, extensionId }, use) => {
    await use(await openManager(context, extensionId));
  },
});
test.setTimeout(60_000);
async function create(
  page: Page,
  name: string,
  url = "https://nebula.example/",
  aliases = "",
) {
  await page.locator("#new-record").click();
  await page.locator("#record-name").fill(name);
  await page.locator("#record-aliases").fill(aliases);
  await page.locator("#record-url").fill(url);
  await page.locator("#save-record").click();
  await expect(page.locator("#status")).toContainText("已保存个人记录");
}
function row(page: Page, name: string) {
  return page
    .locator("#records article")
    .filter({ has: page.getByRole("heading", { name, exact: true }) });
}
function backup(
  name: string,
  url = "https://imported.example/",
  confirmedAt = "2026-10-14T00:00:00.000Z",
) {
  return {
    format: "NameFirst personal memory",
    formatVersion: 1,
    exportedAt: "2026-10-14T00:00:00.000Z",
    records: [{ name, aliases: [], url, confirmedAt }],
  };
}
async function preview(page: Page, data: unknown) {
  await page.locator("#import-file").setInputFiles({
    name: "memory.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(data)),
  });
  await page.locator("#preview-import").click();
}

test("list search, editing, deletion, undo and age review are usable without visiting search pages", async ({
  manager: page,
}, testInfo) => {
  await create(page, "NebulaDesk", "https://nebula.example/", "星云文档");
  await page.locator("#filter").fill("星云");
  await expect(row(page, "NebulaDesk")).toBeVisible();
  await row(page, "NebulaDesk")
    .getByRole("button", { name: "编辑", exact: true })
    .click();
  await page.locator("#record-name").fill("NebulaDesk Next");
  await page.locator("#record-url").fill("https://next.example/");
  await page.locator("#save-record").click();
  await expect(row(page, "NebulaDesk Next").locator("a")).toHaveAttribute(
    "href",
    "https://next.example/",
  );
  await row(page, "NebulaDesk Next")
    .getByRole("button", { name: "删除", exact: true })
    .click();
  await expect(page.locator("#records article")).toHaveCount(0);
  await page.locator("#undo").click();
  await expect(row(page, "NebulaDesk Next")).toBeVisible();
  await page.locator("#filter").fill("");
  await preview(
    page,
    backup("OldDesk", "https://old.example/", "2020-01-01T00:00:00.000Z"),
  );
  await expect(page.locator("#apply-import")).toBeEnabled();
  await page.locator("#apply-import").click();
  await expect(row(page, "OldDesk")).toContainText("超过 180 天");
  await row(page, "OldDesk")
    .getByRole("button", { name: "重新确认", exact: true })
    .click();
  await expect(row(page, "OldDesk")).not.toContainText("超过 180 天");
  await page.screenshot({
    path: testInfo.outputPath("manager.png"),
    fullPage: true,
  });
  await preview(page, {
    ...backup("Paging"),
    records: Array.from({ length: 21 }, (_, index) => ({
      name: `Paging${String(index).padStart(2, "0")}`,
      aliases: [],
      url: "https://paging.example/",
      confirmedAt: "2026-10-14T00:00:00.000Z",
    })),
  });
  await page.locator("#apply-import").click();
  await expect(page.locator("#records article")).toHaveCount(20);
  await page.locator("#next").click();
  await expect(page.locator("#records article")).toHaveCount(3);
  await page.locator("#filter").fill("Paging20");
  await expect(page.locator("#records article")).toHaveCount(1);
  await expect(row(page, "Paging20")).toBeVisible();
});

test("downloaded backup imports into a fresh profile and its alias recalls on both engines", async ({
  manager: page,
  context,
  target,
}) => {
  await create(page, "NebulaDesk", "https://nebula.example/", "NebulaAlias");
  const downloading = page.waitForEvent("download");
  await page.locator("#export").click();
  const download = await downloading;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) {
    chunks.push(Buffer.from(chunk));
  }
  const buffer = Buffer.concat(chunks);
  const portable = JSON.parse(buffer.toString("utf8")) as { records: object[] };
  expect(portable.records[0]).not.toHaveProperty("id");
  const fresh = await launchNameFirst(target);
  try {
    await routes(fresh.context);
    const manager = await openManager(fresh.context, fresh.extensionId);
    await manager.locator("#import-file").setInputFiles({
      name: download.suggestedFilename(),
      mimeType: "application/json",
      buffer,
    });
    await manager.locator("#preview-import").click();
    await expect(manager.locator("#import-preview")).toContainText("尚未写入");
    await expect(manager.locator("#records article")).toHaveCount(0);
    await manager.locator("#apply-import").click();
    await expect(row(manager, "NebulaDesk")).toBeVisible();
    for (const href of [
      "https://www.bing.com/search?q=NebulaAlias",
      "https://www.baidu.com/s?wd=NebulaAlias",
    ]) {
      const search = await fresh.context.newPage();
      await search.goto(href);
      await expect(
        search.locator("[data-namefirst-card] h2 a"),
      ).toHaveAttribute("href", "https://nebula.example/");
    }
    await expect(row(page, "NebulaDesk")).toBeVisible();
    expect(context.pages().length).toBeGreaterThan(0);
  } finally {
    await fresh.context.close();
  }
});

test("invalid files and merge conflicts preserve data; cross-page changes invalidate import previews", async ({
  manager: page,
  context,
  extensionId,
}) => {
  await create(page, "Existing", "https://existing.example/");
  await preview(page, backup("Existing", "https://different.example/"));
  await expect(page.locator("#import-preview")).toContainText("冲突");
  await expect(page.locator("#apply-import")).toBeDisabled();
  await preview(page, { ...backup("Future"), formatVersion: 99 });
  await expect(page.locator("#import-preview")).toContainText("版本");
  await page.locator("#import-file").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from("not JSON"),
  });
  await page.locator("#preview-import").click();
  await expect(page.locator("#import-preview")).toContainText("有效的 JSON");
  await preview(page, backup("Incoming"));
  await expect(page.locator("#apply-import")).toBeEnabled();
  const other = await openManager(context, extensionId);
  await create(other, "Concurrent", "https://concurrent.example/");
  await expect(page.locator("#apply-import")).toBeDisabled();
  await expect(page.locator("#import-preview")).toContainText("重新预览");
  await expect(row(page, "Existing")).toBeVisible();
  await expect(row(page, "Concurrent")).toBeVisible();
  await expect(row(page, "Incoming")).toHaveCount(0);
});

test("replacement requires review confirmation; import and clearing are reversible", async ({
  manager: page,
}) => {
  await create(page, "Existing", "https://existing.example/");
  await page.locator("#import-mode").selectOption("replace");
  await preview(page, backup("Replacement"));
  await expect(page.locator("#import-preview")).toContainText("替换移除 1 条");
  await expect(page.locator("#apply-import")).toBeDisabled();
  await page.locator("#confirm-replace").check();
  await page.locator("#apply-import").click();
  await expect(row(page, "Replacement")).toBeVisible();
  await expect(row(page, "Existing")).toHaveCount(0);
  await page.locator("#undo").click();
  await expect(row(page, "Existing")).toBeVisible();
  await page.getByText("清空个人记忆", { exact: true }).click();
  await expect(page.locator("#clear")).toBeDisabled();
  await page.locator("#confirm-clear").check();
  await page.locator("#clear").click();
  await expect(page.locator("#records article")).toHaveCount(0);
  await page.locator("#undo").click();
  await expect(row(page, "Existing")).toBeVisible();
});

test("concurrent record edits preserve unsaved manager and search drafts and reject stale saves", async ({
  manager: page,
  context,
  extensionId,
}) => {
  await create(page, "NebulaDesk");
  await row(page, "NebulaDesk")
    .getByRole("button", { name: "编辑", exact: true })
    .click();
  await page.locator("#record-url").fill("https://local-draft.example/");
  const search = await context.newPage();
  await search.goto("https://www.bing.com/search?q=NebulaDesk");
  await expect(search.locator("[data-namefirst-card]")).toBeVisible();
  await search.locator("details.feedback > summary").click();
  await search
    .getByLabel("目标 HTTPS 地址（不含参数或片段）")
    .fill("https://search-draft.example/");
  const other = await openManager(context, extensionId);
  await row(other, "NebulaDesk")
    .getByRole("button", { name: "编辑", exact: true })
    .click();
  await other.locator("#record-url").fill("https://remote.example/");
  await other.locator("#save-record").click();
  await expect(page.locator("#record-url")).toHaveValue(
    "https://local-draft.example/",
  );
  await expect(page.locator("#draft-status")).toContainText("草稿保留");
  await page.locator("#save-record").click();
  await expect(page.locator("#status")).toContainText("其他标签页");
  await expect(
    search.getByLabel("目标 HTTPS 地址（不含参数或片段）"),
  ).toHaveValue("https://search-draft.example/");
  await expect(search.locator(".feedback [role=status]")).toContainText(
    "草稿保留",
  );
  await search.locator("details.feedback > summary").click();
  await expect(search.locator("[data-namefirst-card] h2 a")).toHaveAttribute(
    "href",
    "https://remote.example/",
  );
});

test("legacy data migrates intact, engine switches are independent, and future storage can be exported raw", async ({
  manager: page,
  context,
  extensionId,
}) => {
  const id = "00000000-0000-4000-8000-000000000001";
  const revision = "00000000-0000-4000-8000-000000000002";
  await page.evaluate(
    ({ id, revision }) =>
      chrome.storage.local.set({
        namefirstMemory: {
          schemaVersion: 1,
          revision: 9,
          records: [
            {
              id,
              revision,
              name: "LegacyDesk",
              aliases: ["LegacyAlias"],
              url: "https://legacy.example/",
              confirmedAt: "2020-01-01T00:00:00.000Z",
            },
          ],
          lastChange: null,
        },
      }),
    { id, revision },
  );
  const read = await openManager(context, extensionId);
  await expect(row(read, "LegacyDesk")).toBeVisible();
  const stored = (
    await read.evaluate(() => chrome.storage.local.get("namefirstMemory"))
  ).namefirstMemory;
  expect(stored.schemaVersion).toBe(2);
  expect(stored.records[0].id).toBe(id);
  expect(stored.records[0].confirmedAt).toBe("2020-01-01T00:00:00.000Z");
  const bing = await context.newPage();
  await bing.goto("https://www.bing.com/search?q=LegacyAlias");
  const baidu = await context.newPage();
  await baidu.goto("https://www.baidu.com/s?wd=LegacyAlias");
  await expect(bing.locator("[data-namefirst-card]")).toBeVisible();
  await expect(baidu.locator("[data-namefirst-card]")).toBeVisible();
  await page.locator("#bing-enabled").uncheck();
  await expect(bing.locator("[data-namefirst-card]")).toHaveCount(0);
  await expect(baidu.locator("[data-namefirst-card]")).toBeVisible();
  await page.locator("#bing-enabled").check();
  await expect(bing.locator("[data-namefirst-card]")).toBeVisible();
  await page.evaluate(() =>
    chrome.storage.local.set({
      namefirstMemory: { schemaVersion: 99, marker: "preserve-future" },
    }),
  );
  await expect(page.locator("#status")).toContainText("版本不支持");
  await expect(page.locator("#export")).toBeDisabled();
  const downloading = page.waitForEvent("download");
  await page.locator("#export-raw").click();
  const download = await downloading;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) {
    chunks.push(Buffer.from(chunk));
  }
  expect(JSON.parse(Buffer.concat(chunks).toString("utf8"))).toEqual({
    schemaVersion: 99,
    marker: "preserve-future",
  });
});
