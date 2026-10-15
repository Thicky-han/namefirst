# NameFirst 1.1.0

本次扩充大学生常用平台官网与工具官方下载入口，新增 **68 个主体、115 个入口**，累计 **118 个主体、173 个入口**。原有 50 个主体及其核实日期保留。

## 下载与安装

普通使用者按浏览器下载一个 ZIP：

- Chrome：`namefirst-chrome-1.1.0.zip`
- Edge：`namefirst-edge-1.1.0.zip`

全部解压后，在浏览器地址栏输入 `chrome://extensions` 或 `edge://extensions`，打开开发者模式，点击“加载已解压的扩展程序 / Load unpacked”，选择解压目录中的 **extension 文件夹**。这个文件夹应直接包含 `manifest.json`。

确认 NameFirst 1.1.0 已启用，刷新百度/Bing 搜索页，再搜索 `Steam`、`可画`、`可画下载`、`Zotero下载` 或 `腾讯会议下载`。点击 NameFirst 卡片中的网站名称访问入口。

`namefirst-source-1.1.0.zip` 与 GitHub 自动生成的 Source code 是开发材料，不能直接当成已构建扩展加载。`release-manifest.json` 与 `SHA256SUMS.txt` 用于来源和完整性核对。五个发行附件同时提供。

[项目 README](https://github.com/Thicky-han/namefirst#readme)及包内 INSTALL.md 已改为逐步安装说明，包含附件选择、全部解压、Chrome/Edge 分别安装、第一次使用、固定图标、个人记录、备份更新和常见问题。

README 提供简体中文、[English](https://github.com/Thicky-han/namefirst/blob/v1.1.0/README.en.md)、[繁體中文](https://github.com/Thicky-han/namefirst/blob/v1.1.0/README.zh-TW.md)、[日本語](https://github.com/Thicky-han/namefirst/blob/v1.1.0/README.ja.md)、[한국어](https://github.com/Thicky-han/namefirst/blob/v1.1.0/README.ko.md)、[Español](https://github.com/Thicky-han/namefirst/blob/v1.1.0/README.es.md)、[Français](https://github.com/Thicky-han/namefirst/blob/v1.1.0/README.fr.md)、[Deutsch](https://github.com/Thicky-han/namefirst/blob/v1.1.0/README.de.md)、[Português (Brasil)](https://github.com/Thicky-han/namefirst/blob/v1.1.0/README.pt-BR.md)，共 9 种语言，可在文首切换；完整版本随源码包提供，安装包内 INSTALL.md 提供在线入口。这是文档翻译，插件界面仍主要为简体中文，名称、别名和支持的搜索引擎不因翻译改变。

## 新增覆盖

- 学籍、升学、考试及课程：学信网、研招网、中国教育考试网、国家大学生就业服务平台、中国大学MOOC、学堂在线、学习通、雨课堂、智慧树。
- 学术检索与写作：中国知网、万方、维普、Google Scholar、Semantic Scholar、PubMed、arXiv、Web of Science、Zotero、EndNote、Overleaf、Obsidian、Typora。
- 办公协作：WPS Office、Microsoft 365、腾讯文档、金山文档、腾讯会议、飞书、钉钉。
- 开发与数据：JetBrains Toolbox App、Visual Studio、Anaconda、Jupyter、R、RStudio、MySQL、DBeaver、Postman。
- 科研与工程：MATLAB、Origin/OriginPro、SPSS Statistics、AutoCAD、SOLIDWORKS、Ansys、COMSOL。
- 创作：Adobe Creative Cloud、Figma、**Canva 可画**、剪映、DaVinci Resolve、Unity、Unreal Engine。
- AI 与翻译：DeepSeek、豆包、Kimi、千问、DeepL、网易有道词典。
- 常用软件与服务：Chrome、Edge、Everything、SumatraPDF、百度网盘、夸克网盘、QQ、微信、Epic Games Store、WeGame。

官网、下载与安装说明分别核对。修正核实过程中发现的 RStudio、DeepL 和 Adobe 旧下载地址；可画提供中国区官网与 Windows 下载入口。Ansys 的下载入口明确为学生版；Jupyter 的下载入口为官方安装指南。部分专业软件仍要求厂商账号、试用或相应许可。

## 更新旧版本

先在旧版管理页导出备份并保存编辑内容。把新版 extension 文件夹里的全部内容复制进原来的 extension 文件夹，同名文件替换，保持原安装位置；在原 NameFirst 扩展卡片上点击“重新加载”，再刷新搜索页。不要先卸载，也不要复制成 extension/extension 的嵌套结构。

版本升级保持稳定扩展 ID `kocncgipjlmfdlhabchnbnjgahlpfjkc`、个人数据格式、权限及本地处理方式。开发者模式加载需要按上述步骤手动更新；跨配置或跨浏览器迁移使用 JSON 备份。

## 验证与边界

测试、成品加载、旧版本记录保留及公开内容检查的范围和结果见源码中的 PRE_RELEASE_CHECK.md、VERIFICATION.md；受控浏览器页面不等于全部真实搜索页面的在线验证。此前百度人工正常验收记录继续保留。

这是本地目录扩充，不增加每次搜索实时联网认证、后台爬站、目录自动更新、在线训练、账号、遥测、云同步或大众反馈。原结果和广告保留，不自动跳转。官网身份核实有效期为 180 天，不代表软件安全审计、网络可达或免费授权。

NameFirst 原创部分的非商业互惠许可、上游 MIT、第三方声明与独立 CLA 流程保持。普通使用不需要签署 CLA。完整条款与来源随安装包和对应源码提供。
