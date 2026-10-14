# 阶段 2：Bing 官网置顶

> 历史快照：本报告记录阶段 2；当前版本已升级为 `0.3.0-stage3`，百度适配及实际 Chrome/Edge 验证见 [STAGE3_REPORT.md](./STAGE3_REPORT.md)。

执行日期：2026-10-13。版本：`0.2.0-stage2`。本阶段已完成；下一阶段为百度适配与 Chrome/Edge 关键路径验证。

## 1. 可见结果

在桌面 Bing 网页搜索页中，准确搜索目录覆盖的平台名称，NameFirst 会将独立的官方入口卡片放在 `ol#b_results` 结果列表首位。搜索 `Steam` 时，标题直接链接 `https://store.steampowered.com/`，并显示官方社区、支持和客户端下载入口、域名、用途及可展开的核实来源。

首次使用无需账号、反馈记录或历史。即使 Bing 当前页没有官网、只有第三方结果或广告，仍可根据随包目录补充入口。卡片明确标注 NameFirst，点击才打开目标，不自动跳转。

搜索 `Steam 使用教程`、未知名称不插入卡片；`Rust` 显示编程语言与游戏两个候选，用户自行选择，不以热度推断唯一目标。待复核、已禁用、过期或缺少所需子入口的记录不会标为已核实官网。原结果与广告保留，未实现广告折叠、结果删除或服务器端排名修改。

## 2. 复用基础与新增边界

继续复用 uBlacklist `v10.1.2` 的固定源码与 builtin 规则，没有升级依赖或另建工具链：

- Bing 规则来自 `extension/builtin/serpinfo/bing.yml`，经已有 `@ublacklist/serpinfo` 解析。
- 使用原有 `shared/serpinfo-match.ts` 与 `@ublacklist/match-pattern` 做页面匹配；结果存在时，核查上游 `.b_algo` 根节点属于目标列表。
- 复用原 esbuild 打包、资源复制、依赖许可收集及图标。
- 在原 `extension/scripts/build.ts` 增加可选 `--namefirst` 模式，选择独立脚本、最小资源和清单；默认上游模式保留。NameFirst 原创增量与原 MIT 材料明确区分，见 `MODIFICATIONS.md`。

源码保留上游后台和云同步模块，但 NameFirst 模式不选择这些入口、不生成这些资源，也不会通过清单启动它们。因此这是基于现有项目的派生实现，当前尚未创建 GitHub 公开 fork。

| 文件 | 职责 |
| --- | --- |
| `extension/src/scripts/namefirst/bing-urls.ts` | 支持域名和 URL 查询解析 |
| `extension/src/scripts/namefirst/bing-rules.ts` | 固定上游规则与结果列表结构核查 |
| `extension/src/scripts/namefirst/bing.ts` | 动态更新、单卡片生命周期、开关与隐藏 |
| `extension/src/scripts/namefirst/card.ts`、`card.css` | 官方/同名卡片及隔离样式 |
| `extension/src/scripts/namefirst-content-script.ts` | 扩展实际入口、本地设置与变更监听 |
| `extension/src/namefirst-manifest.ts` | NameFirst 的最小 Manifest V3 清单 |
| `extension/src/pages/namefirst-popup.html`、`src/scripts/namefirst-popup.ts`、`src/scripts/namefirst/popup.css` | 扩展开关窗口；这些 `src/` 均位于 `extension/` |
| `scripts/Build.ps1`、`Verify-Build.ps1` | 两种包、稳定身份、许可材料和资源白名单核查 |
| `extension/e2e/namefirst/` | 实际安装扩展的受控测试与可选真实页面冒烟脚本 |

共享名称核心继续位于独立模块。此次调整其候选状态优先级：先检查核实状态、有效期及入口可用性，再返回同名选择，防止两个过期或禁用记录绕过可信门槛。

## 3. 页面行为

支持 HTTPS 桌面 Bing 网页搜索路径 `/search`，域名与固定规则一致：`www.bing.com`、`www2.bing.com`、`www4.bing.com`、`cn.bing.com`。运行时进一步检查路径和域名；重复的 `q`、空查询、图像搜索及其他路径不处理。

