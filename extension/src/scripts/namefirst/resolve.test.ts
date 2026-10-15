// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

import assert from "node:assert/strict";
import { test } from "node:test";

import catalogData from "./catalog.json" with { type: "json" };
import { CatalogSchema, isSafePublicHTTPSURL } from "./model.ts";
import { normalizeName } from "./normalize.ts";
import { createNameResolver, resolveName } from "./resolve.ts";

const current = { asOf: "2026-10-15" };
function resolve(query: string) {
  return resolveName(query, current);
}
function changedCatalog() {
  return CatalogSchema.parse(structuredClone(catalogData));
}

test("ambiguous names never bypass the verification and expiry gate", () => {
  const stale = resolveName("Rust", { asOf: "2027-10-13" });
  assert.equal(stale.status, "candidate");
  if (stale.status === "candidate") {
    assert.equal(stale.reason, "stale-record");
  }
  const catalog = changedCatalog();
  catalog.platforms.find(
    (platform) => platform.canonicalName === "Rust",
  )!.verification.status = "disabled";
  const disabled = createNameResolver(catalog)("Rust", current);
  assert.equal(disabled.status, "candidate");
  if (disabled.status === "candidate") {
    assert.equal(disabled.reason, "review-needed");
  }
});

test("bundled catalog validates with source references and 118 reviewed subjects", () => {
  const catalog = CatalogSchema.parse(catalogData);
  assert.equal(catalog.platforms.length, 118);
  assert.equal(
    catalog.platforms.flatMap((platform) => platform.entries).length,
    173,
  );
  assert.equal(
    catalog.materialLicense,
    "LicenseRef-NameFirst-NC-Reciprocal-1.0",
  );
});

test("first-use exact names resolve without feedback, history, or page results", async (t) => {
  for (const platform of catalogData.platforms.filter(
    (item) => item.canonicalName !== "Rust",
  )) {
    await t.test(platform.canonicalName, () => {
      const result = resolve(platform.canonicalName);
      assert.equal(result.status, "official");
      if (result.status === "official") {
        assert.equal(result.result.platformId, platform.id);
        assert.equal(
          result.result.entry.url,
          platform.entries.find((entry) => entry.id === platform.defaultEntryId)
            ?.url,
        );
        assert.equal(result.result.matchKind, "canonical");
      }
    });
  }
});

test("Steam returns the actual store URL and independently identified alternatives", () => {
  const result = resolve("Steam");
  assert.equal(result.status, "official");
  if (result.status === "official") {
    assert.equal(result.result.entry.url, "https://store.steampowered.com/");
    assert.equal(result.result.verification.verifiedAt, "2026-10-13");
    assert.deepEqual(
      result.result.alternativeEntries.map((entry) => entry.purpose),
      ["community", "support", "download"],
    );
  }
});

test("case, width and ordinary whitespace normalization preserve meaningful characters", async (t) => {
  for (const query of [
    " steam ",
    "STEAM",
    "Ｓｔｅａｍ",
    "\tSteam\n",
    "  OBS   Studio  ",
    "Node.js",
  ]) {
    await t.test(JSON.stringify(query), () =>
      assert.equal(resolve(query).status, "official"),
    );
  }
  assert.equal(normalizeName("C++"), "c++");
  for (const query of [
    "Nodejs",
    "Node js",
    "Git Hub",
    "Ste am",
    "Stéam",
    "Stеam",
  ]) {
    assert.equal(resolve(query).status, "none", query);
  }
});

test("verified aliases are distinct from canonical matches", async (t) => {
  for (const [query, id] of [
    ["bilibili", "bilibili"],
    ["维基百科", "wikipedia"],
    ["OBS", "obs"],
    ["VLC", "vlc"],
    ["Bing", "bing"],
  ]) {
    await t.test(query!, () => {
      const result = resolve(query!);
      assert.equal(result.status, "official");
      if (result.status === "official") {
        assert.equal(result.result.platformId, id);
        assert.equal(result.result.matchKind, "alias");
      }
    });
  }
});

