# SPDX-License-Identifier: LicenseRef-NameFirst-NC-Reciprocal-1.0
# Copyright (c) 2026 NameFirst contributors.
[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [ValidateNotNullOrEmpty()]
    [string]$Query
)

$ErrorActionPreference = 'Stop'
$extensionRoot = Join-Path $PSScriptRoot '..\extension'
$packageManager = Get-Command pnpm -ErrorAction Stop
$previousCI = $env:CI
$previousLefthook = $env:LEFTHOOK
try {
    $env:CI = 'true'
    $env:LEFTHOOK = '0'
    Push-Location $extensionRoot
    try {
        & $packageManager.Source exec node src/scripts/namefirst/demo.ts $Query
        if ($LASTEXITCODE -ne 0) { throw 'Name resolution demonstration failed.' }
    } finally {
        Pop-Location
    }
} finally {
    $env:CI = $previousCI
    $env:LEFTHOOK = $previousLefthook
}
