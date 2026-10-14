// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.
// Stage 2 interface retained; both engines use the shared lifecycle.

import { bingAdapter } from "./adapters.ts";
import { startSearchCard } from "./search.ts";

export type { SearchController as BingController } from "./search.ts";
export function startBingCard(enabled = true) {
  return startSearchCard(enabled, [bingAdapter]);
}
