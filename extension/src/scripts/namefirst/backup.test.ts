// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

import assert from "node:assert/strict";
import { test } from "node:test";

import {
  changeMemory,
  emptyMemory,
  exportBackup,
  parseBackup,
  personalDisplay,
  previewImport,
  readMemory,
  type MemoryState,
} from "./memory.ts";
import { resolveName } from "./resolve.ts";

function saved(
  state = emptyMemory(),
  name = "NebulaDesk",
  url = "https://nebula.example/",
) {
  return changeMemory(
    state,
    {
      channel: "namefirst-memory",
      action: "save",
      id: null,
      expectedRevision: null,
      name,
      aliases: [name + "别名"],
      url,
    },
    "2026-10-14T00:00:00.000Z",
  );
}
function legacy(state: MemoryState) {
  const last = state.lastChange;
  return {
    ...state,
    schemaVersion: 1,
    lastChange: last
      ? { token: last.token, before: last.before, after: last.after }
      : null,
  };
}
test("v1 storage migrates without losing identities, confirmation dates or record undo", () => {
  const state = saved();
  const old = legacy(state);
  const migrated = readMemory(old);
  assert.equal(migrated.schemaVersion, 2);
  assert.deepEqual(migrated.records, state.records);
  assert.equal(migrated.lastChange?.token, state.lastChange?.token);
  assert.deepEqual(
    changeMemory(migrated, {
      channel: "namefirst-memory",
      action: "undo",
      token: migrated.lastChange!.token,
    }).records,
    [],
  );
  assert.equal(old.schemaVersion, 1);
});
test("portable export omits identities, revisions, settings and undo; restored records recall in a fresh state", () => {
  const source = saved();
  const backup = exportBackup(source);
  const portable = backup.records[0]!;
  assert.equal("id" in portable, false);
  assert.equal("revision" in portable, false);
  assert.equal("lastChange" in backup, false);
  const restored = changeMemory(emptyMemory(), {
    channel: "namefirst-memory",
    action: "import",
    expectedStateRevision: 0,
    mode: "merge",
    content: JSON.stringify(backup),
  });
  assert.equal(
    restored.records[0]?.confirmedAt,
    source.records[0]?.confirmedAt,
  );
  assert.notEqual(restored.records[0]?.id, source.records[0]?.id);
});
test("valid legacy snapshots can be imported without importing their undo history", () => {
  assert.equal(
    parseBackup(JSON.stringify(legacy(saved()))).records[0]?.name,
    "NebulaDesk",
  );
  assert.equal(
    parseBackup("\uFEFF" + JSON.stringify(exportBackup(saved()))).records
      .length,
    1,
  );
});
test("exact duplicates are skipped; conflicting names or aliases reject the entire merge", () => {
  const state = saved();
  const text = JSON.stringify(exportBackup(state));
  assert.equal(previewImport(state, text, "merge").duplicates, 1);
  const conflict = saved(
    emptyMemory(),
    "NebulaDesk",
    "https://different.example/",
  );
  assert.throws(
    () => previewImport(state, JSON.stringify(exportBackup(conflict)), "merge"),
    /冲突/u,
  );
  assert.equal(state.records[0]?.url, "https://nebula.example/");
});
test("replace and clear are single-step reversible and restoration refreshes all record revisions", () => {
  const state = saved(saved(), "Another", "https://another.example/");
  for (const request of [
    {
      channel: "namefirst-memory",
      action: "clear",
      expectedStateRevision: state.revision,
    } as const,
    {
      channel: "namefirst-memory",
      action: "import",
      expectedStateRevision: state.revision,
      mode: "replace",
      content: JSON.stringify(
        exportBackup(saved(emptyMemory(), "Replacement")),
      ),
    } as const,
  ]) {
    const changed = changeMemory(state, request);
    const restored = changeMemory(changed, {
      channel: "namefirst-memory",
      action: "undo",
      token: changed.lastChange!.token,
    });
    assert.deepEqual(
      restored.records.map((record) => record.name).sort(),
      state.records.map((record) => record.name).sort(),
    );
    for (const record of restored.records) {
      assert.notEqual(
        record.revision,
        state.records.find((item) => item.id === record.id)?.revision,
      );
    }
  }
});
test("stale import previews and clear confirmations cannot overwrite a newer record", () => {
  const state = saved();
  assert.throws(() =>
    changeMemory(state, {
      channel: "namefirst-memory",
      action: "clear",
      expectedStateRevision: 0,
    }),
  );
  assert.throws(() =>
    changeMemory(state, {
      channel: "namefirst-memory",
      action: "import",
      expectedStateRevision: 0,
      mode: "replace",
      content: JSON.stringify(exportBackup(emptyMemory())),
    }),
  );
});
test("malformed, oversized, future-version and unsafe backups never get truncated or accepted", () => {
  for (const content of [
    "not JSON",
    "x".repeat(4_000_001),
    JSON.stringify({ ...exportBackup(saved()), formatVersion: 99 }),
    JSON.stringify({
      ...exportBackup(saved()),
      records: [
        {
          name: "X",
          aliases: [],
          url: "javascript:alert(1)",
          confirmedAt: "2026-10-14T00:00:00.000Z",
        },
      ],
    }),
  ]) {
    assert.throws(() => parseBackup(content));
  }
  const backup = exportBackup(saved());
  backup.records.push(backup.records[0]!);
  assert.throws(() => parseBackup(JSON.stringify(backup)));
});
test("catalog expiry can expose a separately labeled confirmed personal target but never a missing sub-entry", () => {
  const state = saved(emptyMemory(), "Steam", "https://steamdb.info/");
  const record = state.records[0]!;
  const stale = resolveName("Steam", { asOf: "2027-10-14" });
  const display = personalDisplay(stale, record, true);
  assert.equal(display.status, "personal");
  if (display.status === "personal") {
    assert.equal(display.result.url, "https://steamdb.info/");
  }
  assert.equal(personalDisplay(stale, record, false), stale);
  const official = resolveName("Steam", { asOf: "2026-10-14" });
  assert.equal(personalDisplay(official, record, true), official);
});
test("record limits reject an oversized backup or merge rather than dropping entries", () => {
  const state = emptyMemory();
  state.records = Array.from({ length: 500 }, (_, index) => ({
    id: crypto.randomUUID(),
    revision: crypto.randomUUID(),
    name: `Record${index}`,
    aliases: [],
    url: "https://example.com/",
    confirmedAt: "2026-10-14T00:00:00.000Z",
  }));
  const oversized = exportBackup(state);
  oversized.records.push(oversized.records[0]!);
  assert.throws(() => parseBackup(JSON.stringify(oversized)));
  assert.throws(
    () =>
      previewImport(
        state,
        JSON.stringify(exportBackup(saved(emptyMemory(), "Extra"))),
        "merge",
      ),
    /500/u,
  );
  assert.equal(state.records.length, 500);
});
