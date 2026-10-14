<p align="center"><img src="assets/brand/namefirst-512.png" width="144" height="144" alt="NameFirst NF arrow icon"></p>
<h1 align="center">NameFirst</h1>
<p align="center"><strong>Search a name. Find the official site first.</strong><br>准确搜索名称，优先找到官网。</p>

NameFirst is a local browser extension for desktop Chrome and Edge. It adds a clearly labeled official-site card above ordinary Baidu and Bing web results for names covered by its reviewed directory. Personal site memories and JSON backups stay on your device. No NameFirst account, API key, telemetry or developer-hosted server is required.

NameFirst 是一个改善“搜到名称，却找不到官网”体验的浏览器插件。输入目录覆盖的平台正式名称时，即使原结果没有官网，也会在网页结果区首位补充已核实入口。小众网站可由你明确确认，记为自己的个人目标。

**版本：1.0.0。支持 Windows 桌面 Chrome/Edge 的百度与 Bing 普通网页搜索。** 本项目为**非商业共享源码**，以 uBlacklist 开源项目为基础，见下方许可说明。

## 主要功能

- **官网优先**：随包目录覆盖 50 个主体、58 个入口，保留官方来源和核实日期；首次使用无需训练或历史记录。
- **名称识别**：按正式名称及已核实别名匹配，支持目录已列出的子入口。同名时列出候选，不自动跳转。
- **个人记忆**：手动确认名称、别名与 HTTPS 地址，之后在两引擎召回，标注“个人记忆”，不会把第三方网站改称官网。
- **记录管理**：搜索、分页、新增、编辑、删除、重新确认，以及最近一次记忆修改撤销。
- **备份迁移**：JSON 导出，导入先校验预览，默认合并，替换需确认；可迁移到另一浏览器或电脑。
- **展示控制**：总开关、百度/Bing 独立开关和反馈入口开关，关闭展示保留记录。

| 搜索内容 | NameFirst 行为 |
| --- | --- |
| `Steam` | 优先显示目录中的 Steam 官方商店 |
| `Steam Support` | 显示已列入目录的官方支持入口 |
| `Rust` | 列出编程语言和游戏两个同名候选 |
| 未记住的 `Steam 使用教程` | 保留普通资料搜索 |
| 未收录的小众名称 | 可自行选择并确认个人目标，之后本地召回 |

卡片补充在网页结果区首位，原结果和广告仍保留。不修改服务器排名、不自动跳转、不汇总大众反馈，也不靠点击自动判断网站官方身份。

## 下载和安装

