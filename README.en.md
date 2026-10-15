<p align="center"><img src="assets/brand/namefirst-512.png" width="144" height="144" alt="NameFirst NF arrow icon"></p>
<h1 align="center">NameFirst</h1>
<p align="center"><strong>Search a name. Find the official site first.</strong></p>

[简体中文](./README.md) · [English](./README.en.md) · [繁體中文](./README.zh-TW.md) · [日本語](./README.ja.md) · [한국어](./README.ko.md) · [Español](./README.es.md) · [Français](./README.fr.md) · [Deutsch](./README.de.md) · [Português (Brasil)](./README.pt-BR.md)

NameFirst is a desktop browser extension for Chrome and Microsoft Edge. When you search Baidu or Bing for a platform name covered by its directory, it shows a clearly labeled official-site card at the top of the web-results container. You can also save personal websites and recall them locally.

**This guide covers 1.1.0: 118 subjects and 173 official entries, including 68 newly added platforms and tools commonly used by university students, such as Canva 可画.** Check [Releases](https://github.com/Thicky-han/namefirst/releases) for the versions actually published and available to download.

You do not need a NameFirst account, an API key, or a source build. The directory and personal memories are processed locally; searching and visiting websites require an internet connection. NameFirst uses a noncommercial source-available license, summarized below.

**Documentation language and interface language are separate.** The extension interface is currently mainly Simplified Chinese. This guide includes the Chinese button labels you will see. Names and aliases are not translated automatically: use the exact supported queries in the examples. Translated guides do not add search-engine or regional support, and all languages use the same browser packages. Other linked project documents may still be in Chinese.

## Step 1: Download the package for your browser

**For normal installation, download just one of these ZIP files.** If you use both browsers, download and install each package separately.

| Browser | File to download | Link |
| --- | --- | --- |
| Google Chrome | `namefirst-chrome-1.1.0.zip` | [Download for Chrome](https://github.com/Thicky-han/namefirst/releases/download/v1.1.0/namefirst-chrome-1.1.0.zip) |
| Microsoft Edge | `namefirst-edge-1.1.0.zip` | [Download for Edge](https://github.com/Thicky-han/namefirst/releases/download/v1.1.0/namefirst-edge-1.1.0.zip) |

To find the files yourself:

1. Open [NameFirst Releases](https://github.com/Thicky-han/namefirst/releases).
2. Open the published release marked **Latest**. If 1.1.0 is not listed yet, use the version actually published and its corresponding filenames.
3. Scroll to **Assets**. Click its small arrow to expand the list if necessary.
4. Click `namefirst-chrome-VERSION.zip` or `namefirst-edge-VERSION.zip` for your browser and wait for the download to finish.

These other files are not needed for normal installation:

| File | Purpose |
| --- | --- |
| `namefirst-source-1.1.0.zip` | Complete editable source and build materials for developers |
| GitHub's `Source code (zip)` / `Source code (tar.gz)` | Repository snapshots; cannot be loaded directly as a built extension |
| `release-manifest.json`, `SHA256SUMS.txt` | Version, provenance and file-integrity checks |

The green **Code → Download ZIP** button also downloads source code. Use the browser-specific ZIP above to install NameFirst.

## Step 2: Extract everything and find the extension folder

1. Find the downloaded ZIP in your file manager, usually under Downloads.
2. Right-click it and choose **Extract All**, or your system's equivalent. Opening the ZIP without extracting it is not enough.
3. Keep the extracted folder in a permanent location. The browser continues to read these files after installation; do not delete or move them casually.
4. Open the extracted folder and locate **`extension`**.

Both browser packages have this structure:

```text
namefirst-chrome-1.1.0/
├─ extension/                 ← Select this folder in the next step
│  ├─ manifest.json
│  ├─ icons/
│  ├─ pages/
│  └─ scripts/
├─ INSTALL.md
├─ PRIVACY.md
└─ ...
```

**Select the folder that directly contains `manifest.json`.** Do not select the ZIP, the outer folder, `scripts`, or the manifest file itself.

## Step 3: Load NameFirst in your browser

### Google Chrome

1. Open a new Chrome tab.
2. Type `chrome://extensions` in the browser's address bar and press Enter. Do not type it into a search-engine search box.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the extracted **`extension` folder** and confirm the folder selection.
6. Look for the **NameFirst** card with the dark green NF / light green arrow icon. Check that the version is **1.1.0** and the extension is enabled.

### Microsoft Edge

1. Open a new Edge tab.
2. Type `edge://extensions` in the address bar and press Enter.
3. Enable **Developer mode**, which may be inside the side menu depending on the layout.
4. Click **Load unpacked**.
5. Select the extracted **`extension` folder** and confirm.
6. Check that **NameFirst 1.1.0** appears and is enabled.

Keep Developer mode enabled and retain the extracted files. For later updates, reload the existing NameFirst extension card.

This version is installed as an unpacked extension and is not listed in the Chrome or Edge extension store. See the official [Chrome instructions](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world) and [Edge instructions](https://learn.microsoft.com/en-us/microsoft-edge/extensions/getting-started/extension-sideloading).

## Step 4: Try a search

1. Refresh any Baidu/Bing search tabs that were already open.
2. Open [Baidu](https://www.baidu.com/) or [Bing](https://www.bing.com/) and use ordinary **web search**.
3. Search for one of these exact examples. Keep the Chinese characters where shown; `下载` means “download.”

| Query | Expected NameFirst entry |
| --- | --- |
| `Steam` | Official Steam store |
| `可画` / `Canva可画` | Canva 可画 website for mainland China |
| `可画下载` | Official Canva 可画 download page for Windows |
| `Zotero下载` | Official Zotero download page |
| `腾讯会议下载` | Official Tencent Meeting download center |
| `RStudio下载` | Posit's official RStudio Desktop download page |

4. Find the **“NameFirst · 已核实官方入口”** card (“reviewed official entry”) at the top of the web-results container. It does not necessarily appear above ads or AI modules elsewhere on the page.
5. Click the website name to visit it. Additional reviewed entries may appear as links such as **“官方下载页面”** (“official download page”).

Original results and ads remain visible. NameFirst does not redirect you automatically or change the search engine's server-side rankings. Searching `Rust` presents the programming language and game as alternatives. Informational queries such as `Steam 使用教程` generally remain ordinary searches.

## Step 5: Pin the icon and manage personal websites

1. Open the browser's **Extensions** menu, usually shown as a puzzle piece.
2. Find NameFirst and choose **Pin** or **Show in toolbar**.
3. Click its icon to access the main switch, separate Baidu/Bing switches and the feedback-entry switch.
4. Click **“管理个人记录与备份”** (“manage personal records and backups”) to add, edit, delete or search records, and import or export JSON backups.

For an unlisted website, expand **“选择并记住个人目标”** (“choose and remember a personal target”) on a supported search page. Check the name, aliases and HTTPS address, then click **“保存个人目标”** (“save personal target”). Future searches for that name or a saved alias can show an entry labeled **“个人记忆”** (“personal memory”). Saving a target does not certify its official identity.

You can save up to 500 targets, with up to 10 aliases each. Backups are unencrypted and limited to 4,000,000 bytes; keep them safe. Chrome and Edge do not sync automatically. To migrate, export from one browser, import into the other and review the preview. Import merges by default; replacing or clearing records requires confirmation. The most recent memory change can be undone.

## Update an existing installation to 1.1.0

Unpacked installations do not update automatically from GitHub:

1. Open the old version's **“管理个人记录与备份”**, export your records, save any edits, then close the management page.
2. Download the new ZIP for your browser and fully extract it into a separate folder.
3. Locate the **old `extension` folder** used for your existing installation. Keep that path unchanged.
4. Copy **all contents inside** the new `extension` folder into the old `extension` folder, replacing files with the same names. Do not create `extension/extension/manifest.json`.
5. Open `chrome://extensions` or `edge://extensions` and click **Reload** or the circular-arrow button on the **existing** NameFirst card.
6. Check that the same card now shows **1.1.0**, refresh your search pages and confirm that your personal records remain.

Do not uninstall the old extension first. Its stable ID is `kocncgipjlmfdlhabchnbnjgahlpfjkc`; normal in-place replacement and reload retain that identity. Uninstalling, clearing a browser profile or changing the extension identity can lose local records. Use JSON backups when moving computers or profiles.

## Troubleshooting

| Problem | What to check |
| --- | --- |
| Cannot find downloads | Open a release's detail page, scroll to Assets and expand it; packages are not in the repository's source-file listing |
| Missing manifest / extension cannot load | Extract the ZIP fully and select the folder directly containing `manifest.json`; use a browser package, not source code |
| No toolbar icon | Find NameFirst in the Extensions menu and pin it |
| No search card after installation | Refresh the page, check extension/engine switches, then try `Steam` in ordinary web results; CAPTCHA, image, news, video and standalone AI pages are outside this version's scope |
| A tool has no official card | Only recorded names, aliases and subentries match; see [CATALOG.md](./CATALOG.md), or save a personal target |
| A download entry is missing | Download pages need separate review; listing a vendor does not cover all its products or imply guessed installer URLs |
| Still seeing the old version | Replace files in the original installation folder, reload the existing card and refresh search pages |
| Developer mode is unavailable | If your school or employer manages the browser, ask the administrator whether local extensions are permitted |
| A destination fails to open or requires login | An official identity does not imply access in every region, no account requirements or free use; follow the site's own requirements |

For further help, open an [Issue](https://github.com/Thicky-han/namefirst/issues) with browser/extension versions, search engine and reproduction steps. Do not upload personal backups, credentials or sensitive pages. Downloading and using NameFirst does not require a GitHub account; submitting Issues or PRs follows GitHub's account requirements.

## Scope and privacy

The 68 additions cover education, student services, academic research, writing, office collaboration, data analysis, engineering, creative work, AI, translation, browsers and utilities. The directory has **118 subjects and 173 entries**, with separate records for websites, stores, downloads and documentation. Sources are in [CATALOG.md](./CATALOG.md).

“Reviewed” means checked against official pages or explicit official cross-links when the directory was prepared. **It is not live verification on each search or software-security certification.** The extension does not crawl sites in the background, fetch directory updates, train online, upload personal feedback or collect your entire search history. Review validity is 180 days; expired records require maintainer review and a new release. Personal confirmation does not refresh official review dates.

NameFirst runs only on supported desktop Baidu/Bing search pages. Personal data stays in the current browser profile. No project account, developer-hosted server, paid API or cloud training is needed. Destination sites retain their own login, subscription and campus-license requirements. See [PRIVACY.md](./PRIVACY.md).

Testing was performed on Windows desktop Chrome/Edge; other systems, all historical versions and every regional experiment have not been individually verified. Controlled browser tests and live manual feedback are recorded separately in [VERIFICATION.md](./VERIFICATION.md) and [PRE_RELEASE_CHECK.md](./PRE_RELEASE_CHECK.md).

## License, contributions and origin

Original NameFirst work uses the **NameFirst Noncommercial Reciprocal License 1.0**. It permits free use, modification and distribution, including free internal business use. Sales, paid services, advertising and other monetization require separate authorization. Distribution requires free public access to corresponding source and necessary build materials; covered modifications keep the same license. Private local modifications need not be published.

This is a **noncommercial source-available** project, not OSI-licensed open source. This description is a summary; the formal [LICENSE](./LICENSE) governs. See [LICENSE_SCOPE.md](./LICENSE_SCOPE.md). Normal installation and use do not require signing a CLA.

Original contributions follow [CONTRIBUTING.md](./CONTRIBUTING.md) and a separately accepted [CLA](./CLA.md). Contributors retain copyright and may grant commercial use, closed-source distribution and sublicensing rights to a recipient identified privately. The public project account is `Thicky-han`; legal identities and executed agreements are private. Unsigned contributions, upstream work and third-party work are not automatically covered. See [CLA_GUIDE.md](./CLA_GUIDE.md).

This repository is a real GitHub fork of [uBlacklist](https://github.com/iorate/ublacklist), pinned to `v10.1.2` / `212384b330002a4c727b034806826e2eb352d7d5`. Upstream source is in `extension/`; builtin is pinned to `c8bd5b7113dc1d416fa00c45509ac308619751df` and included as ordinary files. The main branch retains the pinned upstream's actual ancestry.

Upstream MIT licenses, third-party licenses and attribution remain intact. The whole package must not be described as MIT. Packages include the public license, `UPSTREAM-LICENSE.txt`, provenance and dependency notices. See [MODIFICATIONS.md](./MODIFICATIONS.md), [NOTICE](./NOTICE) and [UPSTREAM.json](./UPSTREAM.json).

<details>
<summary>Developers: build and verify from source</summary>

Ordinary users should use the browser ZIP above. Developers need PowerShell 7, Node.js and pnpm. Run from the project root:

```powershell
./scripts/Build.ps1 -InstallDependencies
./scripts/Package.ps1
./scripts/Verify-Package.ps1
./scripts/Audit-Runtime.ps1
node scripts/check-public-content.mjs
node scripts/check-release-content.mjs
```

Generate formal release packages from committed local `main`. In `extension/`, run:

```powershell
$env:CI = 'true'
$env:LEFTHOOK = '0'
pnpm check
pnpm test
pnpm exec playwright test --config e2e/namefirst/playwright.config.ts
```

Upstream devEngines specify Node 26.10.0; local tool entry points use host Node 24 and pnpm 11. The separate `--namefirst` build mode preserves upstream's default mode. Do not change the stable public key or treat an upstream default build as NameFirst.

Tests use separate temporary browser profiles. Dependencies, caches, generated reports and profiles are not committed or packaged. Static scanning cannot guarantee detection of all unknown secrets. See [PUBLISHING.md](./PUBLISHING.md) for maintenance and release steps.

</details>

More: [Installation](./INSTALL.md) · [Directory](./CATALOG.md) · [Release notes](./RELEASE_NOTES.md) · [Verification](./VERIFICATION.md) · [Specification](./PROJECT_SPEC.md) · [Implementation plan](./IMPLEMENTATION_PLAN.md). Historical reports describe their original versions; Releases shows current publication status.
