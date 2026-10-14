// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";

export const projectRoot = fileURLToPath(new URL("../../../", import.meta.url));
export type BrowserTarget = "chrome" | "edge";

export async function launchNameFirst(target: BrowserTarget, profile = "") {
  const executablePath =
    target === "chrome"
      ? process.env.NAMEFIRST_CHROME
      : process.env.NAMEFIRST_EDGE;
  const context = await chromium.launchPersistentContext(profile, {
    ...(executablePath
      ? { executablePath }
      : { channel: target === "chrome" ? "chrome" : "msedge" }),
    headless: true,
    viewport: { width: 1440, height: 1000 },
    ignoreDefaultArgs: ["--disable-extensions"],
    // Only this temporary test profile permits CDP to load an unpacked extension.
    args: ["--enable-unsafe-extension-debugging"],
  });
  try {
    const browser = context.browser();
    if (!browser) {
      throw new Error("No browser available for extension testing.");
    }
    const session = await browser.newBrowserCDPSession();
    const { id } = await session.send("Extensions.loadUnpacked", {
      path: path.join(projectRoot, "dist", target),
    });
    await session.detach();
    return { context, extensionId: id, version: browser.version(), target };
  } catch (error) {
    await context.close();
    throw error;
  }
}
