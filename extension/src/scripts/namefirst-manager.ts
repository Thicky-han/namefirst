// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

import "./namefirst/manager.css";
import { requestMemory } from "./namefirst/memory-client.ts";
import {
  emptyMemory,
  exportBackup,
  FEEDBACK_KEY,
  MEMORY_KEY,
  previewImport,
  readMemory,
  type MemoryRecord,
  type MemoryRequest,
  type MemoryState,
} from "./namefirst/memory.ts";
import { normalizeName } from "./namefirst/normalize.ts";
import { ENABLED_KEY, ENGINE_KEYS } from "./namefirst/preferences.ts";

function element<T extends HTMLElement>(selector: string) {
  return document.querySelector<T>(selector)!;
}
const status = element<HTMLParagraphElement>("#status");
const form = element<HTMLFormElement>("#editor");
const name = element<HTMLInputElement>("#record-name");
const aliases = element<HTMLInputElement>("#record-aliases");
const url = element<HTMLInputElement>("#record-url");
const draft = element<HTMLParagraphElement>("#draft-status");
const filter = element<HTMLInputElement>("#filter");
const file = element<HTMLInputElement>("#import-file");
const mode = element<HTMLSelectElement>("#import-mode");
const preview = element<HTMLDivElement>("#import-preview");
const apply = element<HTMLButtonElement>("#apply-import");
const replace = element<HTMLInputElement>("#confirm-replace");
const clear = element<HTMLInputElement>("#confirm-clear");
let state = emptyMemory();
let available = false;
let busy = false;
let page = 0;
let editing: MemoryRecord | null = null;
let proposal: {
  content: string;
  mode: "merge" | "replace";
  revision: number;
} | null = null;
let clearRevision: number | null = null;

