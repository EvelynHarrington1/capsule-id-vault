# PowerShell script to start complete development environment
# This script starts both backend node and frontend dev server

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Starting Development Environment" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Start Hardhat node in background
Write-Host "Starting Hardhat node..." -ForegroundColor Yellow
$nodeProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run node" -PassThru

# Wait for node to be ready
Write-Host "Waiting for node to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Deploy contract
Write-Host ""
Write-Host "Deploying contract..." -ForegroundColor Yellow
npm run deploy:local

if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed!" -ForegroundColor Red
    Stop-Process -Id $nodeProcess.Id
    exit 1
}

Write-Host "Contract deployed successfully!" -ForegroundColor Green

# Start frontend
Write-Host ""
Write-Host "Starting frontend..." -ForegroundColor Yellow
cd frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
cd ..

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "Development Environment Ready!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Hardhat Node: http://localhost:8545" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to stop all services..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Cleanup
Stop-Process -Id $nodeProcess.Id
Write-Host "Services stopped." -ForegroundColor Yellow

