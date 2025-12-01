# Git commit and push script
$ErrorActionPreference = "Continue"

Write-Host "=== GIT STATUS ===" -ForegroundColor Cyan
git status

Write-Host "`n=== STAGING FILES ===" -ForegroundColor Cyan
git add -A
Write-Host "Files staged" -ForegroundColor Green

Write-Host "`n=== CREATING COMMIT ===" -ForegroundColor Cyan
$commitMessage = @"
fix: corregir navegacion de tareas y optimizar codigo

- Fix: JobCard ahora navega correctamente a /tasks/:id
- Eliminar componentes obsoletos  
- Limpiar App.jsx
- Mejorar SEO en index.html
"@

git commit -m $commitMessage

Write-Host "`n=== PUSHING TO GITHUB ===" -ForegroundColor Cyan
git push origin main

Write-Host "`n=== LATEST COMMITS ===" -ForegroundColor Cyan
git log --oneline -3

Write-Host "`n=== DONE ===" -ForegroundColor Green
