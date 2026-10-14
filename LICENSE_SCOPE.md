# NameFirst 许可范围与中文说明

> 生效版本：NameFirst Noncommercial Reciprocal License 1.0，2026-10-13。  
> 自定义标识：`LicenseRef-NameFirst-NC-Reciprocal-1.0`，未登记于 SPDX License List。  
> 正式条款：源码根目录的 `LICENSE`，或成品包中的 `LICENSE.txt`；本文件是说明，不代替英文正式文本。

## 已采用的规则

- 允许个人免费使用、学习、研究、修改和免费分发。
- 允许企业内部免费使用，包括员工在普通工作中使用搜索辅助功能。
- 禁止销售、出租、订阅收费、收费托管，以及围绕本软件的收费支持、安装、定制或咨询；禁止广告、赞助、佣金、用户数据出售等变现和捆绑到收费产品中。商业例外须取得相关权利人的另行书面许可。
- 用它浏览商业网站、购买无关商品或辅助普通工作不属于软件变现。免费源码托管平台自身的广告，在分发者不从中获益的情况下也不构成软件变现。
- 对外分发原版或修改版时，必须免费公开对应版本的完整可修改源码和必要构建材料，获取源码不能要求账号；受本许可覆盖的修改继续采用同一版本许可。
- 分发者须提供明确源码地址，在提供该版本期间及最后一次分发后至少三年保持源码可用。可以使用现有公开源码地址，但仍须负责满足可用性要求。
- 私人本地修改和同一组织内部分享不触发公开源码义务。只提供网络服务、不交付副本，也不单独触发源码义务，但仍受禁止变现条款限制。
- 保留作者署名、许可和第三方声明，说明修改内容与日期；不能冒充原作者背书。
- 不要求公开私钥、账号凭据或用户个人数据，应提供安全的配置说明。

