// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

import { cardLink, createCard, createCardSurface } from "./card.ts";
import { requestMemory } from "./memory-client.ts";
import {
  recordNames,
  personalDisplay,
  type MemoryRecord,
  type MemoryRequest,
  type MemoryState,
} from "./memory.ts";
import type { PageCandidate, Resolution } from "./model.ts";
import { normalizeName } from "./normalize.ts";
import { getNavigationPurpose } from "./resolve.ts";

export type FeedbackView = {
  query: string;
  name: string;
  resolution: Resolution;
  state: MemoryState;
  record: MemoryRecord | undefined;
  enabled: boolean;
  error: string | null;
  notice: string;
  open: boolean;
  getCandidates: () => PageCandidate[];
  dismiss: () => void;
  onMemory: (state: MemoryState, notice: string) => void;
  refresh: () => void;
};

export function createSearchView(
  document: Document,
  tag: "li" | "div",
  view: FeedbackView,
) {
  const { record } = view;
  const resolution = personalDisplay(
    view.resolution,
    record,
    getNavigationPurpose(view.query) === null,
  );
  const card = createCard(document, resolution, view.dismiss, tag);
  if (
    !card &&
    (!view.enabled ||
      resolution.intent === "information" ||
      (resolution.status === "none" && resolution.reason !== "unknown-name"))
  ) {
    return null;
  }
  const surface = card
    ? {
        host: card,
        section:
          card.firstElementChild!.shadowRoot!.querySelector<HTMLElement>(
            "section",
          )!,
      }
    : createCardSurface(document, tag, "data-namefirst-feedback");
  const { section } = surface;
  if (resolution !== view.resolution) {
    const note = document.createElement("p");
    note.className = "notice";
    note.textContent = "官网目录信息需要复核，当前入口只是你确认的个人选择。";
    section.append(note);
  }
  if (
    record &&
    resolution.status !== "personal" &&
    !(
      resolution.status === "official" &&
      resolution.result.entry.url === record.url
    )
  ) {
    const note = document.createElement("p");
    note.className = "personal-note";
    note.append(
      "你的个人选择（未核实官方身份）：",
      cardLink(document, record.name, record.url),
    );
    section.append(note);
  }
  if (!view.enabled) {
    return surface.host;
  }
  const panel = document.createElement("details");
  panel.className = "feedback";
  panel.open = view.open;
  const summary = document.createElement("summary");
  summary.textContent =
    resolution.status === "official" || resolution.status === "personal"
      ? "这个 NameFirst 入口是你要访问的网站吗？"
      : "选择并记住个人目标";
  panel.append(summary);
  const explanation = document.createElement("p");
  explanation.textContent =
    "仅在你明确保存后记住个人选择；不会据此核实官网，也不会把否定当成全局拉黑。";
  panel.append(explanation);
  const form = document.createElement("form");
  function field(labelText: string, value: string, placeholder: string) {
    const label = document.createElement("label");
    label.textContent = labelText;
    const input = document.createElement("input");
    input.type = "text";
    input.defaultValue = value;
    input.placeholder = placeholder;
    label.append(input);
    form.append(label);
    return input;
  }
  const name = field("记忆名称", record?.name ?? view.name, "网站名称");
  name.maxLength = 256;
  name.required = true;
  const aliases = field(
    "个人别名（可选，逗号分隔）",
    record?.aliases.join(", ") ?? "",
    "例如：我的文档",
  );
  aliases.maxLength = 2800;
  const recommendedUrl =
    resolution.status === "official"
      ? resolution.result.entry.url
      : resolution.status === "personal"
        ? resolution.result.url
        : "";
  const url = field(
    "目标 HTTPS 地址（不含参数或片段）",
    record?.url ?? recommendedUrl,
    "https://example.com/",
  );
  url.required = true;
  url.maxLength = 2048;
  const status = document.createElement("p");
  status.setAttribute("role", "status");
  status.textContent = view.error ?? view.notice;
  const buttons: HTMLButtonElement[] = [];
  function button(label: string, parent: HTMLElement, action: () => void) {
    const item = document.createElement("button");
    item.type = "button";
    item.textContent = label;
    item.addEventListener("click", action);
    parent.append(item);
    buttons.push(item);
    return item;
  }
  async function perform(request: MemoryRequest, notice: string) {
    if (view.error) {
      status.textContent = view.error;
      return;
    }
    for (const item of buttons) {
      item.disabled = true;
    }
    status.textContent = "正在保存到本地…";
    try {
      const state = await requestMemory(request);
      view.onMemory(state, notice);
    } catch (error) {
      status.textContent =
        error instanceof Error ? error.message : "保存失败，原记忆保留。";
    } finally {
      for (const item of buttons) {
        item.disabled = false;
      }
    }
  }
  function save(targetUrl = url.value.trim()) {
    void perform(
      {
        channel: "namefirst-memory",
        action: "save",
        id: record?.id ?? null,
        expectedRevision: record?.revision ?? null,
        name: name.value.trim(),
        aliases:
          record && aliases.value === record.aliases.join(", ")
            ? record.aliases
            : aliases.value
                .split(/[,，;；\n]/u)
                .map((value) => value.trim())
                .filter(Boolean),
        url: targetUrl,
      },
      "已记住个人目标，下次搜索此名称或别名会召回。可撤销本次修改。",
    );
  }
  const actions = document.createElement("nav");
  if (recommendedUrl) {
    button("是，记住这个入口", actions, () => save(recommendedUrl));
  }
  button("不是，选择正确网站", actions, () => {
    url.value = "";
    status.textContent = "尚未修改记忆。请选择正确目标或手动填入地址，再保存。";
    url.focus();
  });
  button("这次查资料", actions, view.dismiss);
  button("跳过", actions, view.dismiss);
  panel.append(actions);
  const choices = document.createElement("div");
  choices.className = "candidate-options";
  let collected = false;
  panel.addEventListener("toggle", () => {
    if (!panel.open) {
      if (surface.host.isConnected) {
        view.refresh();
      }
      return;
    }
    if (collected) {
      return;
    }
    collected = true;
    const candidates =
      resolution.status === "candidate" &&
      resolution.reason === "ambiguous-name"
        ? resolution.officialCandidates.map((candidate) => ({
            title: `${candidate.name}（${candidate.description}，已核实候选）`,
            url: candidate.entry.url,
          }))
        : view.getCandidates();
    const label = document.createElement("p");
    label.textContent = candidates.length
      ? "从候选选取地址后，再确认保存；原结果候选未核实官方身份。"
      : "没有可直接读取的候选地址。搜索跳转链接不会自动解析；请手动填写目标 HTTPS 地址。";
    choices.append(label);
    for (const candidate of candidates) {
      button(
        `选择：${candidate.title} · ${new URL(candidate.url).hostname}`,
        choices,
        () => {
          url.value = candidate.url;
          status.textContent =
            "已选取地址，尚未保存。请检查名称和目标，再保存个人记忆。";
        },
      );
    }
  });
  panel.append(choices, form);
  const submit = button("保存个人目标", form, () => {
    if (form.reportValidity()) {
      save();
    }
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (form.reportValidity()) {
      save();
    }
  });
  submit.disabled = Boolean(view.error);
  if (record) {
    button("忘记此个人记录（含别名）", panel, () => {
      void perform(
        {
          channel: "namefirst-memory",
          action: "forget",
          id: record.id,
          expectedRevision: record.revision,
        },
        "已忘记个人记录；官网目录和原搜索结果保留。可撤销本次修改。",
      );
    });
  }
  const change = view.state.lastChange;
  if (
    change &&
    [change.before, change.after].some(
      (item) =>
        item &&
        (recordNames(item).includes(normalizeName(view.query)) ||
          recordNames(item).includes(normalizeName(view.name))),
    )
  ) {
    button("撤销上次记忆修改", panel, () => {
      void perform(
        { channel: "namefirst-memory", action: "undo", token: change.token },
        "已撤销上次记忆修改。",
      );
    });
  }
  panel.append(status);
  section.append(panel);
  return surface.host;
}
