// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

import { PageCandidateSchema, type PageCandidate } from "./model.ts";

export function collectCandidates(
  document: Document,
  selector: string,
): PageCandidate[] {
  const candidates: PageCandidate[] = [];
  for (const anchor of document.querySelectorAll<HTMLAnchorElement>(selector)) {
    if (
      anchor.closest(
        "[data-namefirst-card], [data-namefirst-feedback], .b_ad, [data-ad], [data-tuiguang]",
      )
    ) {
      continue;
    }
    const parsed = PageCandidateSchema.safeParse({
      title: anchor.textContent?.trim().slice(0, 256),
      url: anchor.href,
    });
    if (
      !parsed.success ||
      /(^|\.)(bing|baidu)\.com$/u.test(new URL(parsed.data.url).hostname)
    ) {
      continue;
    }
    if (!candidates.some((candidate) => candidate.url === parsed.data.url)) {
      candidates.push(parsed.data);
    }
    if (candidates.length === 5) {
      break;
    }
  }
  return candidates;
}
