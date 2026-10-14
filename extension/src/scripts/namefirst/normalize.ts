// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

export function normalizeName(value: string): string {
  return value.normalize("NFKC").toLowerCase().trim().replace(/\s+/gu, " ");
}

export function hasUnsafeText(value: string): boolean {
  // Permit ordinary whitespace, but do not silently remove hidden format marks.
  const withoutOrdinaryWhitespace = value
    .replaceAll("\t", "")
    .replaceAll("\n", "")
    .replaceAll("\r", "");
  return /[\p{Cf}\p{Cc}]/u.test(withoutOrdinaryWhitespace);
}
