// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

import * as z from "zod";

import { isSafePublicHTTPSURL, type Resolution } from "./model.ts";
import { hasUnsafeText, normalizeName } from "./normalize.ts";

export const MEMORY_KEY = "namefirstMemory";
export const FEEDBACK_KEY = "namefirstFeedbackEnabled";
const name = z
  .string()
  .min(1)
  .max(256)
  .refine(
    (value) =>
      value.trim() === value &&
      !hasUnsafeText(value) &&
      normalizeName(value).length > 0,
  );
export const MemoryRecordSchema = z.strictObject({
  id: z.uuid(),
  revision: z.uuid(),
  name,
  aliases: z.array(name).max(10),
  url: z.string().refine(isSafePublicHTTPSURL),
  confirmedAt: z.iso.datetime(),
});
export type MemoryRecord = z.infer<typeof MemoryRecordSchema>;
export function recordNames(record: MemoryRecord): string[] {
  return [record.name, ...record.aliases].map(normalizeName);
}
const LegacyChangeSchema = z.strictObject({
  token: z.uuid(),
  before: MemoryRecordSchema.nullable(),
  after: MemoryRecordSchema.nullable(),
});
export const LegacyMemorySchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    revision: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
    records: z.array(MemoryRecordSchema).max(500),
    lastChange: LegacyChangeSchema.nullable(),
  })
  .superRefine((state, context) => {
    const ids = new Set(state.records.map((record) => record.id));
    const names = state.records.flatMap(recordNames);
    if (
      ids.size !== state.records.length ||
      new Set(names).size !== names.length
    ) {
      context.addIssue({
        code: "custom",
        message: "Duplicate memory names or IDs",
      });
    }
    const change = state.lastChange;
    if (
      change &&
      ((!change.before && !change.after) ||
        (change.before && change.after && change.before.id !== change.after.id))
    ) {
      context.addIssue({ code: "custom", message: "Invalid undo record" });
    }
    if (
      change?.after &&
      !state.records.some(
        (record) => JSON.stringify(record) === JSON.stringify(change.after),
      )
    ) {
      context.addIssue({
        code: "custom",
        message: "Undo target differs from current memory",
      });
    }
    if (change && !change.after && change.before && ids.has(change.before.id)) {
      context.addIssue({
        code: "custom",
        message: "Deleted undo target is still present",
      });
    }
  });
const RecordsSchema = z
  .array(MemoryRecordSchema)
  .max(500)
  .superRefine((records, context) => {
    const names = records.flatMap(recordNames);
    if (
      new Set(records.map((record) => record.id)).size !== records.length ||
      new Set(names).size !== names.length
    ) {
      context.addIssue({
        code: "custom",
        message: "Duplicate memory names or IDs",
      });
    }
  });
const ChangeSchema = LegacyChangeSchema.extend({
  restoreRecords: RecordsSchema.nullable(),
});
export const MemorySchema = z
  .strictObject({
    schemaVersion: z.literal(2),
    revision: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
    records: RecordsSchema,
    lastChange: ChangeSchema.nullable(),
  })
  .superRefine((state, context) => {
    const change = state.lastChange;
    if (!change) {
      return;
    }
    if (change.restoreRecords !== null) {
      if (change.before || change.after) {
        context.addIssue({
          code: "custom",
          message: "Mixed batch and record undo",
        });
      }
      return;
    }
    const legacy = LegacyMemorySchema.safeParse({
      ...state,
      schemaVersion: 1,
      lastChange: {
        token: change.token,
        before: change.before,
        after: change.after,
      },
    });
    if (!legacy.success) {
      context.addIssue({ code: "custom", message: "Invalid record undo" });
    }
  });
export type MemoryState = z.infer<typeof MemorySchema>;
export function emptyMemory(): MemoryState {
  return { schemaVersion: 2, revision: 0, records: [], lastChange: null };
}
export function readMemory(value: unknown): MemoryState {
  if (value === undefined) {
    return emptyMemory();
  }
  const legacy = LegacyMemorySchema.safeParse(value);
  const migrated = legacy.success
    ? {
        ...legacy.data,
        schemaVersion: 2,
        lastChange: legacy.data.lastChange
          ? { ...legacy.data.lastChange, restoreRecords: null }
          : null,
      }
    : value;
  const result = MemorySchema.safeParse(migrated);
  if (!result.success) {
    throw new Error(
      "本地记忆格式无效或版本不支持，已保留原数据；官网优先仍可使用。",
    );
  }
  return result.data;
}

