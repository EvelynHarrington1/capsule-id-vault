# PowerShell script to test contract interaction
# Prerequisites: Hardhat node must be running and contract must be deployed

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Testing Contract Interaction" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Get contract address
Write-Host "Getting contract address..." -ForegroundColor Yellow
npx hardhat --network localhost task:address

Write-Host ""
Write-Host "Submitting test health data..." -ForegroundColor Yellow
Write-Host "BMI: 25, Blood Sugar: 100, Heart Rate: 75" -ForegroundColor White

npx hardhat --network localhost task:submit-health --bmi 25 --bloodsugar 100 --heartrate 75

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to submit health data!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Decrypting health data..." -ForegroundColor Yellow
npx hardhat --network localhost task:decrypt-health

Write-Host ""
Write-Host "Getting contract statistics..." -ForegroundColor Yellow
npx hardhat --network localhost task:get-stats

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "Contract Test Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

