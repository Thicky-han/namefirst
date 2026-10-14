# SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
# Copyright (c) 2026 NameFirst contributors.
[CmdletBinding()]
param([switch]$SkipBuild)

$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$identity = Get-Content -LiteralPath (Join-Path $projectRoot 'config/extension-identity.json') -Raw | ConvertFrom-Json
$version = $identity.version
if ($version -notmatch '^\d+\.\d+\.\d+$') { throw 'Expected a numeric release version.' }
if (-not $SkipBuild) { & (Join-Path $PSScriptRoot 'Build.ps1') }
& (Join-Path $PSScriptRoot 'Verify-Build.ps1')
$releaseRoot = [IO.Path]::GetFullPath((Join-Path $projectRoot "release/$version"))
$expectedRelease = [IO.Path]::GetFullPath((Join-Path $projectRoot 'release')) + [IO.Path]::DirectorySeparatorChar
if (-not $releaseRoot.StartsWith($expectedRelease, [StringComparison]::OrdinalIgnoreCase)) { throw 'Release path escaped its root.' }
New-Item -ItemType Directory -Path $releaseRoot -Force | Out-Null
Add-Type -AssemblyName System.IO.Compression
$fixedTime = [DateTimeOffset]::Parse('2026-10-14T00:00:00+00:00')

