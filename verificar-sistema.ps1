# Script de verificación rápida - Ejecutar antes de hacer cambios

Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  AUTOFLOW - VERIFICACION DE SISTEMA   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Cyan

# FRONTEND
Write-Host "📁 FRONTEND" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────" -ForegroundColor Gray
cd "c:\Users\Xavi\Documents\PROYECTOS PROGRA\Front\autoflow-frontend"

Write-Host "Git Remote: " -NoNewline
git remote get-url origin
Write-Host "Rama Actual: " -NoNewline
git branch --show-current
Write-Host "Estado: " -NoNewline
$status = git status --porcelain
if ($status) {
    Write-Host "HAY CAMBIOS SIN COMMITEAR" -ForegroundColor Red
} else {
    Write-Host "LIMPIO ✓" -ForegroundColor Green
}

# BACKEND
Write-Host "`n📁 BACKEND" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────" -ForegroundColor Gray
cd "c:\Users\Xavi\Documents\PROYECTOS PROGRA\APPS\autoflow-app"

if (Test-Path .git) {
    Write-Host "Git Remote: " -NoNewline
    git remote get-url origin
    Write-Host "Rama Actual: " -NoNewline
    git branch --show-current
} else {
    Write-Host "NO ES REPOSITORIO GIT" -ForegroundColor Red
    Write-Host "Ejecuta: git init" -ForegroundColor Yellow
}

if (Test-Path .env) {
    Write-Host ".env: ENCONTRADO ✓" -ForegroundColor Green
} else {
    Write-Host ".env: NO ENCONTRADO ✗" -ForegroundColor Red
}

Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         VERIFICACION COMPLETA          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "Presiona ENTER para continuar..." -ForegroundColor Gray
Read-Host
