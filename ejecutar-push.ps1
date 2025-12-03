# Script de verificación y push con output visible

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VERIFICACIÓN Y PUSH DE COMMITS A GITHUB" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. Verificar cambios sin commitear
Write-Host "[1] Verificando archivos modificados..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "ARCHIVOS CON CAMBIOS:" -ForegroundColor Red
    git status --short
    
    Write-Host "`n¿Agregar estos cambios? (Presiona ENTER)" -ForegroundColor Yellow
    Read-Host
    
    git add src/pages/TaskDetail.jsx src/pages/NewTask.jsx
    Write-Host "✓ Archivos agregados" -ForegroundColor Green
    
    Write-Host "`nCreando commit..." -ForegroundColor Yellow
    git commit -m "feat: upload imagenes/videos + scanner VIN

- Funcionalidad completa de upload a Cloudinary
- Scanner VIN corregido con API_URL
- Soporte imagenes y videos
- Botones eliminar archivos"
    
    Write-Host "✓ Commit creado" -ForegroundColor Green
} else {
    Write-Host "✓ No hay cambios sin commitear" -ForegroundColor Green
}

# 2. Mostrar últimos commits locales
Write-Host "`n[2] Últimos 5 commits LOCALES:" -ForegroundColor Yellow
git log --oneline -5 --decorate

# 3. Verificar rama actual
Write-Host "`n[3] Rama actual:" -ForegroundColor Yellow
$currentBranch = git branch --show-current
Write-Host "  * $currentBranch" -ForegroundColor Cyan

# 4. Comparar con GitHub
Write-Host "`n[4] Commits que se enviarán a GitHub:" -ForegroundColor Yellow
$unpushed = git log origin/main..HEAD --oneline
if ($unpushed) {
    Write-Host $unpushed -ForegroundColor Cyan
    $count = ($unpushed | Measure-Object -Line).Lines
    Write-Host "`n  Total a pushear: $count commits" -ForegroundColor Magenta
} else {
    Write-Host "  (Ninguno - todo está sincronizado)" -ForegroundColor Green
}

# 5. Push a GitHub
Write-Host "`n[5] Haciendo push a GitHub..." -ForegroundColor Yellow
Write-Host "Ejecutando: git push origin main`n" -ForegroundColor Gray

git push origin main 2>&1 | ForEach-Object {
    Write-Host $_ -ForegroundColor White
}

# 6. Verificación final
Write-Host "`n[6] Verificación final:" -ForegroundColor Yellow
$finalCheck = git log origin/main..HEAD --oneline
if ($finalCheck) {
    Write-Host "⚠ AÚN HAY COMMITS SIN PUSHEAR:" -ForegroundColor Red
    Write-Host $finalCheck -ForegroundColor Red
} else {
    Write-Host "✓ TODOS LOS COMMITS ESTÁN EN GITHUB" -ForegroundColor Green
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "PROCESO COMPLETADO" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Ahora ve a GitHub y verifica:" -ForegroundColor Yellow
Write-Host "https://github.com/Xavraha/autoflow-frontend/commits/main`n" -ForegroundColor Cyan

Write-Host "Presiona ENTER para cerrar..." -ForegroundColor Gray
Read-Host