这是**非商业共享源码**项目。禁止商用不符合 [OSI 开源定义](https://opensource.org/osd)；公开在 GitHub、允许 fork 不等于 OSI 意义上的开源。README 中的“开源基础”指可复用的上游开源项目。

## 文件与权利边界

2026-10-14 贡献政策更新：公众 LICENSE 1.0 原文保持，新增 [CLA.md](./CLA.md) 与 [CLA_GUIDE.md](./CLA_GUIDE.md)作为独立贡献者协议。贡献者保留版权，可通过明确签署向私下确认的接收方授予商业使用、闭源分发、不同条款和再许可权；公开项目关联账号为 `Thicky-han`，真实主体与签署记录不公开。只有完成明确授权的材料才适用，不追溯未签历史贡献，不改变上游或第三方许可，不撤回已有公众副本权利。普通使用和免费 fork 不要求签 CLA，也不因 CLA 自动获准变现。

| 材料 | 适用许可 | 当前说明 |
| --- | --- | --- |
| `assets/brand/` 与 `extension/src/icons/namefirst/` | 原创材料按 NameFirst 非商业互惠许可 1.0，受不可授权权利边界限制 | 已确认的 NF/上箭头图标及尺寸导出；未复制上游图标，不宣称商标注册或排他性版权保证 |
| 根目录 NameFirst 文档、`scripts/` 和 `config/` 的原创材料 | NameFirst 非商业互惠许可 1.0 | 包括构建包装、独立身份生成和项目需求说明 |
| `extension/` 内从固定上游导入的材料 | 上游或各自第三方许可 | 原材料权利保留；阶段 2 修改了构建文件，不能把整目录改成非商业许可 |
| `extension/src/scripts/namefirst/` | NameFirst 非商业互惠许可 1.0 | 阶段 1 目录与核心；阶段 2 Bing；阶段 3 百度适配、共享生命周期、卡片及测试，均为原创 |
| 阶段 4 `extension/src/scripts/namefirst-background.ts` 与 `src/scripts/namefirst/` 内的记忆、反馈、候选和测试模块 | NameFirst 非商业互惠许可 1.0 | 原创本地消息后台及记忆闭环，2026-10-14；沿用现有授权，不修改许可证条款 |
| 阶段 5 `extension/src/scripts/namefirst-manager.ts`、`extension/src/pages/namefirst-manager.html`、`extension/src/scripts/namefirst/manager.css`、`backup.test.ts`、`extension/e2e/namefirst/tests/manager.spec.ts` 及既有 NameFirst 模块的原创增量 | NameFirst 非商业互惠许可 1.0 | 记录管理、备份迁移、批量撤销、独立引擎开关、草稿保护及测试，2026-10-14；不改变正式许可条款 |
| `extension/src/namefirst-manifest.ts`、`src/scripts/namefirst-content-script.ts`、`src/scripts/namefirst-popup.ts`、`src/pages/namefirst-popup.html`、`extension/e2e/namefirst/` | NameFirst 非商业互惠许可 1.0 | 阶段 2 新增，阶段 3 扩展到百度与实际 Chrome/Edge 验证；表中 `src/` 均指 `extension/src/` |
| `extension/scripts/build.ts` | 原 MIT 材料 + NameFirst 原创增量分别适用 | 新增 `--namefirst` 构建模式；文件头区分权利，变更记录见 `MODIFICATIONS.md` |
| 阶段 6 原创 `scripts/Package.ps1`、`scripts/Verify-Package.ps1`、`scripts/Audit-Runtime.ps1`、`extension/e2e/namefirst/packaged-smoke.ts`、官网目录增量及安装/隐私/验收/发布文档 | NameFirst 非商业互惠许可 1.0 | 首版打包与对应源码、官网事实编排及验证材料；2026-10-14，不改变原有许可条款，不复制目标网站正文或脚本 |
| `extension/LICENSE.txt` | 上游 MIT 许可原文 | 保留 `Copyright (c) 2018 iorate`；不替换、不删除 |
| `extension/builtin/` | 导入的上游规则材料 | 来源和提交记录在 `UPSTREAM.json`；不是 NameFirst 原创目录 |
| `extension/third-party/`、依赖及其声明 | 各自原有许可 | 构建输出继续携带实际依赖的 `third-party-notices.txt` |
| 后续新增的 NameFirst 原创模块、原创目录编排和原创修改 | 默认 NameFirst 非商业互惠许可 1.0 | 导入的第三方材料须单独标记；名称、事实和网址本身不因编排而成为独占权利 |
| `dist/chrome/`、`dist/edge/` | 按所包含材料分别适用 | 不是“全包 MIT”，也不是把上游整体重新限制为非商业 |

上游 MIT 已授予的使用、修改和商用等权利继续有效，见 [MIT 原文说明](https://choosealicense.com/licenses/mit/)。本项目只能限制有权授权的 NameFirst 原创材料及原创修改；无法阻止别人单独使用原有 uBlacklist 代码商用。

作者声明采用 `NameFirst contributors`，每位贡献者保留其自身版权；这不是把所有贡献的版权转让给维护者，也未擅自填写未确认的姓名或账号。

CLA 的英文正文是贡献者与具体接收方之间的单独授权，不是整包的公众许可证。企业、雇主、客户或共同作者有权利时需有相应授权；当前没有声称任何外部贡献者已经签署。CLA 的公开联系账号与版权署名是不同概念，不把 `NameFirst contributors` 整体改写为单一账号所有。

## 后续代码的标记办法

1. 新增原创代码文件建议写明 `SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0`；它是本地自定义标识，不代表 SPDX 收录或 OSI 审批。
2. 修改上游文件时保留原有声明，并注明“Original upstream material remains under its original license; NameFirst additions are under LicenseRef-NameFirst-NC-Reciprocal-1.0”，记录修改内容、日期及贡献者。不能将上游整文件的许可证粗暴替换。
3. 第三方导入须保留来源、版本和许可，更新本文件及 `NOTICE`；不可仅凭目录位置认定原创。
4. 发布修改版需提供精确对应源码、构建脚本、配置、依赖清单、锁文件和构建安装说明。另行许可的依赖按其许可提供源码或精确版本与公开获取方法。
5. 不兼容的依赖不能仅靠保留声明解决，应在引入前核对其条款。不能用本许可撤回旧版本已经授予的权利，也不能替其他贡献者授权商业例外。

## 成品包应包含的材料

- `LICENSE.txt`：根目录 `LICENSE` 的完整副本。
- `UPSTREAM-LICENSE.txt`：`extension/LICENSE.txt` 的完整副本。
- `NOTICE` 和 `LICENSE_SCOPE.md`：署名及许可边界。
- `CLA.md`、`CLA_GUIDE.md` 与 `CONTRIBUTING.md`：单独贡献授权及流程，普通安装使用无需签署。空白签署模板随源码提供，已填写记录不打包。
- `UPSTREAM.json`：固定上游来源。
- `MODIFICATIONS.md`：原创模块、修改文件、日期与贡献者记录。
- `third-party-notices.txt`：上游构建生成的依赖声明。

外层构建脚本负责复制以上许可材料，校验脚本比对其内容，防止遗漏或误把整个包标为 MIT。直接使用 `extension/` 内的默认命令会生成上游版本，带 `--namefirst` 时生成未经外层包装的 NameFirst 文件；两者均不能替代根目录的 NameFirst 分发构建。

本许可为按项目需求起草的自定义文本，未经律师审查；法律效力和跨地区适用性不能仅凭文件存在保证。正式条款不指定尚未确认的司法管辖地区，也不自动切换到后续版本。
