# PowerShell script to deploy and test Capsule ID Vault locally
# Run this script from the project root directory

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Capsule ID Vault - Local Deployment" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Compile contracts
Write-Host ""
Write-Host "Compiling contracts..." -ForegroundColor Yellow
npm run compile

if ($LASTEXITCODE -ne 0) {
    Write-Host "Compilation failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Contracts compiled successfully!" -ForegroundColor Green

# Run tests
Write-Host ""
Write-Host "Running tests..." -ForegroundColor Yellow
npm test

if ($LASTEXITCODE -ne 0) {
    Write-Host "Tests failed!" -ForegroundColor Red
    exit 1
}

Write-Host "All tests passed!" -ForegroundColor Green

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "1. Start local node: npm run node" -ForegroundColor White
Write-Host "2. Deploy contract: npm run deploy:local" -ForegroundColor White
Write-Host "3. Start frontend: npm run frontend:dev" -ForegroundColor White
Write-Host ""

