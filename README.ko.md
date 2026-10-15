<p align="center"><img src="assets/brand/namefirst-512.png" width="144" height="144" alt="NameFirst NF 화살표 아이콘"></p>
<h1 align="center">NameFirst</h1>
<p align="center"><strong>이름으로 검색하고 공식 사이트부터 찾으세요.</strong></p>

[简体中文](./README.md) · [English](./README.en.md) · [繁體中文](./README.zh-TW.md) · [日本語](./README.ja.md) · [한국어](./README.ko.md) · [Español](./README.es.md) · [Français](./README.fr.md) · [Deutsch](./README.de.md) · [Português (Brasil)](./README.pt-BR.md)

NameFirst는 데스크톱 Chrome과 Microsoft Edge용 확장 프로그램입니다. Baidu나 Bing에서 목록에 등록된 플랫폼 이름을 검색하면 웹 검색 결과 영역 상단에 명확한 표시가 있는 공식 사이트 카드를 추가합니다. 개인 사이트를 저장한 뒤 로컬에서 다시 불러올 수도 있습니다.

**이 문서는 1.1.0 기준입니다. 118개 대상과 공식 진입점 173개를 제공하며, Canva 可画를 포함해 대학생이 자주 사용하는 플랫폼과 도구 68개를 추가했습니다.** 실제 공개 버전과 다운로드 가능 여부는 [Releases](https://github.com/Thicky-han/namefirst/releases)에서 확인하세요.

NameFirst 계정, API 키, 직접 빌드는 필요하지 않습니다. 목록과 개인 기록은 로컬에서 처리하며 검색과 사이트 방문에는 인터넷이 필요합니다. 비상업적 소스 공개 라이선스를 사용하며 아래에 요약이 있습니다.

**문서 번역은 확장 프로그램 화면의 번역을 뜻하지 않습니다.** 현재 화면은 주로 중국어 간체입니다. 아래 설명에는 실제 중국어 버튼 이름을 함께 적었습니다. 이름과 별칭은 자동 번역하지 않으므로 예시 검색어를 그대로 사용하세요. 모든 언어에서 같은 설치 파일을 사용하며, 번역이 검색 엔진이나 지역 지원을 추가하지는 않습니다. 연결된 보충 문서는 중국어일 수 있습니다.

## 1단계: 브라우저에 맞는 설치 파일 다운로드

**일반 사용자는 아래 ZIP 중 하나만 받으면 됩니다.** 두 브라우저를 모두 사용한다면 각각 다운로드하고 따로 설치하세요.

| 브라우저 | 파일 | 다운로드 |
| --- | --- | --- |
| Google Chrome | `namefirst-chrome-1.1.0.zip` | [Chrome용](https://github.com/Thicky-han/namefirst/releases/download/v1.1.0/namefirst-chrome-1.1.0.zip) |
| Microsoft Edge | `namefirst-edge-1.1.0.zip` | [Edge용](https://github.com/Thicky-han/namefirst/releases/download/v1.1.0/namefirst-edge-1.1.0.zip) |

파일을 직접 찾으려면:

1. [NameFirst Releases](https://github.com/Thicky-han/namefirst/releases)를 엽니다.
2. **Latest** 표시가 있는 공개 버전의 제목을 누릅니다. 아직 1.1.0이 없다면 실제로 공개된 버전과 해당 파일명을 사용하세요.
3. 아래로 내려가 **Assets**를 찾고, 접혀 있으면 옆 화살표로 펼칩니다.
4. 브라우저에 맞는 `namefirst-chrome-버전.zip` 또는 `namefirst-edge-버전.zip`을 눌러 다운로드합니다.

다음 파일은 일반 설치에 필요하지 않습니다.

| 파일 | 용도 |
| --- | --- |
| `namefirst-source-1.1.0.zip` | 개발자를 위한 수정 가능한 전체 소스와 빌드 자료 |
| `Source code (zip)` / `Source code (tar.gz)` | GitHub의 소스 스냅샷. 완성된 확장 프로그램으로 바로 불러올 수 없음 |
| `release-manifest.json`, `SHA256SUMS.txt` | 버전, 출처 및 파일 무결성 확인 |

초록색 **Code → Download ZIP**도 소스 코드입니다. 설치에는 브라우저 전용 ZIP을 사용하세요.

## 2단계: 전부 압축 해제하고 extension 폴더 찾기

1. 파일 탐색기에서 다운로드한 ZIP을 찾습니다. 보통 다운로드 폴더에 있습니다.
2. 마우스 오른쪽 버튼으로 **모두 압축 풀기** 또는 운영체제의 동등한 기능을 선택합니다. ZIP 내부를 열어 보는 것만으로는 부족합니다.
3. 압축을 푼 폴더는 계속 보관할 위치에 두세요. 설치 후에도 브라우저가 이 파일을 읽으므로 삭제하거나 함부로 옮기지 마세요.
4. 그 안에 있는 **`extension` 폴더**를 찾습니다.

두 브라우저용 ZIP의 구조는 같습니다.

```text
namefirst-chrome-1.1.0/
├─ extension/                 ← 다음 단계에서 이 폴더 선택
│  ├─ manifest.json
│  ├─ icons/
│  ├─ pages/
│  └─ scripts/
├─ INSTALL.md
├─ PRIVACY.md
└─ ...
```

**`manifest.json`이 바로 들어 있는 폴더를 선택해야 합니다.** ZIP, 가장 바깥 폴더, `scripts` 또는 manifest 파일 자체를 선택하지 마세요.

## 3단계: 브라우저에서 NameFirst 불러오기

### Chrome

1. Chrome에서 새 탭을 엽니다.
2. 검색 사이트의 검색창이 아닌 **브라우저 주소창**에 `chrome://extensions`를 입력하고 Enter를 누릅니다.
3. **개발자 모드(Developer mode)**를 켭니다.
4. **압축해제된 확장 프로그램을 로드합니다(Load unpacked)**에 해당하는 버튼을 누릅니다.
5. 압축을 푼 **`extension` 폴더**를 선택하고 확인합니다.
6. 진녹색 NF와 연녹색 화살표 아이콘의 **NameFirst** 카드가 생기는지 확인합니다. 버전이 **1.1.0**이고 활성화되어 있어야 합니다.

### Microsoft Edge

1. 새 탭의 주소창에 `edge://extensions`를 입력하고 Enter를 누릅니다.
2. **개발자 모드(Developer mode)**를 켭니다. 화면 구성에 따라 옆 메뉴에 있을 수 있습니다.
3. **압축 풀린 파일 로드(Load unpacked)**에 해당하는 버튼을 누릅니다.
4. 압축을 푼 **`extension` 폴더**를 선택하고 확인합니다.
5. **NameFirst 1.1.0**이 나타나고 활성화되었는지 확인합니다.

개발자 모드를 계속 켜 두고 압축 해제한 파일도 보관하세요. 업데이트할 때는 기존 NameFirst 카드에서 새로고침합니다. 이 버전은 Chrome/Edge 확장 스토어에 등록되지 않았습니다. [Chrome 공식 설명](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world)과 [Edge 공식 설명](https://learn.microsoft.com/en-us/microsoft-edge/extensions/getting-started/extension-sideloading)도 참고할 수 있습니다.

## 4단계: 검색해서 동작 확인하기

1. 이미 열려 있던 Baidu/Bing 검색 탭을 새로고침합니다.
2. [Baidu](https://www.baidu.com/) 또는 [Bing](https://www.bing.com/)에서 일반 **웹 검색**을 사용합니다.
3. 다음 검색어 중 하나를 그대로 입력합니다. `下载`는 중국어로 ‘다운로드’라는 뜻입니다.

| 검색어 | 표시될 공식 진입점 |
| --- | --- |
| `Steam` | Steam 공식 상점 |
| `可画` / `Canva可画` | 중국 본토용 Canva 可画 공식 사이트 |
| `可画下载` | Canva 可画 Windows 공식 다운로드 |
| `Zotero下载` | Zotero 공식 다운로드 |
| `腾讯会议下载` | Tencent Meeting 공식 다운로드 센터 |
| `RStudio下载` | Posit의 공식 RStudio Desktop 다운로드 |

4. 웹 결과 영역 상단에서 **“NameFirst · 已核实官方入口”**(확인된 공식 진입점) 카드를 찾습니다. 페이지 다른 위치의 광고나 AI 영역보다 항상 위에 표시되는 것은 아닙니다.
5. 사이트 이름이나 **“官方下载页面”**(공식 다운로드 페이지) 등의 추가 링크를 누릅니다.

원래 결과와 광고는 남아 있습니다. 자동 이동하거나 검색 서버의 순위를 바꾸지 않습니다. `Rust`를 검색하면 프로그래밍 언어와 게임 중에서 선택할 수 있습니다. `Steam 使用教程` 같은 정보 검색은 보통 기존 검색 그대로 유지됩니다.

## 5단계: 아이콘 고정 및 개인 사이트 관리

1. 브라우저 도구 모음의 퍼즐 모양 **확장 프로그램 메뉴**를 엽니다.
2. NameFirst를 찾아 고정하거나 도구 모음에 표시합니다.
3. 아이콘을 누르면 전체, Baidu/Bing 각각, 피드백 진입점의 스위치를 조절할 수 있습니다.
4. **“管理个人记录与备份”**(개인 기록 및 백업 관리)에서 기록 추가·편집·삭제·검색과 JSON 가져오기/내보내기를 할 수 있습니다.

미등록 사이트는 지원 검색 페이지의 **“选择并记住个人目标”**를 펼쳐 이름·별칭·HTTPS 주소를 확인한 뒤 **“保存个人目标”**를 누릅니다. 다음부터 같은 이름이나 저장된 별칭으로 **“个人记忆”**(개인 기억) 항목을 표시할 수 있습니다. 개인 저장은 공식 사이트 인증이 아닙니다.

최대 500개 대상, 대상별 별칭 10개를 저장할 수 있습니다. 백업은 최대 4,000,000바이트이며 암호화되지 않으므로 안전하게 보관하세요. Chrome과 Edge는 자동 동기화하지 않습니다. 내보내기 후 다른 브라우저에서 가져오고 미리보기를 확인하세요. 기본값은 병합이며 교체·전체 삭제에는 확인이 필요합니다. 가장 최근의 기억 변경 1회를 되돌릴 수 있습니다.

## 기존 설치를 1.1.0으로 업데이트

압축 해제 방식의 확장 프로그램은 GitHub에서 자동 업데이트되지 않습니다.

1. 구버전 **“管理个人记录与备份”**에서 백업을 내보내고, 편집 중인 내용을 저장한 뒤 관리 페이지를 닫습니다.
2. 새 ZIP을 받아 별도 폴더에 모두 압축 해제합니다.
3. 원래 설치할 때 선택했던 **기존 `extension` 폴더**를 찾고 경로를 유지합니다.
4. 새 `extension` **안의 모든 내용**을 기존 `extension` 안에 복사하고 같은 이름의 파일을 덮어씁니다. `extension/extension/manifest.json` 구조로 만들지 마세요.
5. `chrome://extensions` 또는 `edge://extensions`의 **기존** NameFirst 카드에서 새로고침/원형 화살표를 누릅니다.
6. 같은 카드가 **1.1.0**을 표시하는지 확인한 뒤 검색 페이지를 새로고침하고 개인 기록을 확인합니다.

먼저 구버전을 제거하지 마세요. 고정 ID는 `kocncgipjlmfdlhabchnbnjgahlpfjkc`이며 원래 위치의 파일 교체와 새로고침으로 유지됩니다. 제거, 브라우저 프로필 초기화, 확장 식별 정보 변경은 로컬 기록 손실로 이어질 수 있습니다. 다른 컴퓨터나 프로필로 이동할 때는 JSON 백업을 사용하세요.

## 자주 발생하는 문제

| 문제 | 확인할 내용 |
| --- | --- |
| 다운로드 파일을 못 찾음 | 릴리스 상세 페이지에서 Assets를 펼치세요. 저장소 소스 목록에서 찾지 마세요 |
| manifest 없음 / 로드 실패 | 완전히 압축 해제하고 `manifest.json`이 바로 있는 폴더를 선택하세요. 소스가 아닌 브라우저용 ZIP인지 확인하세요 |
| 도구 모음 아이콘 없음 | 확장 프로그램 메뉴에서 고정하세요 |
| 카드가 표시되지 않음 | 새로고침하고 확장 및 검색 엔진 스위치를 확인한 뒤 웹 검색에서 `Steam`을 시도하세요. CAPTCHA, 이미지, 뉴스, 동영상, 별도 AI 페이지는 지원 범위 밖입니다 |
| 특정 도구가 없음 | 등록 이름·별칭·하위 항목만 일치합니다. [CATALOG.md](./CATALOG.md)를 확인하거나 개인 목표로 저장하세요 |
| 다운로드 항목 없음 | 다운로드 페이지는 별도 확인이 필요합니다. 제조사 등록이 모든 제품을 뜻하지 않으며 설치 파일 URL을 추측하지 않습니다 |
| 업데이트 후에도 구버전 | 원래 설치 경로를 교체하고 기존 카드와 검색 페이지를 새로고침하세요 |
| 개발자 모드 사용 불가 | 학교·회사 관리 브라우저라면 관리자에게 로컬 확장 허용 여부를 확인하세요 |
| 사이트 접속 실패 / 로그인 요구 | 공식 사이트도 지역 접속, 계정, 구독, 라이선스 조건이 있을 수 있습니다 |

추가 문제는 [Issues](https://github.com/Thicky-han/namefirst/issues)에 브라우저·확장 버전, 검색 엔진과 재현 절차를 적어 주세요. 개인 백업, 인증 정보, 민감한 페이지는 올리지 마세요. 다운로드와 사용에는 GitHub 계정이 필요 없지만 Issue/PR 제출은 GitHub 계정 절차를 따릅니다.

## 지원 범위와 개인정보

추가된 68개 항목은 교육·학생 서비스·학술 검색·글쓰기·협업·데이터 분석·공학·창작·AI·번역·브라우저·유틸리티를 포함합니다. 총 **118개 대상, 173개 진입점**이며 사이트, 상점, 다운로드, 문서는 구분해 기록합니다. 출처는 [CATALOG.md](./CATALOG.md)에 있습니다.

‘확인됨’은 목록 작성 시 공식 페이지나 명시적인 공식 교차 링크를 확인했다는 뜻입니다. **검색할 때마다 실시간 인증을 하거나 소프트웨어 보안을 인증하는 것은 아닙니다.** 백그라운드 크롤링, 목록 업데이트 다운로드, 온라인 학습, 개인 피드백 업로드, 전체 검색 기록 수집은 하지 않습니다. 유효기간은 180일이며 만료 후에는 관리자의 재검토와 새 릴리스가 필요합니다. 개인 확인으로 공식 검토 날짜가 갱신되지 않습니다.

지원하는 데스크톱 Baidu/Bing 검색 페이지에서만 동작합니다. 개인 기록은 현재 브라우저 프로필에 저장되며 프로젝트 계정, 관리자 서버, 유료 API, 클라우드 학습은 필요하지 않습니다. 대상 사이트 자체의 로그인·구독·학교 라이선스 조건은 유지됩니다. [PRIVACY.md](./PRIVACY.md)를 참고하세요.

검증은 Windows 데스크톱 Chrome/Edge에서 수행했습니다. 다른 OS, 모든 과거 버전, 모든 지역 실험 페이지를 개별 검증하지는 않았습니다. 통제된 브라우저 테스트와 실제 수동 피드백은 [VERIFICATION.md](./VERIFICATION.md), [PRE_RELEASE_CHECK.md](./PRE_RELEASE_CHECK.md)에 구분해 기록했습니다.

## 라이선스, 기여 및 출처

NameFirst의 독자 작업에는 **NameFirst Noncommercial Reciprocal License 1.0**이 적용됩니다. 무료 사용·수정·배포 및 기업 내부 무료 사용을 허용합니다. 판매, 유료 서비스, 광고 및 기타 수익화에는 별도 허가가 필요합니다. 배포 시 대응 소스와 필요한 빌드 자료를 무료 공개하고 적용 대상 수정에는 같은 라이선스를 유지해야 합니다. 개인적인 로컬 수정은 공개할 필요가 없습니다.

이 프로젝트는 **비상업적 소스 공개** 프로젝트이며 OSI 의미의 오픈 소스 라이선스가 아닙니다. 이 설명은 요약이며 공식 [LICENSE](./LICENSE)가 적용됩니다. 범위는 [LICENSE_SCOPE.md](./LICENSE_SCOPE.md)를 참고하세요. 일반 설치·사용에는 CLA 서명이 필요하지 않습니다.

독자 기여는 [CONTRIBUTING.md](./CONTRIBUTING.md)에 따라 [CLA](./CLA.md)를 별도로 확인·수락합니다. 기여자는 저작권을 유지하며 비공개로 신원을 확인한 수령인에게 상업적 사용, 비공개 소스 배포, 재라이선스 권리를 부여할 수 있습니다. 공개 계정은 `Thicky-han`이며 법적 신원과 서명본은 공개하지 않습니다. 미서명 기여, 업스트림, 제3자 작업에는 자동 적용되지 않습니다. [CLA_GUIDE.md](./CLA_GUIDE.md)를 참고하세요.

이 저장소는 [uBlacklist](https://github.com/iorate/ublacklist)의 실제 GitHub fork입니다. 기준은 `v10.1.2` / `212384b330002a4c727b034806826e2eb352d7d5`이며 업스트림 소스는 `extension/`에 있습니다. builtin은 `c8bd5b7113dc1d416fa00c45509ac308619751df`에 고정하여 일반 파일로 포함했고 main은 실제 업스트림 조상 관계를 유지합니다.

업스트림 MIT, 제3자 라이선스 및 저작자 표시는 유지합니다. 전체 패키지를 MIT라고 부르면 안 됩니다. 패키지에는 공개 라이선스, `UPSTREAM-LICENSE.txt`, 출처와 의존성 고지를 포함합니다. [MODIFICATIONS.md](./MODIFICATIONS.md), [NOTICE](./NOTICE), [UPSTREAM.json](./UPSTREAM.json)을 참고하세요.

<details>
<summary>개발자: 소스 빌드와 검증</summary>

일반 사용자는 브라우저 ZIP을 사용하면 됩니다. 개발에는 PowerShell 7, Node.js, pnpm이 필요합니다. 프로젝트 루트에서 실행하세요.

```powershell
./scripts/Build.ps1 -InstallDependencies
./scripts/Package.ps1
./scripts/Verify-Package.ps1
./scripts/Audit-Runtime.ps1
node scripts/check-public-content.mjs
node scripts/check-release-content.mjs
```

정식 패키지는 커밋된 로컬 `main`에서 생성합니다. `extension/`에서 다음을 실행합니다.

```powershell
$env:CI = 'true'
$env:LEFTHOOK = '0'
pnpm check
pnpm test
pnpm exec playwright test --config e2e/namefirst/playwright.config.ts
```

업스트림 devEngines는 Node 26.10.0을 지정하며 로컬 도구 진입점은 호스트 Node 24와 pnpm 11을 사용합니다. 별도 `--namefirst` 모드는 업스트림 기본 모드를 보존합니다. 고정 공개 키를 바꾸거나 업스트림 기본 빌드를 NameFirst로 취급하지 마세요.

테스트는 별도의 임시 브라우저 프로필을 사용합니다. 의존성·캐시·생성 보고서·프로필은 커밋하거나 패키지에 넣지 않습니다. 정적 검사로 모든 미지의 비밀 정보를 찾을 수 있다고 보장하지 않습니다. 유지보수·배포는 [PUBLISHING.md](./PUBLISHING.md)를 참고하세요.

</details>

자료: [설치](./INSTALL.md) · [목록](./CATALOG.md) · [릴리스 노트](./RELEASE_NOTES.md) · [검증](./VERIFICATION.md) · [명세](./PROJECT_SPEC.md) · [구현 계획](./IMPLEMENTATION_PLAN.md). 과거 보고서는 당시 상태를 기록하며 현재 공개 상태는 Releases를 기준으로 합니다.
