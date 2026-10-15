<p align="center"><img src="assets/brand/namefirst-512.png" width="144" height="144" alt="NameFirst NF 箭頭圖示"></p>
<h1 align="center">NameFirst</h1>
<p align="center"><strong>準確搜尋名稱，優先找到官方網站。</strong></p>

[简体中文](./README.md) · [English](./README.en.md) · [繁體中文](./README.zh-TW.md) · [日本語](./README.ja.md) · [한국어](./README.ko.md) · [Español](./README.es.md) · [Français](./README.fr.md) · [Deutsch](./README.de.md) · [Português (Brasil)](./README.pt-BR.md)

NameFirst 是桌面版 Chrome 與 Microsoft Edge 的瀏覽器擴充功能。在百度、Bing 搜尋目錄涵蓋的平台名稱時，它會在網頁結果區頂端顯示有明確標示的官方入口卡片；也能儲存個人網站，之後在本機查找。

**本文對應 1.1.0：118 個主體、173 個官方入口，新增 68 項大學生常用平台與工具，包含可畫。** 實際已發布及可下載版本，以 [Releases 發行頁](https://github.com/Thicky-han/namefirst/releases)為準。

不需要註冊 NameFirst 帳號、設定 API Key 或自行編譯。官方目錄與個人記憶在本機處理，搜尋及造訪網站仍需要網路。本專案採用非商業共享原始碼授權，摘要見下文。

**文件翻譯不代表介面已完成在地化。** 擴充功能介面目前主要為簡體中文，下文保留實際按鈕文字。名稱與別名不會自動繁簡轉換或翻譯，請使用範例原文。各語言使用相同安裝包，也不會因此增加搜尋引擎或地區支援；其他連結文件可能仍是簡體中文。

## 第一步：下載對應瀏覽器的安裝包

**一般使用者只需下載下列其中一個 ZIP。** 同時使用 Chrome 與 Edge 時，請分別下載及安裝。

| 瀏覽器 | 應下載的檔案 | 下載 |
| --- | --- | --- |
| Google Chrome | `namefirst-chrome-1.1.0.zip` | [Chrome 安裝包](https://github.com/Thicky-han/namefirst/releases/download/v1.1.0/namefirst-chrome-1.1.0.zip) |
| Microsoft Edge | `namefirst-edge-1.1.0.zip` | [Edge 安裝包](https://github.com/Thicky-han/namefirst/releases/download/v1.1.0/namefirst-edge-1.1.0.zip) |

也可手動尋找附件：

1. 開啟 [NameFirst Releases](https://github.com/Thicky-han/namefirst/releases)。
2. 找到標示 **Latest** 的已發布版本，點標題進入詳細頁；若尚無 1.1.0，使用當時已發布版本及其對應檔名。
3. 向下捲動至 **Assets**；若清單已收合，點小箭頭展開。
4. 點選 `namefirst-chrome-版本號.zip` 或 `namefirst-edge-版本號.zip`，等待下載完成。

以下檔案不是一般安裝包：

| 檔案 | 用途 |
| --- | --- |
| `namefirst-source-1.1.0.zip` | 給開發者的完整可修改原始碼與建置材料 |
| `Source code (zip)` / `Source code (tar.gz)` | GitHub 自動提供的原始碼快照，無法直接當作已建置的擴充功能載入 |
| `release-manifest.json`、`SHA256SUMS.txt` | 版本、來源與檔案完整性核對 |

綠色 **Code → Download ZIP** 下載的也是原始碼；安裝請用瀏覽器專用 ZIP。

## 第二步：完整解壓縮，找到 extension 資料夾

1. 在檔案總管中找到下載的 ZIP，通常在「下載」資料夾。
2. 按右鍵選 **「全部解壓縮」**或系統的同等功能；僅開啟壓縮檔瀏覽內容並不算解壓縮。
3. 將解壓縮後的資料夾放在長期保留的位置。瀏覽器安裝後仍會讀取這些檔案，請勿刪除或任意移動。
4. 開啟解壓縮目錄，找到 **`extension`** 資料夾。

兩個安裝包的結構相同：

```text
namefirst-chrome-1.1.0/
├─ extension/                 ← 下一步選擇此資料夾
│  ├─ manifest.json
│  ├─ icons/
│  ├─ pages/
│  └─ scripts/
├─ INSTALL.md
├─ PRIVACY.md
└─ ...
```

**必須選擇直接包含 `manifest.json` 的資料夾。** 不要選 ZIP、最外層目錄、`scripts` 或清單檔案本身。

## 第三步：在瀏覽器載入 NameFirst

### Chrome

1. 開啟 Chrome 新分頁。
2. 在瀏覽器網址列輸入 `chrome://extensions`，按 Enter；不是在搜尋引擎的搜尋框輸入。
3. 開啟 **「開發人員模式」**（Developer mode）。
4. 點 **「載入未封裝項目」**或對應的 **Load unpacked** 按鈕。
5. 選取解壓縮後的 **`extension` 資料夾**並確認。
6. 確認出現深綠 NF／淺綠箭頭圖示的 **NameFirst 1.1.0** 卡片，且已啟用。

### Microsoft Edge

1. 開啟 Edge 新分頁。
2. 在網址列輸入 `edge://extensions`，按 Enter。
3. 開啟 **「開發人員模式」**（Developer mode）；不同版面可能將開關放在側邊選單。
4. 點 **Load unpacked** 對應的載入未封裝擴充功能按鈕。
5. 選取解壓縮後的 **`extension` 資料夾**並確認。
6. 確認 **NameFirst 1.1.0** 已啟用。

請保持開發人員模式開啟並保留解壓縮檔案；更新時重新載入原有 NameFirst 卡片。本版尚未上架 Chrome／Edge 擴充功能商店，可對照 [Chrome 官方說明](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world)與 [Edge 官方說明](https://learn.microsoft.com/en-us/microsoft-edge/extensions/getting-started/extension-sideloading)。

## 第四步：試著搜尋一次

1. 若已有百度／Bing 搜尋分頁，先重新整理。
2. 開啟 [百度](https://www.baidu.com/)或 [Bing](https://www.bing.com/)，使用一般**網頁搜尋**。
3. 原樣輸入下列其中一項；範例中的「下载」是簡體中文下載意圖，不要自行改寫。

| 搜尋文字 | 預期入口 |
| --- | --- |
| `Steam` | Steam 官方商店 |
| `可画` / `Canva可画` | Canva 可畫中國大陸官網 |
| `可画下载` | Canva 可畫 Windows 官方下載頁 |
| `Zotero下载` | Zotero 官方下載頁 |
| `腾讯会议下载` | 騰訊會議官方下載中心 |
| `RStudio下载` | Posit 官方 RStudio Desktop 下載頁 |

4. 找到網頁結果區頂端的 **「NameFirst · 已核实官方入口」**卡片。卡片位於網頁結果容器內，不保證高於頁面其他位置的廣告或 AI 模組。
5. 點網站名稱進入；若有其他入口，也可點 **「官方下载页面」**等連結。

原始搜尋結果與廣告仍保留，不會自動跳轉，也不改變搜尋引擎伺服器的排序。搜尋 `Rust` 會提供程式語言及遊戲兩個選項；`Steam 使用教程` 等資訊查詢通常維持一般搜尋。

## 第五步：固定圖示與管理個人網站

1. 點瀏覽器工具列通常呈拼圖形狀的**擴充功能選單**。
2. 找到 NameFirst，選釘選或顯示於工具列。
3. 點圖示可設定總開關、百度／Bing 個別開關與回饋入口開關。
4. 點 **「管理个人记录与备份」**，即可新增、編輯、刪除、搜尋紀錄，以及匯入、匯出 JSON 備份。

未收錄網站可在支援的搜尋頁展開 **「选择并记住个人目标」**，檢查名稱、別名與 HTTPS 網址，再點 **「保存个人目标」**。之後搜尋相同名稱或別名，即可顯示標示 **「个人记忆」**的入口。個人儲存不等於官方身分認證。

最多 500 筆目標，每筆最多 10 個別名。備份上限 4,000,000 位元組且未加密，請妥善保管。Chrome 與 Edge 不會自動同步；移轉時先匯出，再於另一瀏覽器匯入並檢查預覽。匯入預設合併，取代及清空需要確認；最近一次記憶修改可復原。

## 從舊版更新至 1.1.0

以開發人員模式載入的版本不會從 GitHub 自動更新：

1. 開啟舊版 **「管理个人记录与备份」**，先匯出紀錄，儲存編輯內容後關閉管理頁。
2. 下載對應瀏覽器的新版 ZIP，完整解壓縮至另一資料夾。
3. 找到原先安裝使用的舊 **`extension` 資料夾**，保持路徑不變。
4. 將新版 `extension` **裡面的全部內容**複製到舊 `extension` 裡，同名檔案選取取代。不要形成 `extension/extension/manifest.json`。
5. 開啟 `chrome://extensions` 或 `edge://extensions`，在**原有** NameFirst 卡片按「重新載入」或圓形箭頭。
6. 確認同一張卡片顯示 **1.1.0**，重新整理搜尋頁並檢查個人紀錄仍在。

更新前不要移除舊擴充功能。穩定 ID 為 `kocncgipjlmfdlhabchnbnjgahlpfjkc`，正常原地取代並重新載入會沿用身分。移除、清除瀏覽器設定檔或改變擴充功能身分可能遺失本機紀錄；更換電腦或設定檔時請透過 JSON 備份移轉。

## 常見問題

| 狀況 | 處理方式 |
| --- | --- |
| 找不到下載附件 | 進入發行詳細頁，捲到 Assets 並展開；不要從原始碼清單找安裝包 |
| 找不到 manifest／載入失敗 | 完整解壓縮並選直接包含 `manifest.json` 的資料夾；確認是瀏覽器成品包 |
| 工具列沒有圖示 | 在擴充功能選單找到 NameFirst 並釘選 |
| 搜尋沒有卡片 | 重新整理、檢查擴充功能及引擎開關，先於一般網頁結果搜尋 `Steam`；驗證碼、圖片、新聞、影片和獨立 AI 頁不在適配範圍 |
| 某工具沒有官方卡片 | 僅匹配收錄名稱、別名與子入口，見 [CATALOG.md](./CATALOG.md)；未收錄者可存為個人目標 |
| 沒有下載入口 | 下載頁須另行核對；收錄廠商不代表涵蓋全部產品，也不會猜測安裝檔網址 |
| 更新後仍是舊版 | 確認替換原安裝目錄、重新載入原卡片，再重新整理搜尋頁 |
| 無法開啟開發人員模式 | 若瀏覽器由學校或公司管理，請洽管理員確認是否允許本機擴充功能 |
| 網站無法開啟或要求登入 | 官網身分不保證各地可連線、免帳號或免費；請遵循網站本身的要求 |

其他問題可至 [Issues](https://github.com/Thicky-han/namefirst/issues)附上瀏覽器與擴充功能版本、搜尋引擎及重現步驟；勿上傳個人備份、憑證或敏感頁面。下載與使用不需 GitHub 帳號，提 Issue／PR 則遵循 GitHub 帳號流程。

## 功能範圍與隱私

新增 68 項涵蓋教學、學籍升學、學術資料、寫作、辦公協作、資料分析、工程設計、創作、AI、翻譯、瀏覽器與工具。累計 **118 個主體、173 個入口**；官網、商店、下載和文件分別記錄，來源見 [CATALOG.md](./CATALOG.md)。

「已核實」表示製作目錄時以官方頁面或明確官方交叉連結核對，**不是每次搜尋即時連網認證，也不是軟體安全認證**。不會背景爬站、下載目錄更新、線上訓練、上傳個人回饋或蒐集全部搜尋紀錄。有效期為 180 天，逾期須由維護者複核並發行更新；個人確認不會刷新官方核實日期。

僅在支援的桌面百度／Bing 搜尋頁執行，紀錄保存在目前瀏覽器設定檔。不需專案帳號、維護者伺服器、付費 API 或雲端訓練；目標網站仍可要求登入、訂閱或校園授權。見 [PRIVACY.md](./PRIVACY.md)。

已驗證範圍為 Windows 桌面 Chrome／Edge，未逐一驗證其他系統、所有歷史版本及各地實驗頁面。受控測試與真實線上人工回饋分別記錄於 [VERIFICATION.md](./VERIFICATION.md)與 [PRE_RELEASE_CHECK.md](./PRE_RELEASE_CHECK.md)。

## 授權、貢獻與來源

NameFirst 原創部分採 **NameFirst Noncommercial Reciprocal License 1.0**，允許免費使用、修改、散布及企業內部免費使用；銷售、收費服務、廣告與其他營利需另行授權。散布須免費公開對應原始碼和必要建置材料，適用範圍內的修改沿用同一授權；私人本機修改無須公開。

這是**非商業共享原始碼**專案，並非 OSI 認可的開放原始碼授權。本文僅為摘要，以正式 [LICENSE](./LICENSE) 為準，範圍見 [LICENSE_SCOPE.md](./LICENSE_SCOPE.md)。一般安裝使用不需簽 CLA。

原創貢獻依 [CONTRIBUTING.md](./CONTRIBUTING.md)另行確認 [CLA](./CLA.md)。貢獻者保留著作權，可向私下明確確認的接收方授予商業使用、閉源散布與再授權權利。公開關聯帳號為 `Thicky-han`，法定身分與簽署副本不公開；未簽署的貢獻、上游及第三方不自動納入，見 [CLA_GUIDE.md](./CLA_GUIDE.md)。

本儲存庫是 [uBlacklist](https://github.com/iorate/ublacklist) 的真實 GitHub fork，基線為 `v10.1.2`／`212384b330002a4c727b034806826e2eb352d7d5`。上游原始碼在 `extension/`，builtin 固定為 `c8bd5b7113dc1d416fa00c45509ac308619751df` 並展開為一般檔案；main 保留實際上游祖先關係。

上游 MIT、第三方授權與署名均保留，不能將整包稱為 MIT。成品附公眾授權、`UPSTREAM-LICENSE.txt`、來源及相依套件聲明，見 [MODIFICATIONS.md](./MODIFICATIONS.md)、[NOTICE](./NOTICE)、[UPSTREAM.json](./UPSTREAM.json)。

<details>
<summary>開發者：從原始碼建置與驗證</summary>

一般使用者請用瀏覽器 ZIP。開發者需 PowerShell 7、Node.js 與 pnpm，在專案根目錄執行：

```powershell
./scripts/Build.ps1 -InstallDependencies
./scripts/Package.ps1
./scripts/Verify-Package.ps1
./scripts/Audit-Runtime.ps1
node scripts/check-public-content.mjs
node scripts/check-release-content.mjs
```

正式發行包須從已提交的本機 `main` 產生。在 `extension/` 執行：

```powershell
$env:CI = 'true'
$env:LEFTHOOK = '0'
pnpm check
pnpm test
pnpm exec playwright test --config e2e/namefirst/playwright.config.ts
```

上游 devEngines 指定 Node 26.10.0，本機工具入口使用宿主 Node 24 與 pnpm 11。獨立 `--namefirst` 模式保留上游預設建置模式；勿更改穩定公鑰或將上游預設產物當成 NameFirst。

測試使用獨立暫存瀏覽器設定檔；相依套件、快取、產生的報告與設定檔不提交或打包。靜態掃描無法保證發現所有未知形式的機密。維護與發行見 [PUBLISHING.md](./PUBLISHING.md)。

</details>

更多文件：[安裝](./INSTALL.md) · [目錄](./CATALOG.md) · [發行說明](./RELEASE_NOTES.md) · [驗證](./VERIFICATION.md) · [需求規劃](./PROJECT_SPEC.md) · [實作計畫](./IMPLEMENTATION_PLAN.md)。歷史報告保留當時狀態，最新發行狀態以 Releases 為準。
