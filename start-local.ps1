# Capsule ID Vault - Local startup script

Write-Host "=== Capsule ID Vault Local Environment ===" -ForegroundColor Green
Write-Host ""

# Step 1: Start Hardhat node
Write-Host "[1/3] Starting Hardhat node in new window..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host 'Hardhat Local Node' -ForegroundColor Cyan; npx hardhat node"

# Wait for node to start
Write-Host "Waiting for node to initialize (15 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Step 2: Deploy contract
Write-Host "[2/3] Deploying contract to localhost..." -ForegroundColor Yellow
npx hardhat deploy --network localhost

if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed! Please check if Hardhat node is running." -ForegroundColor Red
    exit 1
}

Write-Host "Contract deployed successfully!" -ForegroundColor Green
Write-Host ""

# Step 3: Start frontend
Write-Host "[3/3] Starting frontend in new window..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host 'Frontend Dev Server' -ForegroundColor Cyan; npm install; npm run dev"

Write-Host ""
Write-Host "=== Startup Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Service URLs:" -ForegroundColor Cyan
Write-Host "  - Hardhat Node: http://localhost:8545" -ForegroundColor White
Write-Host "  - Frontend App: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Open http://localhost:3000 in your browser" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to close this window (services will continue running)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

