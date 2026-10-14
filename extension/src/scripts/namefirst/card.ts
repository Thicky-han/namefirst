// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

import type { OfficialEntry, Resolution } from "./model.ts";

import cardCSS from "./card.css" with { type: "text" };

const purposeLabels: Record<OfficialEntry["purpose"], string> = {
  home: "官网主页",
  store: "官方商店",
  community: "官方社区",
  support: "官方帮助",
  download: "官方下载页面",
  docs: "官方文档",
};

export function cardLink(
  document: Document,
  label: string,
  url: string,
): HTMLAnchorElement {
  const anchor = document.createElement("a");
  anchor.textContent = label;
  anchor.href = url;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.referrerPolicy = "no-referrer";
  return anchor;
}

export function createCard(
  document: Document,
  resolution: Resolution,
  dismiss: () => void,
  tag: "li" | "div" = "li",
): HTMLLIElement | HTMLDivElement | null {
  if (
    resolution.status !== "official" &&
    resolution.status !== "personal" &&
    !(
      resolution.status === "candidate" &&
      resolution.reason === "ambiguous-name"
    )
  ) {
    return null;
  }
  const { host, section } = createCardSurface(
    document,
    tag,
    "data-namefirst-card",
  );
  const header = document.createElement("header");
  const badge = document.createElement("span");
  badge.textContent =
    resolution.status === "official"
      ? "NameFirst · 已核实官方入口"
      : resolution.status === "personal"
        ? "NameFirst · 个人记忆（未核实官方身份）"
        : "NameFirst · 同名候选，请选择";
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "隐藏本次";
  button.setAttribute("aria-label", "隐藏本次搜索的 NameFirst 卡片");
  button.addEventListener("click", dismiss);
  header.append(badge, button);
  section.append(header);

  if (resolution.status === "personal") {
    const title = document.createElement("h2");
    title.append(
      cardLink(document, resolution.result.name, resolution.result.url),
    );
    const note = document.createElement("p");
    note.textContent = `你确认的个人目标 · ${new URL(resolution.result.url).hostname}`;
    section.append(title, note);
  } else if (resolution.status === "official") {
    const result = resolution.result;
    const title = document.createElement("h2");
    title.append(cardLink(document, result.name, result.entry.url));
    const description = document.createElement("p");
    description.textContent = `${result.description} · ${purposeLabels[result.entry.purpose]}`;
    const domain = document.createElement("span");
    domain.className = "domain";
    domain.textContent = new URL(result.entry.url).hostname;
    section.append(title, description, domain);
    if (result.alternativeEntries.length) {
      const navigation = document.createElement("nav");
      navigation.setAttribute("aria-label", "其他官方入口");
      for (const entry of result.alternativeEntries) {
        navigation.append(cardLink(document, entry.label, entry.url));
      }
      section.append(navigation);
    }
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = `核实依据 · ${result.verification.verifiedAt}`;
    const sources = document.createElement("ul");
    for (const source of result.verification.sources) {
      const item = document.createElement("li");
      item.append(cardLink(document, source.note, source.url));
      sources.append(item);
    }
    details.append(summary, sources);
    section.append(details);
  } else {
    const title = document.createElement("h2");
    title.textContent = "这个名称对应多个网站";
    section.append(title);
    for (const candidate of resolution.officialCandidates) {
      const choice = document.createElement("p");
      choice.className = "choice";
      choice.append(
        cardLink(
          document,
          `${candidate.name}（${candidate.description}）`,
          candidate.entry.url,
        ),
      );
      const domain = document.createElement("span");
      domain.className = "domain";
      domain.textContent = new URL(candidate.entry.url).hostname;
      choice.append(domain);
      section.append(choice);
    }
    const notice = document.createElement("p");
    notice.className = "notice";
    notice.textContent = "没有按热度替你选定目标；原搜索结果仍保留。";
    section.append(notice);
  }
  return host;
}

export function createCardSurface(
  document: Document,
  tag: "li" | "div",
  marker: "data-namefirst-card" | "data-namefirst-feedback",
) {
  const host = document.createElement(tag);
  host.setAttribute(marker, "");
  host.style.cssText =
    "display:block!important;list-style:none!important;margin:0 0 20px!important;padding:0!important;width:auto!important;max-width:100%!important;";
  // List items cannot host a shadow root; keep the semantic li and isolate a div.
  const surface = document.createElement("div");
  host.append(surface);
  const shadow = surface.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = cardCSS;
  const section = document.createElement("section");
  section.setAttribute("aria-label", "NameFirst 搜索辅助");
  shadow.append(style, section);
  return { host, section };
}
