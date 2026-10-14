// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

import assert from "node:assert/strict";
import { test } from "node:test";

import { getNameFirstManifest } from "../../namefirst-manifest.ts";
import { BAIDU_MATCHES } from "./baidu.ts";
import { BING_HOSTS, BING_MATCHES, getBingQuery } from "./bing-urls.ts";

test("Bing queries use the URL, decode correctly and restrict hosts", () => {
  for (const host of BING_HOSTS) {
    assert.equal(
      getBingQuery(
        `https://${host}/search?q=Steam+%E5%AE%98%E7%BD%91&form=QBLH`,
      ),
      "Steam 官网",
    );
  }
  assert.equal(
    getBingQuery(
      "https://www.bing.com/search?q=%EF%BC%B3%EF%BD%94%EF%BD%85%EF%BD%81%EF%BD%8D",
    ),
    "Ｓｔｅａｍ",
  );
});

test("invalid, ambiguous and non-web-search URLs fail closed", () => {
  for (const url of [
    "invalid",
    "http://www.bing.com/search?q=Steam",
    "https://bing.com/search?q=Steam",
    "https://www.bing.com.evil.example/search?q=Steam",
    "https://evil.example/search?q=Steam",
    "https://user@www.bing.com/search?q=Steam",
    "https://www.bing.com:444/search?q=Steam",
    "https://www.bing.com/images/search?q=Steam",
    "https://www.bing.com/searching?q=Steam",
    "https://www.bing.com/search",
    "https://www.bing.com/search?q=",
    "https://www.bing.com/search?q=+",
    "https://www.bing.com/search?q=Steam&q=GitHub",
  ]) {
    assert.equal(getBingQuery(url), null, url);
  }
});

test("NameFirst manifests have a local memory worker without account or remote service permissions", () => {
  for (const browser of ["chrome", "edge"] as const) {
    const manifest = getNameFirstManifest({
      browser,
      version: "0.2.0",
      noKey: false,
      debug: false,
    });
    assert.deepEqual(manifest.permissions, ["storage"]);
    assert.deepEqual(manifest.content_scripts[0]?.matches, [
      ...BING_MATCHES,
      ...BAIDU_MATCHES,
    ]);
    assert.equal(manifest.action.default_popup, "pages/namefirst-popup.html");
    for (const property of [
      "oauth2",
      "host_permissions",
      "web_accessible_resources",
      "key",
      "default_locale",
    ]) {
      assert.equal(property in manifest, false, property);
    }
    assert.deepEqual(manifest.background, {
      service_worker: "scripts/namefirst-background.js",
    });
    assert.deepEqual(manifest.options_ui, {
      page: "pages/namefirst-manager.html",
      open_in_tab: true,
    });
  }
  assert.throws(() =>
    getNameFirstManifest({
      browser: "firefox",
      version: "0.2.0",
      noKey: true,
      debug: false,
    }),
  );
});