test("canonical name beats another platform's alias", () => {
  const catalog = changedCatalog();
  catalog.platforms
    .find((platform) => platform.id === "github")!
    .aliases.push({ name: "Steam", evidenceIds: ["primary"] });
  const result = createNameResolver(catalog)("Steam", current);
  assert.equal(result.status, "official");
  if (result.status === "official") {
    assert.equal(result.result.platformId, "steam");
  }
});

test("an exact canonical name also beats a colliding shorthand alias", () => {
  const catalog = changedCatalog();
  catalog.platforms.find(
    (platform) => platform.id === "github",
  )!.canonicalName = "OBS";
  const result = createNameResolver(catalog)("OBS", current);
  assert.equal(result.status, "official");
  if (result.status === "official") {
    assert.equal(result.result.platformId, "github");
  }
});

test("Rust remains ambiguous rather than choosing by popularity", () => {
  const result = resolve("Rust 官网");
  assert.equal(result.status, "candidate");
  if (result.status === "candidate") {
    assert.equal(result.reason, "ambiguous-name");
    assert.deepEqual(
      result.officialCandidates.map((item) => item.platformId),
      ["rust-language", "rust-game"],
    );
    assert.equal(
      new Set(result.officialCandidates.map((item) => item.entry.url)).size,
      2,
    );
  }
  const qualified = resolve("Rust Programming Language");
  assert.equal(qualified.status, "official");
  if (qualified.status === "official") {
    assert.equal(qualified.result.platformId, "rust-language");
  }
});

test("navigation decorations only match the complete remaining name", async (t) => {
  for (const query of [
    "Steam官网",
    "Steam 官方网站",
    "官网 Steam",
    "官方网站Steam",
    "official Steam",
    "Steam official website",
    "Steam homepage",
  ]) {
    await t.test(query, () => assert.equal(resolve(query).status, "official"));
  }
  for (const query of [
    "Steam代购官网",
    "fake Steam官网",
    "Steam官网镜像",
    "Steam官方代理",
    "Steam 官网 推荐",
  ]) {
    assert.equal(resolve(query).status, "none", query);
  }
});

test("explicit official sub-entries resolve by recorded purpose", async (t) => {
  for (const [query, url] of [
    ["Steam 社区", "https://steamcommunity.com/"],
    ["Steam community", "https://steamcommunity.com/"],
    ["Steam Community", "https://steamcommunity.com/"],
    ["Steam 帮助", "https://help.steampowered.com/"],
    ["Steam Support", "https://help.steampowered.com/"],
    ["Steam 官方下载", "https://store.steampowered.com/about/"],
    ["Steam download", "https://store.steampowered.com/about/"],
    ["Python 官方文档", "https://docs.python.org/"],
    ["Python documentation", "https://docs.python.org/"],
  ]) {
    await t.test(query!, () => {
      const result = resolve(query!);
      assert.equal(result.status, "official");
      if (result.status === "official") {
        assert.equal(result.result.entry.url, url);
      }
    });
  }
});

test("an unrecorded requested entry is not silently replaced by a homepage", () => {
  const result = resolve("GitHub 商店");
  assert.equal(result.status, "candidate");
  if (result.status === "candidate") {
    assert.equal(result.reason, "entry-unavailable");
  }
});

test("information queries keep their intent, including official tutorial queries", async (t) => {
  for (const query of [
    "Steam 使用教程",
    "Steam下载教程",
    "Steam 官网 教程",
    "Steam news",
    "Steam 新闻",
    "GitHub 怎么使用",
    "Python是什么",
    "Rust vs Python",
    "how to install Steam",
    "Steam price",
    "Steam打不开",
  ]) {
    await t.test(query, () => {
      const result = resolve(query);
      assert.equal(result.status, "none");
      assert.equal(result.intent, "information");
      if (result.status === "none") {
        assert.equal(result.reason, "information-query");
      }
    });
  }
});

test("a catalog name containing an information word still wins as an exact name", () => {
  const catalog = changedCatalog();
  catalog.platforms.find(
    (platform) => platform.id === "github",
  )!.canonicalName = "Example News";
  assert.equal(
    createNameResolver(catalog)("Example News", current).status,
    "official",
  );
  assert.equal(
    createNameResolver(catalog)("Example News 官网", current).status,
    "official",
  );
});

