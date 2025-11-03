import { ethers } from "hardhat";

async function main() {
  console.log("Deploying HealthMetrics contract to Sepolia...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    console.error("\n❌ Error: Account has no ETH!");
    console.log("Please get Sepolia ETH from a faucet:");
    console.log("- https://sepoliafaucet.com/");
    console.log("- https://www.infura.io/faucet/sepolia");
    process.exit(1);
  }

  console.log("\nDeploying contract...");
  const HealthMetrics = await ethers.getContractFactory("HealthMetrics");
  const healthMetrics = await HealthMetrics.deploy();

  console.log("Waiting for deployment...");
  await healthMetrics.waitForDeployment();

  const address = await healthMetrics.getAddress();
  console.log("\n✅ HealthMetrics deployed to Sepolia:", address);
  console.log("🔗 Etherscan:", `https://sepolia.etherscan.io/address/${address}`);
  console.log("\n📝 Update frontend/src/config/contract.ts with:");
  console.log(`export const CONTRACT_ADDRESS = '${address}';`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

