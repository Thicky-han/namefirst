// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

import { fileURLToPath } from "node:url";

import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  outputDir: "../test-results/namefirst",
  forbidOnly: Boolean(process.env.CI),
  workers: 1,
  timeout: 30_000,
  projects: [
    { name: "chrome-bing", testMatch: /(?:memory|search)\.spec\.ts$/u },
    { name: "chrome-baidu", testMatch: /(?:memory|search)\.spec\.ts$/u },
    { name: "edge-bing", testMatch: /(?:memory|search)\.spec\.ts$/u },
    { name: "edge-baidu", testMatch: /(?:memory|search)\.spec\.ts$/u },
    { name: "chrome-manager", testMatch: /manager\.spec\.ts$/u },
    { name: "edge-manager", testMatch: /manager\.spec\.ts$/u },
  ],
  reporter: [
    ["list"],
    [
      "json",
      {
        outputFile: fileURLToPath(
          new URL("../../../.cache/1.1.0-browser-report.json", import.meta.url),
        ),
      },
    ],
  ],
});
