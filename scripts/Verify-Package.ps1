# SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
# Copyright (c) 2026 NameFirst contributors.
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$identity = Get-Content -LiteralPath (Join-Path $projectRoot 'config/extension-identity.json') -Raw | ConvertFrom-Json
$version = $identity.version
$releaseRoot = Join-Path $projectRoot "release/$version"
$metadata = Get-Content -LiteralPath (Join-Path $releaseRoot 'release-manifest.json') -Raw | ConvertFrom-Json
if ($metadata.version -ne $version -or $metadata.publicReleaseCreated -ne $false) { throw 'Unexpected local release metadata.' }
if ($metadata.repository -ne 'https://github.com/Thicky-han/namefirst' -or $metadata.sourceBranch -ne 'main' -or $metadata.sourceCommit -ne (& git -C $projectRoot rev-parse HEAD).Trim()) { throw 'Unexpected source repository or commit.' }
$expectedNames = @("namefirst-chrome-$version.zip", "namefirst-edge-$version.zip", "namefirst-source-$version.zip")
if ((Compare-Object $expectedNames @($metadata.archives.name)) -or @($metadata.archives).Count -ne 3) { throw 'Unexpected archive set.' }
Add-Type -AssemblyName System.IO.Compression
function Hash-Stream([IO.Stream]$Stream) {
    $hash = [Security.Cryptography.SHA256]::Create()
    try { return [Convert]::ToHexString($hash.ComputeHash($Stream)).ToLowerInvariant() } finally { $hash.Dispose() }
}
$guides = @('INSTALL.md', 'PRIVACY.md', 'CATALOG.md', 'RELEASE_NOTES.md', 'VERIFICATION.md')
foreach ($item in $metadata.archives) {
    $archivePath = Join-Path $releaseRoot $item.name
    if ((Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash.ToLowerInvariant() -ne $item.sha256 -or (Get-Item -LiteralPath $archivePath).Length -ne $item.bytes) { throw "Archive checksum mismatch: $($item.name)" }
    $isSource = $item.name -eq "namefirst-source-$version.zip"
    $target = if ($item.name -eq "namefirst-chrome-$version.zip") { 'chrome' } else { 'edge' }
    $archive = [IO.Compression.ZipFile]::OpenRead($archivePath)
    try {
        $seen = [Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
        foreach ($entry in $archive.Entries) {
            $relative = $entry.FullName
            if ($relative -match '(^/|\\|(^|/)\.\.(/|$))' -or -not $seen.Add($relative)) { throw "Unsafe archive entry: $relative" }
            if ($isSource) {
                $prefix = "namefirst-$version/"
                if (-not $relative.StartsWith($prefix, [StringComparison]::Ordinal)) { throw 'Invalid source root.' }
                $relative = $relative.Substring($prefix.Length)
                if ($relative -match '(^|/)legal/private(/|$)') { throw 'Private CLA signing records in archive.' }
                if ($relative -match '^(dist|release|\.cache)/|(^|/)(\.git|node_modules|test-results|dist)(/|$)|\.(pem|p12|pfx|key)$|(^|/)namefirst-(memory|raw-recovery)-' -or ($relative -match '(^|/)\.env($|\.)' -and $relative -notmatch '(^|/)\.env\.example$')) { throw "Unexpected private/generated source asset: $relative" }
                $source = Join-Path $projectRoot $relative
            } elseif ($relative.StartsWith('extension/', [StringComparison]::Ordinal)) {
                $source = Join-Path $projectRoot "dist/$target/$($relative.Substring(10))"
            } elseif ($guides -contains $relative) {
                $source = Join-Path $projectRoot $relative
            } else { throw "Unexpected browser archive asset: $relative" }
            $resolved = [IO.Path]::GetFullPath($source)
            if (-not $resolved.StartsWith($projectRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Archive mapping escaped project.' }
            $stream = $entry.Open()
            try { $actual = Hash-Stream $stream } finally { $stream.Dispose() }
            if ($actual -ne (Get-FileHash -LiteralPath $resolved -Algorithm SHA256).Hash.ToLowerInvariant()) { throw "Archive differs from corresponding file: $relative" }
        }
        if ($isSource) {
            if ($seen.Count -ne $metadata.sourceFileCount) { throw 'Source file count mismatch.' }
            foreach ($required in @('LICENSE', 'CLA.md', 'CLA_GUIDE.md', 'CONTRIBUTING.md', 'legal/CLA_ACCEPTANCE_TEMPLATE.md', '.github/pull_request_template.md', 'README.md', 'INSTALL.md', 'PRIVACY.md', 'VERIFICATION.md', 'UPSTREAM.json', 'MODIFICATIONS.md', 'config/extension-identity.json', 'scripts/Build.ps1', 'scripts/Package.ps1', 'scripts/Verify-Package.ps1', 'extension/LICENSE.txt', 'extension/package.json', 'extension/pnpm-lock.yaml', 'extension/src/namefirst-manifest.ts', 'extension/src/scripts/namefirst/catalog.json', 'extension/builtin/serpinfo/bing.yml')) {
                if (-not $seen.Contains("namefirst-$version/$required")) { throw "Missing source: $required" }
            }
        } else {
            foreach ($buildFile in Get-ChildItem -LiteralPath (Join-Path $projectRoot "dist/$target") -Recurse -File) {
                $relative = [IO.Path]::GetRelativePath((Join-Path $projectRoot "dist/$target"), $buildFile.FullName).Replace('\', '/')
                if (-not $seen.Contains("extension/$relative")) { throw "Missing build asset: $relative" }
            }
            foreach ($guide in $guides) { if (-not $seen.Contains($guide)) { throw "Missing installation guide: $guide" } }
            $manifestStream = $archive.GetEntry('extension/manifest.json').Open()
            $reader = [IO.StreamReader]::new($manifestStream)
            try { $manifest = $reader.ReadToEnd() | ConvertFrom-Json } finally { $reader.Dispose() }
            if ($manifest.version -ne $version -or $manifest.key -ne $identity.manifestKey) { throw 'Archived extension identity/version mismatch.' }
        }
        Write-Output "$($item.name): checksum and $($seen.Count) corresponding files verified."
    } finally { $archive.Dispose() }
}
$checksumLines = @(Get-Content -LiteralPath (Join-Path $releaseRoot 'SHA256SUMS.txt'))
if ($checksumLines.Count -ne 4) { throw 'Unexpected checksum list.' }
foreach ($line in $checksumLines) {
    if ($line -notmatch '^([a-f0-9]{64})  ([a-z0-9.-]+)$') { throw 'Malformed checksum line.' }
    $hash = $Matches[1]
    $name = $Matches[2]
    if (@($expectedNames + 'release-manifest.json') -notcontains $name) { throw 'Unexpected checksum target.' }
    if ((Get-FileHash -LiteralPath (Join-Path $releaseRoot $name) -Algorithm SHA256).Hash.ToLowerInvariant() -ne $hash) { throw "Checksum list mismatch: $name" }
}
Write-Output 'All local release archives and checksum records verified.'
