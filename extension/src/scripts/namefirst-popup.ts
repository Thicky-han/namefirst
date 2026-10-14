// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

import "./namefirst/popup.css";
import { requestMemory } from "./namefirst/memory-client.ts";
import {
  FEEDBACK_KEY,
  MEMORY_KEY,
  readMemory,
  type MemoryState,
} from "./namefirst/memory.ts";
import { ENABLED_KEY } from "./namefirst/preferences.ts";

const checkbox = document.querySelector<HTMLInputElement>("#enabled")!;
const status = document.querySelector<HTMLParagraphElement>("#status")!;
const feedback = document.querySelector<HTMLInputElement>("#feedback-enabled")!;
const memoryStatus =
  document.querySelector<HTMLParagraphElement>("#memory-status")!;
const undo = document.querySelector<HTMLButtonElement>("#undo-memory")!;
let memory: MemoryState | null = null;
function renderMemory(state: MemoryState) {
  memory = state;
  memoryStatus.textContent = `已记住 ${state.records.length} 个个人目标。仅保存在本浏览器，无自动同步。`;
  undo.hidden = !state.lastChange;
  const record = state.lastChange?.after ?? state.lastChange?.before;
  undo.textContent = record
    ? `撤销最近记忆修改：${record.name}`
    : "撤销最近导入或清空";
}
async function initialize() {
  try {
    const stored = await chrome.storage.local.get([ENABLED_KEY, FEEDBACK_KEY]);
    checkbox.checked = stored[ENABLED_KEY] !== false;
    checkbox.disabled = false;
    status.textContent = checkbox.checked ? "已启用。" : "已暂停。";
    feedback.checked = stored[FEEDBACK_KEY] !== false;
    feedback.disabled = false;
  } catch {
    status.textContent = "暂时无法读取设置，请重新打开插件窗口。";
  }
  try {
    renderMemory(
      await requestMemory({ channel: "namefirst-memory", action: "read" }),
    );
  } catch (error) {
    memoryStatus.textContent =
      error instanceof Error ? error.message : "个人记忆暂不可用。";
  }
}
void initialize();
checkbox.addEventListener("change", () => {
  checkbox.disabled = true;
  void chrome.storage.local
    .set({ [ENABLED_KEY]: checkbox.checked })
    .then(() => {
      status.textContent = checkbox.checked
        ? "已启用，百度和 Bing 页面会立即更新。"
        : "已暂停，原搜索结果保留。";
      checkbox.disabled = false;
    })
    .catch(() => {
      checkbox.checked = !checkbox.checked;
      checkbox.disabled = false;
      status.textContent = "保存失败，请重试。";
    });
});
feedback.addEventListener("change", () => {
  feedback.disabled = true;
  void chrome.storage.local
    .set({ [FEEDBACK_KEY]: feedback.checked })
    .then(() => {
      feedback.disabled = false;
      status.textContent = feedback.checked
        ? "已显示个人反馈入口。"
        : "已隐藏反馈入口，已记住的目标仍可召回。";
    })
    .catch(() => {
      feedback.checked = !feedback.checked;
      feedback.disabled = false;
      status.textContent = "保存失败，请重试。";
    });
});
undo.addEventListener("click", () => {
  const token = memory?.lastChange?.token;
  if (!token) {
    return;
  }
  undo.disabled = true;
  void requestMemory({ channel: "namefirst-memory", action: "undo", token })
    .then((state) => {
      renderMemory(state);
      memoryStatus.textContent += " 已撤销最近修改。";
    })
    .catch((error: unknown) => {
      memoryStatus.textContent =
        error instanceof Error ? error.message : "撤销失败，请重试。";
    })
    .finally(() => {
      undo.disabled = false;
    });
});
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") {
    return;
  }
  if (MEMORY_KEY in changes) {
    try {
      renderMemory(readMemory(changes[MEMORY_KEY]?.newValue));
    } catch (error) {
      memory = null;
      undo.hidden = true;
      memoryStatus.textContent =
        error instanceof Error ? error.message : "个人记忆暂不可用。";
    }
  }
  if (ENABLED_KEY in changes) {
    checkbox.checked = changes[ENABLED_KEY]?.newValue !== false;
  }
  if (FEEDBACK_KEY in changes) {
    feedback.checked = changes[FEEDBACK_KEY]?.newValue !== false;
  }
});
