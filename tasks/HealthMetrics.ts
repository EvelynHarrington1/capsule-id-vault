import { FhevmType } from "@fhevm/hardhat-plugin";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

/**
 * Tutorial: Deploy and Interact Locally (--network localhost)
 * ===========================================================
 *
 * 1. From a separate terminal window:
 *
 *   npx hardhat node
 *
 * 2. Deploy the HealthMetrics contract
 *
 *   npx hardhat --network localhost deploy
 *
 * 3. Interact with the HealthMetrics contract
 *
 *   npx hardhat --network localhost task:submit-health --bmi 25 --bloodsugar 100 --heartrate 75
 *   npx hardhat --network localhost task:decrypt-health
 *   npx hardhat --network localhost task:get-stats
 *
 *
 * Tutorial: Deploy and Interact on Sepolia (--network sepolia)
 * ===========================================================
 *
 * 1. Deploy the HealthMetrics contract
 *
 *   npx hardhat --network sepolia deploy
 *
 * 2. Interact with the HealthMetrics contract
 *
 *   npx hardhat --network sepolia task:submit-health --bmi 25 --bloodsugar 100 --heartrate 75
 *   npx hardhat --network sepolia task:decrypt-health
 *   npx hardhat --network sepolia task:get-stats
 *
 */

/**
 * Example:
 *   - npx hardhat --network localhost task:address
 *   - npx hardhat --network sepolia task:address
 */
task("task:address", "Prints the HealthMetrics contract address").setAction(
  async function (_taskArguments: TaskArguments, hre) {
    const { deployments } = hre;

    const healthMetrics = await deployments.get("HealthMetrics");

    console.log("HealthMetrics contract address:", healthMetrics.address);
  }
);

/**
 * Example:
 *   - npx hardhat --network localhost task:submit-health --bmi 25 --bloodsugar 100 --heartrate 75
 *   - npx hardhat --network sepolia task:submit-health --bmi 25 --bloodsugar 100 --heartrate 75
 */
task("task:submit-health", "Submit encrypted health data")
  .addOptionalParam("address", "Optionally specify the HealthMetrics contract address")
  .addParam("bmi", "BMI value (e.g., 25)")
  .addParam("bloodsugar", "Blood sugar level (e.g., 100)")
  .addParam("heartrate", "Heart rate (e.g., 75)")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    const bmi = parseInt(taskArguments.bmi);
    const bloodSugar = parseInt(taskArguments.bloodsugar);
    const heartRate = parseInt(taskArguments.heartrate);

    if (!Number.isInteger(bmi) || !Number.isInteger(bloodSugar) || !Number.isInteger(heartRate)) {
      throw new Error("All health metrics must be integers");
    }

    await fhevm.initializeCLIApi();

    const healthMetricsDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("HealthMetrics");
    console.log(`HealthMetrics: ${healthMetricsDeployment.address}`);

    const signers = await ethers.getSigners();

    const healthMetricsContract = await ethers.getContractAt("HealthMetrics", healthMetricsDeployment.address);

    // Encrypt the health metrics
    const encryptedBmi = await fhevm
      .createEncryptedInput(healthMetricsDeployment.address, signers[0].address)
      .add32(bmi)
      .encrypt();

    const encryptedBloodSugar = await fhevm
      .createEncryptedInput(healthMetricsDeployment.address, signers[0].address)
      .add32(bloodSugar)
      .encrypt();

    const encryptedHeartRate = await fhevm
      .createEncryptedInput(healthMetricsDeployment.address, signers[0].address)
      .add32(heartRate)
      .encrypt();

    console.log("\n📊 Submitting encrypted health data...");
    console.log(`   BMI: ${bmi}`);
    console.log(`   Blood Sugar: ${bloodSugar}`);
    console.log(`   Heart Rate: ${heartRate}`);

    const tx = await healthMetricsContract
      .connect(signers[0])
      .submitHealthData(
        encryptedBmi.handles[0],
        encryptedBmi.inputProof,
        encryptedBloodSugar.handles[0],
        encryptedBloodSugar.inputProof,
        encryptedHeartRate.handles[0],
        encryptedHeartRate.inputProof
      );

    console.log(`\n⏳ Wait for tx: ${tx.hash}...`);

    const receipt = await tx.wait();
    console.log(`✅ Transaction confirmed! Status: ${receipt?.status}`);

    console.log("\n💡 Expected Health Score (unencrypted):", 3 * bmi + 5 * bloodSugar + 2 * heartRate);
    console.log("🔒 All data is encrypted on-chain!");
    console.log("\n🔍 Use 'task:decrypt-health' to view your encrypted health data");
  });