test("unknown names and typos do not generate guessed domains", () => {
  for (const query of [
    "stema",
    "从未收录的站点",
    "从未收录的站点官网",
    "steam.example.com",
  ]) {
    const result = resolve(query);
    assert.equal(result.status, "none");
    assert.equal("result" in result, false);
  }
});

test("blank, oversized and hidden-control queries fail safely", () => {
  assert.equal(resolve("  ").status, "none");
  for (const query of [
    "Steam\u200b",
    "Steam\u202e",
    "Steam\0",
    "a".repeat(513),
  ]) {
    const result = resolve(query);
    assert.equal(result.status, "none");
    if (result.status === "none") {
      assert.equal(result.reason, "invalid-query");
    }
  }
});

test("a fake first result and its claimed official field cannot replace Steam", () => {
  const result = resolveName("Steam", {
    ...current,
    pageCandidates: [
      { title: "Steam官网", url: "https://fake.example.com/", official: true },
    ],
    personalTargets: [
      {
        name: "Steam",
        url: "https://fake.example.com/",
        confirmed: true,
        confirmedAt: "2026-10-13T00:00:00Z",
      },
    ],
  });
  assert.equal(result.status, "official");
  if (result.status === "official") {
    assert.equal(result.result.entry.url, "https://store.steampowered.com/");
  }
});

test("a matching unknown page title is only a candidate, never official proof", () => {
  const result = resolveName("小众站官网", {
    ...current,
    pageCandidates: [
      { title: "小众站官网", url: "https://niche.example.com/" },
    ],
  });
  assert.equal(result.status, "candidate");
  if (result.status === "candidate") {
    assert.equal(result.reason, "unverified-page");
    assert.equal(result.officialCandidates.length, 0);
    assert.equal(result.pageCandidates.length, 1);
  }
});

test("unsafe, unrelated and authority-forging page candidates are ignored", () => {
  const result = resolveName("小众站", {
    ...current,
    pageCandidates: [
      { title: "小众站", url: "javascript:alert(1)" },
      { title: "小众站", url: "https://fake.example.com/", verified: true },
      { title: "其他站点", url: "https://other.example.com/" },
    ],
  });
  assert.equal(result.status, "none");
});

test("explicitly supplied confirmed personal targets keep personal status", () => {
  const result = resolveName("小众站", {
    ...current,
    personalTargets: [
      {
        name: "小众站",
        url: "https://niche.example.com/",
        confirmed: true,
        confirmedAt: "2026-10-12T12:00:00Z",
      },
    ],
  });
  assert.equal(result.status, "personal");
  if (result.status === "personal") {
    assert.equal(result.result.url, "https://niche.example.com/");
    assert.equal("verification" in result.result, false);
  }
  assert.equal(resolve("小众站").status, "none");
});

test("unconfirmed, future and unsafe personal inputs are ignored", () => {
  for (const extra of [
    { confirmed: false },
    { confirmedAt: "2026-10-16T00:00:00Z" },
    { url: "https://localhost/" },
    { official: true },
  ]) {
    const result = resolveName("小众站", {
      ...current,
      personalTargets: [
        {
          name: "小众站",
          url: "https://niche.example.com/",
          confirmed: true,
          confirmedAt: "2026-10-12T00:00:00Z",
          ...extra,
        },
      ],
    });
    assert.equal(result.status, "none");
  }
});

test("conflicting personal targets require a choice", () => {
  const result = resolveName("小众站", {
    ...current,
    personalTargets: ["one", "two"].map((host) => ({
      name: "小众站",
      url: `https://${host}.example.com/`,
      confirmed: true,
      confirmedAt: "2026-10-12T00:00:00Z",
    })),
  });
  assert.equal(result.status, "candidate");
  if (result.status === "candidate") {
    assert.equal(result.reason, "personal-conflict");
  }
});

test("personal confirmation cannot override an ambiguous official name", () => {
  const result = resolveName("Rust", {
    ...current,
    personalTargets: [
      {
        name: "Rust",
        url: "https://fake.example.com/",
        confirmed: true,
        confirmedAt: "2026-10-12T00:00:00Z",
      },
    ],
  });
  assert.equal(result.status, "candidate");
  if (result.status === "candidate") {
    assert.equal(result.reason, "ambiguous-name");
  }
});

