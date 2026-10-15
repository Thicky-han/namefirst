<p align="center"><img src="assets/brand/namefirst-512.png" width="144" height="144" alt="NameFirst NF arrow icon"></p>
<h1 align="center">NameFirst</h1>
<p align="center"><strong>Search a name. Find the official site first.</strong><br>准确搜索名称，优先找到官网。</p>

[简体中文](./README.md) · [English](./README.en.md) · [繁體中文](./README.zh-TW.md) · [日本語](./README.ja.md) · [한국어](./README.ko.md) · [Español](./README.es.md) · [Français](./README.fr.md) · [Deutsch](./README.de.md) · [Português (Brasil)](./README.pt-BR.md)

这些是使用说明的语言版本，插件界面目前主要为简体中文。名称与别名不会自动翻译，搜索示例保留实际支持的写法；多语言文档不表示增加了搜索引擎或地区支持。各版本对应同一套安装包，许可说明仅为摘要，正式许可文本以 [LICENSE](./LICENSE) 为准。

NameFirst 是用于桌面 Chrome 和 Microsoft Edge 的浏览器插件。在百度、Bing 搜索目录覆盖的平台名称时，它会在网页结果区顶部显示带明确标识的官方入口卡片；也可以由你保存个人网站，之后在本地召回。

**本文对应 1.1.0：118 个主体、173 个官方入口，新增 68 项大学生常用平台和工具，包含可画。** 是否已发布及可下载版本，以 [Releases 发行页](https://github.com/Thicky-han/namefirst/releases)为准。

不需要注册 NameFirst 账号、配置 API Key 或自己编译。官网目录和个人记忆在本地处理，访问百度、Bing 和目标网站需要网络。项目采用非商业共享源码许可，说明见文末。

## 第一步：下载适合你的浏览器安装包

**普通使用者只需下载下面两种 ZIP 中的一种。** 如果 Chrome、Edge 都要使用，则分别下载、分别安装。

| 你使用的浏览器 | 应下载的文件 | 下载 |
| --- | --- | --- |
| Google Chrome | `namefirst-chrome-1.1.0.zip` | [下载 Chrome 安装包](https://github.com/Thicky-han/namefirst/releases/download/v1.1.0/namefirst-chrome-1.1.0.zip) |
| Microsoft Edge | `namefirst-edge-1.1.0.zip` | [下载 Edge 安装包](https://github.com/Thicky-han/namefirst/releases/download/v1.1.0/namefirst-edge-1.1.0.zip) |

也可以手动寻找附件：

1. 打开 [NameFirst Releases](https://github.com/Thicky-han/namefirst/releases)。
2. 找到带 **Latest** 标识的已发布版本，点击标题打开详情。若 1.1.0 尚未出现，先使用页面上实际已经发布的版本，按该版本文件名下载。
3. 向下滚动到 **Assets**。如果附件折叠了，点击 Assets 前的小箭头展开。
4. 点击与你的浏览器对应的 `namefirst-chrome-版本号.zip` 或 `namefirst-edge-版本号.zip`，等待下载完成。

以下文件用于其他用途，首次安装时不用下载：

| 文件 | 用途 |
| --- | --- |
| `namefirst-source-1.1.0.zip` | 完整可修改源码及构建材料，供开发者使用 |
| GitHub 自动提供的 `Source code (zip)` / `Source code (tar.gz)` | 仓库源码快照，不能直接作为已构建扩展加载 |
| `release-manifest.json`、`SHA256SUMS.txt` | 版本、来源和文件一致性校验 |

仓库绿色 **Code → Download ZIP** 下载的也是源码。安装插件请使用上面 Chrome / Edge 专用 ZIP。

## 第二步：全部解压，找到 extension 文件夹

1. 在文件资源管理器中找到下载的 ZIP，通常在“下载”文件夹。
2. 右键 ZIP，选择 **“全部解压缩”**，按提示完成解压；不要只双击 ZIP 后在压缩包里查看文件。
3. 将解压后的文件夹放到长期保留的位置。安装后浏览器仍会读取这些文件，不要删除或随意移动它们。
4. 打开解压后的文件夹，找到里面的 **`extension`** 文件夹。

Chrome 包解压后，结构类似下面这样；Edge 包结构相同：

```text
namefirst-chrome-1.1.0/
├─ extension/                 ← 下一步需要选择这个文件夹
│  ├─ manifest.json
│  ├─ icons/
│  ├─ pages/
│  └─ scripts/
├─ INSTALL.md
├─ PRIVACY.md
└─ ...
```

**选择的必须是直接包含 `manifest.json` 的文件夹。** 不要选 ZIP、最外层文件夹、`scripts` 文件夹或 `manifest.json` 文件本身。

## 第三步：在浏览器中加载 NameFirst

### 使用 Chrome

1. 打开 Chrome，新建一个标签页。
2. 在顶部地址栏输入 `chrome://extensions`，按回车。这里是浏览器地址栏，不是百度/Bing 搜索框。
3. 在扩展管理页面打开 **“开发者模式”**。
4. 点击 **“加载已解压的扩展程序”**（英文界面为 **Load unpacked**）。
5. 在弹出的文件夹选择窗口中，进入第二步的解压目录，选中 **`extension` 文件夹**，点击“选择文件夹”。
6. 页面出现带深绿 NF / 浅绿箭头图标的 **NameFirst** 卡片，确认版本为 **1.1.0**、开关处于启用状态。

### 使用 Microsoft Edge

1. 打开 Edge，新建一个标签页。
2. 在顶部地址栏输入 `edge://extensions`，按回车。
3. 打开 **“开发人员模式”**（Developer mode）；窗口布局不同时，该开关可能在侧边菜单内。
4. 点击 **“加载解压缩的扩展”**或同义按钮（**Load unpacked**）。
5. 在文件夹选择窗口中选中解压后的 **`extension` 文件夹**，点击“选择文件夹”。
6. 确认扩展列表里出现 **NameFirst 1.1.0**，并且开关已开启。

请保持开发者／开发人员模式开启，并保留解压目录；以后更新时在原 NameFirst 卡片上重新加载。

本版通过开发者模式解压加载，尚未上架 Chrome / Edge 扩展商店。安装步骤可对照 [Chrome 官方说明](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world)和 [Edge 官方说明](https://learn.microsoft.com/en-us/microsoft-edge/extensions/getting-started/extension-sideloading)。

## 第四步：搜索一次，确认已经生效

1. 如果之前已打开百度/Bing 搜索页，先刷新该页面。
2. 打开 [百度](https://www.baidu.com/)或 [Bing](https://www.bing.com/)，使用普通 **“网页”**搜索。
3. 输入下列示例中的任意一项并提交搜索：

| 输入内容 | 应出现的 NameFirst 入口 |
| --- | --- |
| `Steam` | Steam 官方商店 |
| `可画` / `Canva可画` | Canva 可画中国区官网 |
| `可画下载` | Canva 可画 Windows 官方下载页 |
| `Zotero下载` | Zotero 官方下载页 |
| `腾讯会议下载` | 腾讯会议官方下载中心 |
| `RStudio下载` | Posit 官方 RStudio 桌面版下载页 |

4. 在网页结果区顶部找到 **“NameFirst · 已核实官方入口”**卡片。它位于网页结果容器内，不保证覆盖页面其他位置的广告或 AI 模块。
5. 点击卡片中的网站名称进入目标网站；有其他已收录入口时，也可点击“官方下载页面”等链接。

原搜索结果和广告仍保留。NameFirst 不自动跳转，也不修改搜索引擎服务器的排名。搜索 `Rust` 会显示编程语言和游戏两个候选，由你选择；`Steam 使用教程` 等资料查询通常保持普通搜索。

## 第五步：固定图标、管理个人网站

1. 点击浏览器工具栏的 **扩展程序图标**，通常是拼图形状。
2. 找到 NameFirst，点击图钉或“在工具栏中显示”，方便以后打开。
3. 点击 NameFirst 图标，可以查看总开关、百度/Bing 分别的开关和反馈入口开关。
4. 点击 **“管理个人记录与备份”**，可新增、编辑、删除、搜索自己的记录，并导入、导出 JSON 备份。

未收录的网站可以在支持的搜索页展开 **“选择并记住个人目标”**，检查名称、别名和 HTTPS 地址，再点 **“保存个人目标”**。之后搜索相同名称或已保存别名，可以看到标注“个人记忆”的入口。个人保存不构成官方身份认证。

最多保存 500 条个人目标、每条最多 10 个别名。备份最多 4,000,000 字节，未加密，需自行保管；Chrome 与 Edge 之间不会自动同步，迁移时先导出、再在另一浏览器导入并检查预览。导入默认合并，替换及清空需要确认，最近一次记忆修改可撤销。

## 从旧版本更新到 1.1.0

开发者模式安装的版本不会自动从 GitHub 更新，请手动操作：

1. 打开旧版 NameFirst → **管理个人记录与备份**，先导出个人记录。保存正在编辑的内容，再关闭管理页。
2. 下载与你的浏览器对应的新版 ZIP，先全部解压到一个新文件夹。
3. 找到以前安装 NameFirst 时选择的旧 **`extension` 文件夹**，保持这个位置不变。
4. 将新版 `extension` 文件夹**里面的全部内容**复制到旧 `extension` 文件夹里面，同名文件选择替换。不要变成 `extension/extension/manifest.json` 的嵌套结构。
5. 打开 `chrome://extensions` 或 `edge://extensions`，找到原来的 NameFirst 卡片，点击 **“重新加载”**或圆形箭头按钮。
6. 确认同一张卡片的版本变成 **1.1.0**，再刷新百度/Bing 搜索页，检查个人记录仍在。

更新前不要卸载旧插件。稳定扩展 ID 为 `kocncgipjlmfdlhabchnbnjgahlpfjkc`；正常替换文件并重新加载会沿用同一身份。卸载、清除浏览器配置或更换扩展身份可能导致本地记录丢失；换电脑或换配置时使用 JSON 导入迁移。

## 常见问题

| 遇到的情况 | 检查与处理 |
| --- | --- |
| 找不到下载附件 | 打开发行详情，滚动到 Assets 并展开；不要在仓库源码文件列表中找安装包 |
| 提示“找不到清单文件”或“无法加载扩展” | 确认已全部解压；选择的文件夹中直接存在 `manifest.json`；确认下载的是 Chrome/Edge 成品 ZIP |
| 工具栏没有 NameFirst 图标 | 在拼图形状的扩展程序菜单中找到 NameFirst，再固定图标 |
| 安装后搜索页没有卡片 | 刷新页面，确认扩展和对应引擎开关开启，先在普通网页结果页搜索 `Steam`；验证码、图片、新闻、视频及独立 AI 页面不属于本版适配范围 |
| 搜某个工具仍没有官方卡片 | 只有目录中的正式名称、已收录别名和子入口会命中；完整范围见 [CATALOG.md](./CATALOG.md)，未收录名称可以保存为个人目标 |
| 没有某软件的“下载”入口 | 对应下载页须另外核实；收录官网不表示覆盖该厂商全部产品或全部下载入口，不会凭空猜测安装包地址 |
| 更新后还是旧版本 | 确认替换的是原安装目录里的文件，点击原扩展卡片“重新加载”，再刷新搜索页 |
| 开发者模式不可用 | 若浏览器由学校或单位管理，请联系管理员确认是否允许加载本地扩展 |
| 目标网站打不开或要求登录 | 官网身份不等于各地网络可达、无需账号或免费；先按该网站自己的网络、账号及许可要求检查 |

仍有问题，可在 [Issues](https://github.com/Thicky-han/namefirst/issues)说明浏览器版本、插件版本、搜索引擎及复现步骤。请勿上传个人备份、凭据或敏感页面。下载和使用无需 GitHub 账号，主动提交 Issue/PR 则遵循 GitHub 的账号流程。

## 功能范围与隐私

1.1.0 新增课程教学、学籍升学、中文与外文文献、论文写作、办公协作、数据分析、工程设计、视频创作、AI、翻译、浏览器与常用工具等 68 项，累计 **118 个主体、173 个入口**。其中官网、官方商店、下载和文档入口分别记录，目录来源见 [CATALOG.md](./CATALOG.md)。

“已核实”表示目录制作时依据官方页面或明确的官方交叉链接进行了核对，**不是每次搜索实时联网审查，也不是软件安全检测认证**。插件不后台爬网站、拉取目录、在线训练、上传个人反馈或收集全部搜索历史。核实有效期为 180 天，过期需要维护者复核并发布更新；个人确认不会刷新官网的核实日期。

只在已支持的百度/Bing 桌面搜索页运行，个人记录保存在本浏览器配置；不需要项目账号、开发者服务器、付费 API 或云训练。目标网站本身的登录、订阅或校园授权要求仍由其决定。详情见 [PRIVACY.md](./PRIVACY.md)。

本机验证范围为 Windows 桌面 Chrome/Edge；其他系统、全部历史版本和所有地区实验页面未逐一验证。受控浏览器测试与真实在线人工反馈分别记录，见 [VERIFICATION.md](./VERIFICATION.md)和[发行前检查](./PRE_RELEASE_CHECK.md)。

## 许可、贡献与来源

NameFirst 原创部分采用 **NameFirst Noncommercial Reciprocal License 1.0**：允许免费使用、修改和分发，以及企业内部免费使用；禁止未经另行授权的销售、收费服务、广告及其他变现。分发须免费公开对应源码及必要构建材料，受许可覆盖的修改继续采用同一许可；私人本地修改无需公开。

这是**非商业共享源码**项目，不是 OSI 意义上的开源许可。正式文本见 [LICENSE](./LICENSE)，边界见 [LICENSE_SCOPE.md](./LICENSE_SCOPE.md)。普通安装使用不要求签 CLA。

原创贡献按 [CONTRIBUTING.md](./CONTRIBUTING.md)单独确认 [CLA](./CLA.md)：贡献者保留版权，可向私下确定的接收方授予商业使用、闭源分发和再许可权。公开项目关联账号为 `Thicky-han`，法定身份和签署副本不公开；未签署的贡献、上游和第三方不自动纳入，见 [CLA_GUIDE.md](./CLA_GUIDE.md)。

本仓库是 [uBlacklist](https://github.com/iorate/ublacklist) 的真实 GitHub fork，基线固定为 `v10.1.2` / `212384b330002a4c727b034806826e2eb352d7d5`。上游源码位于 `extension/`，builtin 固定为 `c8bd5b7113dc1d416fa00c45509ac308619751df` 并展开为普通文件。main 保留固定上游的真实祖先关系。

上游 MIT、第三方许可和署名继续保留；不能把整个成品统一称为 MIT。成品携带公众许可、`UPSTREAM-LICENSE.txt`、来源与依赖声明。详情见 [MODIFICATIONS.md](./MODIFICATIONS.md)、[NOTICE](./NOTICE)、[UPSTREAM.json](./UPSTREAM.json)。

<details>
<summary>开发者：从源码构建与验证</summary>

普通安装者使用上面的浏览器 ZIP 即可。本节供修改源码的开发者使用，需要 PowerShell 7、Node.js 和 pnpm。

在项目根目录运行：

```powershell
# 首次安装锁定依赖并构建
./scripts/Build.ps1 -InstallDependencies

# 打包与公开内容检查；正式发行包应在已提交的本地 main 上生成
./scripts/Package.ps1
./scripts/Verify-Package.ps1
./scripts/Audit-Runtime.ps1
node scripts/check-public-content.mjs
node scripts/check-release-content.mjs
```

在 `extension/` 目录验证：

```powershell
$env:CI = 'true'
$env:LEFTHOOK = '0'
pnpm check
pnpm test
pnpm exec playwright test --config e2e/namefirst/playwright.config.ts
```

源码依上游 devEngines 使用 Node 26.10.0，本机工具入口使用宿主 Node 24 与 pnpm 11。独立 `--namefirst` 构建模式保留上游默认模式；不要更改稳定公钥或将上游默认构建包当作 NameFirst。

测试使用独立临时浏览器配置。依赖、缓存、生成的测试报告和浏览器配置不提交或打包。静态内容检查不能保证发现所有未知形式的秘密。维护与发行步骤见 [PUBLISHING.md](./PUBLISHING.md)。

</details>

更多材料：[安装与使用](./INSTALL.md) · [官网目录](./CATALOG.md) · [发行说明](./RELEASE_NOTES.md) · [验收记录](./VERIFICATION.md) · [需求与规划](./PROJECT_SPEC.md) · [实施计划](./IMPLEMENTATION_PLAN.md)。历史报告保留当时状态，当前发行状态以 Releases 为准。
