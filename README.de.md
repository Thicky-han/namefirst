<p align="center"><img src="assets/brand/namefirst-512.png" width="144" height="144" alt="NameFirst-Symbol mit NF und Pfeil"></p>
<h1 align="center">NameFirst</h1>
<p align="center"><strong>Nach Namen suchen. Die offizielle Website zuerst finden.</strong></p>

[简体中文](./README.md) · [English](./README.en.md) · [繁體中文](./README.zh-TW.md) · [日本語](./README.ja.md) · [한국어](./README.ko.md) · [Español](./README.es.md) · [Français](./README.fr.md) · [Deutsch](./README.de.md) · [Português (Brasil)](./README.pt-BR.md)

NameFirst ist eine Erweiterung für Chrome und Microsoft Edge auf dem Desktop. Bei einer Suche auf Baidu oder Bing nach einem im Verzeichnis erfassten Plattformnamen erscheint eine deutlich gekennzeichnete Karte mit dem offiziellen Zugang am Anfang des Bereichs für Web-Ergebnisse. Eigene Websites lassen sich ebenfalls speichern und lokal wieder aufrufen.

**Diese Anleitung gilt für 1.1.0: 118 Einträge auf Plattform- und Produktebene mit 173 offiziellen Zugängen. Neu sind 68 häufig von Studierenden genutzte Plattformen und Werkzeuge, darunter Canva 可画.** Welche Version tatsächlich veröffentlicht und verfügbar ist, steht unter [Releases](https://github.com/Thicky-han/namefirst/releases).

Ein NameFirst-Konto, API-Schlüssel oder eigener Build ist nicht nötig. Verzeichnis und persönliche Daten werden lokal verarbeitet; Suche und Website-Aufrufe benötigen Internet. Das Projekt verwendet eine nichtkommerzielle Lizenz mit verfügbarem Quellcode, siehe unten.

**Die Übersetzung betrifft die Anleitung, nicht die Oberfläche.** Diese ist derzeit überwiegend auf vereinfachtem Chinesisch. Die tatsächlichen chinesischen Beschriftungen werden unten mit aufgeführt. Namen und Aliasse werden nicht automatisch übersetzt: Suchbeispiele bitte unverändert verwenden. Alle Sprachen nutzen dieselben Pakete; weitere Suchmaschinen oder Regionen werden dadurch nicht unterstützt. Verlinkte Zusatzdokumente können auf Chinesisch sein.

## Schritt 1: Das passende Browserpaket herunterladen

**Für die normale Installation reicht eine der beiden ZIP-Dateien.** Wer beide Browser verwendet, lädt beide Pakete und installiert sie getrennt.

| Browser | Datei | Download |
| --- | --- | --- |
| Google Chrome | `namefirst-chrome-1.1.0.zip` | [Für Chrome](https://github.com/Thicky-han/namefirst/releases/download/v1.1.0/namefirst-chrome-1.1.0.zip) |
| Microsoft Edge | `namefirst-edge-1.1.0.zip` | [Für Edge](https://github.com/Thicky-han/namefirst/releases/download/v1.1.0/namefirst-edge-1.1.0.zip) |

So findest du die Dateien manuell:

1. Öffne [NameFirst Releases](https://github.com/Thicky-han/namefirst/releases).
2. Öffne die veröffentlichte Version mit der Kennzeichnung **Latest**. Falls 1.1.0 noch fehlt, verwende die tatsächlich veröffentlichte Version und deren Dateinamen.
3. Scrolle zu **Assets** und klappe die Liste bei Bedarf mit dem kleinen Pfeil auf.
4. Klicke je nach Browser auf `namefirst-chrome-VERSION.zip` oder `namefirst-edge-VERSION.zip` und warte auf den Abschluss.

Diese Dateien sind für die normale Installation nicht erforderlich:

| Datei | Zweck |
| --- | --- |
| `namefirst-source-1.1.0.zip` | Vollständiger bearbeitbarer Quellcode und Build-Materialien für die Entwicklung |
| `Source code (zip)` / `Source code (tar.gz)` | GitHub-Schnappschüsse des Quellcodes; nicht direkt als fertige Erweiterung ladbar |
| `release-manifest.json`, `SHA256SUMS.txt` | Prüfung von Version, Herkunft und Dateiintegrität |

Auch der grüne Knopf **Code → Download ZIP** lädt Quellcode. Für die Installation ist das browserspezifische ZIP gedacht.

## Schritt 2: Alles entpacken und den Ordner extension finden

1. Suche das heruntergeladene ZIP im Dateimanager, meist unter Downloads.
2. Wähle per Rechtsklick **Alle extrahieren** oder die entsprechende Systemfunktion. Nur das ZIP zu öffnen reicht nicht.
3. Bewahre den entpackten Ordner dauerhaft am selben Ort auf. Der Browser liest diese Dateien weiterhin; lösche oder verschiebe sie nicht unbedacht.
4. Suche darin den Ordner **`extension`**.

Beide Pakete sind so aufgebaut:

```text
namefirst-chrome-1.1.0/
├─ extension/                 ← Im nächsten Schritt diesen Ordner wählen
│  ├─ manifest.json
│  ├─ icons/
│  ├─ pages/
│  └─ scripts/
├─ INSTALL.md
├─ PRIVACY.md
└─ ...
```

**Wähle den Ordner, der `manifest.json` direkt enthält.** Nicht das ZIP, den äußeren Ordner, `scripts` oder die Manifestdatei selbst.

## Schritt 3: NameFirst im Browser laden

### Chrome

1. Öffne einen neuen Chrome-Tab.
2. Gib `chrome://extensions` in die **Adressleiste des Browsers** ein und drücke Enter, nicht in das Suchfeld einer Suchmaschine.
3. Aktiviere den **Entwicklermodus (Developer mode)**.
4. Klicke auf **Entpackte Erweiterung laden (Load unpacked)**.
5. Wähle den entpackten Ordner **`extension`** und bestätige.
6. Prüfe die **NameFirst**-Karte mit dunkelgrünem NF und hellgrünem Pfeil: Version **1.1.0**, Schalter eingeschaltet.

### Microsoft Edge

1. Öffne einen neuen Tab und gib `edge://extensions` in die Adressleiste ein; drücke Enter.
2. Aktiviere den **Entwicklermodus (Developer mode)**. Er kann im Seitenmenü stehen.
3. Klicke auf **Entpackte Erweiterung laden (Load unpacked)** oder die entsprechend benannte Schaltfläche.
4. Wähle den entpackten Ordner **`extension`** und bestätige.
5. Prüfe, dass **NameFirst 1.1.0** angezeigt und aktiviert ist.

Lass den Entwicklermodus eingeschaltet und behalte die Dateien. Bei Updates wird die bestehende NameFirst-Karte neu geladen. Diese Version ist nicht im Chrome- oder Edge-Store verfügbar. Siehe auch die offiziellen Anleitungen für [Chrome](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world) und [Edge](https://learn.microsoft.com/en-us/microsoft-edge/extensions/getting-started/extension-sideloading).

## Schritt 4: Eine Suche ausprobieren

1. Lade bereits geöffnete Baidu-/Bing-Suchseiten neu.
2. Öffne [Baidu](https://www.baidu.com/) oder [Bing](https://www.bing.com/) und nutze die normale **Websuche**.
3. Suche nach einem dieser Beispiele, genau wie angegeben. Chinesische Zeichen beibehalten: `下载` bedeutet „Download“.

| Suchtext | Erwarteter Zugang |
| --- | --- |
| `Steam` | Offizieller Steam-Store |
| `可画` / `Canva可画` | Offizielle Canva-可画-Website für Festlandchina |
| `可画下载` | Offizieller Windows-Download von Canva 可画 |
| `Zotero下载` | Offizieller Zotero-Download |
| `腾讯会议下载` | Offizielles Downloadcenter von Tencent Meeting |
| `RStudio下载` | Offizieller RStudio-Desktop-Download von Posit |

4. Suche am Anfang des Web-Ergebniscontainers die Karte **„NameFirst · 已核实官方入口“** („geprüfter offizieller Zugang“). Sie steht nicht zwingend über Werbung oder KI-Modulen in anderen Seitenbereichen.
5. Klicke auf den Websitenamen oder weitere Links wie **„官方下载页面“** („offizielle Downloadseite“).

Die ursprünglichen Ergebnisse und Anzeigen bleiben bestehen. Es gibt keine automatische Weiterleitung und keine Änderung des Rankings auf dem Suchmaschinenserver. `Rust` bietet die Programmiersprache und das Spiel zur Auswahl. Informationssuchen wie `Steam 使用教程` bleiben normalerweise unverändert.

## Schritt 5: Symbol anheften und eigene Websites verwalten

1. Öffne das **Erweiterungsmenü**, meist als Puzzleteil dargestellt.
2. Suche NameFirst und hefte das Symbol an oder zeige es in der Symbolleiste an.
3. Über das Symbol erreichst du den Hauptschalter, die einzelnen Baidu-/Bing-Schalter und den Schalter für den Feedbackzugang.
4. **„管理个人记录与备份“** („persönliche Einträge und Sicherungen verwalten“) bietet Hinzufügen, Bearbeiten, Löschen, Suchen und JSON-Import/-Export.

Für nicht erfasste Websites öffnest du auf einer unterstützten Suchseite **„选择并记住个人目标“**, prüfst Namen, Aliasse und HTTPS-Adresse und klickst auf **„保存个人目标“**. Bei einer späteren Suche nach dem Namen oder Alias kann der Eintrag als **„个人记忆“** („persönliche Erinnerung“) erscheinen. Eigenes Speichern bestätigt keine offizielle Identität.

Maximal 500 Ziele mit je 10 Aliasen sind möglich. Sicherungen sind unverschlüsselt und auf 4.000.000 Bytes begrenzt; bewahre sie sicher auf. Chrome und Edge synchronisieren nicht automatisch. Exportiere und importiere im anderen Browser und prüfe die Vorschau. Standardmäßig wird zusammengeführt; Ersetzen und Leeren erfordern eine Bestätigung. Die letzte Speicheränderung lässt sich rückgängig machen.

## Bestehende Installation auf 1.1.0 aktualisieren

Entpackt geladene Erweiterungen werden nicht automatisch über GitHub aktualisiert:

1. Öffne in der alten Version **„管理个人记录与备份“**, exportiere eine Sicherung, speichere offene Änderungen und schließe die Verwaltungsseite.
2. Lade das neue Browser-ZIP und entpacke es vollständig in einen separaten Ordner.
3. Suche den **alten `extension`-Ordner** der bisherigen Installation. Sein Pfad bleibt gleich.
4. Kopiere den **gesamten Inhalt** des neuen `extension`-Ordners in den alten und ersetze gleichnamige Dateien. Erzeuge nicht `extension/extension/manifest.json`.
5. Klicke unter `chrome://extensions` oder `edge://extensions` auf **Neu laden** beziehungsweise den kreisförmigen Pfeil der **bestehenden** NameFirst-Karte.
6. Prüfe **1.1.0**, lade die Suchseiten neu und kontrolliere deine persönlichen Einträge.

Deinstalliere die alte Version nicht vorher. Die stabile ID lautet `kocncgipjlmfdlhabchnbnjgahlpfjkc`; Ersetzen am gleichen Ort und Neuladen behält sie bei. Deinstallation, Löschen des Profils oder eine geänderte Erweiterungsidentität können lokale Daten verlieren. Für andere Computer oder Profile nutzt du JSON-Sicherungen.

## Häufige Probleme

| Problem | Prüfung |
| --- | --- |
| Downloads fehlen | Release-Detailseite öffnen und Assets ausklappen; nicht in der Quellcodeliste suchen |
| Manifest fehlt / Laden scheitert | Vollständig entpacken und den Ordner direkt mit `manifest.json` wählen; Browserpaket statt Quellcode verwenden |
| Symbol fehlt | Im Erweiterungsmenü anheften |
| Keine Karte | Seite neu laden, Schalter prüfen und `Steam` in der Websuche testen; CAPTCHA, Bilder, Nachrichten, Videos und eigenständige KI-Seiten sind nicht abgedeckt |
| Werkzeug fehlt | Nur erfasste Namen, Aliasse und Untereinträge stimmen überein; siehe [CATALOG.md](./CATALOG.md) oder eigenes Ziel speichern |
| Download fehlt | Downloadseiten werden separat geprüft; ein Hersteller deckt nicht alle Produkte ab, Installations-URLs werden nicht erraten |
| Weiterhin alte Version | Dateien am ursprünglichen Ort ersetzen, bestehende Karte und Suchseiten neu laden |
| Entwicklermodus gesperrt | Bei Schul- oder Firmenbrowsern die Administration nach lokalen Erweiterungen fragen |
| Website nicht erreichbar / Anmeldung nötig | Offiziell bedeutet nicht weltweit erreichbar, ohne Konto oder kostenlos; Bedingungen der Website beachten |

Weitere Hilfe über [Issues](https://github.com/Thicky-han/namefirst/issues): Browser-/Erweiterungsversion, Suchmaschine und Schritte zur Reproduktion angeben. Keine persönlichen Sicherungen, Zugangsdaten oder vertraulichen Seiten hochladen. Download und Nutzung benötigen kein GitHub-Konto; Issues/PRs folgen GitHubs Kontovorgaben.

## Umfang und Datenschutz

Die 68 Ergänzungen umfassen Lehre, Studierendenangebote, Literatur, Schreiben, Zusammenarbeit, Datenanalyse, Technik, Gestaltung, KI, Übersetzung, Browser und Hilfsprogramme. **118 Einträge auf Plattform- und Produktebene mit 173 Zugängen** unterscheiden Websites, Stores, Downloads und Dokumentation. Quellen: [CATALOG.md](./CATALOG.md).

„Geprüft“ bedeutet bei der Erstellung anhand offizieller Seiten oder eindeutiger offizieller Querverweise kontrolliert. **Es ist keine Echtzeitzertifizierung pro Suche und keine Sicherheitsprüfung der Software.** Keine Hintergrund-Crawler, kein Abruf von Verzeichnisupdates, kein Online-Training, kein Hochladen persönlicher Rückmeldungen und keine Erfassung des gesamten Suchverlaufs. Die Gültigkeit beträgt 180 Tage; danach sind erneute Prüfung und neue Veröffentlichung nötig. Persönliche Bestätigung verlängert die offiziellen Prüfdaten nicht.

NameFirst läuft nur auf unterstützten Baidu-/Bing-Desktop-Suchseiten. Daten bleiben im aktuellen Browserprofil. Projektkonto, Entwicklerserver, bezahlte API und Cloud-Training sind unnötig. Zielseiten können weiterhin Anmeldung, Abonnement oder Hochschullizenz verlangen. Siehe [PRIVACY.md](./PRIVACY.md).

Geprüft wurde unter Windows mit Desktop-Chrome/Edge, nicht einzeln auf allen anderen Systemen, historischen Versionen oder regionalen Testseiten. Kontrollierte Browsertests und echte manuelle Rückmeldungen sind in [VERIFICATION.md](./VERIFICATION.md) und [PRE_RELEASE_CHECK.md](./PRE_RELEASE_CHECK.md) getrennt dokumentiert.

## Lizenz, Beiträge und Herkunft

Eigene NameFirst-Arbeiten stehen unter der **NameFirst Noncommercial Reciprocal License 1.0**. Erlaubt sind kostenlose Nutzung, Änderung und Weitergabe sowie kostenlose firmeninterne Nutzung. Verkauf, kostenpflichtige Dienste, Werbung und andere Monetarisierung benötigen eine gesonderte Erlaubnis. Bei Weitergabe müssen entsprechender Quellcode und notwendige Build-Materialien kostenlos öffentlich zugänglich sein; erfasste Änderungen behalten dieselbe Lizenz. Private lokale Änderungen müssen nicht veröffentlicht werden.

Dies ist ein **nichtkommerzielles Projekt mit verfügbarem Quellcode**, keine Open-Source-Lizenz im Sinne der OSI. Diese Beschreibung ist eine Zusammenfassung; maßgeblich ist die formelle [LICENSE](./LICENSE). Siehe [LICENSE_SCOPE.md](./LICENSE_SCOPE.md). Normale Installation und Nutzung erfordern kein CLA.

Eigene Beiträge folgen [CONTRIBUTING.md](./CONTRIBUTING.md) und einem separat vereinbarten [CLA](./CLA.md). Beitragende behalten ihr Urheberrecht und können einer privat identifizierten empfangenden Partei kommerzielle Nutzung, Closed-Source-Verteilung und Unterlizenzierung erlauben. Öffentliches Konto: `Thicky-han`; rechtliche Identitäten und unterschriebene Vereinbarungen bleiben privat. Unterschriftslose Beiträge, Upstream und Dritte sind nicht automatisch eingeschlossen. Siehe [CLA_GUIDE.md](./CLA_GUIDE.md).

Dieses Repository ist ein tatsächlicher GitHub-Fork von [uBlacklist](https://github.com/iorate/ublacklist), fest auf `v10.1.2` / `212384b330002a4c727b034806826e2eb352d7d5`. Upstream-Quellen liegen in `extension/`; builtin ist auf `c8bd5b7113dc1d416fa00c45509ac308619751df` fixiert und als normale Dateien enthalten. main behält die echte Upstream-Abstammung bei.

MIT von Upstream, Drittlizenzen und Namensnennungen bleiben erhalten. Das Gesamtpaket darf nicht pauschal als MIT bezeichnet werden. Enthalten sind die öffentliche Lizenz, `UPSTREAM-LICENSE.txt`, Herkunfts- und Abhängigkeitshinweise. Siehe [MODIFICATIONS.md](./MODIFICATIONS.md), [NOTICE](./NOTICE) und [UPSTREAM.json](./UPSTREAM.json).

<details>
<summary>Entwicklung: Aus Quellcode bauen und prüfen</summary>

Für normale Nutzung reicht das Browser-ZIP. Erforderlich sind PowerShell 7, Node.js und pnpm. Im Projektstamm ausführen:

```powershell
./scripts/Build.ps1 -InstallDependencies
./scripts/Package.ps1
./scripts/Verify-Package.ps1
./scripts/Audit-Runtime.ps1
node scripts/check-public-content.mjs
node scripts/check-release-content.mjs
```

Formelle Pakete aus dem lokalen `main` mit committeten Änderungen erzeugen. In `extension/`:

```powershell
$env:CI = 'true'
$env:LEFTHOOK = '0'
pnpm check
pnpm test
pnpm exec playwright test --config e2e/namefirst/playwright.config.ts
```

Upstream-devEngines nennt Node 26.10.0; lokale Werkzeuge verwenden Host-Node 24 und pnpm 11. Der eigene `--namefirst`-Modus erhält den Upstream-Standardmodus. Den stabilen öffentlichen Schlüssel nicht ändern und einen Upstream-Standardbuild nicht als NameFirst behandeln.

Tests nutzen getrennte temporäre Browserprofile. Abhängigkeiten, Caches, generierte Berichte und Profile werden nicht committet oder gepackt. Statische Prüfungen garantieren nicht, alle unbekannten Geheimnisse zu finden. Wartung und Veröffentlichung: [PUBLISHING.md](./PUBLISHING.md).

</details>

Weitere Dokumente: [Installation](./INSTALL.md) · [Verzeichnis](./CATALOG.md) · [Versionshinweise](./RELEASE_NOTES.md) · [Prüfung](./VERIFICATION.md) · [Spezifikation](./PROJECT_SPEC.md) · [Plan](./IMPLEMENTATION_PLAN.md). Historische Berichte gelten für ihren damaligen Stand; Releases zeigt den aktuellen Veröffentlichungsstand.