test("old and future verifications are not promoted", () => {
  for (const asOf of ["2027-10-13", "2026-10-12"]) {
    const result = resolveName("Steam", { asOf });
    assert.equal(result.status, "candidate");
    if (result.status === "candidate") {
      assert.equal(result.reason, "stale-record");
    }
  }
});

test("review-needed and disabled records are not promoted", () => {
  for (const status of ["review-needed", "disabled"] as const) {
    const catalog = changedCatalog();
    catalog.platforms.find(
      (platform) => platform.id === "steam",
    )!.verification.status = status;
    const result = createNameResolver(catalog)("Steam", current);
    assert.equal(result.status, "candidate");
    if (result.status === "candidate") {
      assert.equal(result.reason, "review-needed");
    }
  }
});

test("malformed catalog and broken evidence references are rejected", () => {
  for (const change of [
    (catalog: ReturnType<typeof changedCatalog>) => {
      catalog.platforms[0]!.defaultEntryId = "missing";
    },
    (catalog: ReturnType<typeof changedCatalog>) => {
      catalog.platforms[0]!.entries[0]!.evidenceIds = ["missing"];
    },
    (catalog: ReturnType<typeof changedCatalog>) => {
      catalog.platforms[0]!.entries[0]!.url = "http://fake.example.com/";
    },
    (catalog: ReturnType<typeof changedCatalog>) => {
      catalog.platforms.push(catalog.platforms[0]!);
    },
    (catalog: ReturnType<typeof changedCatalog>) => {
      catalog.platforms[0]!.aliases.push({
        name: "Ｓｔｅａｍ",
        evidenceIds: ["primary"],
      });
    },
    (catalog: ReturnType<typeof changedCatalog>) => {
      catalog.platforms[0]!.verification.verifiedAt = "2026-10-16";
    },
  ]) {
    const catalog = changedCatalog();
    change(catalog);
    assert.throws(() => createNameResolver(catalog));
  }
  assert.equal(
    CatalogSchema.safeParse({ ...catalogData, schemaVersion: 2 }).success,
    false,
  );
  assert.equal(
    CatalogSchema.safeParse({ ...catalogData, updatedAt: "2026-02-30" })
      .success,
    false,
  );
});

test("unsafe URL forms are rejected without claiming domain-ownership verification", async (t) => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,hi",
    "http://example.com/",
    "https://user:pass@example.com/",
    "https://localhost/",
    "https://127.0.0.1/",
    "https://0x7f000001/",
    "https://[::1]/",
    "https://internal.test/",
    "https://example.com:8443/",
    "https://example.com/?redirect=https://evil.example.com/",
    "https://example.com/#fragment",
    "https://example.com\\@evil.example.com/",
    " https://example.com/",
    "https://example.com./",
  ]) {
    await t.test(url, () => assert.equal(isSafePublicHTTPSURL(url), false));
  }
  assert.equal(isSafePublicHTTPSURL("https://example.com/"), true);
  assert.equal(
    resolveName("Unknown", {
      ...current,
      pageCandidates: [{ title: "Unknown", url: "https://example.com/" }],
    }).status,
    "candidate",
  );
});

test("catalog results cannot mutate shared official URLs", () => {
  const result = resolve("Steam");
  assert.equal(result.status, "official");
  if (result.status === "official") {
    assert.throws(() => {
      result.result.entry.url = "https://fake.example.com/";
    });
  }
  const again = resolve("Steam");
  if (again.status === "official") {
    assert.equal(again.result.entry.url, "https://store.steampowered.com/");
  }
});

test("caller catalog is snapshotted and policy dates are validated", () => {
  const catalog = changedCatalog();
  const resolver = createNameResolver(catalog);
  catalog.platforms[0]!.entries[0]!.url = "https://fake.example.com/";
  const result = resolver("Steam", current);
  if (result.status === "official") {
    assert.equal(result.result.entry.url, "https://store.steampowered.com/");
  }
  assert.throws(() => resolver("Steam", { asOf: "2026-02-30" }));
  assert.throws(() => createNameResolver(catalogData, 0));
});
