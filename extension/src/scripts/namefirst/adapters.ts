// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

import { findBaiduResults, getBaiduQuery } from "./baidu.ts";
import { findBingResults } from "./bing-rules.ts";
import { getBingQuery } from "./bing-urls.ts";
import { collectCandidates } from "./candidates.ts";
import type { PageCandidate } from "./model.ts";

export type SearchAdapter = {
  id: "bing" | "baidu";
  getQuery: (href: string) => string | null;
  findResults: (document: Document, href: string) => HTMLElement | null;
  cardTag: "li" | "div";
  getCandidates: (document: Document) => PageCandidate[];
};

export const bingAdapter: SearchAdapter = {
  id: "bing",
  getQuery: getBingQuery,
  findResults: findBingResults,
  cardTag: "li",
  getCandidates: (document) =>
    collectCandidates(document, "#b_results .b_algo h2 > a"),
};
export const baiduAdapter: SearchAdapter = {
  id: "baidu",
  getQuery: getBaiduQuery,
  findResults: findBaiduResults,
  cardTag: "div",
  getCandidates: (document) =>
    collectCandidates(
      document,
      "#content_left .result h3 a, #content_left .c-container h3 a",
    ),
};
export const SEARCH_ADAPTERS = [bingAdapter, baiduAdapter] as const;
