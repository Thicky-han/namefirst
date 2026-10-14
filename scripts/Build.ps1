[CmdletBinding()]
param(
    [ValidateSet('chrome', 'edge', 'all')]
    [string]$Browser = 'all',
    [switch]$InstallDependencies
)

$ErrorActionPreference = 'Stop'
$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$extensionRoot = Join-Path $projectRoot 'extension'
$outputRoot = Join-Path $projectRoot 'dist'
$identityPath = Join-Path $projectRoot 'config\extension-identity.json'
$packageManager = Get-Command pnpm -ErrorAction Stop
$identity = Get-Content -LiteralPath $identityPath -Raw | ConvertFrom-Json
$targets = if ($Browser -eq 'all') { @('chrome', 'edge') } else { @($Browser) }
$previousCI = $env:CI
$previousLefthook = $env:LEFTHOOK
New-Item -ItemType Directory -Path $outputRoot -Force | Out-Null

try {
    # The upstream dependency's postinstall skips Git hook installation in CI.
    $env:CI = 'true'
    $env:LEFTHOOK = '0'
    Push-Location $extensionRoot
    try {
        if ($InstallDependencies) {
            & $packageManager.Source install --frozen-lockfile
            if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed.' }
        }

        foreach ($target in $targets) {
            # Never embed the upstream extension's identity in NameFirst outputs.
            & $packageManager.Source build "--browser=$target" --no-key --namefirst
            if ($LASTEXITCODE -ne 0) { throw "Upstream build failed for $target." }

            $source = Join-Path $extensionRoot "dist\$target-namefirst-no-key"
            $destination = [System.IO.Path]::GetFullPath((Join-Path $outputRoot $target))
            $expectedPrefix = [System.IO.Path]::GetFullPath($outputRoot) + [System.IO.Path]::DirectorySeparatorChar
            if (-not $destination.StartsWith($expectedPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
                throw 'Build destination escaped the project output directory.'
            }
            if (Test-Path -LiteralPath $destination) {
                # The exact absolute target was checked above; only this build output is removed.
                Remove-Item -LiteralPath $destination -Recurse -Force
            }
            Copy-Item -LiteralPath $source -Destination $destination -Recurse

            $manifestPath = Join-Path $destination 'manifest.json'
            $manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
            $manifest.name = 'NameFirst'
            $manifest.description = 'Verified official websites first on Baidu and Bing. Local processing, no account required.'
            $manifest.version = $identity.version
            $manifest | Add-Member -NotePropertyName key -NotePropertyValue $identity.manifestKey -Force
            $manifest | Add-Member -NotePropertyName version_name -NotePropertyValue $identity.version -Force
            [System.IO.File]::WriteAllText(
                $manifestPath,
                ($manifest | ConvertTo-Json -Depth 30) + "`n",
                [System.Text.UTF8Encoding]::new($false)
            )
            Copy-Item -LiteralPath (Join-Path $projectRoot 'LICENSE') -Destination (Join-Path $destination 'LICENSE.txt')
            Copy-Item -LiteralPath (Join-Path $extensionRoot 'LICENSE.txt') -Destination (Join-Path $destination 'UPSTREAM-LICENSE.txt')
            Copy-Item -LiteralPath (Join-Path $projectRoot 'NOTICE') -Destination (Join-Path $destination 'NOTICE')
            Copy-Item -LiteralPath (Join-Path $projectRoot 'LICENSE_SCOPE.md') -Destination (Join-Path $destination 'LICENSE_SCOPE.md')
            Copy-Item -LiteralPath (Join-Path $projectRoot 'CLA.md') -Destination (Join-Path $destination 'CLA.md')
            Copy-Item -LiteralPath (Join-Path $projectRoot 'CLA_GUIDE.md') -Destination (Join-Path $destination 'CLA_GUIDE.md')
            Copy-Item -LiteralPath (Join-Path $projectRoot 'CONTRIBUTING.md') -Destination (Join-Path $destination 'CONTRIBUTING.md')
            Copy-Item -LiteralPath (Join-Path $projectRoot 'UPSTREAM.json') -Destination (Join-Path $destination 'UPSTREAM.json')
            Copy-Item -LiteralPath (Join-Path $projectRoot 'MODIFICATIONS.md') -Destination (Join-Path $destination 'MODIFICATIONS.md')
            Write-Output "Built NameFirst $($identity.version): $destination"
        }
    } finally {
        Pop-Location
    }
} finally {
    $env:CI = $previousCI
    $env:LEFTHOOK = $previousLefthook
}

& (Join-Path $PSScriptRoot 'Verify-Build.ps1') -Browser $Browser
