// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

import { SEARCH_ADAPTERS, type SearchAdapter } from "./adapters.ts";
import { createSearchView } from "./feedback.ts";
import {
  emptyMemory,
  findMemory,
  personalTargets,
  type MemoryState,
} from "./memory.ts";
import { normalizeName } from "./normalize.ts";
import { getNavigationName, resolveName } from "./resolve.ts";

export type SearchController = {
  refresh: () => void;
  setEnabled: (enabled: boolean) => void;
  stop: () => void;
  setMemory: (
    state: MemoryState,
    error?: string | null,
    notice?: string,
  ) => void;
  setFeedbackEnabled: (enabled: boolean) => void;
  setEngineEnabled: (engine: SearchAdapter["id"], enabled: boolean) => void;
};

export function startSearchCard(
  enabled = true,
  adapters: readonly SearchAdapter[] = SEARCH_ADAPTERS,
  initial: {
    memory: MemoryState;
    error: string | null;
    feedbackEnabled: boolean;
  } = { memory: emptyMemory(), error: null, feedbackEnabled: true },
): SearchController {
  let host: HTMLElement | null = null;
  let signature = "";
  let stopped = false;
  let pending: number | null = null;
  let href = window.location.href;
  const dismissed = new Set<string>();
  let memory = initial.memory;
  let memoryError = initial.error;
  let feedbackEnabled = initial.feedbackEnabled;
  const engines = { bing: true, baidu: true };
  let notice = "";
  let noticeQuery = "";

  function clear() {
    host?.remove();
    host = null;
    signature = "";
  }
  function refresh(forceQuery?: string) {
    if (stopped) {
      return;
    }
    try {
      const adapter = adapters.find(
        (item) => item.getQuery(window.location.href) !== null,
      );
      const query = adapter?.getQuery(window.location.href);
      const dismissalKey = `${adapter?.id}:${normalizeName(query ?? "")}`;
      const target =
        query && enabled && adapter && engines[adapter.id]
          ? adapter?.findResults(document, window.location.href)
          : null;
      if (!target || !query || !adapter || dismissed.has(dismissalKey)) {
        clear();
        return;
      }
      const matchedRecord = findMemory(memory, query, getNavigationName(query));
      const resolution = resolveName(query, {
        personalTargets: matchedRecord
          ? personalTargets({ ...memory, records: [matchedRecord] })
          : [],
      });
      const name =
        resolution.status === "official"
          ? resolution.result.name
          : getNavigationName(query);
      const record =
        matchedRecord ?? findMemory(memory, name, normalizeName(name));
      const currentNotice = noticeQuery === dismissalKey ? notice : "";
      const nextSignature = JSON.stringify([
        adapter.id,
        resolution,
        record,
        memoryError,
        feedbackEnabled,
        currentNotice,
      ]);
      const openEditor =
        host?.firstElementChild?.shadowRoot?.querySelector<HTMLDetailsElement>(
          "details.feedback[open]",
        );
      const dirty =
        openEditor &&
        [...openEditor.querySelectorAll<HTMLInputElement>("form input")].some(
          (input) => input.value !== input.defaultValue,
        );
      if (
        dirty &&
        forceQuery !== dismissalKey &&
        host?.isConnected &&
        host.parentElement === target &&
        host.dataset.queryKey === dismissalKey &&
        host.dataset.notice === currentNotice &&
        feedbackEnabled &&
        !memoryError &&
        signature !== nextSignature
      ) {
        const message = openEditor.querySelector<HTMLElement>("[role=status]");
        const warning =
          "其他页面已更新记忆；当前草稿保留。关闭此入口可载入最新值，旧草稿不能覆盖新记录。";
        if (message && message.textContent !== warning) {
          message.textContent = warning;
        }
        if (target.firstElementChild !== host) {
          target.prepend(host);
        }
        return;
      }
      if (
        host?.isConnected &&
        host.parentElement === target &&
        signature === nextSignature
      ) {
        if (target.firstElementChild !== host) {
          target.prepend(host);
        }
        return;
      }
      clear();
      host = createSearchView(document, adapter.cardTag, {
        query,
        name,
        resolution,
        state: memory,
        record,
        enabled: feedbackEnabled,
        error: memoryError,
        notice: currentNotice,
        open: Boolean(currentNotice),
        getCandidates: () => adapter.getCandidates(document),
        dismiss: () => {
          dismissed.add(dismissalKey);
          clear();
        },
        onMemory: (state, message) => {
          if (state.revision < memory.revision) {
            return;
          }
          memory = state;
          memoryError = null;
          notice = message;
          noticeQuery = dismissalKey;
          refresh(dismissalKey);
        },
        refresh,
      });
      if (host) {
        host.dataset.queryKey = dismissalKey;
        host.dataset.notice = currentNotice;
      }
      signature = nextSignature;
      if (host) {
        target.prepend(host);
      }
    } catch {
      // A changed DOM or invalidated extension must not break the search UI.
      clear();
    }
  }
  function schedule() {
    if (!stopped && pending === null) {
      pending = window.setTimeout(() => {
        pending = null;
        refresh();
      }, 80);
    }
  }
  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  const poll = window.setInterval(() => {
    if (href !== window.location.href) {
      href = window.location.href;
      refresh();
    }
  }, 500);
  window.addEventListener("popstate", schedule);
  window.addEventListener("pageshow", schedule);
  refresh();
  return {
    refresh,
    setEngineEnabled(engine, value) {
      engines[engine] = value;
      refresh();
    },
    setMemory(state, error = null, message = "") {
      memory = state;
      memoryError = error;
      if (message) {
        notice = message;
        noticeQuery = `${adapters.find((item) => item.getQuery(window.location.href) !== null)?.id}:${normalizeName(adapters.map((item) => item.getQuery(window.location.href)).find(Boolean) ?? "")}`;
      }
      refresh();
    },
    setFeedbackEnabled(value) {
      feedbackEnabled = value;
      refresh();
    },
    setEnabled(value) {
      enabled = value;
      refresh();
    },
    stop() {
      stopped = true;
      observer.disconnect();
      window.clearInterval(poll);
      if (pending !== null) {
        window.clearTimeout(pending);
      }
      window.removeEventListener("popstate", schedule);
      window.removeEventListener("pageshow", schedule);
      clear();
    },
  };
}
