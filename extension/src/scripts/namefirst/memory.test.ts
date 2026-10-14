// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

import assert from "node:assert/strict";
import { test } from "node:test";

import {
  changeMemory,
  emptyMemory,
  findMemory,
  MemoryRequestSchema,
  personalTargets,
  readMemory,
  type MemoryRecord,
  type MemoryState,
} from "./memory.ts";
import { getNavigationName, resolveName } from "./resolve.ts";

const now = "2026-10-14T00:00:00.000Z";
const current = { asOf: "2026-10-14" };
function save(
  state: MemoryState,
  name = "NebulaDesk",
  url = "https://nebula.example/",
  record?: MemoryRecord,
  aliases = ["我的桌面"],
) {
  return changeMemory(
    state,
    {
      channel: "namefirst-memory",
      action: "save",
      id: record?.id ?? null,
      expectedRevision: record?.revision ?? null,
      name,
      url,
      aliases,
    },
    now,
  );
}

test("empty storage does not fabricate feedback; malformed or future schemas are preserved and rejected", () => {
  assert.deepEqual(readMemory(undefined), emptyMemory());
  for (const value of [
    null,
    {},
    { ...emptyMemory(), schemaVersion: 99 },
    { ...emptyMemory(), extra: true },
  ]) {
    assert.throws(() => readMemory(value));
  }
});
test("confirmed names and aliases recall personal targets without declaring them official", () => {
  const state = save(emptyMemory());
  for (const query of [
    "NebulaDesk",
    "NEBULADESK",
    "我的桌面",
    "NebulaDesk 官网",
  ]) {
    const result = resolveName(query, {
      ...current,
      personalTargets: personalTargets(state),
    });
    assert.equal(result.status, "personal", query);
    assert.equal(
      findMemory(state, query, getNavigationName(query))?.url,
      "https://nebula.example/",
    );
  }
  assert.equal(
    resolveName("NebulaDesk 使用教程", {
      ...current,
      personalTargets: personalTargets(state),
    }).intent,
    "information",
  );
});
test("explicit complete personal names containing News win; unconfirmed future targets do not", () => {
  const state = save(
    emptyMemory(),
    "Hacker News",
    "https://news.ycombinator.com/",
    undefined,
    [],
  );
  assert.equal(
    resolveName("Hacker News", {
      ...current,
      personalTargets: personalTargets(state),
    }).status,
    "personal",
  );
  const future = personalTargets(state).map((target) => ({
    ...target,
    confirmedAt: "2027-01-01T00:00:00.000Z",
  }));
  assert.equal(
    resolveName("Hacker News", { ...current, personalTargets: future }).intent,
    "information",
  );
});
test("remembering a third-party Steam preference cannot replace the verified official catalog", () => {
  const state = save(
    emptyMemory(),
    "Steam",
    "https://steamdb.info/",
    undefined,
    [],
  );
  const result = resolveName("Steam", {
    ...current,
    personalTargets: personalTargets(state),
  });
  assert.equal(result.status, "official");
  if (result.status === "official") {
    assert.equal(result.result.entry.url, "https://store.steampowered.com/");
  }
});
test("corrections update one record and undo restores its prior URL with a fresh revision", () => {
  const initial = save(emptyMemory());
  const before = initial.records[0]!;
  const corrected = save(
    initial,
    before.name,
    "https://correct.example/",
    before,
    before.aliases,
  );
  assert.equal(initial.records[0]?.url, "https://nebula.example/");
  assert.equal(corrected.records.length, 1);
  const restored = changeMemory(corrected, {
    channel: "namefirst-memory",
    action: "undo",
    token: corrected.lastChange!.token,
  });
  assert.equal(restored.records[0]?.url, before.url);
  assert.notEqual(restored.records[0]?.revision, before.revision);
  assert.equal(restored.lastChange, null);
});
test("forget removes the record and its aliases, and its undo restores both", () => {
  const initial = save(emptyMemory());
  const record = initial.records[0]!;
  const forgotten = changeMemory(initial, {
    channel: "namefirst-memory",
    action: "forget",
    id: record.id,
    expectedRevision: record.revision,
  });
  assert.equal(forgotten.records.length, 0);
  const restored = changeMemory(forgotten, {
    channel: "namefirst-memory",
    action: "undo",
    token: forgotten.lastChange!.token,
  });
  assert.deepEqual(restored.records[0]?.aliases, record.aliases);
});
test("stale updates and undo tokens cannot overwrite a later edit", () => {
  const first = save(emptyMemory());
  const record = first.records[0]!;
  const updated = save(
    first,
    record.name,
    "https://correct.example/",
    record,
    record.aliases,
  );
  assert.throws(() =>
    save(
      updated,
      record.name,
      "https://wrong.example/",
      record,
      record.aliases,
    ),
  );
  assert.throws(() =>
    changeMemory(updated, {
      channel: "namefirst-memory",
      action: "forget",
      id: record.id,
      expectedRevision: record.revision,
    }),
  );
  assert.throws(() =>
    changeMemory(updated, {
      channel: "namefirst-memory",
      action: "undo",
      token: first.lastChange!.token,
    }),
  );
});
test("normalized aliases cannot collide within or across records", () => {
  const state = save(emptyMemory());
  assert.throws(() =>
    save(state, "Another", "https://another.example/", undefined, ["我的桌面"]),
  );
  assert.throws(() =>
    save(emptyMemory(), "Steam", "https://example.com/", undefined, [
      "ＳＴＥＡＭ",
    ]),
  );
  assert.throws(() =>
    save(state, "NEBULADESK", "https://another.example/", undefined, []),
  );
});
test("unsafe addresses and hidden-name markers cannot enter persistent requests", () => {
  for (const url of [
    "javascript:alert(1)",
    "http://example.com/",
    "https://user:password@example.com/",
    "https://localhost/",
    "https://127.0.0.1/",
    "https://example.com/?token=secret",
    "https://example.com/#x",
  ]) {
    assert.equal(
      MemoryRequestSchema.safeParse({
        channel: "namefirst-memory",
        action: "save",
        id: null,
        expectedRevision: null,
        name: "Example",
        aliases: [],
        url,
      }).success,
      false,
    );
  }
  assert.throws(() => save(emptyMemory(), "Steam\u200b"));
});
test("undo metadata must match current storage and duplicate IDs are rejected", () => {
  const state = save(emptyMemory());
  assert.throws(() =>
    readMemory({ ...state, records: [state.records[0], state.records[0]] }),
  );
  assert.throws(() =>
    readMemory({
      ...state,
      records: [{ ...state.records[0], url: "https://another.example/" }],
    }),
  );
});
