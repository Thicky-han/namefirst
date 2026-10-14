// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

export const BAIDU_HOSTS = ["www.baidu.com", "baidu.com"] as const;
export const BAIDU_MATCHES = BAIDU_HOSTS.map((host) => `https://${host}/s*`);

export function getBaiduQuery(href: string): string | null {
  try {
    const url = new URL(href);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.port ||
      url.pathname !== "/s" ||
      !BAIDU_HOSTS.some((host) => host === url.hostname)
    ) {
      return null;
    }
    if (
      url.searchParams
        .getAll("tn")
        .some((value) => ["news", "baiduimage", "video"].includes(value))
    ) {
      return null;
    }
    const values = [
      ...url.searchParams.getAll("wd"),
      ...url.searchParams.getAll("word"),
    ];
    return values.length === 1 && values[0]?.trim() ? values[0] : null;
  } catch {
    return null;
  }
}

export function findBaiduResults(document: Document): HTMLDivElement | null {
  const container = document.querySelector("#content_left");
  // Missing or changed structures (including verification pages) fail closed.
  return container instanceof HTMLDivElement ? container : null;
}
