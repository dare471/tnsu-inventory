# SPFx + Heft — установка (PowerShell, из папки spfx/)
#   .\setup-spfx-heft.ps1

$ErrorActionPreference = "Stop"

function Info    { param($msg) Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Success { param($msg) Write-Host "[OK]   $msg" -ForegroundColor Green }
function Warn    { param($msg) Write-Host "[WARN] $msg" -ForegroundColor Yellow }

Info "Проверка Node.js..."
$nodeVersion = node -e "process.stdout.write(process.version)"
$nodeMajor = [int]($nodeVersion.TrimStart('v').Split('.')[0])
if ($nodeMajor -lt 18) {
    Warn "Node.js $nodeVersion — требуется 18+"
    exit 1
}
Success "Node.js $nodeVersion"

Info "npm install..."
npm install --legacy-peer-deps
Success "Зависимости установлены."

Info "Проверка embed-сборки frontend..."
Push-Location ..\frontend
npm install
npm run build:embed
Pop-Location
Success "Frontend embed собран в spfx/lib/frontend/"

Write-Host ""
Write-Host "Готово. Команды:" -ForegroundColor Green
Write-Host "  npm run serve             — локальная отладка SPFx"
Write-Host "  npm run package-solution  — .sppkg для App Catalog"
Write-Host ""
