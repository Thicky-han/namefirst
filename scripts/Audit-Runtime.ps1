# SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
# Copyright (c) 2026 NameFirst contributors.
[CmdletBinding()]
param()
$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
& (Join-Path $PSScriptRoot 'Verify-Build.ps1')
$forbidden = @(
    '\bfetch\s*\(', 'XMLHttpRequest', '\bsendBeacon\s*\(', '\bWebSocket\s*\(',
    'chrome\s*\.\s*identity', 'chrome\s*\.\s*storage\s*\.\s*sync',
    'dropboxapi\.com', 'googleapis\.com', 'accounts\.google\.com',
    'chrome\s*\.\s*alarms', 'chrome\s*\.\s*history'
)
foreach ($target in @('chrome', 'edge')) {
    $scripts = Join-Path $projectRoot "dist/$target/scripts"
    foreach ($file in Get-ChildItem -LiteralPath $scripts -File -Filter '*.js') {
        $code = [IO.File]::ReadAllText($file.FullName)
        foreach ($pattern in $forbidden) {
            if ($code -match $pattern) { throw "Review forbidden runtime capability in $target/$($file.Name): $pattern" }
        }
    }
    Write-Output "$target final scripts: no forbidden network/account/sync/history capability matched."
}
# This scan is a bounded release check, not a formal proof. Browser request tests
# and the minimal manifest separately verify actual runtime behavior.
