# Fix broken react-scripts install: remove folder and reinstall
$clientRoot = $PSScriptRoot
Set-Location $clientRoot

Write-Host "Removing broken react-scripts folder..." -ForegroundColor Yellow
$rsPath = Join-Path $clientRoot "node_modules\react-scripts"
if (Test-Path $rsPath) {
    Remove-Item -Recurse -Force $rsPath -ErrorAction Stop
    Write-Host "Removed." -ForegroundColor Green
} else {
    Write-Host "react-scripts folder not found." -ForegroundColor Gray
}

Write-Host "Installing react-scripts@5.0.1..." -ForegroundColor Yellow
npm install react-scripts@5.0.1 --save-dev
if ($LASTEXITCODE -eq 0) {
    Write-Host "Done. Run: npm start" -ForegroundColor Green
} else {
    Write-Host "Install failed. Try: Remove-Item -Recurse -Force node_modules; npm install" -ForegroundColor Red
}
