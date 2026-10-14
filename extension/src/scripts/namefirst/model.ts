// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

import * as z from "zod";

import { hasUnsafeText, normalizeName } from "./normalize.ts";

export function isSafePublicHTTPSURL(value: string): boolean {
  if (value.length > 2048 || value.trim() !== value || /[\s\\]/u.test(value)) {
    return false;
  }
  try {
    const url = new URL(value);
    const labels = url.hostname.split(".");
    return (
      value.startsWith("https://") &&
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !url.port &&
      !url.search &&
      !url.hash &&
      !hasUnsafeText(value) &&
      url.hostname.length <= 253 &&
      labels.length >= 2 &&
      labels.every((label) =>
        /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/u.test(label),
      ) &&
      /^[a-z][a-z0-9-]*$/u.test(labels.at(-1) ?? "") &&
      !/\.(?:localhost|local|internal|invalid|test)$/u.test(url.hostname)
    );
  } catch {
    return false;
  }
}

const text = z
  .string()
  .min(1)
  .max(256)
  .refine((value) => value === value.trim() && !hasUnsafeText(value));
const id = z.string().regex(/^[a-z][a-z0-9-]{0,63}$/u);
const httpsURL = z
  .string()
  .refine(isSafePublicHTTPSURL, "Unsafe public HTTPS URL");
const date = z.iso.date();

export const EntrySchema = z.strictObject({
  id,
  label: text,
  url: httpsURL,
  purpose: z.enum([
    "home",
    "store",
    "community",
    "support",
    "download",
    "docs",
  ]),
  language: text,
  region: text,
  names: z.array(text),
  evidenceIds: z.array(id).min(1),
});

const PlatformSchema = z
  .strictObject({
    id,
    canonicalName: text,
    description: text,
    nameEvidenceIds: z.array(id).min(1),
    aliases: z.array(
      z.strictObject({ name: text, evidenceIds: z.array(id).min(1) }),
    ),
    defaultEntryId: id,
    entries: z.array(EntrySchema).min(1),
    verification: z.strictObject({
      status: z.enum(["verified", "review-needed", "disabled"]),
      verifiedAt: date,
      sources: z
        .array(
          z.strictObject({
            id,
            url: httpsURL,
            kind: z.enum([
              "official-site",
              "official-repository",
              "official-cross-link",
            ]),
            note: z.string().min(1).max(1000),
          }),
        )
        .min(1),
    }),
  })
  .superRefine((platform, context) => {
    const evidenceIds = new Set(
      platform.verification.sources.map((source) => source.id),
    );
    const entryIds = new Set(platform.entries.map((entry) => entry.id));
    const names = [
      platform.canonicalName,
      ...platform.aliases.map((alias) => alias.name),
    ].map(normalizeName);
    if (
      evidenceIds.size !== platform.verification.sources.length ||
      entryIds.size !== platform.entries.length ||
      new Set(names).size !== names.length
    ) {
      context.addIssue({
        code: "custom",
        message: "Duplicate evidence, entry ID, or normalized name",
      });
    }
    if (!entryIds.has(platform.defaultEntryId)) {
      context.addIssue({ code: "custom", message: "Missing default entry" });
    }
    for (const reference of [
      ...platform.nameEvidenceIds,
      ...platform.aliases.flatMap((alias) => alias.evidenceIds),
      ...platform.entries.flatMap((entry) => entry.evidenceIds),
    ]) {
      if (!evidenceIds.has(reference)) {
        context.addIssue({
          code: "custom",
          message: `Missing evidence: ${reference}`,
        });
      }
    }
  });

export const CatalogSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    version: text,
    updatedAt: date,
    materialLicense: z.literal("LicenseRef-NameFirst-NC-Reciprocal-1.0"),
    platforms: z.array(PlatformSchema).min(1),
  })
  .superRefine((catalog, context) => {
    if (
      new Set(catalog.platforms.map((platform) => platform.id)).size !==
      catalog.platforms.length
    ) {
      context.addIssue({ code: "custom", message: "Duplicate platform ID" });
    }
    for (const platform of catalog.platforms) {
      if (platform.verification.verifiedAt > catalog.updatedAt) {
        context.addIssue({
          code: "custom",
          message: "Verification is later than catalog update",
        });
      }
    }
  });

// A user confirmation never becomes evidence of official ownership.
export const PersonalTargetSchema = z.strictObject({
  name: text,
  url: httpsURL,
  confirmed: z.literal(true),
  confirmedAt: z.iso.datetime(),
});

export const PageCandidateSchema = z.strictObject({
  title: text,
  url: httpsURL,
});

export type Catalog = z.infer<typeof CatalogSchema>;
export type Platform = Catalog["platforms"][number];
export type OfficialEntry = z.infer<typeof EntrySchema>;
export type PersonalTarget = z.infer<typeof PersonalTargetSchema>;
export type PageCandidate = z.infer<typeof PageCandidateSchema>;

export type OfficialMatch = {
  platformId: string;
  name: string;
  description: string;
  entry: OfficialEntry;
  alternativeEntries: OfficialEntry[];
  verification: Platform["verification"];
  matchKind: "canonical" | "alias" | "entry-name";
};

export type Resolution = {
  query: string;
  normalizedQuery: string;
  intent: "navigation" | "information" | "unknown";
} & (
  | { status: "official"; result: OfficialMatch }
  | { status: "personal"; result: PersonalTarget }
  | {
      status: "candidate";
      reason:
        | "ambiguous-name"
        | "review-needed"
        | "stale-record"
        | "entry-unavailable"
        | "personal-conflict"
        | "unverified-page";
      officialCandidates: OfficialMatch[];
      personalCandidates: PersonalTarget[];
      pageCandidates: z.infer<typeof PageCandidateSchema>[];
    }
  | {
      status: "none";
      reason:
        | "empty-query"
        | "invalid-query"
        | "information-query"
        | "unknown-name";
    }
);
