// SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
// Copyright (c) 2026 NameFirst contributors.

import { resolveName } from "./resolve.ts";

const query = process.argv.slice(2).join(" ");
if (!query.trim()) {
  throw new Error("Provide a website name, for example Steam.");
}
const result = resolveName(query);
console.log(`搜索名称：${query}`);
switch (result.status) {
  case "official":
    console.log(
      `已核实官方：${result.result.name}（${result.result.description}）`,
    );
    console.log(`${result.result.entry.label}：${result.result.entry.url}`);
    console.log(`核实日期：${result.result.verification.verifiedAt}`);
    break;
  case "personal":
    console.log(`个人目标（不代表官网）：${result.result.url}`);
    break;
  case "candidate":
    console.log("需要确认，未选择唯一官方入口：");
    for (const candidate of result.officialCandidates) {
      console.log(
        `- ${candidate.name}（${candidate.description}）：${candidate.entry.url}`,
      );
    }
    for (const candidate of result.personalCandidates) {
      console.log(`- 个人候选：${candidate.url}`);
    }
    for (const candidate of result.pageCandidates) {
      console.log(`- 未核实网页候选：${candidate.url}`);
    }
    break;
  case "none":
    console.log(
      result.intent === "information"
        ? "这是资料查询，保留普通搜索。"
        : "没有可靠目标，保留普通搜索。",
    );
    break;
}
