import { ethers } from "hardhat";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

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
  
  // Automatically update frontend config
  try {
    const configPath = join(__dirname, "../frontend/src/config/contract.ts");
    let configContent = readFileSync(configPath, "utf-8");
    
    // Update the localhost address
    const addressRegex = /localhost:\s*'0x[a-fA-F0-9]+'/;
    const newAddressLine = `localhost: '${address}'`;
    
    if (addressRegex.test(configContent)) {
      configContent = configContent.replace(addressRegex, newAddressLine);
      writeFileSync(configPath, configContent, "utf-8");
      console.log("\n✅ Frontend config updated automatically!");
    } else {
      console.log("\n⚠️  Could not auto-update config. Please manually update:");
      console.log(`   frontend/src/config/contract.ts`);
      console.log(`   localhost: '${address}'`);
    }
  } catch (error) {
    console.log("\n⚠️  Could not auto-update config. Please manually update:");
    console.log(`   frontend/src/config/contract.ts`);
    console.log(`   localhost: '${address}'`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

