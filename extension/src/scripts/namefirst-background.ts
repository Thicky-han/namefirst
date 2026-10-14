// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.
// Local-only message worker; never fetches, trains or syncs anything.

import { getBaiduQuery } from "./namefirst/baidu.ts";
import { getBingQuery } from "./namefirst/bing-urls.ts";
import {
  changeMemory,
  MEMORY_KEY,
  MemoryRequestSchema,
  readMemory,
} from "./namefirst/memory.ts";

let queue = Promise.resolve();
chrome.runtime.onMessage.addListener((input: unknown, sender, respond) => {
  function reply(value: unknown) {
    try {
      respond(value);
    } catch {
      /* Client closed; completed local writes remain valid. */
    }
  }
  if (
    !input ||
    typeof input !== "object" ||
    !("channel" in input) ||
    input.channel !== "namefirst-memory"
  ) {
    return false;
  }
  const url = sender.url ?? "";
  if (
    sender.id !== chrome.runtime.id ||
    !(
      url === chrome.runtime.getURL("pages/namefirst-popup.html") ||
      url === chrome.runtime.getURL("pages/namefirst-manager.html") ||
      getBingQuery(url) !== null ||
      getBaiduQuery(url) !== null
    )
  ) {
    reply({ ok: false, message: "此页面不能访问个人记忆。" });
    return false;
  }
  const parsed = MemoryRequestSchema.safeParse(input);
  if (!parsed.success) {
    reply({
      ok: false,
      message: "请检查名称、别名和 HTTPS 地址（不含参数或片段）。",
    });
    return false;
  }
  queue = queue
    .then(async () => {
      try {
        const stored = await chrome.storage.local.get(MEMORY_KEY);
        const current = readMemory(stored[MEMORY_KEY]);
        const state = changeMemory(current, parsed.data);
        const legacy =
          stored[MEMORY_KEY] &&
          typeof stored[MEMORY_KEY] === "object" &&
          stored[MEMORY_KEY].schemaVersion === 1;
        if (parsed.data.action !== "read" || legacy) {
          await chrome.storage.local.set({ [MEMORY_KEY]: state });
        }
        reply({ ok: true, state });
      } catch (error) {
        reply({
          ok: false,
          message:
            error instanceof Error ? error.message : "保存失败，原记忆已保留。",
        });
      }
    })
    .catch(() => {
      reply({ ok: false, message: "本地记忆服务暂不可用，请重试。" });
    });
  return true;
});