/**
 * Example:
 *   - npx hardhat --network localhost task:decrypt-health
 *   - npx hardhat --network sepolia task:decrypt-health
 */
task("task:decrypt-health", "Decrypt and display health data for the caller")
  .addOptionalParam("address", "Optionally specify the HealthMetrics contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    await fhevm.initializeCLIApi();

    const healthMetricsDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("HealthMetrics");
    console.log(`HealthMetrics: ${healthMetricsDeployment.address}`);

    const signers = await ethers.getSigners();

    const healthMetricsContract = await ethers.getContractAt("HealthMetrics", healthMetricsDeployment.address);

    // Check if user has data
    const hasData = await healthMetricsContract.hasHealthData();
    if (!hasData) {
      console.log("❌ No health data found for this account");
      console.log("💡 Use 'task:submit-health' to submit your health data first");
      return;
    }

    console.log("\n🔓 Decrypting health data...\n");

    // Get encrypted values
    const encryptedBmi = await healthMetricsContract.getBmi();
    const encryptedBloodSugar = await healthMetricsContract.getBloodSugar();
    const encryptedHeartRate = await healthMetricsContract.getHeartRate();
    const encryptedHealthScore = await healthMetricsContract.getHealthScore();
    const timestamp = await healthMetricsContract.getTimestamp();

    // Decrypt values
    const clearBmi = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedBmi,
      healthMetricsDeployment.address,
      signers[0]
    );

    const clearBloodSugar = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedBloodSugar,
      healthMetricsDeployment.address,
      signers[0]
    );

    const clearHeartRate = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedHeartRate,
      healthMetricsDeployment.address,
      signers[0]
    );

    const clearHealthScore = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedHealthScore,
      healthMetricsDeployment.address,
      signers[0]
    );

    // Display results
    console.log("📊 Health Metrics:");
    console.log("─────────────────────────────────");
    console.log(`   BMI:          ${clearBmi}`);
    console.log(`   Blood Sugar:  ${clearBloodSugar}`);
    console.log(`   Heart Rate:   ${clearHeartRate}`);
    console.log(`   Health Score: ${clearHealthScore}`);
    console.log("─────────────────────────────────");
    console.log(`   Timestamp:    ${new Date(Number(timestamp) * 1000).toLocaleString()}`);
    console.log("\n✨ All data was computed in encrypted form!");
  });

/**
 * Example:
 *   - npx hardhat --network localhost task:get-stats
 *   - npx hardhat --network sepolia task:get-stats
 */
task("task:get-stats", "Get general statistics from the contract")
  .addOptionalParam("address", "Optionally specify the HealthMetrics contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const healthMetricsDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("HealthMetrics");
    console.log(`HealthMetrics: ${healthMetricsDeployment.address}`);

    const healthMetricsContract = await ethers.getContractAt("HealthMetrics", healthMetricsDeployment.address);

    const totalUsers = await healthMetricsContract.getTotalUsers();
    const hasData = await healthMetricsContract.hasHealthData();

    console.log("\n📈 Contract Statistics:");
    console.log("─────────────────────────────────");
    console.log(`   Total Users: ${totalUsers}`);
    console.log(`   Your Data:   ${hasData ? "✅ Submitted" : "❌ Not submitted"}`);
    console.log("─────────────────────────────────\n");
  });

/**
 * Example:
 *   - npx hardhat --network localhost task:check-data
 *   - npx hardhat --network sepolia task:check-data
 */
task("task:check-data", "Check if current account has health data")
  .addOptionalParam("address", "Optionally specify the HealthMetrics contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const healthMetricsDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("HealthMetrics");

    const signers = await ethers.getSigners();
    const healthMetricsContract = await ethers.getContractAt("HealthMetrics", healthMetricsDeployment.address);

    const hasData = await healthMetricsContract.connect(signers[0]).hasHealthData();

    console.log("\n🔍 Account Status:");
    console.log(`   Address: ${signers[0].address}`);
    console.log(`   Has Data: ${hasData ? "✅ Yes" : "❌ No"}`);

    if (hasData) {
      const timestamp = await healthMetricsContract.getTimestamp();
      console.log(`   Last Update: ${new Date(Number(timestamp) * 1000).toLocaleString()}`);
    }
    console.log();
  });

