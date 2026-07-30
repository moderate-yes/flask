param(
    [Parameter(Mandatory = $true)]
    [string]$Bucket,

    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,

    [string]$Region = "ap-northeast-2"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
$OutputDirectory = Join-Path $ProjectRoot "s3-site"

if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
    throw "AWS CLI is not installed or is not available in PATH."
}

python (Join-Path $ProjectRoot "build_static.py") --site-url $SiteUrl --output $OutputDirectory
if ($LASTEXITCODE -ne 0) {
    throw "The static site build failed."
}

aws s3 sync $OutputDirectory "s3://$Bucket" --region $Region
if ($LASTEXITCODE -ne 0) {
    throw "The S3 upload failed."
}

# AWS CLI installations do not always infer the JavaScript MIME type for .mjs
# modules. PDF.js is loaded as an ES module and must not be octet-stream.
aws s3 cp (Join-Path $OutputDirectory "static") "s3://$Bucket/static" `
    --recursive `
    --exclude "*" `
    --include "*.mjs" `
    --content-type "text/javascript" `
    --region $Region
if ($LASTEXITCODE -ne 0) {
    throw "The JavaScript module upload failed."
}

aws s3 website "s3://$Bucket" --index-document index.html --error-document 404.html
if ($LASTEXITCODE -ne 0) {
    throw "The S3 website configuration failed."
}

Write-Host ""
Write-Host "Upload complete."
Write-Host "Canonical site URL: $SiteUrl"
Write-Host "S3 bucket: s3://$Bucket"
Write-Host "If the site is not public, configure CloudFront or an S3 public-read bucket policy."
