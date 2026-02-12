# Refresh environment variables for the current session
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   GitHub CLI Setup Helper (Auto-Fix)     " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Installing/Detecting gh command..." -ForegroundColor Green

# Verify gh command
if (Get-Command gh -ErrorAction SilentlyContinue) {
    Write-Host "OK: gh command found!" -ForegroundColor Green
    Write-Host "Starting authentication..." -ForegroundColor Yellow
    Write-Host "Please follow the instructions:"
    Write-Host "1. Press Enter used to select options."
    Write-Host "2. Copy the code."
    Write-Host "3. Paste it in the browser."
    Write-Host ""
    gh auth login
}
else {
    Write-Host "ERROR: gh command still not found." -ForegroundColor Red
    Write-Host "Please try restarting VS Code completely." -ForegroundColor Red
}
