// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

import { requestMemory } from "./namefirst/memory-client.ts";
import {
  emptyMemory,
  FEEDBACK_KEY,
  MEMORY_KEY,
  readMemory,
} from "./namefirst/memory.ts";
import { ENABLED_KEY, ENGINE_KEYS } from "./namefirst/preferences.ts";
import { startSearchCard, type SearchController } from "./namefirst/search.ts";

async function start() {
  const scope = window as Window & {
    namefirstBing?: SearchController;
    namefirstSearch?: SearchController;
    namefirstCleanup?: () => void;
  };
  scope.namefirstCleanup?.();
  scope.namefirstBing?.stop();
  scope.namefirstSearch?.stop();
  try {
    const stored = await chrome.storage.local.get([
      ENABLED_KEY,
      FEEDBACK_KEY,
      ...Object.values(ENGINE_KEYS),
    ]);
    let memory = emptyMemory();
    let memoryError: string | null = null;
    try {
      memory = await requestMemory({
        channel: "namefirst-memory",
        action: "read",
      });
    } catch (error) {
      memoryError =
        error instanceof Error ? error.message : "个人记忆暂不可用。";
    }
    const controller = startSearchCard(
      stored[ENABLED_KEY] !== false,
      undefined,
      {
        memory,
        error: memoryError,
        feedbackEnabled: stored[FEEDBACK_KEY] !== false,
      },
    );
    scope.namefirstSearch = controller;
    for (const engine of ["bing", "baidu"] as const) {
      controller.setEngineEnabled(
        engine,
        stored[ENGINE_KEYS[engine]] !== false,
      );
    }
    const onChanged = (
      changes: { [key: string]: chrome.storage.StorageChange },
      area: string,
    ) => {
      if (area === "local" && ENABLED_KEY in changes) {
        controller.setEnabled(changes[ENABLED_KEY]?.newValue !== false);
      }
      if (area === "local" && FEEDBACK_KEY in changes) {
        controller.setFeedbackEnabled(
          changes[FEEDBACK_KEY]?.newValue !== false,
        );
      }
      for (const engine of ["bing", "baidu"] as const) {
        if (area === "local" && ENGINE_KEYS[engine] in changes) {
          controller.setEngineEnabled(
            engine,
            changes[ENGINE_KEYS[engine]]?.newValue !== false,
          );
        }
      }
      if (area === "local" && MEMORY_KEY in changes) {
        try {
          controller.setMemory(readMemory(changes[MEMORY_KEY]?.newValue));
        } catch (error) {
          controller.setMemory(
            emptyMemory(),
            error instanceof Error ? error.message : "个人记忆暂不可用。",
          );
        }
      }
    };
    chrome.storage.onChanged.addListener(onChanged);
    scope.namefirstCleanup = () =>
      chrome.storage.onChanged.removeListener(onChanged);
  } catch {
    // Leave the original page intact if the extension is unavailable.
  }
}
void start();
