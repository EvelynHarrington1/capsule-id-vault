import { expect } from "chai";
import { ethers, deployments, fhevm } from "hardhat";
import { FhevmType } from "@fhevm/hardhat-plugin";
import type { HealthMetrics } from "../types";
import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("HealthMetrics - Sepolia Integration Tests", function () {
  let contract: HealthMetrics;
  let contractAddress: string;
  let user: HardhatEthersSigner;

  before(async function () {
    // Skip if running on mock (local) environment
    if (fhevm.isMock) {
      console.warn(`Skipping Sepolia tests in mock environment`);
      this.skip();
    }

    // Get deployed contract from deployments
    const deployment = await deployments.get("HealthMetrics");
    contractAddress = deployment.address;
    contract = (await ethers.getContractAt("HealthMetrics", deployment.address)) as HealthMetrics;

    const signers = await ethers.getSigners();
    [user] = signers;
  });

  it("should submit health data and decrypt results on Sepolia", async function () {
    this.timeout(5 * 60 * 1000); // 5 minutes timeout for Sepolia operations

    const bmi = 25;
    const bloodSugar = 100;
    const heartRate = 75;
    const expectedScore = 3 * bmi + 5 * bloodSugar + 2 * heartRate; // 725

    console.log(`  → Creating encrypted inputs...`);
    console.log(`     BMI: ${bmi}, Blood Sugar: ${bloodSugar}, Heart Rate: ${heartRate}`);
    
    const encryptedBmi = await fhevm
      .createEncryptedInput(contractAddress, user.address)
      .add32(bmi)
      .encrypt();

    const encryptedBloodSugar = await fhevm
      .createEncryptedInput(contractAddress, user.address)
      .add32(bloodSugar)
      .encrypt();

    const encryptedHeartRate = await fhevm
      .createEncryptedInput(contractAddress, user.address)
      .add32(heartRate)
      .encrypt();

    console.log(`  → Submitting health data to contract ${contractAddress}...`);
    const tx = await contract
      .connect(user)
      .submitHealthData(
        encryptedBmi.handles[0],
        encryptedBmi.inputProof,
        encryptedBloodSugar.handles[0],
        encryptedBloodSugar.inputProof,
        encryptedHeartRate.handles[0],
        encryptedHeartRate.inputProof
      );

    const receipt = await tx.wait();
    console.log(`  → Transaction confirmed: ${receipt?.hash}`);

    // Check if user has data
    const hasData = await contract.hasHealthData();
    console.log(`  → User has health data: ${hasData}`);
    expect(hasData).to.equal(true);

    console.log(`  → Fetching encrypted health metrics...`);
    const encBmi = await contract.connect(user).getBmi();
    const encBloodSugar = await contract.connect(user).getBloodSugar();
    const encHeartRate = await contract.connect(user).getHeartRate();
    const encHealthScore = await contract.connect(user).getHealthScore();

    console.log(`  → Waiting 10 seconds for ACL updates to propagate...`);
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log(`  → Decrypting BMI...`);
    const decryptedBmi = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encBmi,
      contractAddress,
      user
    );
    console.log(`  → Decrypted BMI: ${decryptedBmi}`);

    console.log(`  → Decrypting Blood Sugar...`);
    const decryptedBloodSugar = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encBloodSugar,
      contractAddress,
      user
    );
    console.log(`  → Decrypted Blood Sugar: ${decryptedBloodSugar}`);

    console.log(`  → Decrypting Heart Rate...`);
    const decryptedHeartRate = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encHeartRate,
      contractAddress,
      user
    );
    console.log(`  → Decrypted Heart Rate: ${decryptedHeartRate}`);

    console.log(`  → Decrypting Health Score...`);
    const decryptedHealthScore = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encHealthScore,
      contractAddress,
      user
    );
    console.log(`  → Decrypted Health Score: ${decryptedHealthScore}`);

    // Verify decrypted values
    expect(decryptedBmi).to.equal(BigInt(bmi));
    expect(decryptedBloodSugar).to.equal(BigInt(bloodSugar));
    expect(decryptedHeartRate).to.equal(BigInt(heartRate));
    expect(decryptedHealthScore).to.equal(BigInt(expectedScore));

    console.log(`  ✅ All health metrics successfully submitted and decrypted on Sepolia`);
  });

  it("should get contract statistics on Sepolia", async function () {
    this.timeout(2 * 60 * 1000);

    console.log(`  → Fetching contract statistics...`);
    const totalUsers = await contract.getTotalUsers();
    console.log(`  → Total users: ${totalUsers}`);
    
    expect(totalUsers).to.be.greaterThan(0n);

    const timestamp = await contract.getTimestamp();
    console.log(`  → Last submission timestamp: ${timestamp}`);
    
    expect(timestamp).to.be.greaterThan(0n);
  });
});
