// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

import { parse } from "@ublacklist/serpinfo";

import bing from "#builtin/serpinfo/bing.yml";

import { serpMatchesUrl } from "../shared/serpinfo-match.ts";

const parsed = parse(bing);
const desktopRule = parsed.success
  ? parsed.data.pages.find((page) => page.name === "Web (desktop)")
  : undefined;

export function findBingResults(
  document: Document,
  href: string,
): HTMLOListElement | null {
  if (!desktopRule || !serpMatchesUrl(desktopRule, href, false)) {
    return null;
  }
  const container = document.querySelector("ol#b_results");
  if (!(container instanceof HTMLOListElement)) {
    return null;
  }
  // Reuse the upstream root selector as a structure check when results exist.
  const root = desktopRule.results[0]?.root;
  if (typeof root !== "string") {
    return null;
  }
  const firstResult = document.querySelector(root);
  if (firstResult && !container.contains(firstResult)) {
    return null;
  }
  return container;
}
