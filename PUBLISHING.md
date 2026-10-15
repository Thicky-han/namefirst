# NameFirst 发行流程

目标：[Thicky-han/namefirst](https://github.com/Thicky-han/namefirst)，public，默认分支 main。v1.0.0 已发布；当前准备 v1.1.0，包含 118 个主体、173 个入口和重写的安装指引。当前准备状态见 [PRE_RELEASE_CHECK.md](./PRE_RELEASE_CHECK.md)，线上状态以 [Releases](https://github.com/Thicky-han/namefirst/releases)为准。

## 准备和确认边界

修改官网目录后，核对来源、日期、名称和下载用途，保留旧记录的真实核实日期。更新版本配置、README、INSTALL、CATALOG、RELEASE_NOTES、来源与验证记录，运行代码检查、单元和实际浏览器受控回归、成品解压加载、旧版更新及公开内容检查。

先完成可审阅的本地提交和五个发行文件，再取得维护者对具体提交及附件的发布确认。确认前不更新远程 main、README、版本标签或 Release。不能把本地打包或无上传的准备检查称为已经公开发行。

GitHub Actions 保持关闭，未配置服务器、付费服务、定时任务或自动签署服务。只使用公开 GitHub 用户名和 noreply 提交邮箱，不公开法定姓名、私下签署记录或用户备份。

## 本地构建和检查

使用 PowerShell 7，首次按 README 安装固定依赖。从已发布 main 开始工作，准备版本的最终本地提交直接继承当前已发布提交，核对完整可修改源码已经包含在该提交中，再在本地 main 打包：

```powershell
./scripts/Package.ps1
./scripts/Verify-Package.ps1
./scripts/Audit-Runtime.ps1
node scripts/check-public-content.mjs
node scripts/check-release-content.mjs
```

输出位于 release/1.1.0，包含 Chrome ZIP、Edge ZIP、完整对应源码 ZIP、release-manifest.json 和 SHA256SUMS.txt。版本来自 config/extension-identity.json。元数据记录源码提交、main 分支、稳定扩展 ID、目录版本和三个 ZIP 的摘要；校验清单另覆盖元数据。

publicReleaseCreated: false 仅记录打包时尚未公开发行，不是查询 GitHub 当前状态。源码或发布正文有任何修改，都要重新提交、打包和校验，不手工修改 ZIP 来绕过内容对应检查。

源码包保留上游基线、展开的 builtin、锁文件、源码和验证材料，排除依赖、缓存、浏览器配置、生成报告、个人备份、私钥及 legal/private。上游 extension/release 中的四个脚本/说明是源码，仍保留。

## 确认后的发布

发布工具默认仅显示准备信息：

```powershell
node scripts/publish-release.mjs
```

收到明确发布确认后，用已确认提交的完整哈希执行：

```powershell
node scripts/publish-release.mjs --confirm-public-release --expected-commit=<已确认的完整提交哈希>
```

脚本要求干净的 main、正确目标、元数据与附件校验一致。通过 GitHub Git API 上传对象，核对树与提交哈希和本地一致；远程 main 必须是当前提交或它的直接父提交，更新使用 force: false，只允许正常向前推进。发现其他远端提交时停止检查，不覆盖或强推。

然后创建 v1.1.0 标签和 Release 草稿，使用 RELEASE_NOTES.md 正文，上传五个附件，核对 GitHub 返回的文件名、大小和 SHA-256 后才公开。已存在不同标签或同版本 Release 时先检查，不能盲目重试覆盖。仅在请求发送前的连接/TLS 失败时自动重试，不自动重复任意失败的写入。

发布后检查 public 可见性、默认 main、源码/标签提交与批准提交一致，未登录时 README 与五个附件均可访问、下载，下载内容与本地校验值一致。更新本地 origin/main 及版本标签记录；保留旧 v1.0.0 发行和附件。

## 许可与维护

保持公众主许可、上游 MIT、第三方署名和独立 CLA；普通下载及使用不签 CLA。法定主体与贡献授权在双方私下签署记录中确认，公开包只包含协议和空白模板。

本次不新增后台爬站、在线认证、账号、遥测、云同步或付费服务。插件运行无维护者服务器或 API 账单；搜索页面变化与目录过期仍需要人工维护。不能因更新版本而凭空刷新原有官网核实日期。
