import { ethers } from "hardhat";
import { HealthMetrics } from "../types/contracts/HealthMetrics";

async function main() {
  console.log("🔍 Verifying HealthMetrics deployment...\n");

  // Get deployed contract
  const healthMetricsAddress = process.env.HEALTH_METRICS_ADDRESS;
  if (!healthMetricsAddress) {
    throw new Error("HEALTH_METRICS_ADDRESS environment variable not set");
  }

  const healthMetrics = await ethers.getContractAt("HealthMetrics", healthMetricsAddress) as HealthMetrics;

  console.log(`📋 Contract Address: ${healthMetricsAddress}`);
  console.log(`🌐 Network: ${(await ethers.provider.getNetwork()).name}\n`);

  // Test basic functionality
  console.log("🧪 Testing basic contract functionality...\n");

  // Check emergency stop status
  const emergencyStop = await healthMetrics.emergencyStop();
  console.log(`🚨 Emergency Stop: ${emergencyStop ? "ACTIVE" : "INACTIVE"}`);

  // Get total users count
  try {
    const userCount = await healthMetrics.getUsersCount();
    console.log(`👥 Total Users: ${userCount}`);
  } catch (error) {
    console.log(`❌ Error getting user count: ${error}`);
  }

  // Test contract ownership/admin status
  const [signer] = await ethers.getSigners();
  const isEmergencyAdmin = await healthMetrics.emergencyAdmins(signer.address);
  console.log(`👑 Is Emergency Admin: ${isEmergencyAdmin}`);

  // Test demographics functionality
  console.log("\n📊 Testing demographics functionality...");
  try {
    await healthMetrics.setDemographics(30, 1);
    const [age, gender, exists] = await healthMetrics.getDemographics(signer.address);
    console.log(`✅ Demographics set - Age: ${age}, Gender: ${gender}, Exists: ${exists}`);
  } catch (error) {
    console.log(`❌ Demographics test failed: ${error}`);
  }

  console.log("\n🎉 Deployment verification completed!");
  console.log("\n📝 Next steps:");
  console.log("1. Update frontend .env.local with contract address");
  console.log("2. Test frontend integration");
  console.log("3. Run full test suite on target network");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment verification failed:", error);
    process.exit(1);
  });
