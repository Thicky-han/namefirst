[CmdletBinding()]
param(
    [ValidateSet('chrome', 'edge', 'all')]
    [string]$Browser = 'all'
)

$ErrorActionPreference = 'Stop'
$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$identity = Get-Content -LiteralPath (Join-Path $projectRoot 'config\extension-identity.json') -Raw | ConvertFrom-Json
$targets = if ($Browser -eq 'all') { @('chrome', 'edge') } else { @($Browser) }

foreach ($target in $targets) {
    $directory = Join-Path $projectRoot "dist\$target"
    $manifest = Get-Content -LiteralPath (Join-Path $directory 'manifest.json') -Raw | ConvertFrom-Json
    if ($manifest.manifest_version -ne 3) { throw "$target is not Manifest V3." }
    if ($manifest.name -ne 'NameFirst') { throw "$target has an unexpected name." }
    if ($manifest.key -ne $identity.manifestKey) { throw "$target has an unexpected extension identity." }
    if ($manifest.version -ne $identity.version) { throw "$target has an unexpected version." }
    if ($manifest.version_name -ne $identity.version) { throw "$target has an unexpected display version." }
    if ($manifest.options_ui.page -ne 'pages/namefirst-manager.html' -or $manifest.options_ui.open_in_tab -ne $true) { throw "$target has an unexpected management page." }
    if ($manifest.background.service_worker -ne 'scripts/namefirst-background.js') { throw "$target has an unexpected local worker." }
    if (@($manifest.permissions).Count -ne 1 -or $manifest.permissions[0] -ne 'storage') { throw "$target has unexpected permissions." }
    foreach ($size in @(16, 32, 48, 128)) {
        $path = "icons/namefirst/icon-$size.png"
        if ($manifest.icons."$size" -ne $path) { throw "$target has an unexpected NameFirst icon." }
        $bytes = [IO.File]::ReadAllBytes((Join-Path $directory $path))
        if ($bytes.Length -lt 24 -or [Convert]::ToHexString($bytes[0..7]) -ne '89504E470D0A1A0A') { throw 'Invalid PNG icon.' }
        $width = ($bytes[16] -shl 24) -bor ($bytes[17] -shl 16) -bor ($bytes[18] -shl 8) -bor $bytes[19]
        $height = ($bytes[20] -shl 24) -bor ($bytes[21] -shl 16) -bor ($bytes[22] -shl 8) -bor $bytes[23]
        if ($width -ne $size -or $height -ne $size) { throw 'Unexpected icon dimensions.' }
        if ((Get-FileHash -LiteralPath (Join-Path $directory $path)).Hash -ne (Get-FileHash -LiteralPath (Join-Path $projectRoot "extension/src/$path")).Hash) { throw 'Packaged icon differs from approved source.' }
    }
    foreach ($forbidden in @('oauth2', 'host_permissions', 'web_accessible_resources', 'default_locale')) {
        if ($manifest.PSObject.Properties.Name -contains $forbidden) { throw "$target unexpectedly includes $forbidden." }
    }
    if ($manifest.action.default_popup -ne 'pages/namefirst-popup.html') { throw "$target has an unexpected popup." }
    if (@($manifest.content_scripts).Count -ne 1) { throw "$target has unexpected content scripts." }
    $expectedMatches = @('https://www.bing.com/search*', 'https://www2.bing.com/search*', 'https://www4.bing.com/search*', 'https://cn.bing.com/search*', 'https://www.baidu.com/s*', 'https://baidu.com/s*')
    $content = $manifest.content_scripts[0]
    if ((Compare-Object $expectedMatches @($content.matches)) -or @($content.js).Count -ne 1 -or $content.js[0] -ne 'scripts/namefirst-content-script.js' -or $content.run_at -ne 'document_idle') { throw "$target has an unexpected search-engine configuration." }

    $references = @(
        $manifest.action.default_popup
        $manifest.background.service_worker
        $manifest.options_ui.page
        'scripts/namefirst-manager.js'
        'scripts/namefirst-manager.css'
        'scripts/namefirst-popup.js'
        'scripts/namefirst-popup.css'
        'LICENSE.txt'
        'UPSTREAM-LICENSE.txt'
        'NOTICE'
        'LICENSE_SCOPE.md'
        'CLA.md'
        'CLA_GUIDE.md'
        'CONTRIBUTING.md'
        'UPSTREAM.json'
        'MODIFICATIONS.md'
        'third-party-notices.txt'
    )
    $references += @($manifest.icons.PSObject.Properties | ForEach-Object { $_.Value })
    $references += @($manifest.action.default_icon.PSObject.Properties | ForEach-Object { $_.Value })
    foreach ($script in $manifest.content_scripts) {
        $references += @($script.js)
        if ($script.css) { $references += @($script.css) }
    }
    foreach ($reference in $references) {
        if ([string]::IsNullOrWhiteSpace($reference)) { continue }
        $resolved = [System.IO.Path]::GetFullPath((Join-Path $directory $reference))
        $prefix = [System.IO.Path]::GetFullPath($directory) + [System.IO.Path]::DirectorySeparatorChar
        if (-not $resolved.StartsWith($prefix, [System.StringComparison]::OrdinalIgnoreCase)) {
            throw "Asset path escaped build directory: $reference"
        }
        if (-not (Test-Path -LiteralPath $resolved -PathType Leaf)) {
            throw "Missing build asset: $target/$reference"
        }
    }
    $allowedAssets = @($references | Sort-Object -Unique) + @('manifest.json')
    foreach ($asset in Get-ChildItem -LiteralPath $directory -Recurse -File) {
        $relative = [System.IO.Path]::GetRelativePath($directory, $asset.FullName).Replace('\', '/')
        if ($allowedAssets -notcontains $relative) { throw "Unexpected packaged asset: $target/$relative" }
    }
    $expectedSource = Get-Content -LiteralPath (Join-Path $projectRoot 'UPSTREAM.json') -Raw | ConvertFrom-Json
    $builtSource = Get-Content -LiteralPath (Join-Path $directory 'UPSTREAM.json') -Raw | ConvertFrom-Json
    if ($builtSource.commit -ne $expectedSource.commit -or $builtSource.builtin.commit -ne $expectedSource.builtin.commit) {
        throw "$target has incorrect upstream attribution."
    }
    $licenseCopies = @{
        'LICENSE.txt' = Join-Path $projectRoot 'LICENSE'
        'UPSTREAM-LICENSE.txt' = Join-Path $projectRoot 'extension\LICENSE.txt'
        'NOTICE' = Join-Path $projectRoot 'NOTICE'
        'LICENSE_SCOPE.md' = Join-Path $projectRoot 'LICENSE_SCOPE.md'
        'CLA.md' = Join-Path $projectRoot 'CLA.md'
        'CLA_GUIDE.md' = Join-Path $projectRoot 'CLA_GUIDE.md'
        'CONTRIBUTING.md' = Join-Path $projectRoot 'CONTRIBUTING.md'
        'MODIFICATIONS.md' = Join-Path $projectRoot 'MODIFICATIONS.md'
    }
    foreach ($copy in $licenseCopies.GetEnumerator()) {
        $originalHash = (Get-FileHash -LiteralPath $copy.Value -Algorithm SHA256).Hash
        $packagedHash = (Get-FileHash -LiteralPath (Join-Path $directory $copy.Key) -Algorithm SHA256).Hash
        if ($packagedHash -ne $originalHash) {
            throw "$target has incorrect license material: $($copy.Key)"
        }
    }
    Write-Output "$target manifest, identity, license, and referenced assets verified."
}
