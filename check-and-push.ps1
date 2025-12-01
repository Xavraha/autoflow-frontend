Write-Host "=== VERIFICANDO ESTADO DE GIT ===" -ForegroundColor Cyan

Write-Host "`n1. Git Status:" -ForegroundColor Yellow
git status

Write-Host "`n2. Últimos 5 Commits Locales:" -ForegroundColor Yellow
git log --oneline -5

Write-Host "`n3. Verificando Rama Actual:" -ForegroundColor Yellow
git branch

Write-Host "`n4. Verificando Commits Pendientes de Push:" -ForegroundColor Yellow
git log origin/main..HEAD --oneline

Write-Host "`n5. Intentando Push:" -ForegroundColor Yellow
git push origin main --verbose

Write-Host "`n=== PROCESO COMPLETADO ===" -ForegroundColor Green
