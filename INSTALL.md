# NameFirst 1.1.0 安装与使用

NameFirst 在 Chrome/Edge 的百度、Bing 普通桌面网页结果中显示已核实目录入口。无需注册 NameFirst 账号、配置 API Key 或编译。官网目录和个人记忆在本地处理，搜索和访问网站仍需网络。

项目主页：https://github.com/Thicky-han/namefirst

其他语言的完整安装、使用与更新说明 / Installation guides:

[English](https://github.com/Thicky-han/namefirst/blob/main/README.en.md) · [繁體中文](https://github.com/Thicky-han/namefirst/blob/main/README.zh-TW.md) · [日本語](https://github.com/Thicky-han/namefirst/blob/main/README.ja.md) · [한국어](https://github.com/Thicky-han/namefirst/blob/main/README.ko.md) · [Español](https://github.com/Thicky-han/namefirst/blob/main/README.es.md) · [Français](https://github.com/Thicky-han/namefirst/blob/main/README.fr.md) · [Deutsch](https://github.com/Thicky-han/namefirst/blob/main/README.de.md) · [Português (Brasil)](https://github.com/Thicky-han/namefirst/blob/main/README.pt-BR.md)

语言版本只翻译文档，插件界面目前主要为简体中文；各版本使用相同浏览器安装包。上述 main 分支链接须在维护者确认并发布此次更新后才会在线可用，未发布时可从对应源码包读取同名文件。

## 1. 下载什么

打开 [Releases](https://github.com/Thicky-han/namefirst/releases)，进入已发布版本的详情，向下找到并展开 **Assets**。

- Chrome：下载 `namefirst-chrome-1.1.0.zip`。
- Edge：下载 `namefirst-edge-1.1.0.zip`。
- 两个浏览器都使用：分别下载、分别安装。

版本以 Releases 实际发布内容为准。普通安装不需要 `namefirst-source-1.1.0.zip`、GitHub 自动生成的 Source code、绿色 Code 按钮下载的源码、JSON 元数据或校验清单。源码包不能直接作为成品扩展加载。

## 2. 全部解压

1. 在文件资源管理器找到下载的 ZIP。
2. 右键 → **全部解压缩**，完成提取，不要在 ZIP 内直接操作。
3. 将文件夹放在长期保留的位置，安装后不要删除或随意移动。
4. 找到里面的 **extension** 文件夹。它里面应直接有 `manifest.json`、`icons`、`pages`、`scripts` 等内容。

浏览器下一步需要选择这个 **extension 文件夹**，不是最外层目录、ZIP、scripts 或某个单独的文件。

## 3. Chrome 安装

1. 打开 Chrome，在顶部地址栏输入 `chrome://extensions` 并回车。
2. 打开 **开发者模式**。
3. 点击 **加载已解压的扩展程序 / Load unpacked**。
4. 在文件夹窗口中选中刚才的 **extension** 文件夹，点击“选择文件夹”。
5. 确认扩展列表出现 **NameFirst 1.1.0** 和深绿 NF / 浅绿箭头图标，开关已启用。

## 4. Edge 安装

1. 打开 Edge，在顶部地址栏输入 `edge://extensions` 并回车。
2. 打开 **开发人员模式 / Developer mode**，必要时展开侧边菜单寻找开关。
3. 点击 **加载解压缩的扩展 / Load unpacked** 或同义按钮。
4. 选择解压后的 **extension** 文件夹。
5. 确认 **NameFirst 1.1.0** 已启用。

请保持开发者／开发人员模式开启，保留解压文件夹；更新时在原 NameFirst 卡片上重新加载。

此版本通过开发者模式加载，未上架浏览器扩展商店。步骤参考 [Chrome 官方说明](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world)及 [Edge 官方说明](https://learn.microsoft.com/en-us/microsoft-edge/extensions/getting-started/extension-sideloading)。学校或单位管理的浏览器如禁止此功能，请联系管理员。

## 5. 验证和使用

1. 刷新已经打开的百度/Bing 搜索页。
2. 在普通 **网页**搜索中输入 `Steam`，应在网页结果区顶部出现 **NameFirst · 已核实官方入口** 卡片。
3. 点击卡片中的 Steam 标题进入官方商店。也可搜索 `可画`、`可画下载`、`Zotero下载` 或 `腾讯会议下载` 检查新增入口。
4. 原结果和广告继续保留，不自动跳转。卡片不保证覆盖网页结果容器以外的广告或 AI 模块。
5. 搜索 `Rust` 会出现两个同名候选；`Steam 使用教程` 等资料查询通常不显示官网卡片。

点击工具栏的拼图形状扩展菜单，找到 NameFirst 并固定图标。点击图标可设置总开关、百度/Bing 开关、反馈入口开关，并打开 **管理个人记录与备份**。

未收录网站可展开 **选择并记住个人目标**，核对名称、别名与 HTTPS 地址，再点 **保存个人目标**。个人记录会标注“个人记忆”，不是官方身份认证；只有明确保存时才记住，不根据点击自动训练或汇总大众反馈。

## 6. 管理、备份和迁移

通过扩展图标 → **管理个人记录与备份**，可以搜索、新增、编辑、删除和重新确认个人记录，导出 JSON 备份。最多 500 条记录、每条最多 10 个别名，导入文件最多 4,000,000 字节。

导入先校验、再预览，默认合并；替换、清空需确认，最近一次记忆修改可撤销。开关、撤销快照不随备份迁移。备份未加密，请自行保管，不要上传公共仓库。换电脑或浏览器时，先在旧配置导出，再到新配置导入；没有自动云同步。

## 7. 更新旧版本

开发者模式安装不会从 GitHub 自动更新。

1. 在旧版管理页导出个人备份，保存编辑内容并关闭管理页。
2. 下载对应浏览器的新版 ZIP，先解压到新文件夹。
3. 保留旧插件的安装位置，把新版 **extension 内全部内容**复制进原来的 **extension 内**，同名文件替换。不要造成 `extension/extension` 嵌套。
4. 打开 `chrome://extensions` 或 `edge://extensions`，在原来的 NameFirst 卡片上点击 **重新加载 / Reload** 或圆形箭头。
5. 确认版本为 1.1.0，再刷新搜索页并检查个人记录。

不要先卸载。稳定 ID 是 `kocncgipjlmfdlhabchnbnjgahlpfjkc`，正常更新保持相同身份；卸载、清除浏览器配置或更改身份可能丢失数据。迁移新配置请使用 JSON 备份。

## 8. 常见问题

| 问题 | 处理 |
| --- | --- |
| 找不到下载文件 | 在发行详情展开 Assets，选 Chrome/Edge 专用 ZIP |
| 清单文件缺失或无法加载扩展 | 全部解压；选直接包含 manifest.json 的 extension 文件夹；检查是否误下源码 |
| 工具栏没有图标 | 打开扩展菜单并固定 NameFirst |
| 搜索没有卡片 | 扩展开关、引擎开关开启；刷新页面；在普通网页结果页搜索 Steam；验证码、图片/视频/新闻和独立 AI 页面不适配 |
| 某个名称或下载查询没有认证入口 | 核对目录是否有该名称、别名及对应子入口；未核实的入口不会自动猜测，可保存个人目标 |
| 仍显示旧版本 | 检查替换的原安装目录，重新加载原扩展，再刷新搜索页 |
| 官网打不开、收费或要求登录 | 官方身份不等于网络可达、免账号或免费授权；按网站自己的要求处理 |

1.1.0 共 118 个主体、173 个入口。核实是目录制作时的来源核对，有效期 180 天；不实时联网认证、不后台更新目录或上传反馈。完整说明见包内 [CATALOG.md](./CATALOG.md)、[PRIVACY.md](./PRIVACY.md)、[VERIFICATION.md](./VERIFICATION.md)。

更详细的安装及源码说明见 [项目 README](https://github.com/Thicky-han/namefirst#readme)。报告问题请说明版本、浏览器、搜索引擎和复现步骤，不提交个人备份、密码或敏感页面。