查询以当前 URL 中唯一的 `q` 为准。用户只在输入框输入新词而未提交，不会把卡片切换到尚未搜索的词。字符解码后交给共享核心，保持名称作为首要标准；不读取网页标题作为官方身份依据。

页面变化使用合并后的 DOM 观察（80 毫秒）与 URL 变更检查（500 毫秒），兼顾搜索列表异步出现、替换、广告插到前面和不触发完整刷新的一页多次查询。判断不变时复用原卡片节点，避免重复插入和展开状态丢失。查询变化时移除旧卡片，再按新的判断展示。

使用语义上的列表项，内部 `div` 承载 Shadow DOM，隔离 Bing 样式。名称、说明和来源文本通过 `textContent` 写入；地址只取自校验后的随包目录。链接新标签打开，带 `noopener noreferrer` 和 `no-referrer`。不引用远程字体、图像或脚本。

“隐藏本次”存于本页面内存，不是负面反馈；同一页面生命周期再次回到相同规范化查询仍隐藏，完整刷新后恢复。插件窗口的开关使用 `chrome.storage.local` 的 `namefirstEnabled`，默认启用；开关修改会通知已打开的页面，暂停时移除卡片。每个页面控制器提供停止和清理，重新初始化时清理旧观察器及设置监听。

页面识别失败、结构变化、扩展环境失效时移除或不插入 NameFirst 内容，不删除或禁用 Bing 的原控件。不能据一次联网失败把网站永久认定为无效。

## 4. 本地模式和权限

最终包权限只有 `storage`，内容脚本仅匹配上列 Bing `/search*` 地址。运行时路径检查比清单更严格，不处理 `/searching` 等地址。

没有后台服务工作线程、OAuth、`identity`、任意网站访问权限、原上游设置页、云同步入口、远程规则更新器或可供网页调用的扩展资源。普通用户不需要 API Key、项目账号或开发者服务器。设置窗口不保存查询、访问记录、个人目标或反馈；本阶段仅持久化一个开关布尔值。

官网目录、判断和页面规则都随包运行，不主动联网验证或更新。搜索 Bing、点击官网及核实来源链接本身仍会访问这些网站，搜索行为仍受浏览器和 Bing 自身机制影响。本地处理不意味着在线搜索网站可以离线使用，也不意味着无限期准确；目录默认 180 天核实有效期，过期后不继续提供已核实卡片，需要维护目录并分发更新。

## 5. 验证结果

### 静态检查与单元测试

`pnpm check` 通过，含类型、规则和格式检查。`pnpm test` 通过 **195 项**：96 项上游测试、99 项 NameFirst 测试（包含子测试）。本阶段新增 4 项：Bing URL 范围/解码、异常 URL 回退、清单权限边界，以及同名记录不能绕过过期/禁用门槛。

### 受控页面中的实际扩展

使用 Chrome for Testing `153.0.8010.12`、Playwright `1.63.0`，为每项测试创建全新临时配置，真实加载最终 `dist/chrome/` 或 `dist/edge/` 扩展目录。Bing 地址由测试拦截，提供明确带广告和无关结果、缺少官网的受控 HTML，扩展脚本由浏览器正常注入，没有用测试脚本替代产品入口。

**8 个场景 × 两种包，共 16 次场景执行通过：**

1. 无反馈首次搜索 Steam：卡片第一、链接正确、来源可展开、原广告/结果保留。
2. 输入框未提交不改卡片；URL 改为 GitHub 更新，教程及未知名称回退。
3. Rust 同名只展示两种选择，不自动跳转。
4. 40 个动态前插条目后保持一张卡片和原节点；整个结果列表替换后恢复。
5. 本次隐藏在页面动态变化后有效，重新加载恢复。
6. 弹窗即时暂停、刷新后保持暂停、重新启用；本地存储只有开关。
7. 不支持路径、重复查询参数及结果容器消失时保留原页功能。
8. 插入卡片和打开弹窗不发起额外网站请求。

两种包均使用同一测试浏览器；不能据此称 Edge 浏览器自身已完成实测。无账号和无额外请求的结论也限定于本阶段实际功能与检查范围，不概括第三方网站自身网络行为。