export const MemoryRequestSchema = z.discriminatedUnion("action", [
  z.strictObject({
    channel: z.literal("namefirst-memory"),
    action: z.literal("read"),
  }),
  z.strictObject({
    channel: z.literal("namefirst-memory"),
    action: z.literal("save"),
    id: z.uuid().nullable(),
    expectedRevision: z.uuid().nullable(),
    name,
    aliases: z.array(name).max(10),
    url: z.string().refine(isSafePublicHTTPSURL),
  }),
  z.strictObject({
    channel: z.literal("namefirst-memory"),
    action: z.literal("forget"),
    id: z.uuid(),
    expectedRevision: z.uuid(),
  }),
  z.strictObject({
    channel: z.literal("namefirst-memory"),
    action: z.literal("undo"),
    token: z.uuid(),
  }),
  z.strictObject({
    channel: z.literal("namefirst-memory"),
    action: z.literal("clear"),
    expectedStateRevision: z.number().int().nonnegative(),
  }),
  z.strictObject({
    channel: z.literal("namefirst-memory"),
    action: z.literal("import"),
    expectedStateRevision: z.number().int().nonnegative(),
    mode: z.enum(["merge", "replace"]),
    content: z.string().max(4_000_000),
  }),
]);
export type MemoryRequest = z.infer<typeof MemoryRequestSchema>;

export const PortableRecordSchema = MemoryRecordSchema.omit({
  id: true,
  revision: true,
});
export const BackupSchema = z
  .strictObject({
    format: z.literal("NameFirst personal memory"),
    formatVersion: z.literal(1),
    exportedAt: z.iso.datetime(),
    records: z.array(PortableRecordSchema).max(500),
  })
  .superRefine((backup, context) => {
    const names = backup.records.flatMap((record) =>
      [record.name, ...record.aliases].map(normalizeName),
    );
    if (new Set(names).size !== names.length) {
      context.addIssue({ code: "custom", message: "Duplicate backup names" });
    }
  });
export function exportBackup(
  state: MemoryState,
  now = new Date().toISOString(),
) {
  return BackupSchema.parse({
    format: "NameFirst personal memory",
    formatVersion: 1,
    exportedAt: now,
    records: readMemory(state).records.map(
      ({ name, aliases, url, confirmedAt }) => ({
        name,
        aliases,
        url,
        confirmedAt,
      }),
    ),
  });
}
export function parseBackup(content: string) {
  if (new TextEncoder().encode(content).length > 4_000_000) {
    throw new Error("备份超过 4 MB 上限。");
  }
  let value: unknown;
  try {
    value = JSON.parse(content.replace(/^\uFEFF/u, ""));
  } catch {
    throw new Error("文件不是有效的 JSON 备份。");
  }
  const portable = BackupSchema.safeParse(value);
  if (portable.success) {
    return portable.data;
  }
  const legacy = LegacyMemorySchema.safeParse(value);
  const current = MemorySchema.safeParse(value);
  if (legacy.success || current.success) {
    return exportBackup(readMemory(value));
  }
  throw new Error("备份格式、版本、地址或名称无效；未更改个人记录。");
}
export function previewImport(
  state: MemoryState,
  content: string,
  mode: "merge" | "replace",
  uuid: () => string = () => crypto.randomUUID(),
) {
  const backup = parseBackup(content);
  const records = mode === "replace" ? [] : [...state.records];
  let added = 0;
  let duplicates = 0;
  for (const incoming of backup.records) {
    const keys = [incoming.name, ...incoming.aliases].map(normalizeName);
    const overlaps = records.filter((record) =>
      recordNames(record).some((key) => keys.includes(key)),
    );
    if (overlaps.length) {
      const existing = overlaps[0]!;
      if (
        overlaps.length === 1 &&
        normalizeName(existing.name) === normalizeName(incoming.name) &&
        existing.url === incoming.url &&
        JSON.stringify(recordNames(existing).sort()) ===
          JSON.stringify([...keys].sort())
      ) {
        duplicates++;
        continue;
      }
      throw new Error(
        `名称或别名冲突：${incoming.name}。请编辑现有记录，或检查后选择替换导入。`,
      );
    }
    records.push({ ...incoming, id: uuid(), revision: uuid() });
    added++;
  }
  if (records.length > 500) {
    throw new Error("导入后超过 500 条上限；没有截断或覆盖数据。");
  }
  return {
    records: RecordsSchema.parse(records),
    incoming: backup.records,
    added,
    duplicates,
    removed: mode === "replace" ? state.records.length : 0,
    total: records.length,
  };
}

