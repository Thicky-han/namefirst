// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.
// Supported desktop hosts follow the pinned upstream builtin/serpinfo/bing.yml.

export const BING_HOSTS = [
  "www.bing.com",
  "www2.bing.com",
  "www4.bing.com",
  "cn.bing.com",
] as const;
export const BING_MATCHES = BING_HOSTS.map((host) => `https://${host}/search*`);

export function getBingQuery(href: string): string | null {
  try {
    const url = new URL(href);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.port ||
      url.pathname !== "/search" ||
      !BING_HOSTS.some((host) => host === url.hostname)
    ) {
      return null;
    }
    const values = url.searchParams.getAll("q");
    return values.length === 1 && values[0]?.trim() ? values[0] : null;
  } catch {
    return null;
  }
}
