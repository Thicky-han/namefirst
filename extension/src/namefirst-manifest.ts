// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

import type { ManifestContext } from "./manifest.ts";
import { BAIDU_MATCHES } from "./scripts/namefirst/baidu.ts";
import { BING_MATCHES } from "./scripts/namefirst/bing-urls.ts";

export function getNameFirstManifest(context: ManifestContext) {
  if (context.browser !== "chrome" && context.browser !== "edge") {
    throw new Error("NameFirst currently supports Chrome and Edge only.");
  }
  return {
    manifest_version: 3,
    name: "NameFirst",
    description:
      "Verified official websites first on Baidu and Bing. Local processing, no account required.",
    version: context.version,
    icons: {
      16: "icons/namefirst/icon-16.png",
      32: "icons/namefirst/icon-32.png",
      48: "icons/namefirst/icon-48.png",
      128: "icons/namefirst/icon-128.png",
    },
    action: {
      default_icon: {
        16: "icons/namefirst/icon-16.png",
        32: "icons/namefirst/icon-32.png",
      },
      default_popup: "pages/namefirst-popup.html",
    },
    permissions: ["storage"],
    background: { service_worker: "scripts/namefirst-background.js" },
    options_ui: { page: "pages/namefirst-manager.html", open_in_tab: true },
    content_scripts: [
      {
        matches: [...BING_MATCHES, ...BAIDU_MATCHES],
        js: ["scripts/namefirst-content-script.js"],
        run_at: "document_idle",
      },
    ],
  };
}
