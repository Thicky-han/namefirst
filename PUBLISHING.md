# NameFirst 首版发布流程

目标仓库为 [Thicky-han/namefirst](https://github.com/Thicky-han/namefirst)，公开、真正的 [iorate/ublacklist](https://github.com/iorate/ublacklist) fork。首版为 `1.0.0`，发布分支为 `main`。本地源码保留上游固定提交的真实祖先关系，并使用公开 GitHub 用户名与 noreply 邮箱提交；不公开私人身份或签署记录。

## 准备和确认边界

发行前完成图标应用、README、源码与成品内容检查、构建、测试、打包和校验。详细范围见 [PRE_RELEASE_CHECK.md](./PRE_RELEASE_CHECK.md)。GitHub Actions 已关闭，未配置收费服务、定时任务或签署机器人。

创建 fork 不代表 NameFirst 首版已经发布。准备阶段远端保留继承的上游分支；只有维护者确认具体源码提交和发行文件后，才上传 `main`、设置默认分支、创建 `v1.0.0` 标签和发布 Release。是否已经发布，以 GitHub 实际分支及 [Releases](https://github.com/Thicky-han/namefirst/releases) 为准。

## 本地构建和检查

在项目根目录使用 PowerShell 7：

```powershell
./scripts/Package.ps1
./scripts/Verify-Package.ps1
./scripts/Audit-Runtime.ps1
node scripts/check-public-content.mjs
node scripts/check-release-content.mjs
```

构建需要 Node.js 及 pnpm，首次先按 README 安装锁定依赖。先把完整可修改源码提交到本地 `main`，再打包，避免元数据指向旧提交。修改源码或发布正文后，需要重新提交、打包和验证。

`release/1.0.0/` 中提供五个文件：Chrome ZIP、Edge ZIP、对应完整源码 ZIP、`release-manifest.json` 和 `SHA256SUMS.txt`。元数据记录源码提交、分支、稳定扩展 ID、目录版本和文件校验值。`publicReleaseCreated: false` 表示打包时尚未公开发行，不是 GitHub 当前状态查询。

源码包包含固定上游源码、展开的 builtin、锁文件、构建材料、许可和测试；排除依赖、构建缓存、浏览器配置、个人备份、私钥和私下 CLA 记录。上游 `extension/release/` 内的脚本和说明属于源码，仍保留。消费者 ZIP 解压后的 `extension` 文件夹可直接加载，不需要编译。

## 确认后的发布

准备脚本 `scripts/publish-release.mjs` 默认只显示待发布信息，不上传。确认时应记录实际审核的完整提交哈希，执行：

```powershell
node scripts/publish-release.mjs --confirm-public-release --expected-commit=<已确认的完整提交哈希>
```

脚本要求干净的 `main`、正确仓库及与该提交一致的附件。通过 GitHub Git API 上传源码对象，逐项核对远端树和提交哈希等于本地已确认对象；随后创建 `main` 并设为默认分支，不覆盖已有不同提交，也不强推。此路径用于直接 Git 连接不可用的环境，保留真实 Git 提交和上游祖先关系。

随后建立指向该提交的 `v1.0.0` 标签，以 RELEASE_NOTES.md 为正文创建草稿，上传五个附件，核对附件名称、大小和 GitHub 返回的 SHA-256 后才公开发行。遇到已有标签、不同的远端 main 或同版本 Release，先检查，不自动覆盖。失败时保留可检查的状态，不能盲目重复执行。

发布后检查 main、标签、正文和附件，确认未登录也能下载源码及安装包。根目录的主许可、上游 MIT、第三方声明、CLA 及贡献说明必须保留。普通下载和使用不需要签署 CLA；真实接收方及贡献者身份仅在双方私下签署记录中确认。

## 成本与维护

插件运行不需要维护者服务器、数据库、域名、付费 API 或云训练；用户下载、搜索和浏览网站需要网络。当前使用开发者模式安装，未发布到浏览器商店。

没有固定服务成本仍需要人工维护：搜索页面变化、浏览器变化和官网目录过期需要核查并发布更新。不能为发布新版本凭空刷新官网核实日期。
