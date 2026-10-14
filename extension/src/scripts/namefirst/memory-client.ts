// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

import {
  MemoryRequestSchema,
  readMemory,
  type MemoryRequest,
} from "./memory.ts";

export async function requestMemory(request: MemoryRequest) {
  const parsed = MemoryRequestSchema.safeParse(request);
  if (!parsed.success) {
    throw new Error("请检查名称、别名和 HTTPS 地址（不含参数或片段）。");
  }
  const response: unknown = await chrome.runtime.sendMessage(parsed.data);
  if (!response || typeof response !== "object" || !("ok" in response)) {
    throw new Error("本地记忆服务暂不可用，请重新加载插件后刷新页面。");
  }
  if (response.ok !== true) {
    throw new Error(
      "message" in response && typeof response.message === "string"
        ? response.message
        : "无法保存记忆，请重试。",
    );
  }
  if (!("state" in response) || response.state === undefined) {
    throw new Error("无法读取本地记忆。");
  }
  return readMemory(response.state);
}