export function changeMemory(
  input: MemoryState,
  inputRequest: MemoryRequest,
  now = new Date().toISOString(),
  uuid: () => string = () => crypto.randomUUID(),
): MemoryState {
  const state = readMemory(input);
  const request = MemoryRequestSchema.parse(inputRequest);
  if (request.action === "read") {
    return state;
  }
  if (request.action === "undo") {
    const change = state.lastChange;
    if (!change || change.token !== request.token) {
      throw new Error(
        "记忆已被其他操作修改，不能撤销这条旧操作。请重新检查当前记录。",
      );
    }
    if (change.restoreRecords !== null) {
      return MemorySchema.parse({
        ...state,
        revision: state.revision + 1,
        records: change.restoreRecords.map((record) => ({
          ...record,
          revision: uuid(),
        })),
        lastChange: null,
      });
    }
    const remaining = state.records.filter(
      (record) => record.id !== (change.after?.id ?? change.before?.id),
    );
    if (change.before) {
      remaining.push({ ...change.before, revision: uuid() });
    }
    return MemorySchema.parse({
      ...state,
      revision: state.revision + 1,
      records: remaining,
      lastChange: null,
    });
  }
  if (request.action === "clear" || request.action === "import") {
    if (state.revision !== request.expectedStateRevision) {
      throw new Error("记录已在其他页面变化，请重新预览后操作。");
    }
    const records =
      request.action === "clear"
        ? []
        : previewImport(state, request.content, request.mode, uuid).records;
    return MemorySchema.parse({
      ...state,
      revision: state.revision + 1,
      records,
      lastChange: {
        token: uuid(),
        before: null,
        after: null,
        restoreRecords: state.records,
      },
    });
  }
  const before = request.id
    ? (state.records.find((record) => record.id === request.id) ?? null)
    : null;
  if (
    (request.id && (!before || before.revision !== request.expectedRevision)) ||
    (!request.id && request.expectedRevision !== null)
  ) {
    throw new Error("这条记忆已在其他标签页变化，请重新选择当前记录后保存。");
  }
  const after =
    request.action === "save"
      ? MemoryRecordSchema.parse({
          id: before?.id ?? uuid(),
          revision: uuid(),
          name: request.name,
          aliases: request.aliases,
          url: request.url,
          confirmedAt: now,
        })
      : null;
  const records = state.records.filter((record) => record.id !== before?.id);
  if (after) {
    const names = recordNames(after);
    if (
      new Set(names).size !== names.length ||
      records.some((record) =>
        recordNames(record).some((key) => names.includes(key)),
      )
    ) {
      throw new Error(
        "名称或别名已被另一条记忆使用，请纠正已有记录或使用不同名称。",
      );
    }
    if (records.length >= 500) {
      throw new Error("已达到 500 条个人记录上限，请先忘记不需要的记录。");
    }
    records.push(after);
  }
  return MemorySchema.parse({
    ...state,
    revision: state.revision + 1,
    records,
    lastChange: { token: uuid(), before, after, restoreRecords: null },
  });
}

export function personalTargets(state: MemoryState) {
  return state.records.flatMap((record) =>
    [record.name, ...record.aliases].map((value) => ({
      name: value,
      url: record.url,
      confirmed: true as const,
      confirmedAt: record.confirmedAt,
    })),
  );
}

export function findMemory(
  state: MemoryState,
  query: string,
  navigationName: string,
): MemoryRecord | undefined {
  return (
    state.records.find((record) =>
      recordNames(record).includes(normalizeName(query)),
    ) ??
    state.records.find((record) => recordNames(record).includes(navigationName))
  );
}
export function personalDisplay(
  resolution: Resolution,
  record: MemoryRecord | undefined,
  allowBaseTarget: boolean,
): Resolution {
  if (
    !record ||
    !allowBaseTarget ||
    resolution.status !== "candidate" ||
    !["stale-record", "review-needed"].includes(resolution.reason)
  ) {
    return resolution;
  }
  return {
    query: resolution.query,
    normalizedQuery: resolution.normalizedQuery,
    intent: "navigation",
    status: "personal",
    result: {
      name: record.name,
      url: record.url,
      confirmed: true,
      confirmedAt: record.confirmedAt,
    },
  };
}
