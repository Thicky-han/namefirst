<p align="center"><img src="assets/brand/namefirst-512.png" width="144" height="144" alt="NameFirst NF 矢印アイコン"></p>
<h1 align="center">NameFirst</h1>
<p align="center"><strong>名前で検索して、公式サイトへ。</strong></p>

[简体中文](./README.md) · [English](./README.en.md) · [繁體中文](./README.zh-TW.md) · [日本語](./README.ja.md) · [한국어](./README.ko.md) · [Español](./README.es.md) · [Français](./README.fr.md) · [Deutsch](./README.de.md) · [Português (Brasil)](./README.pt-BR.md)

NameFirst は、デスクトップ版 Chrome と Microsoft Edge 向けの拡張機能です。Baidu または Bing で登録済みのサービス名を検索すると、ウェブ検索結果の領域の先頭に、公式サイトへのカードを明確なラベル付きで表示します。個人用のサイトを保存し、ローカルで呼び出すこともできます。

**この説明は 1.1.0 に対応しています。118 のサービス・製品、173 の公式エントリを収録し、大学生によく使われる 68 項目（Canva 可画を含む）を追加しています。** 実際の公開状況とダウンロード可能なバージョンは [Releases](https://github.com/Thicky-han/namefirst/releases) を確認してください。

NameFirst のアカウント、API キー、自分でのビルドは不要です。ディレクトリと個人データはローカルで処理しますが、検索やサイトの閲覧にはインターネット接続が必要です。ライセンスは非商用のソース公開型です。

**説明書の翻訳と拡張機能の表示言語は別です。** 拡張機能の画面は現在、主に簡体字中国語です。以下では実際の中国語ラベルも記載します。検索名や別名は自動翻訳されないため、例の文字列をそのまま使ってください。翻訳によって検索エンジンや地域の対応範囲は増えません。全言語で同じパッケージを使い、リンク先の補足資料は中国語の場合があります。

## 手順 1：ブラウザーに合った ZIP をダウンロード

**通常のインストールに必要なのは、次の ZIP のどちらか 1 つです。** 両方のブラウザーを使う場合は、それぞれダウンロードして個別にインストールします。

| ブラウザー | ファイル | ダウンロード |
| --- | --- | --- |
| Google Chrome | `namefirst-chrome-1.1.0.zip` | [Chrome 版](https://github.com/Thicky-han/namefirst/releases/download/v1.1.0/namefirst-chrome-1.1.0.zip) |
| Microsoft Edge | `namefirst-edge-1.1.0.zip` | [Edge 版](https://github.com/Thicky-han/namefirst/releases/download/v1.1.0/namefirst-edge-1.1.0.zip) |

リリース画面から探す場合：

1. [NameFirst Releases](https://github.com/Thicky-han/namefirst/releases) を開きます。
2. **Latest** の付いた公開済みリリースを開きます。1.1.0 がまだなければ、実際に公開されているバージョンのファイルを選びます。
3. 下へスクロールして **Assets** を開きます。折りたたまれていれば横の矢印を押します。
4. ブラウザーに合う `namefirst-chrome-バージョン.zip` または `namefirst-edge-バージョン.zip` をクリックし、完了を待ちます。

次のファイルは通常のインストールには不要です。

| ファイル | 用途 |
| --- | --- |
| `namefirst-source-1.1.0.zip` | 開発者向けの変更可能な全ソースとビルド資料 |
| `Source code (zip)` / `Source code (tar.gz)` | GitHub のソーススナップショット。そのまま完成済み拡張機能としては読み込めません |
| `release-manifest.json`、`SHA256SUMS.txt` | バージョン、出所、ファイルの整合性の確認 |

緑の **Code → Download ZIP** もソースのダウンロードです。インストールにはブラウザー専用 ZIP を使ってください。

## 手順 2：すべて展開して extension フォルダーを探す

1. 通常は「ダウンロード」にある ZIP をファイル管理画面で探します。
2. 右クリックして **「すべて展開」**、または OS の同等機能を使います。ZIP 内を閲覧するだけでは不十分です。
3. 展開したファイルを、今後も残しておく場所に置きます。ブラウザーはインストール後も参照するため、削除や安易な移動は避けてください。
4. 展開先の中にある **`extension` フォルダー**を探します。

Chrome 版と Edge 版の構成は同じです。

```text
namefirst-chrome-1.1.0/
├─ extension/                 ← 次の手順でこのフォルダーを選択
│  ├─ manifest.json
│  ├─ icons/
│  ├─ pages/
│  └─ scripts/
├─ INSTALL.md
├─ PRIVACY.md
└─ ...
```

**`manifest.json` が直下にあるフォルダーを選びます。** ZIP、外側のフォルダー、`scripts`、manifest ファイル自体は選びません。

## 手順 3：ブラウザーに読み込む

### Chrome

1. 新しいタブを開きます。
2. ブラウザーのアドレスバーに `chrome://extensions` を入力し Enter を押します。検索サイトの検索欄ではありません。
3. **デベロッパー モード（Developer mode）**を有効にします。
4. **「パッケージ化されていない拡張機能を読み込む」**（Load unpacked）をクリックします。
5. 展開した **`extension` フォルダー**を選択して確定します。
6. 濃緑の NF と薄緑の矢印の **NameFirst** カードを確認します。バージョンが **1.1.0** で、有効になっていることを確かめます。

### Microsoft Edge

1. 新しいタブを開き、アドレスバーに `edge://extensions` を入力して Enter を押します。
2. **開発者モード（Developer mode）**を有効にします。レイアウトによりサイドメニュー内にあります。
3. **Load unpacked** に相当する展開済み拡張機能の読み込みボタンをクリックします。
4. 展開した **`extension` フォルダー**を選んで確定します。
5. **NameFirst 1.1.0** が表示され、有効であることを確認します。

開発者モードは有効のままにして、展開したファイルも残してください。更新は既存の NameFirst カードから再読み込みします。本版は Chrome／Edge ストアでは未配布です。[Chrome 公式手順](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world)と [Edge 公式手順](https://learn.microsoft.com/en-us/microsoft-edge/extensions/getting-started/extension-sideloading)も参照できます。

## 手順 4：検索して確認

1. すでに開いていた Baidu／Bing の検索タブを再読み込みします。
2. [Baidu](https://www.baidu.com/) または [Bing](https://www.bing.com/) の通常の**ウェブ検索**を使います。
3. 次の文字列をそのまま検索します。`下载` は中国語の「ダウンロード」です。

| 検索文字列 | 表示される入口 |
| --- | --- |
| `Steam` | Steam 公式ストア |
| `可画` / `Canva可画` | 中国本土向け Canva 可画公式サイト |
| `可画下载` | Canva 可画 Windows 版公式ダウンロード |
| `Zotero下载` | Zotero 公式ダウンロード |
| `腾讯会议下载` | Tencent Meeting 公式ダウンロードセンター |
| `RStudio下载` | Posit の RStudio Desktop 公式ダウンロード |

4. ウェブ結果領域の先頭に **「NameFirst · 已核实官方入口」**（確認済み公式入口）カードを探します。ページ内の別の広告や AI モジュールより上になる保証はありません。
5. サイト名、または **「官方下载页面」**（公式ダウンロードページ）などの追加リンクをクリックします。

元の結果や広告は残ります。自動転送も検索サーバー側の順位変更も行いません。`Rust` はプログラミング言語とゲームを候補として表示し、`Steam 使用教程` のような情報検索は通常の検索のままです。

## 手順 5：アイコンの固定と個人サイトの管理

1. ツールバーのパズル形の**拡張機能メニュー**を開きます。
2. NameFirst を固定、またはツールバーに表示します。
3. アイコンから全体、Baidu／Bing 別、フィードバック入口の各スイッチを操作できます。
4. **「管理个人记录与备份」**（個人記録とバックアップ）で追加・編集・削除・検索、JSON のインポート／エクスポートを行えます。

未登録のサイトは、対応検索ページで **「选择并记住个人目标」**を開き、名前・別名・HTTPS アドレスを確認して **「保存个人目标」**を押します。次回から同じ名前や保存済み別名で **「个人记忆」**（個人記憶）として表示できます。個人の保存は公式であることの認証ではありません。

保存上限は 500 件、別名は各 10 個です。バックアップは最大 4,000,000 バイトで暗号化されません。Chrome と Edge は自動同期しません。移行はエクスポート後、別ブラウザーでインポートしてプレビューを確認します。既定ではマージし、置換・全削除には確認が必要です。直近 1 回の記憶変更を元に戻せます。

## 旧版から 1.1.0 への更新

展開済み拡張機能は GitHub から自動更新されません。

1. 旧版の **「管理个人记录与备份」**でエクスポートし、編集中の内容を保存して管理ページを閉じます。
2. ブラウザーに合う新版 ZIP を別フォルダーにすべて展開します。
3. 元のインストールで選んだ**旧 `extension` フォルダー**を探し、パスを変えずに使います。
4. 新しい `extension` の**中身をすべて**旧フォルダーへコピーして上書きします。`extension/extension/manifest.json` にしないでください。
5. `chrome://extensions` または `edge://extensions` の**既存の** NameFirst カードで再読み込み／円形矢印を押します。
6. 同じカードが **1.1.0** になったこと、検索ページの再読み込み後も個人記録が残ることを確認します。

先にアンインストールしないでください。固定 ID は `kocncgipjlmfdlhabchnbnjgahlpfjkc` で、同じ場所のファイル置換と再読み込みにより維持されます。アンインストール、プロファイル削除、拡張機能の識別情報の変更でローカル記録を失う場合があります。別 PC やプロファイルへの移行には JSON を使います。

## よくある問題

| 問題 | 対処 |
| --- | --- |
| 添付ファイルがない | リリース詳細の Assets を展開します。ソース一覧では探しません |
| manifest がない／読み込めない | 完全に展開し、`manifest.json` 直下のフォルダーを選択。ソースではなく完成済みブラウザー ZIP を使います |
| アイコンが見えない | 拡張機能メニューから固定します |
| カードが出ない | ページ再読み込みと各スイッチを確認し、通常のウェブ検索で `Steam` を試します。CAPTCHA、画像、ニュース、動画、独立 AI ページは対象外です |
| 特定のツールが出ない | 登録名・別名・子エントリのみ対応。[CATALOG.md](./CATALOG.md) を確認するか個人用に保存します |
| ダウンロードがない | ダウンロード先は別途確認が必要です。メーカー登録は全製品の対応を意味せず、URL を推測しません |
| 更新後も旧版 | 元のパスを上書きし、既存カードと検索ページを再読み込みします |
| 開発者モードを使えない | 学校・組織管理のブラウザーでは管理者へ利用可否を確認してください |
| サイトが開かない／ログインが必要 | 公式サイトでも地域の通信制限、アカウント、料金やライセンス条件は残ります |

[Issues](https://github.com/Thicky-han/namefirst/issues) ではブラウザーと拡張機能のバージョン、検索エンジン、再現手順を記載してください。個人バックアップ、認証情報、機密ページを載せないでください。ダウンロード・利用に GitHub アカウントは不要ですが、Issue／PR 投稿は GitHub のアカウント要件に従います。

## 範囲とプライバシー

追加 68 項目は学習・学生向けサービス・文献・執筆・共同作業・データ分析・工学・制作・AI・翻訳・ブラウザー・ユーティリティを含みます。合計 **118 主体・173 エントリ**で、公式サイト、ストア、ダウンロード、文書を別に記録します。出典は [CATALOG.md](./CATALOG.md) にあります。

「確認済み」はディレクトリ作成時に公式ページや明示的な公式リンクで確認したという意味です。**毎回の検索時に行うリアルタイム認証やソフトウェア安全認証ではありません。** バックグラウンド巡回、目録の取得、オンライン学習、個人フィードバックの送信、全検索履歴の収集は行いません。有効期間は 180 日で、期限後は管理者の再確認と更新版公開が必要です。個人の確認で公式記録の日付は更新されません。

対応デスクトップ Baidu／Bing 検索ページでのみ動作し、データは現在のブラウザープロファイルに保存されます。専用アカウント、管理者サーバー、有料 API、クラウド学習は不要です。リンク先のログイン・購読・学内ライセンスは別です。[PRIVACY.md](./PRIVACY.md) を参照してください。

検証は Windows デスクトップ Chrome／Edge で実施しました。他 OS、過去の全バージョン、地域ごとの全実験ページを個別検証したものではありません。制御したページでのテストと実際の手動確認は [VERIFICATION.md](./VERIFICATION.md) と [PRE_RELEASE_CHECK.md](./PRE_RELEASE_CHECK.md) に分けて記録しています。

## ライセンス・貢献・由来

独自部分は **NameFirst Noncommercial Reciprocal License 1.0** です。無料での利用・変更・配布、企業内での無料利用が可能です。販売、有料サービス、広告、その他の収益化は別途許可が必要です。配布時には対応するソースと必要なビルド資料を無料公開し、対象の変更には同じライセンスを適用します。私的なローカル変更は公開不要です。

**非商用のソース公開型**であり、OSI の意味でのオープンソースライセンスではありません。この説明は要約で、正式な [LICENSE](./LICENSE) が適用されます。[LICENSE_SCOPE.md](./LICENSE_SCOPE.md) も参照してください。通常利用に CLA 署名は不要です。

独自の貢献は [CONTRIBUTING.md](./CONTRIBUTING.md) に従い、別途 [CLA](./CLA.md) を確認・合意します。著作権は貢献者に残り、非公開で特定した受領者に商用利用・クローズドソース配布・再許諾の権利を付与できます。公開アカウントは `Thicky-han` で、法的身元と署名済み記録は非公開です。未署名の貢献、上流、第三者には自動適用されません。[CLA_GUIDE.md](./CLA_GUIDE.md) を参照してください。

本リポジトリは [uBlacklist](https://github.com/iorate/ublacklist) の実際の GitHub fork です。基準は `v10.1.2`／`212384b330002a4c727b034806826e2eb352d7d5`。上流ソースは `extension/`、builtin は `c8bd5b7113dc1d416fa00c45509ac308619751df` に固定し通常ファイルとして同梱しています。main は実際の上流祖先関係を保持します。

上流 MIT、第三者ライセンス、帰属表示は維持され、全体を MIT と呼ぶことはできません。パッケージには公衆向けライセンス、`UPSTREAM-LICENSE.txt`、由来・依存関係の表示を含みます。[MODIFICATIONS.md](./MODIFICATIONS.md)、[NOTICE](./NOTICE)、[UPSTREAM.json](./UPSTREAM.json) を参照してください。

<details>
<summary>開発者向け：ソースからのビルドと検証</summary>

通常利用はブラウザー ZIP で十分です。開発には PowerShell 7、Node.js、pnpm が必要です。プロジェクトのルートで実行します。

```powershell
./scripts/Build.ps1 -InstallDependencies
./scripts/Package.ps1
./scripts/Verify-Package.ps1
./scripts/Audit-Runtime.ps1
node scripts/check-public-content.mjs
node scripts/check-release-content.mjs
```

正式な配布物はコミット済みのローカル `main` から作成します。`extension/` 内で検証します。

```powershell
$env:CI = 'true'
$env:LEFTHOOK = '0'
pnpm check
pnpm test
pnpm exec playwright test --config e2e/namefirst/playwright.config.ts
```

上流 devEngines は Node 26.10.0、ローカルツール入口はホスト Node 24 と pnpm 11 を使用します。独立した `--namefirst` モードは上流の既定モードを維持します。固定公開鍵を変えたり、上流既定ビルドを NameFirst として配布したりしないでください。

テストには独立した一時プロファイルを使います。依存物・キャッシュ・生成レポート・プロファイルはコミットも同梱もしません。静的検査で未知の秘密情報をすべて検出できる保証はありません。手順は [PUBLISHING.md](./PUBLISHING.md) にあります。

</details>

資料：[インストール](./INSTALL.md) · [ディレクトリ](./CATALOG.md) · [リリースノート](./RELEASE_NOTES.md) · [検証](./VERIFICATION.md) · [仕様](./PROJECT_SPEC.md) · [実装計画](./IMPLEMENTATION_PLAN.md)。過去の報告は当時の状態を示し、公開状況は Releases を参照してください。
