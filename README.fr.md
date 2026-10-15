<p align="center"><img src="assets/brand/namefirst-512.png" width="144" height="144" alt="Icône NF avec flèche de NameFirst"></p>
<h1 align="center">NameFirst</h1>
<p align="center"><strong>Recherchez un nom. Trouvez d’abord le site officiel.</strong></p>

[简体中文](./README.md) · [English](./README.en.md) · [繁體中文](./README.zh-TW.md) · [日本語](./README.ja.md) · [한국어](./README.ko.md) · [Español](./README.es.md) · [Français](./README.fr.md) · [Deutsch](./README.de.md) · [Português (Brasil)](./README.pt-BR.md)

NameFirst est une extension pour Chrome et Microsoft Edge sur ordinateur. Lorsque vous recherchez sur Baidu ou Bing le nom d’une plateforme répertoriée, elle affiche une carte clairement identifiée vers son site officiel en tête de la zone des résultats web. Vous pouvez aussi enregistrer vos propres sites et les retrouver localement.

**Ce guide correspond à la version 1.1.0 : 118 entités et 173 entrées officielles, dont 68 nouveaux outils et plateformes couramment utilisés par les étudiants, notamment Canva 可画.** Consultez [Releases](https://github.com/Thicky-han/namefirst/releases) pour connaître les versions effectivement publiées et téléchargeables.

Vous n’avez besoin ni d’un compte NameFirst, ni d’une clé d’API, ni de compiler le code. Le répertoire et les souvenirs personnels sont traités localement ; les recherches et visites de sites nécessitent internet. Le projet utilise une licence non commerciale avec code source disponible, résumée ci-dessous.

**La traduction du guide ne traduit pas l’interface.** Celle-ci est actuellement principalement en chinois simplifié ; les libellés chinois réels sont indiqués pour vous aider. Les noms et alias ne sont pas traduits automatiquement : conservez les requêtes d’exemple telles quelles. Toutes les langues utilisent les mêmes paquets, sans étendre la prise en charge des moteurs ou des régions. Les autres documents liés peuvent être en chinois.

## Étape 1 : télécharger le paquet adapté à votre navigateur

**Pour une installation normale, un seul des deux ZIP suffit.** Si vous utilisez les deux navigateurs, téléchargez et installez chaque paquet séparément.

| Navigateur | Fichier | Téléchargement |
| --- | --- | --- |
| Google Chrome | `namefirst-chrome-1.1.0.zip` | [Pour Chrome](https://github.com/Thicky-han/namefirst/releases/download/v1.1.0/namefirst-chrome-1.1.0.zip) |
| Microsoft Edge | `namefirst-edge-1.1.0.zip` | [Pour Edge](https://github.com/Thicky-han/namefirst/releases/download/v1.1.0/namefirst-edge-1.1.0.zip) |

Pour retrouver les fichiers manuellement :

1. Ouvrez [NameFirst Releases](https://github.com/Thicky-han/namefirst/releases).
2. Cliquez sur le titre de la version publiée portant la mention **Latest**. Si 1.1.0 n’apparaît pas encore, utilisez la version réellement publiée et les noms de fichiers correspondants.
3. Descendez jusqu’à **Assets** et dépliez la liste avec la petite flèche si nécessaire.
4. Cliquez sur `namefirst-chrome-VERSION.zip` ou `namefirst-edge-VERSION.zip` selon votre navigateur, puis attendez la fin du téléchargement.

Les fichiers suivants ne servent pas à l’installation normale :

| Fichier | Utilité |
| --- | --- |
| `namefirst-source-1.1.0.zip` | Sources complètes modifiables et éléments de compilation pour les développeurs |
| `Source code (zip)` / `Source code (tar.gz)` | Instantanés GitHub du dépôt ; ils ne se chargent pas directement comme extension déjà compilée |
| `release-manifest.json`, `SHA256SUMS.txt` | Vérification de la version, de la provenance et de l’intégrité |

Le bouton vert **Code → Download ZIP** télécharge lui aussi les sources. Pour installer, utilisez le ZIP propre à votre navigateur.

## Étape 2 : tout extraire et trouver le dossier extension

1. Retrouvez le ZIP dans votre gestionnaire de fichiers, généralement dans Téléchargements.
2. Faites un clic droit puis **Extraire tout**, ou utilisez la fonction équivalente de votre système. Parcourir le ZIP sans l’extraire ne suffit pas.
3. Conservez le dossier extrait à un emplacement durable : le navigateur continuera à lire ces fichiers. Ne les supprimez pas et ne les déplacez pas sans précaution.
4. Repérez le dossier **`extension`** à l’intérieur.

Les deux paquets ont la même structure :

```text
namefirst-chrome-1.1.0/
├─ extension/                 ← Sélectionner ce dossier à l’étape suivante
│  ├─ manifest.json
│  ├─ icons/
│  ├─ pages/
│  └─ scripts/
├─ INSTALL.md
├─ PRIVACY.md
└─ ...
```

**Sélectionnez le dossier contenant directement `manifest.json`.** Ne choisissez ni le ZIP, ni le dossier extérieur, ni `scripts`, ni le fichier manifest lui-même.

## Étape 3 : charger NameFirst dans le navigateur

### Chrome

1. Ouvrez un nouvel onglet Chrome.
2. Saisissez `chrome://extensions` dans la **barre d’adresse du navigateur**, puis Entrée, et non dans le champ du moteur de recherche.
3. Activez le **Mode développeur (Developer mode)**.
4. Cliquez sur **Charger l’extension non empaquetée (Load unpacked)** ou le bouton équivalent.
5. Sélectionnez le dossier **`extension`** extrait et validez.
6. Vérifiez la présence de **NameFirst**, avec l’icône NF vert foncé et la flèche vert clair, en version **1.1.0** et activée.

### Microsoft Edge

1. Dans un nouvel onglet, saisissez `edge://extensions` dans la barre d’adresse, puis Entrée.
2. Activez le **Mode développeur (Developer mode)**, éventuellement situé dans le menu latéral.
3. Cliquez sur **Charger l’extension décompressée (Load unpacked)** ou son équivalent.
4. Sélectionnez le dossier **`extension`** extrait et validez.
5. Vérifiez que **NameFirst 1.1.0** apparaît et est activée.

Laissez le mode développeur activé et conservez les fichiers. Les mises à jour se font en rechargeant la carte NameFirst existante. Cette version n’est pas distribuée dans les boutiques Chrome/Edge. Consultez aussi les instructions officielles de [Chrome](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world) et [Edge](https://learn.microsoft.com/en-us/microsoft-edge/extensions/getting-started/extension-sideloading).

## Étape 4 : essayer une recherche

1. Actualisez les onglets Baidu/Bing déjà ouverts.
2. Ouvrez [Baidu](https://www.baidu.com/) ou [Bing](https://www.bing.com/) et utilisez la recherche **web** ordinaire.
3. Saisissez l’un de ces exemples exactement. Gardez les caractères chinois : `下载` signifie « téléchargement ».

| Requête | Entrée attendue |
| --- | --- |
| `Steam` | Boutique officielle Steam |
| `可画` / `Canva可画` | Site officiel Canva 可画 pour la Chine continentale |
| `可画下载` | Téléchargement officiel Canva 可画 pour Windows |
| `Zotero下载` | Téléchargement officiel Zotero |
| `腾讯会议下载` | Centre officiel de téléchargement Tencent Meeting |
| `RStudio下载` | Téléchargement officiel RStudio Desktop de Posit |

4. Repérez **« NameFirst · 已核实官方入口 »** (« entrée officielle vérifiée ») en tête du conteneur des résultats web. Elle n’est pas nécessairement au-dessus des publicités ou modules d’IA situés ailleurs.
5. Cliquez sur le nom du site ou sur un lien supplémentaire, comme **« 官方下载页面 »** (« page officielle de téléchargement »).

Les résultats et publicités d’origine restent affichés. L’extension ne redirige pas automatiquement et ne modifie pas le classement côté serveur. `Rust` propose le langage de programmation et le jeu. Les recherches d’information comme `Steam 使用教程` restent généralement des recherches normales.

## Étape 5 : épingler l’icône et gérer vos sites

1. Ouvrez le menu **Extensions**, généralement représenté par une pièce de puzzle.
2. Repérez NameFirst et épinglez son icône ou affichez-la dans la barre d’outils.
3. L’icône donne accès aux interrupteurs général, Baidu/Bing et à celui de l’entrée de retour utilisateur.
4. Cliquez sur **« 管理个人记录与备份 »** (« gérer les entrées personnelles et sauvegardes ») pour ajouter, modifier, supprimer, rechercher, importer ou exporter en JSON.

Pour un site absent, ouvrez **« 选择并记住个人目标 »** sur une page compatible, vérifiez nom, alias et adresse HTTPS, puis cliquez sur **« 保存个人目标 »**. Une recherche du nom ou d’un alias enregistré peut ensuite afficher **« 个人记忆 »** (« souvenir personnel »). Un enregistrement personnel ne certifie pas le caractère officiel du site.

Limites : 500 destinations, 10 alias chacune. Les sauvegardes ne sont pas chiffrées et sont limitées à 4 000 000 octets ; conservez-les en sécurité. Chrome et Edge ne se synchronisent pas automatiquement. Exportez, importez dans l’autre navigateur et vérifiez l’aperçu. L’import fusionne par défaut ; le remplacement ou l’effacement exige confirmation. La dernière modification de mémoire peut être annulée.

## Mettre à jour une ancienne installation vers 1.1.0

Les extensions chargées sans empaquetage ne se mettent pas à jour automatiquement depuis GitHub :

1. Dans l’ancienne version, ouvrez **« 管理个人记录与备份 »**, exportez une sauvegarde, enregistrez les modifications en cours et fermez la page de gestion.
2. Téléchargez le nouveau ZIP et extrayez-le entièrement dans un autre dossier.
3. Retrouvez l’**ancien dossier `extension`** utilisé à l’installation ; gardez son emplacement.
4. Copiez **tout le contenu intérieur** du nouveau `extension` dans l’ancien, en remplaçant les fichiers homonymes. Ne créez pas `extension/extension/manifest.json`.
5. Dans `chrome://extensions` ou `edge://extensions`, cliquez sur **Recharger** ou la flèche circulaire de la carte NameFirst **existante**.
6. Vérifiez **1.1.0**, actualisez les pages de recherche et contrôlez que vos entrées sont toujours présentes.

Ne désinstallez pas l’ancienne version au préalable. L’identifiant stable est `kocncgipjlmfdlhabchnbnjgahlpfjkc` ; remplacer les fichiers au même endroit et recharger le conserve. Une désinstallation, la suppression du profil ou un changement d’identité de l’extension peut perdre les données locales. Utilisez les sauvegardes JSON pour changer d’ordinateur ou de profil.

## Dépannage

| Problème | Vérification |
| --- | --- |
| Fichiers introuvables | Ouvrez le détail d’une version et dépliez Assets ; pas la liste des sources |
| Manifest absent / chargement impossible | Extrayez tout et choisissez le dossier contenant directement `manifest.json` ; utilisez le ZIP du navigateur, pas les sources |
| Icône absente | Épinglez-la depuis le menu Extensions |
| Pas de carte | Actualisez, vérifiez les interrupteurs et essayez `Steam` en recherche web ; CAPTCHA, images, actualités, vidéos et pages d’IA indépendantes sont hors périmètre |
| Outil absent | Seuls les noms, alias et sous-entrées enregistrés correspondent ; consultez [CATALOG.md](./CATALOG.md) ou ajoutez une destination personnelle |
| Pas de téléchargement | Ces pages demandent une vérification séparée ; un éditeur référencé ne couvre pas tous ses produits, et les URL d’installateurs ne sont pas devinées |
| Toujours l’ancienne version | Remplacez dans le dossier d’origine, rechargez la carte existante et les recherches |
| Mode développeur indisponible | Pour un navigateur géré par une école ou une entreprise, contactez l’administrateur |
| Site inaccessible / connexion exigée | Le caractère officiel ne garantit ni disponibilité régionale, ni absence de compte, ni gratuité ; suivez les conditions du site |

Pour obtenir de l’aide, ouvrez une [Issue](https://github.com/Thicky-han/namefirst/issues) avec versions, moteur et étapes de reproduction. N’envoyez pas de sauvegardes personnelles, d’identifiants ni de pages sensibles. Aucun compte GitHub n’est nécessaire pour télécharger ou utiliser ; les Issues/PR suivent les exigences de compte de GitHub.

## Périmètre et confidentialité

Les 68 ajouts couvrent enseignement, services étudiants, recherche académique, rédaction, collaboration, analyse de données, ingénierie, création, IA, traduction, navigateurs et utilitaires. Les **118 entités et 173 entrées** distinguent sites, boutiques, téléchargements et documentation. Les sources figurent dans [CATALOG.md](./CATALOG.md).

« Vérifiée » signifie contrôlée à la préparation du répertoire à partir de pages officielles ou de liens officiels explicites. **Ce n’est ni une certification en temps réel à chaque recherche, ni une certification de sécurité des logiciels.** Pas d’exploration en arrière-plan, de téléchargement du répertoire, d’apprentissage en ligne, d’envoi des retours personnels ou de collecte de tout l’historique de recherche. La validité est de 180 jours ; ensuite, le mainteneur doit revérifier et publier une mise à jour. Une confirmation personnelle ne renouvelle pas la date officielle.

L’extension fonctionne uniquement sur les pages de recherche Baidu/Bing de bureau prises en charge. Les données restent dans le profil actuel. Aucun compte du projet, serveur du développeur, API payante ou entraînement cloud n’est nécessaire. Les sites visités conservent leurs exigences de connexion, d’abonnement ou de licence universitaire. Voir [PRIVACY.md](./PRIVACY.md).

Les vérifications portent sur Chrome/Edge de bureau sous Windows, sans validation individuelle des autres systèmes, de toutes les versions passées ou de toutes les expériences régionales. Tests contrôlés et retours manuels réels sont distingués dans [VERIFICATION.md](./VERIFICATION.md) et [PRE_RELEASE_CHECK.md](./PRE_RELEASE_CHECK.md).

## Licence, contributions et origine

Le travail original utilise **NameFirst Noncommercial Reciprocal License 1.0** : usage, modification et distribution gratuits, y compris usage interne gratuit en entreprise. Vente, services payants, publicité et autres monétisations nécessitent une autorisation distincte. La distribution exige l’accès public gratuit aux sources correspondantes et aux éléments nécessaires à la compilation ; les modifications couvertes gardent la même licence. Les modifications locales privées n’ont pas à être publiées.

C’est un projet **non commercial avec code source disponible**, pas une licence open source au sens de l’OSI. Ce texte est un résumé ; la [LICENSE](./LICENSE) officielle fait foi. Voir [LICENSE_SCOPE.md](./LICENSE_SCOPE.md). L’installation et l’utilisation ordinaires ne demandent pas de CLA.

Les contributions originales suivent [CONTRIBUTING.md](./CONTRIBUTING.md) avec acceptation distincte du [CLA](./CLA.md). Les contributeurs gardent leurs droits d’auteur et peuvent accorder usage commercial, distribution en code fermé et sous-licence à un bénéficiaire identifié en privé. Le compte public est `Thicky-han` ; identités légales et accords signés restent privés. Les contributions non signées, le code amont et les tiers ne sont pas automatiquement inclus. Voir [CLA_GUIDE.md](./CLA_GUIDE.md).

Ce dépôt est un véritable fork GitHub de [uBlacklist](https://github.com/iorate/ublacklist), fixé à `v10.1.2` / `212384b330002a4c727b034806826e2eb352d7d5`. Les sources amont sont dans `extension/` ; builtin est fixé à `c8bd5b7113dc1d416fa00c45509ac308619751df` et inclus sous forme de fichiers ordinaires. main conserve l’ascendance amont réelle.

MIT en amont, licences tierces et attributions sont conservées. L’ensemble du paquet ne doit pas être présenté comme MIT. La licence publique, `UPSTREAM-LICENSE.txt`, la provenance et les avis de dépendances sont inclus. Voir [MODIFICATIONS.md](./MODIFICATIONS.md), [NOTICE](./NOTICE) et [UPSTREAM.json](./UPSTREAM.json).

<details>
<summary>Développeurs : compiler et vérifier les sources</summary>

Pour l’utilisation ordinaire, prenez le ZIP du navigateur. Le développement nécessite PowerShell 7, Node.js et pnpm. Depuis la racine du projet :

```powershell
./scripts/Build.ps1 -InstallDependencies
./scripts/Package.ps1
./scripts/Verify-Package.ps1
./scripts/Audit-Runtime.ps1
node scripts/check-public-content.mjs
node scripts/check-release-content.mjs
```

Les paquets officiels se préparent depuis `main` local avec les modifications commitées. Dans `extension/` :

```powershell
$env:CI = 'true'
$env:LEFTHOOK = '0'
pnpm check
pnpm test
pnpm exec playwright test --config e2e/namefirst/playwright.config.ts
```

devEngines en amont indique Node 26.10.0 ; les outils locaux utilisent Node 24 de l’hôte et pnpm 11. Le mode distinct `--namefirst` préserve le mode amont par défaut. Ne changez pas la clé publique stable et n’utilisez pas une compilation amont par défaut comme NameFirst.

Les tests utilisent des profils temporaires séparés. Dépendances, caches, rapports générés et profils ne sont ni commités ni empaquetés. L’analyse statique ne garantit pas la détection de tous les secrets inconnus. Procédure : [PUBLISHING.md](./PUBLISHING.md).

</details>

Autres documents : [Installation](./INSTALL.md) · [Répertoire](./CATALOG.md) · [Notes de version](./RELEASE_NOTES.md) · [Vérification](./VERIFICATION.md) · [Spécification](./PROJECT_SPEC.md) · [Plan](./IMPLEMENTATION_PLAN.md). Les rapports historiques décrivent leur époque ; Releases indique l’état actuel de publication.