从 [Releases](https://github.com/Thicky-han/namefirst/releases) 下载浏览器成品 ZIP，无需编译。首版附件尚未显示时，请以 Releases 页的实际发布状态为准。

| 文件 | 用途 |
| --- | --- |
| [Chrome 1.0.0](https://github.com/Thicky-han/namefirst/releases/download/v1.0.0/namefirst-chrome-1.0.0.zip) | Chrome 解压安装包 |
| [Edge 1.0.0](https://github.com/Thicky-han/namefirst/releases/download/v1.0.0/namefirst-edge-1.0.0.zip) | Edge 解压安装包 |
| [对应源码](https://github.com/Thicky-han/namefirst/releases/download/v1.0.0/namefirst-source-1.0.0.zip) | 完整源码、上游基线、锁文件、配置与构建材料 |
| [SHA256SUMS.txt](https://github.com/Thicky-han/namefirst/releases/download/v1.0.0/SHA256SUMS.txt) | 发行文件一致性校验清单 |

1. 下载对应浏览器 ZIP，在文件资源管理器选择“全部解压缩”。把文件夹放在之后不会移动或删除的位置。
2. Chrome 地址栏输入 `chrome://extensions`；Edge 输入 `edge://extensions`。
3. 开启“开发者模式”，点击“加载已解压/解压缩的扩展程序”。
4. 选择包内 **`extension` 文件夹**，它直接包含 `manifest.json`，不要选择 ZIP 或源码包。
5. 确认 NameFirst 1.0.0 已启用，刷新已有搜索页，再在百度或 Bing 搜索 `Steam`。

这是一份解压加载版，尚未提交扩展商店。步骤依据 [Chrome 官方说明](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world)与 [Edge 官方说明](https://learn.microsoft.com/en-us/microsoft-edge/extensions/getting-started/extension-sideloading)。详细使用和排错见 [INSTALL.md](./INSTALL.md)。

## 个人记录与备份

点击浏览器扩展按钮 → NameFirst → **“管理个人记录与备份”**。可以整理个人网站、导出 JSON、检查导入预览，以及分别关闭两个搜索引擎的展示。

导入默认合并，保留现有记录并跳过相同项；其他名称或别名冲突会拒绝整次操作。替换和清空需要明确确认，可立即撤销全局最近一次记忆修改，后续修改会替换这次撤销机会。

最多 500 条个人目标，每条最多 10 个别名，备份最多 4,000,000 字节。地址只接受现有规则允许的公共 HTTPS，不接受 HTTP、账号凭据、本地/IP 地址、非标准端口、参数或片段。备份未加密，不包含开关或撤销历史，请自行保管。两浏览器之间不自动同步。

更新前先备份；替换固定安装目录中的新文件，再重新加载原扩展，不先卸载。稳定扩展 ID 为 `kocncgipjlmfdlhabchnbnjgahlpfjkc`。有效旧数据可自动升级，卸载、清除配置或更换身份可能导致记录丢失。

## 隐私与支持范围

不要求项目账号，不上传个人反馈、不保存全部搜索历史，没有云同步、遥测、付费 API 或开发者运行后台。目录、匹配和记忆在本地处理；访问搜索网站和目标网站仍需要网络，目标网站自身可能要求登录。详见 [PRIVACY.md](./PRIVACY.md)。

已验证环境为 Windows 桌面 Chrome/Edge 155；没有验证其他系统、所有旧版本、移动端、Firefox/Safari、图片/新闻/视频、独立 AI 页面或所有地区实验结构。验证码页面不插卡片，按搜索网站自己的流程处理。正常结果页结构变化可能需要更新适配。

官方核实有效期为 180 天，插件不后台联网复核或下载目录，需安装后续更新；个人确认不会刷新官方核实日期。个人记录超过 180 天只提示复核，不自动删除。目录无法保证永久准确、当地网络可达或覆盖全部未知名称，见 [CATALOG.md](./CATALOG.md)。

单元、实际浏览器受控验收和人工在线反馈分别记录，见 [VERIFICATION.md](./VERIFICATION.md)和[发行前检查](./PRE_RELEASE_CHECK.md)。受控页面通过不等于所有真实网站页面均已验证。

## 许可、贡献与上游

NameFirst 原创部分采用 **NameFirst Noncommercial Reciprocal License 1.0**：允许免费使用、修改和分发，以及企业内部免费使用；禁止未经另行授权的销售、收费服务、广告及其他变现。分发须免费公开对应源码和必要构建材料，受许可覆盖的修改继续采用同一许可。私人本地修改不必公开。

这是**非商业共享源码**许可，不是 OSI 意义上的开源许可。正式文本见 [LICENSE](./LICENSE)，边界见 [LICENSE_SCOPE.md](./LICENSE_SCOPE.md)。普通用户安装使用不需要签 CLA。

外部原创贡献按 [CONTRIBUTING.md](./CONTRIBUTING.md)单独确认 [CLA](./CLA.md)：贡献者保留版权，可向私下确定的接收方授予商业使用、闭源分发和再许可权。公开项目关联账号为 `Thicky-han`，真实法定身份和签署副本不公开；未签署的贡献、上游与第三方不自动纳入，见 [CLA_GUIDE.md](./CLA_GUIDE.md)。

本仓库是 [uBlacklist](https://github.com/iorate/ublacklist) 的 GitHub fork，NameFirst 基线固定为 `v10.1.2` / `212384b330002a4c727b034806826e2eb352d7d5`。上游源码位于 `extension/`，builtin 固定为 `c8bd5b7113dc1d416fa00c45509ac308619751df`，已展开为普通文件。NameFirst 的 `main` 保留固定上游提交作为历史基础。

上游 MIT 和第三方权利继续保留；不能把整包标为 MIT，也不能将原上游整体改成非商业。成品携带公众许可、`UPSTREAM-LICENSE.txt`、来源与依赖声明。修改及出处见 [MODIFICATIONS.md](./MODIFICATIONS.md)、[NOTICE](./NOTICE)和 [UPSTREAM.json](./UPSTREAM.json)。

## 开发与构建

在项目根目录运行 PowerShell 7：

```powershell
# 首次安装固定依赖并构建 Chrome/Edge
.\scripts\Build.ps1 -InstallDependencies

# 后续构建和打包
.\scripts\Package.ps1
.\scripts\Verify-Package.ps1
.\scripts\Audit-Runtime.ps1
```

源码基于 Node 26.10.0，由上游 devEngines 提供；本机验证使用宿主 Node 24 与 pnpm 11。首次构建需要网络下载开发依赖，普通安装成品不需要开发工具。独立 `--namefirst` 构建模式保留上游默认模式；不要改动稳定公钥或把上游默认包当成 NameFirst。

在 `extension/` 目录验证：

```powershell
$env:CI = 'true'
$env:LEFTHOOK = '0'
pnpm check
pnpm test
pnpm exec playwright test --config e2e/namefirst/playwright.config.ts
```

测试使用独立临时浏览器配置，不改用户现有配置。测试源码是验证材料，生成的报告、缓存、浏览器配置和依赖目录不提交或打包。公网发布前还执行 `node scripts/check-public-content.mjs`，对拟公开源码和包进行静态检查；它不保证发现所有未知形式的秘密。

## 反馈与文档

遇到问题请在 [Issues](https://github.com/Thicky-han/namefirst/issues)说明浏览器版本、搜索引擎、最小复现和插件版本，不上传个人备份、token、签署记录或敏感页面。下载和使用无需 GitHub 登录；主动提交 Issue/PR 使用 GitHub 的账号流程。

- [安装与更新](./INSTALL.md)、[隐私](./PRIVACY.md)、[目录与来源](./CATALOG.md)
- [发行说明](./RELEASE_NOTES.md)、[验收范围](./VERIFICATION.md)、[发行检查](./PRE_RELEASE_CHECK.md)
- [需求与规划](./PROJECT_SPEC.md)、[实施计划](./IMPLEMENTATION_PLAN.md)、[发布流程](./PUBLISHING.md)

历史阶段报告保留当时的数字和状态；当前发行状态以 Releases 页面为准。运行无需维护者购买服务器，但搜索网站改版和目录过期仍可能需要人工维护。
