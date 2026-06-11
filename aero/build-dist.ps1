$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$dist = Join-Path $root "dist"

$files = @(
    "index.html",
    "certif.html",
    "privacy.html",
    "robots.txt"
)

$folders = @(
    "ori",
    "certif"
)

if (Test-Path -LiteralPath $dist) {
    Remove-Item -LiteralPath $dist -Recurse -Force
}

New-Item -ItemType Directory -Path $dist | Out-Null

foreach ($file in $files) {
    Copy-Item -LiteralPath (Join-Path $root $file) -Destination $dist
}

foreach ($folder in $folders) {
    Copy-Item -LiteralPath (Join-Path $root $folder) -Destination $dist -Recurse
}

Write-Host "Production build ready at: $dist"
