// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

import catalogData from "./catalog.json" with { type: "json" };
import {
  CatalogSchema,
  PageCandidateSchema,
  PersonalTargetSchema,
  type OfficialEntry,
  type OfficialMatch,
  type Platform,
  type Resolution,
} from "./model.ts";
import { hasUnsafeText, normalizeName } from "./normalize.ts";

export type ResolutionOptions = {
  asOf?: string;
  personalTargets?: readonly unknown[];
  pageCandidates?: readonly unknown[];
};

type NameMatch = {
  platform: Platform;
  entry: OfficialEntry | null;
  kind: OfficialMatch["matchKind"];
};
type Purpose = OfficialEntry["purpose"];
type Navigation = { name: string; purpose: Purpose | null };

const purposes: readonly [RegExp, Purpose][] = [
  [/\s*(?:商店|商城)$/u, "store"],
  [/\s+store$/u, "store"],
  [/\s*社区$/u, "community"],
  [/\s+community$/u, "community"],
  [/\s*(?:帮助|支持|客服)$/u, "support"],
  [/\s+(?:help|support)$/u, "support"],
  [/\s*(?:官方下载|下载)$/u, "download"],
  [/\s+download$/u, "download"],
  [/\s*(?:官方文档|文档)$/u, "docs"],
  [/\s+(?:docs|documentation)$/u, "docs"],
];

function parseNavigation(query: string): Navigation {
  const name = query
    .replace(/^(?:官方网站|官网|官方主页|官方)\s*/u, "")
    .replace(/^official\s+/u, "")
    .replace(/\s*(?:官方网站|官方主页|官网|主页|首页|官方)$/u, "")
    .replace(/\s+(?:official(?:\s+(?:website|site))?|website|homepage)$/u, "")
    .trim();
  for (const [pattern, purpose] of purposes) {
    if (pattern.test(name)) {
      return { name: name.replace(pattern, "").trim(), purpose };
    }
  }
  return { name, purpose: null };
}

export function getNavigationName(query: string): string {
  return parseNavigation(normalizeName(query)).name;
}
export function getNavigationPurpose(query: string) {
  return parseNavigation(normalizeName(query)).purpose;
}

function isInformationQuery(query: string): boolean {
  return (
    /教程|攻略|新闻|评测|测评|评论|对比|是什么|为什么|怎么|如何|怎么办|打不开|好用吗|价格/u.test(
      query,
    ) ||
    /\b(?:tutorials?|news|reviews?|versus|vs|troubleshooting|price)\b|\bhow\s+(?:to|do|does)\b|\bwhat\s+is\b/u.test(
      query,
    )
  );
}

function freezeTree(value: unknown): void {
  if (value !== null && typeof value === "object") {
    for (const child of Object.values(value)) {
      freezeTree(child);
    }
    Object.freeze(value);
  }
}

