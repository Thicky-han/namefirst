// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

import assert from "node:assert/strict";
import { test } from "node:test";

import { BAIDU_HOSTS, getBaiduQuery } from "./baidu.ts";

test("Baidu desktop wd/word queries decode once, retain punctuation and allow pagination", () => {
  for (const host of BAIDU_HOSTS) {
    assert.equal(
      getBaiduQuery(
        `https://${host}/s?wd=Steam+%E5%AE%98%E7%BD%91&pn=10&ie=utf-8`,
      ),
      "Steam 官网",
    );
    assert.equal(getBaiduQuery(`https://${host}/s?word=Node.js`), "Node.js");
    assert.equal(getBaiduQuery(`https://${host}/s?wd=C%2B%2B`), "C++");
  }
});

test("Baidu URL ambiguity, credentials, spoofed hosts, mobile and vertical pages fail closed", () => {
  for (const href of [
    "invalid",
    "http://www.baidu.com/s?wd=Steam",
    "https://m.baidu.com/s?word=Steam",
    "https://www.baidu.com.evil.example/s?wd=Steam",
    "https://evil.example/s?wd=Steam",
    "https://user@www.baidu.com/s?wd=Steam",
    "https://www.baidu.com:444/s?wd=Steam",
    "https://www.baidu.com/sf/vsearch?wd=Steam",
    "https://www.baidu.com/search?wd=Steam",
    "https://www.baidu.com/s?wd=Steam&wd=GitHub",
    "https://www.baidu.com/s?wd=Steam&word=Steam",
    "https://www.baidu.com/s?word=Steam&word=GitHub",
    "https://www.baidu.com/s?wd=+",
    "https://www.baidu.com/s",
    "https://www.baidu.com/s?wd=Steam&tn=news",
    "https://www.baidu.com/s?wd=Steam&tn=baiduimage",
    "https://wappass.baidu.com/static/captcha/tuxing_v2.html?wd=Steam",
  ]) {
    assert.equal(getBaiduQuery(href), null, href);
  }
});