### 真实 Bing 页面

2026-10-13，使用独立无登录临时配置、真实网络响应及 Chrome 包，**4 项通过，均返回 HTTP 200：**

| 页面 | 结果 |
| --- | --- |
| 国际版 `www.bing.com` 搜索 Steam | 官方商店卡片可见且为列表第一项，原自然结果 10 条 |
| 国内版 `cn.bing.com` 搜索 Steam | 官方商店卡片可见且为列表第一项，原自然结果 10 条 |
| 国际版搜索 Steam 使用教程 | 不插入卡片，原自然结果 10 条 |
| 国际版搜索 Rust | 显示两个同名候选且为列表第一项，原自然结果 10 条 |

真实页面截图已经检查，Steam 卡片无重叠或裁切，位于网页结果顶部。此次真实 Steam 页本来已有官方自然结果排前；“原结果缺少官网、广告排前”通过受控页面独立验证，不把此次在线结果当作所有用户搜索结果的代表。

本地证据位于 `.cache/bing-live/report.json` 和同目录 PNG；它们是忽略的本机验证输出，不随扩展包分发。受控截图位于 `extension/e2e/test-results/namefirst/`。测试不接触或改动用户现有浏览器配置。

### 构建和许可

根目录构建生成 `dist/chrome/` 与 `dist/edge/`，两者都使用原 NameFirst 稳定开发身份和版本 `0.2.0`。校验检查清单权限、仅 Bing 注入配置、引用资源、允许资源清单、上游固定提交、许可文件哈希及修改记录。没有旧后台/设置资源混入新包。

包携带 `LICENSE.txt`、`UPSTREAM-LICENSE.txt`、`NOTICE`、`LICENSE_SCOPE.md`、`MODIFICATIONS.md`、`UPSTREAM.json` 与实际打包依赖的 `third-party-notices.txt`。Root 非商业互惠许可及原 MIT 权利边界保持。

## 6. 复现和使用

在项目根目录执行 `scripts/Build.ps1`；两个文件夹可在对应浏览器扩展管理页以开发者模式解压加载。此前加载的基线必须重新加载扩展，并刷新原有 Bing 标签页；目录中存在文件不意味着浏览器已经切换到新脚本。普通用户使用包不需要开发依赖。

开发验收从 `extension/` 执行：

```powershell
$env:CI = 'true'
$env:LEFTHOOK = '0'
pnpm check
pnpm test
pnpm exec playwright install chromium
pnpm exec playwright test --config e2e/namefirst/playwright.config.ts
pnpm exec node e2e/namefirst/live-bing.ts
```

若已有 Chrome for Testing，可设置 `NAMEFIRST_CHROMIUM` 为其可执行文件路径，避免重复下载。测试自动加载扩展采用 Chromium/Chrome for Testing，参见 [Playwright 官方扩展测试文档](https://playwright.dev/docs/chrome-extensions)。真实页面脚本需联网，网络失败或站点验证页会报告失败而非用受控 HTML 冒充成功。

## 7. 限制和下一步

- 当前只覆盖随包 16 个主体/24 个入口，未知名称不会猜官网，个人反馈和记忆还未实现。
- 仅承诺桌面网页结果列表首位；Bing 搜索框、标签栏、列表外的实验 AI 模块等仍可能在它上方。移动端、图片/新闻/AI 页面及全部地区实验版本未验证。
- `www2`、`www4` 与固定规则保持支持范围一致，但本轮真实网络仅测国际版和国内版，没有宣称四个域名全部实测。
- 不保留大众反馈，没有后台训练和长期自动核实；更新目录需要分发新版本。
- 已生成 Chrome/Edge 两种包，尚未完成实际品牌浏览器矩阵、商店签名、GitHub 发布或公开 fork。
- 暂停只控制 NameFirst 卡片，浏览器仍按清单加载脚本并读取该开关；可在浏览器扩展管理页禁用扩展，完全停止注入。

下一项是阶段 3：百度适配和 Chrome/Edge 关键路径验证。复用已有目录、名称核心和卡片，逐个处理引擎页面差异。此轮未提前开展百度、反馈管理、过滤广告或机器学习模块。