function dayNumber(value: string): number {
  const time = Date.parse(`${value}T00:00:00Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/u.test(value) ||
    !Number.isFinite(time) ||
    new Date(time).toISOString().slice(0, 10) !== value
  ) {
    throw new RangeError("asOf must be a valid YYYY-MM-DD date");
  }
  return time / 86_400_000;
}

/** Accept only a maintainer-reviewed catalog, never search-page JSON. */
export function createNameResolver(inputCatalog: unknown, maxAgeDays = 180) {
  if (!Number.isSafeInteger(maxAgeDays) || maxAgeDays < 1) {
    throw new RangeError("maxAgeDays must be a positive integer");
  }
  const catalog = CatalogSchema.parse(inputCatalog);
  freezeTree(catalog);
  const canonical = new Map<string, NameMatch[]>();
  const aliases = new Map<string, NameMatch[]>();
  const entryNames = new Map<string, NameMatch[]>();

  function index(
    map: Map<string, NameMatch[]>,
    name: string,
    match: NameMatch,
  ) {
    const key = normalizeName(name);
    const existing = map.get(key) ?? [];
    existing.push(match);
    map.set(key, existing);
  }
  for (const platform of catalog.platforms) {
    index(canonical, platform.canonicalName, {
      platform,
      entry: null,
      kind: "canonical",
    });
    for (const alias of platform.aliases) {
      index(aliases, alias.name, { platform, entry: null, kind: "alias" });
    }
    for (const entry of platform.entries) {
      for (const name of entry.names) {
        index(entryNames, name, { platform, entry, kind: "entry-name" });
      }
    }
  }

  function lookup(name: string): NameMatch[] {
    return (
      canonical.get(name) ?? aliases.get(name) ?? entryNames.get(name) ?? []
    );
  }

  return function resolveName(
    query: string,
    options: ResolutionOptions = {},
  ): Resolution {
    const normalizedQuery = normalizeName(query);
    const base = { query, normalizedQuery, intent: "unknown" as const };
    if (!normalizedQuery) {
      return { ...base, status: "none", reason: "empty-query" };
    }
    if (
      query.length > 512 ||
      normalizedQuery.length > 256 ||
      hasUnsafeText(query)
    ) {
      return { ...base, status: "none", reason: "invalid-query" };
    }

    const exactMatches = lookup(normalizedQuery);
    const today = dayNumber(
      options.asOf ?? new Date().toISOString().slice(0, 10),
    );
    const validatedPersonal = (options.personalTargets ?? []).flatMap(
      (input) => {
        const parsed = PersonalTargetSchema.safeParse(input);
        return parsed.success &&
          Date.parse(parsed.data.confirmedAt) < (today + 1) * 86_400_000
          ? [parsed.data]
          : [];
      },
    );
    const exactPersonal = validatedPersonal.some(
      (target) => normalizeName(target.name) === normalizedQuery,
    );
    const navigation =
      exactMatches.length || exactPersonal
        ? { name: normalizedQuery, purpose: null }
        : parseNavigation(normalizedQuery);
    const matches = exactMatches.length
      ? exactMatches
      : lookup(navigation.name);
    // Complete catalog names still win when they contain words such as News.
    if (
      !matches.length &&
      !exactPersonal &&
      isInformationQuery(normalizedQuery)
    ) {
      return {
        ...base,
        intent: "information",
        status: "none",
        reason: "information-query",
      };
    }
    const navigationBase = { ...base, intent: "navigation" as const };

    if (matches.length) {
      const officialCandidates: OfficialMatch[] = matches.map((match) => {
        const { platform } = match;
        // Schema validation guarantees a default entry; no domain is guessed.
        const defaultEntry = platform.entries.find(
          (entry) => entry.id === platform.defaultEntryId,
        )!;
        const entry = navigation.purpose
          ? (platform.entries.find(
              (item) => item.purpose === navigation.purpose,
            ) ?? defaultEntry)
          : (match.entry ?? defaultEntry);
        return {
          platformId: platform.id,
          name: platform.canonicalName,
          description: platform.description,
          entry,
          alternativeEntries: platform.entries.filter(
            (item) => item.id !== entry.id,
          ),
          verification: platform.verification,
          matchKind: match.kind,
        };
      });
      let reason:
        | Extract<Resolution, { status: "candidate" }>["reason"]
        | null = null;
      if (
        officialCandidates.some(
          (match) => match.verification.status !== "verified",
        )
      ) {
        reason = "review-needed";
      } else if (
        officialCandidates.some((match) => {
          const age = today - dayNumber(match.verification.verifiedAt);
          return age < 0 || age > maxAgeDays;
        })
      ) {
        reason = "stale-record";
      } else if (
        navigation.purpose &&
        officialCandidates.some(
          (match) => match.entry.purpose !== navigation.purpose,
        )
      ) {
        reason = "entry-unavailable";
      } else if (officialCandidates.length > 1) {
        reason = "ambiguous-name";
      }
      if (reason) {
        return {
          ...navigationBase,
          status: "candidate",
          reason,
          officialCandidates,
          personalCandidates: [],
          pageCandidates: [],
        };
      }
      return {
        ...navigationBase,
        status: "official",
        result: officialCandidates[0]!,
      };
    }

    // Personal confirmations remain separate from the official catalog.
    const personalCandidates = validatedPersonal
      .flatMap((input) => {
        const parsed = PersonalTargetSchema.safeParse(input);
        return parsed.success &&
          normalizeName(parsed.data.name) === navigation.name &&
          Date.parse(parsed.data.confirmedAt) < (today + 1) * 86_400_000
          ? [parsed.data]
          : [];
      })
      .filter(
        (target, index, targets) =>
          targets.findIndex((item) => item.url === target.url) === index,
      );
    if (personalCandidates.length === 1 && !navigation.purpose) {
      return {
        ...navigationBase,
        status: "personal",
        result: personalCandidates[0]!,
      };
    }
    if (personalCandidates.length) {
      return {
        ...navigationBase,
        status: "candidate",
        reason: navigation.purpose ? "entry-unavailable" : "personal-conflict",
        officialCandidates: [],
        personalCandidates,
        pageCandidates: [],
      };
    }
    const pageCandidates = (options.pageCandidates ?? [])
      .flatMap((input) => {
        const parsed = PageCandidateSchema.safeParse(input);
        return parsed.success &&
          parseNavigation(normalizeName(parsed.data.title)).name ===
            navigation.name
          ? [parsed.data]
          : [];
      })
      .filter(
        (target, index, targets) =>
          targets.findIndex((item) => item.url === target.url) === index,
      );
    if (pageCandidates.length) {
      return {
        ...navigationBase,
        status: "candidate",
        reason: "unverified-page",
        officialCandidates: [],
        personalCandidates: [],
        pageCandidates,
      };
    }
    return { ...base, status: "none", reason: "unknown-name" };
  };
}

export const resolveName = createNameResolver(catalogData);