function resetEditor() {
  editing = null;
  form.reset();
  draft.textContent = "新记录只有在保存后才生效。";
}
function edit(record: MemoryRecord) {
  editing = record;
  name.value = record.name;
  aliases.value = record.aliases.join(", ");
  url.value = record.url;
  draft.textContent = `正在编辑：${record.name}`;
  name.focus();
}
function button(label: string, action: () => void) {
  const item = document.createElement("button");
  item.type = "button";
  item.textContent = label;
  item.disabled = busy || !available;
  item.addEventListener("click", action);
  return item;
}
function invalidatePreview(message = "") {
  proposal = null;
  replace.checked = false;
  apply.disabled = true;
  preview.textContent = message;
}
function render() {
  const matches = state.records
    .filter((record) =>
      normalizeName(
        [record.name, ...record.aliases, record.url].join(" "),
      ).includes(normalizeName(filter.value)),
    )
    .sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
  const pages = Math.max(1, Math.ceil(matches.length / 20));
  page = Math.min(page, pages - 1);
  element("#count").textContent =
    `共 ${state.records.length} 条，匹配 ${matches.length} 条。`;
  const list = element("#records");
  list.replaceChildren();
  for (const record of matches.slice(page * 20, (page + 1) * 20)) {
    const article = document.createElement("article");
    article.dataset.recordId = record.id;
    const heading = document.createElement("h3");
    heading.textContent = record.name;
    const link = document.createElement("a");
    link.href = record.url;
    link.textContent = record.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.referrerPolicy = "no-referrer";
    const details = document.createElement("p");
    details.textContent = `别名：${record.aliases.join("、") || "无"} · 确认于 ${new Date(record.confirmedAt).toLocaleDateString("zh-CN")}`;
    const age = Date.now() - Date.parse(record.confirmedAt);
    if (age < 0 || age > 180 * 86_400_000) {
      details.textContent +=
        age < 0
          ? " · 确认时间在未来，建议检查"
          : " · 超过 180 天未确认，建议复核";
      details.className = "review";
    }
    const actions = document.createElement("div");
    actions.className = "actions";
    actions.append(
      button("编辑", () => edit(record)),
      button("重新确认", () => {
        void mutate(
          {
            channel: "namefirst-memory",
            action: "save",
            id: record.id,
            expectedRevision: record.revision,
            name: record.name,
            aliases: record.aliases,
            url: record.url,
          },
          "已重新确认个人目标；官网事实不变。",
        );
      }),
      button("删除", () => {
        void mutate(
          {
            channel: "namefirst-memory",
            action: "forget",
            id: record.id,
            expectedRevision: record.revision,
          },
          "已删除个人记录及别名，可撤销最近修改。",
        );
      }),
    );
    article.append(heading, link, details, actions);
    list.append(article);
  }
  if (!matches.length) {
    const empty = document.createElement("p");
    empty.textContent = state.records.length
      ? "没有匹配的个人记录。"
      : "还没有个人记录，可新增或导入备份。";
    list.append(empty);
  }
  element("#page").textContent = `${page + 1} / ${pages}`;
  element<HTMLButtonElement>("#previous").disabled = page === 0;
  element<HTMLButtonElement>("#next").disabled = page === pages - 1;
  const last = state.lastChange;
  const lastRecord = last?.after ?? last?.before;
  element("#undo").textContent = lastRecord
    ? `撤销最近修改：${lastRecord.name}`
    : "撤销最近导入或清空";
  element<HTMLButtonElement>("#undo").disabled = busy || !available || !last;
  element("#clear-count").textContent =
    `当前有 ${state.records.length} 条个人记录；清空不修改官网目录或展示开关。`;
  element<HTMLButtonElement>("#clear").disabled =
    busy || !available || !clear.checked || clearRevision !== state.revision;
  element<HTMLButtonElement>("#export").disabled = busy || !available;
  element<HTMLButtonElement>("#save-record").disabled = busy || !available;
  apply.disabled =
    busy ||
    !available ||
    !proposal ||
    (proposal.mode === "replace" && !replace.checked);
}
function accept(next: MemoryState, authoritative = false) {
  if (!authoritative && available && next.revision < state.revision) {
    return;
  }
  const changed = next.revision !== state.revision;
  state = next;
  available = true;
  if (changed) {
    if (proposal) {
      invalidatePreview("记录已在其他页面变化，请重新预览导入。");
    }
    clear.checked = false;
    clearRevision = null;
    if (
      editing &&
      state.records.find((record) => record.id === editing!.id)?.revision !==
        editing.revision
    ) {
      draft.textContent =
        "这条记录已在其他页面变化。当前草稿保留，请重新选择记录载入最新值；旧草稿不能覆盖新记录。";
    }
  }
  render();
}
async function mutate(request: MemoryRequest, message: string) {
  if (busy || !available) {
    return;
  }
  busy = true;
  render();
  try {
    accept(await requestMemory(request));
    status.textContent = message;
    if (request.action === "save") {
      resetEditor();
    }
  } catch (error) {
    status.textContent =
      error instanceof Error ? error.message : "操作失败，原数据保留。";
  } finally {
    busy = false;
    render();
  }
}
function download(value: unknown, label: string) {
  const blob = new Blob([JSON.stringify(value, null, 2) + "\n"], {
    type: "application/json",
  });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = `namefirst-${label}-${new Intl.DateTimeFormat("sv-SE").format(new Date())}.json`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 30_000);
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) {
    return;
  }
  void mutate(
    {
      channel: "namefirst-memory",
      action: "save",
      id: editing?.id ?? null,
      expectedRevision: editing?.revision ?? null,
      name: name.value.trim(),
      aliases:
        editing && aliases.value === editing.aliases.join(", ")
          ? editing.aliases
          : aliases.value
              .split(/[,，;；\n]/u)
              .map((value) => value.trim())
              .filter(Boolean),
      url: url.value.trim(),
    },
    "已保存个人记录。",
  );
});
element("#new-record").addEventListener("click", () => {
  resetEditor();
  name.focus();
});
element("#cancel-edit").addEventListener("click", resetEditor);
filter.addEventListener("input", () => {
  page = 0;
  render();
});
element("#previous").addEventListener("click", () => {
  page--;
  render();
});
element("#next").addEventListener("click", () => {
  page++;
  render();
});
element("#export").addEventListener("click", () => {
  if (available) {
    download(exportBackup(state), "memory");
    status.textContent = "已导出个人记录；备份未上传。";
  }
});
element("#export-raw").addEventListener("click", () => {
  void chrome.storage.local
    .get(MEMORY_KEY)
    .then((stored) => {
      download(stored[MEMORY_KEY] ?? null, "raw-recovery");
      status.textContent = "已导出原始数据。原存储未修改；此文件只供恢复检查。";
    })
    .catch(() => {
      status.textContent = "暂时无法导出原始数据。";
    });
});
file.addEventListener("change", () => invalidatePreview());
mode.addEventListener("change", () => {
  invalidatePreview();
  element("#replace-label").hidden = mode.value !== "replace";
});
element("#preview-import").addEventListener("click", () => {
  void (async () => {
    invalidatePreview();
    const selected = file.files?.[0];
    if (!selected) {
      preview.textContent = "请先选择 JSON 备份文件。";
      return;
    }
    if (!available) {
      preview.textContent =
        "当前记录不可读取，已保留原数据；可先导出原始数据用于恢复。";
      return;
    }
    if (selected.size > 4_000_000) {
      preview.textContent = "备份超过 4 MB 上限。";
      return;
    }
    const revision = state.revision;
    const selectedMode = mode.value === "replace" ? "replace" : "merge";
    try {
      const content = await selected.text();
      const plan = previewImport(state, content, selectedMode);
      if (
        revision !== state.revision ||
        file.files?.[0] !== selected ||
        mode.value !== selectedMode
      ) {
        preview.textContent = "记录或文件已变化，请重新预览。";
        return;
      }
      proposal = { content, mode: selectedMode, revision };
      preview.textContent = `预览：新增 ${plan.added} 条，跳过完全重复 ${plan.duplicates} 条，替换移除 ${plan.removed} 条，应用后共 ${plan.total} 条。尚未写入。`;
      const samples = document.createElement("ul");
      for (const record of plan.incoming.slice(0, 5)) {
        const item = document.createElement("li");
        item.textContent = `${record.name} → ${record.url}`;
        samples.append(item);
      }
      if (plan.incoming.length > 5) {
        const note = document.createElement("p");
        note.textContent =
          "此处仅显示文件中的前 5 条记录；上方数量包括全部记录。";
        preview.append(note);
      }
      preview.append(samples);
      render();
    } catch (error) {
      preview.textContent =
        error instanceof Error ? error.message : "备份无法导入，原数据保留。";
    }
  })();
});
replace.addEventListener("change", render);
apply.addEventListener("click", () => {
  if (!proposal || (proposal.mode === "replace" && !replace.checked)) {
    return;
  }
  const current = proposal;
  void mutate(
    {
      channel: "namefirst-memory",
      action: "import",
      expectedStateRevision: current.revision,
      mode: current.mode,
      content: current.content,
    },
    "已导入个人记录，可撤销最近修改。",
  );
});
clear.addEventListener("change", () => {
  clearRevision = clear.checked ? state.revision : null;
  render();
});
element("#clear").addEventListener("click", () => {
  if (!clear.checked || clearRevision === null) {
    return;
  }
  void mutate(
    {
      channel: "namefirst-memory",
      action: "clear",
      expectedStateRevision: clearRevision,
    },
    "已清空个人记录，可撤销最近修改。",
  );
});
element("#undo").addEventListener("click", () => {
  const token = state.lastChange?.token;
  if (token) {
    void mutate(
      { channel: "namefirst-memory", action: "undo", token },
      "已撤销最近记忆修改。",
    );
  }
});
const preferences = [
  ["#enabled", ENABLED_KEY],
  ["#bing-enabled", ENGINE_KEYS.bing],
  ["#baidu-enabled", ENGINE_KEYS.baidu],
  ["#feedback-enabled", FEEDBACK_KEY],
] as const;
for (const [selector, key] of preferences) {
  const input = element<HTMLInputElement>(selector);
  input.addEventListener("change", () => {
    input.disabled = true;
    void chrome.storage.local
      .set({ [key]: input.checked })
      .then(() => {
        status.textContent = "已更新展示设置，已打开的搜索页会同步变化。";
      })
      .catch(() => {
        input.checked = !input.checked;
        status.textContent = "保存设置失败，请重试。";
      })
      .finally(() => {
        input.disabled = false;
      });
  });
}
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") {
    return;
  }
  if (MEMORY_KEY in changes) {
    try {
      accept(readMemory(changes[MEMORY_KEY]?.newValue), true);
    } catch (error) {
      available = false;
      status.textContent =
        error instanceof Error ? error.message : "记忆不可读取。";
      element("#export-raw").hidden = false;
      render();
    }
  }
  for (const [selector, key] of preferences) {
    if (key in changes) {
      element<HTMLInputElement>(selector).checked =
        changes[key]?.newValue !== false;
    }
  }
});
async function initialize() {
  try {
    const stored = await chrome.storage.local.get(
      preferences.map(([, key]) => key),
    );
    for (const [selector, key] of preferences) {
      const input = element<HTMLInputElement>(selector);
      input.checked = stored[key] !== false;
      input.disabled = false;
    }
  } catch {
    status.textContent = "暂时无法读取展示设置。";
  }
  try {
    accept(
      await requestMemory({ channel: "namefirst-memory", action: "read" }),
    );
    status.textContent = "记录已载入；本页不会联网检查或自动删除网站。";
  } catch (error) {
    available = false;
    status.textContent =
      error instanceof Error ? error.message : "记忆不可读取。";
    element("#export-raw").hidden = false;
    render();
  }
}
resetEditor();
render();
void initialize();