function Write-Archive([string]$Destination, [object[]]$Files) {
    $seen = [Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
    $fileStream = [IO.File]::Open($Destination, [IO.FileMode]::Create)
    $archive = [IO.Compression.ZipArchive]::new($fileStream, [IO.Compression.ZipArchiveMode]::Create, $false)
    try {
        foreach ($item in ($Files | Sort-Object Entry)) {
            if ($item.Entry -match '(^/|\\|(^|/)\.\.(/|$))' -or -not $seen.Add($item.Entry)) { throw "Unsafe or duplicate archive entry: $($item.Entry)" }
            $entry = $archive.CreateEntry($item.Entry, [IO.Compression.CompressionLevel]::Optimal)
            $entry.LastWriteTime = $fixedTime
            $inputStream = [IO.File]::OpenRead($item.Source)
            $entryStream = $entry.Open()
            try { $inputStream.CopyTo($entryStream) } finally { $entryStream.Dispose(); $inputStream.Dispose() }
        }
    } finally { $archive.Dispose(); $fileStream.Dispose() }
}

$guideNames = @('INSTALL.md', 'PRIVACY.md', 'CATALOG.md', 'RELEASE_NOTES.md', 'VERIFICATION.md')
foreach ($target in @('chrome', 'edge')) {
    $buildRoot = Join-Path $projectRoot "dist/$target"
    $files = @()
    foreach ($item in Get-ChildItem -LiteralPath $buildRoot -Recurse -File) {
        $files += @{ Source = $item.FullName; Entry = 'extension/' + [IO.Path]::GetRelativePath($buildRoot, $item.FullName).Replace('\', '/') }
    }
    foreach ($guide in $guideNames) { $files += @{ Source = Join-Path $projectRoot $guide; Entry = $guide } }
    Write-Archive (Join-Path $releaseRoot "namefirst-$target-$version.zip") $files
}

# Include the corresponding source, lockfile and build materials; exclude runtime
# profiles, dependencies, generated packages, recovery files and private material.
$sourceNames = @(& git -c core.quotepath=false -C $projectRoot ls-files --cached --others --exclude-standard -- .)
if ($LASTEXITCODE -ne 0 -or $sourceNames.Count -eq 0) { throw 'Unable to enumerate source files.' }
$sourceFiles = @()
$rootPrefix = $projectRoot + [IO.Path]::DirectorySeparatorChar
foreach ($relative in ($sourceNames | Sort-Object -Unique)) {
    $relative = $relative.Replace('\', '/')
    if ($relative -match '(^|/)legal/private(/|$)') { throw 'Private CLA signing records must not be packaged.' }
    if ($relative -match '^(dist|release|\.cache)/|(^|/)(\.git|node_modules|test-results|dist)(/|$)') { continue }
    if ($relative -match '(^|/)\.env($|\.)|\.(pem|p12|pfx|key)$|(^|/)namefirst-(memory|raw-recovery)-') {
        if ($relative -notmatch '(^|/)\.env\.example$') { throw "Private or recovery material in source selection: $relative" }
    }
    $resolved = [IO.Path]::GetFullPath((Join-Path $projectRoot $relative))
    if (-not $resolved.StartsWith($rootPrefix, [StringComparison]::OrdinalIgnoreCase)) { throw "Source path escaped project: $relative" }
    $item = Get-Item -LiteralPath $resolved
    if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) { throw "Source links must be reviewed separately: $relative" }
    $sourceFiles += @{ Source = $resolved; Entry = "namefirst-$version/$relative" }
}
foreach ($required in @('LICENSE', 'CLA.md', 'CLA_GUIDE.md', 'CONTRIBUTING.md', 'legal/CLA_ACCEPTANCE_TEMPLATE.md', '.github/pull_request_template.md', 'README.md', 'INSTALL.md', 'PRIVACY.md', 'CATALOG.md', 'UPSTREAM.json', 'config/extension-identity.json', 'scripts/Build.ps1', 'scripts/Package.ps1', 'extension/LICENSE.txt', 'extension/package.json', 'extension/pnpm-lock.yaml', 'extension/src/scripts/namefirst/catalog.json', 'extension/builtin/serpinfo/bing.yml')) {
    if ($sourceFiles.Entry -notcontains "namefirst-$version/$required") { throw "Source archive lacks $required" }
}
Write-Archive (Join-Path $releaseRoot "namefirst-source-$version.zip") $sourceFiles

$metadata = [ordered]@{
    formatVersion = 1
    version = $version
    repository = 'https://github.com/Thicky-han/namefirst'
    sourceCommit = (& git -C $projectRoot rev-parse HEAD).Trim()
    sourceBranch = (& git -C $projectRoot branch --show-current).Trim()
    extensionId = 'kocncgipjlmfdlhabchnbnjgahlpfjkc'
    catalogVersion = (Get-Content -LiteralPath (Join-Path $projectRoot 'extension/src/scripts/namefirst/catalog.json') -Raw | ConvertFrom-Json).version
    sourceFileCount = $sourceFiles.Count
    contributionPolicy = [ordered]@{
        agreement = 'NameFirst-CLA-1.0'
        publicProjectContact = 'Thicky-han'
        legalIdentity = 'must be identified and confirmed in each executed private acceptance record'
        acceptanceRecordsIncluded = $false
    }
    publicReleaseCreated = $false
    upstream = Get-Content -LiteralPath (Join-Path $projectRoot 'UPSTREAM.json') -Raw | ConvertFrom-Json
    archives = @('chrome', 'edge', 'source') | ForEach-Object {
        $fileName = "namefirst-$_-$version.zip"
        $archivePath = Join-Path $releaseRoot $fileName
        [ordered]@{ name = $fileName; sha256 = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash.ToLowerInvariant(); bytes = (Get-Item -LiteralPath $archivePath).Length }
    }
}
[IO.File]::WriteAllText((Join-Path $releaseRoot 'release-manifest.json'), ($metadata | ConvertTo-Json -Depth 30) + "`n", [Text.UTF8Encoding]::new($false))
$hashNames = @($metadata.archives.name) + @('release-manifest.json')
$hashLines = foreach ($fileName in $hashNames) { "$((Get-FileHash -LiteralPath (Join-Path $releaseRoot $fileName) -Algorithm SHA256).Hash.ToLowerInvariant())  $fileName" }
[IO.File]::WriteAllText((Join-Path $releaseRoot 'SHA256SUMS.txt'), ($hashLines -join "`n") + "`n", [Text.UTF8Encoding]::new($false))
Write-Output "Release archives prepared locally: $releaseRoot ($($sourceFiles.Count) source files)"
