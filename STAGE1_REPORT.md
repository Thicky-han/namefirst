# 阶段 1：官网目录与名称识别

> 历史快照：本报告记录阶段 1 完成时的状态。核心现已在阶段 2 接入 Bing，当前行为与验证结果见 [STAGE2_REPORT.md](./STAGE2_REPORT.md)。

> 日期：2026-10-13（Asia/Shanghai）  
> 结果：**阶段 1 核心模块完成，尚未接入搜索页。**  
> 目录版本：`2026.10.13.1`；结构版本：`1`。  
> 验证：95 项新增测试、96 项上游测试，共 191 项通过；静态检查及浏览器核心打包通过。

## 1. 本阶段交付

原创模块位于 `extension/src/scripts/namefirst/`，没有改动上游业务文件，也没有增加新依赖。

| 文件 | 用途 |
| --- | --- |
| `catalog.json` | 16 个平台主体、24 个官方入口、来源与核实日期 |
| `model.ts` | 数据结构、目录一致性检查、网址约束和四种结果类型 |
| `normalize.ts` | 大小写、Unicode 兼容形式及合理空白规范化 |
| `resolve.ts` | 名称索引、查询意图、官方入口、歧义及过期判断 |
| `resolve.test.ts` | 首次使用、误触发、伪造身份、非法输入和边界行为验证 |
| `demo.ts` | 用真实识别模块运行的命令行演示 |
| 根目录 `scripts/Resolve-Name.ps1` | 方便从项目目录运行演示，恢复环境变量 |

目录和核心在本地运行，不读取浏览历史，不保存反馈，不访问网络，不使用账号、服务器、模型或付费 API。开发时的来源查证与首次依赖下载需要联网，不能与核心运行混为一谈。

现有 Chrome/Edge 扩展输出仍是阶段 0 的开发基线，尚未调用该核心。另行验证了核心可打包为浏览器 ESM 模块；这不代表搜索页已经会显示卡片。整体扩展仍有阶段 0 报告中记录的上游云同步和远程规则逻辑，阶段 2 需处理。

## 2. 首批目录与证据

以下均在本轮读取平台自身页面，或通过官方项目仓库的明确外链核实；名称、入口和自编证据说明记录在 JSON 中。没有导入这些平台的程序代码、网页正文、图标或标志。

