import { ethers } from "hardhat";

async function main() {
  console.log("Deploying HealthMetrics contract...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  const HealthMetrics = await ethers.getContractFactory("HealthMetrics");
  const healthMetrics = await HealthMetrics.deploy();

  await healthMetrics.waitForDeployment();

  const address = await healthMetrics.getAddress();
  console.log("\n✅ HealthMetrics deployed to:", address);
  console.log("\n📝 Update frontend/src/config/contract.ts with:");
  console.log(`export const CONTRACT_ADDRESS = '${address}';`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

