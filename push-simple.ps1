# Script simplificado para commit y push

Write-Host "=== INICIANDO PROCESO DE COMMIT Y PUSH ===" -ForegroundColor Cyan

# 1. Agregar archivos
Write-Host "`n[Paso 1] Agregando archivos modificados..." -ForegroundColor Yellow
git add src/pages/TaskDetail.jsx src/pages/NewTask.jsx
Write-Host "Archivos agregados" -ForegroundColor Green

# 2. Crear commit
Write-Host "`n[Paso 2] Creando commit..." -ForegroundColor Yellow
git commit -m "feat: upload imagenes/videos + scanner VIN - Funcionalidad completa de upload a Cloudinary - Scanner VIN corregido con API_URL - Soporte imagenes y videos - Botones eliminar archivos"
Write-Host "Commit creado" -ForegroundColor Green

# 3. Mostrar commits locales
Write-Host "`n[Paso 3] Ultimos commits locales:" -ForegroundColor Yellow
git log --oneline -3

# 4. Push a GitHub
Write-Host "`n[Paso 4] Haciendo push a GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "`n=== PROCESO COMPLETADO ===" -ForegroundColor Green
Write-Host "`nVerifica en: https://github.com/Xavraha/autoflow-frontend/commits/main" -ForegroundColor Cyan

pause