| 主体 | 默认入口 | 主要核实来源 |
| --- | --- | --- |
| Steam | `https://store.steampowered.com/` | [Steam 自身介绍](https://store.steampowered.com/about/)及其商店、社区链接 |
| GitHub | `https://github.com/` | [GitHub 自身主页](https://github.com/) |
| 哔哩哔哩 | `https://www.bilibili.com/` | [官网入口](https://www.bilibili.com/)导向同域的旧浏览器提示，显示平台客户端和署名 |
| Wikipedia | `https://www.wikipedia.org/` | [多语言首页](https://www.wikipedia.org/)与[中文首页](https://zh.wikipedia.org/) |
| Firefox | `https://www.firefox.com/` | [Mozilla 原下载入口](https://www.mozilla.org/en-US/firefox/new/)跳转到 Firefox.com；[新官网](https://www.firefox.com/)也已读取 |
| Python | `https://www.python.org/` | [Python 自身主页](https://www.python.org/)及官方文档链接 |
| Apple | `https://www.apple.com/` | [Apple 主页](https://www.apple.com/)与[中国大陆旧路径](https://www.apple.com/cn/)的官方跳转 |
| Microsoft | `https://www.microsoft.com/` | [Microsoft 主页](https://www.microsoft.com/)与[中文入口](https://www.microsoft.com/zh-cn/) |
| Blender | `https://www.blender.org/` | [官方镜像仓库](https://github.com/blender/blender)明确提供 Main Website 链接 |
| VLC media player | `https://www.videolan.org/vlc/` | [VideoLAN VLC 仓库](https://github.com/videolan/vlc)明确提供项目网站链接 |
| OBS Studio | `https://obsproject.com/` | [OBS 自身主页](https://obsproject.com/)展示正式名称与简称 |
| 百度 | `https://www.baidu.com/` | [百度主页](https://www.baidu.com/) |
| Microsoft Bing | `https://www.bing.com/` | [Bing 搜索主页](https://www.bing.com/)标题与名称 |
| Rust 编程语言 | `https://rust-lang.org/` | [语言项目主页](https://rust-lang.org/) |
| Rust 游戏 | `https://rust.facepunch.com/` | [Facepunch 游戏官网](https://rust.facepunch.com/) |
| Node.js | `https://nodejs.org/` | [Node.js 自身主页](https://nodejs.org/) |

Blender 和 VLC 官网直接抓取受限，因此采用官方仓库的外链作为证据，未声称本次成功读取官网正文。哔哩哔哩返回兼容提示页，未声称完成其完整业务页面验收。“官方身份有来源”不等于在所有地区、设备和时间都能访问。

Steam 另含社区、支持和客户端下载页面；Wikipedia、Firefox、Apple、Microsoft 另含语言或地区入口；Python 另含文档入口。默认入口保持明确，多个入口分别记录用途和 URL，不按注册域名推断所有子域名或路径都官方。

别名只录入本轮证据支持的少量名称，例如 `bilibili`、`维基百科`、`OBS`、`VLC`、`Bing`。未将所有常用中文简称自动认定为已核实别名；目录覆盖仍然有限。

## 3. 数据和维护规则

每个主体有稳定 ID、正式名称、区分同名的说明、带证据引用的别名、默认入口、多个入口、核实状态、日期和证据列表。入口包含用途、语言、地区、明确 URL 及证据引用。

格式检查会拒绝重复主体 ID、同一主体中重复的规范化名称、缺失默认入口、悬空证据引用、非法日期及超出目录更新时间的核实日期。不同主体使用同一名称是合法情况，必须保留为歧义。

目录构造接口仅供受维护者审查的目录使用。字段写着 `verified`、证据 URL 可解析或网页自称“官网”，都不能自动证明身份；添加记录需要实际审查证据。首版没有自动接收网上目录或用户记录的机制。

默认核实有效期为 180 天。过期、核实日在查询日期之后、`review-needed` 或 `disabled` 的记录均不返回已核实官方结果，而是返回待核查候选。构造函数可设置有效期，测试可指定日期；正常运行使用当前 UTC 日期。不后台抓取、不自动刷新，不宣称可以永久准确而无需目录维护。

当前 URL 约束较保守：只接受 HTTPS、公开域名形式，不接受用户凭据、非默认端口、IP 地址、本地保留域、反斜杠、查询参数或片段。此检查用于拒绝异常输入，不验证域名所有权，也不解析 DNS；合法 URL 仍然可能是第三方网址。

## 4. 识别与结果

名称先作 NFKC、转小写、去首尾空白及连续空白合并。保留有区分作用的字符，不把 `Node.js` 和 `Nodejs` 合并，不去掉所有标点、不折叠所有空格、不把不同文字系统的相似字形当成相同字符。隐藏格式字符和异常控制字符会被拒绝。

匹配顺序是完整正式名称、完整已核实别名、明确子入口名称。匹配允许有限的导航表达，如 `Steam官网`、`官网 Steam`、`Steam official website`，以及 `Steam 社区`、`Steam 帮助`、`Steam 下载`、`Python 官方文档`。不采用包含某个名称就命中的子串匹配，不模糊猜测域名。

名称冲突不按访问频率、搜索排名或热度选定；`Rust` 保留语言和游戏两个主体。包含教程、新闻、对比、价格、故障等提示的普通查询不转为官网导航。完整目录名称本身含 `News` 等词时仍可准确匹配，不把这些词从名称中删除。

| 状态 | 含义 | 自动选定目标 |
| --- | --- | --- |
| `official` | 名称唯一匹配到当前有效的已核实入口，附证据、日期及其他入口 | 可供下一阶段展示官方卡片 |
| `personal` | 调用方明确提供的、已确认的个人目标 | 只能标为个人目标，不能标成官网 |
| `candidate` | 同名、过期、需复核、缺少所请求入口、个人冲突或未核实页面 | 不选定唯一官方结果 |
| `none` | 空输入、异常输入、资料查询或无可靠目标 | 保留普通搜索，不猜网址 |

个人目标和页面候选是纯输入接口，方便后续复用；本阶段没有反馈窗、存储、学习或自动采集网页。已核实名称匹配优先于个人输入，个人输入不能改写公共官网事实。同名官方记录也不会因为单次个人输入而变成唯一官方结论。

页面标题只能用于列出待确认候选；严格校验其数据，忽略带额外 `official` 等字段的伪造记录。未知站点即使标题与查询完全相同，也只得到 `candidate`，不得到 `official`。候选与个人记录中的非法地址会被忽略。

## 5. 接入接口

下一阶段可直接导入 `resolveName`，传入搜索框中的完整字符串。可选参数为 `asOf`、`personalTargets`、`pageCandidates`，默认只使用内置目录；创建独立实例使用 `createNameResolver(catalog, maxAgeDays)`。

`official` 返回主体 ID、名称、区分说明、选中的入口、其他入口、匹配类型和核实证据；页面层不用再实现另一套目录。只有明确的官方结果才能展示为“已核实官方”，其余状态需按上述含义处理。

正式卡片接入时还要处理 DOM、语言及地区偏好、页面适配失败、重复插入与可访问性。这些属于阶段 2/3；当前核心只是保留地区数据和默认入口，没有按用户地区推断或访问频率自动改选。

## 6. 本地演示与复核

依赖已安装时，在项目根目录运行：

```powershell
.\scripts\Resolve-Name.ps1 -Query Steam
.\scripts\Resolve-Name.ps1 -Query 'Steam 使用教程'
.\scripts\Resolve-Name.ps1 -Query 'Rust 官网'
.\scripts\Resolve-Name.ps1 -Query '从未收录的站点'
```

本轮实际输出分别为官方商店入口、保留资料搜索、两个 Rust 候选、没有可靠目标。这些输出来自真实模块，不是硬编码示例。

在 `extension/` 中运行 `pnpm check` 和 `pnpm test` 可复核静态检查及全部测试。只运行新增核心测试可使用 `pnpm exec node --test src/scripts/namefirst/resolve.test.ts`。开发调用前可设置 `CI=true`、`LEFTHOOK=0`，外层演示和构建脚本会自行设置并恢复这些环境变量。

另外用现有 esbuild 将 `resolve.ts` 打包为 `platform=browser` 的 ESM，再运行该打包模块验证真实输出。产物位于忽略提交的 `.cache/namefirst-core.mjs`，未压缩约 199 KB，只用于核心打包核查，不是已接入浏览器的成品。

## 7. 验证范围

新增 95 项测试（含子测试），加上 96 项上游测试，共 191 项通过。覆盖首次使用、名称优先级、规范化、已核实别名、Rust 歧义、子入口、资料意图、未知名称、非法查询、冒充官网的页面、个人状态边界、记录过期、停用、证据引用、URL 安全约束及共享目录防篡改。

静态检查包含类型检查和格式检查。两个浏览器的既有开发基线重新构建并进行资源及许可核查，确保新增源码和许可范围说明没有破坏现有构建。

没有浏览器搜索页效果测试，也没有全网覆盖率、所有名称准确率或长期访问可用性结论。纯模块测试通过不能代替阶段 2 的 Bing 实际卡片验收。

## 8. 许可和下一阶段

本目录的原创代码、测试、证据说明及可受版权保护的编排采用项目根目录的 NameFirst 非商业互惠许可；文件带有自定义许可标识。平台名称、事实、网址本身不因此成为独占权利，上游和第三方许可继续保留。许可范围和署名文件已同步更新。

下一项为阶段 2：将名称核心接入 Bing 页面，补充 NameFirst 官方卡片，让用户真正看到优先入口；同时处理首版不需要的上游账号及强制远程依赖。百度适配仍按阶段 3 推进。本轮没有服务器、账号或付费依赖，也没有推送、发布或扩大功能范围。
