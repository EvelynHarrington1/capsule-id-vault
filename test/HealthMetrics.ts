import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { HealthMetrics, HealthMetrics__factory } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("HealthMetrics")) as HealthMetrics__factory;
  const healthMetricsContract = (await factory.deploy()) as HealthMetrics;
  const healthMetricsContractAddress = await healthMetricsContract.getAddress();

  return { healthMetricsContract, healthMetricsContractAddress };
}

describe("HealthMetrics", function () {
  let signers: Signers;
  let healthMetricsContract: HealthMetrics;
  let healthMetricsContractAddress: string;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2] };
  });

  beforeEach(async function () {
    // Check whether the tests are running against an FHEVM mock environment
    if (!fhevm.isMock) {
      console.warn(`This hardhat test suite cannot run on Sepolia Testnet`);
      this.skip();
    }

    ({ healthMetricsContract, healthMetricsContractAddress } = await deployFixture());
  });

  describe("Initial State", function () {
    it("should have no users initially", async function () {
      const totalUsers = await healthMetricsContract.getTotalUsers();
      expect(totalUsers).to.equal(0);
    });

    it("should return false for hasHealthData on new account", async function () {
      const hasData = await healthMetricsContract.connect(signers.alice).hasHealthData();
      expect(hasData).to.equal(false);
    });

    it("should revert when trying to get health data from account without data", async function () {
      await expect(healthMetricsContract.connect(signers.alice).getBmi()).to.be.revertedWith("No health data found");
    });
  });

  describe("Submit Health Data", function () {
    it("should successfully submit health data", async function () {
      const bmi = 25;
      const bloodSugar = 100;
      const heartRate = 75;

      // Encrypt health metrics
      const encryptedBmi = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(bmi)
        .encrypt();

      const encryptedBloodSugar = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(bloodSugar)
        .encrypt();

      const encryptedHeartRate = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(heartRate)
        .encrypt();

      // Submit health data
      const tx = await healthMetricsContract
        .connect(signers.alice)
        .submitHealthData(
          encryptedBmi.handles[0],
          encryptedBmi.inputProof,
          encryptedBloodSugar.handles[0],
          encryptedBloodSugar.inputProof,
          encryptedHeartRate.handles[0],
          encryptedHeartRate.inputProof
        );

      await tx.wait();

      // Verify data was stored
      const hasData = await healthMetricsContract.connect(signers.alice).hasHealthData();
      expect(hasData).to.equal(true);

      // Verify total users increased
      const totalUsers = await healthMetricsContract.getTotalUsers();
      expect(totalUsers).to.equal(1);
    });

    it("should calculate correct health score", async function () {
      const bmi = 25;
      const bloodSugar = 100;
      const heartRate = 75;

      // Expected score: 3*25 + 5*100 + 2*75 = 75 + 500 + 150 = 725
      const expectedScore = 3 * bmi + 5 * bloodSugar + 2 * heartRate;

      // Encrypt health metrics
      const encryptedBmi = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(bmi)
        .encrypt();

      const encryptedBloodSugar = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(bloodSugar)
        .encrypt();

      const encryptedHeartRate = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(heartRate)
        .encrypt();

      // Submit health data
      const tx = await healthMetricsContract
        .connect(signers.alice)
        .submitHealthData(
          encryptedBmi.handles[0],
          encryptedBmi.inputProof,
          encryptedBloodSugar.handles[0],
          encryptedBloodSugar.inputProof,
          encryptedHeartRate.handles[0],
          encryptedHeartRate.inputProof
        );

      await tx.wait();

      // Get encrypted health score
      const encryptedHealthScore = await healthMetricsContract.connect(signers.alice).getHealthScore();

      // Decrypt health score
      const clearHealthScore = await fhevm.userDecryptEuint(
        FhevmType.euint32,
        encryptedHealthScore,
        healthMetricsContractAddress,
        signers.alice
      );

      expect(clearHealthScore).to.equal(expectedScore);
    });

    it("should emit events when submitting health data", async function () {
      const bmi = 22;
      const bloodSugar = 95;
      const heartRate = 70;

      const encryptedBmi = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(bmi)
        .encrypt();

      const encryptedBloodSugar = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(bloodSugar)
        .encrypt();

      const encryptedHeartRate = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(heartRate)
        .encrypt();

      await expect(
        healthMetricsContract
          .connect(signers.alice)
          .submitHealthData(
            encryptedBmi.handles[0],
            encryptedBmi.inputProof,
            encryptedBloodSugar.handles[0],
            encryptedBloodSugar.inputProof,
            encryptedHeartRate.handles[0],
            encryptedHeartRate.inputProof
          )
      )
        .to.emit(healthMetricsContract, "HealthDataSubmitted")
        .and.to.emit(healthMetricsContract, "HealthScoreCalculated");
    });
  });

  describe("Retrieve Health Data", function () {
    beforeEach(async function () {
      // Submit test data for Alice
      const bmi = 25;
      const bloodSugar = 100;
      const heartRate = 75;

      const encryptedBmi = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(bmi)
        .encrypt();

      const encryptedBloodSugar = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(bloodSugar)
        .encrypt();

      const encryptedHeartRate = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(heartRate)
        .encrypt();

      await healthMetricsContract
        .connect(signers.alice)
        .submitHealthData(
          encryptedBmi.handles[0],
          encryptedBmi.inputProof,
          encryptedBloodSugar.handles[0],
          encryptedBloodSugar.inputProof,
          encryptedHeartRate.handles[0],
          encryptedHeartRate.inputProof
        );
    });

    it("should retrieve and decrypt BMI correctly", async function () {
      const encryptedBmi = await healthMetricsContract.connect(signers.alice).getBmi();
      const clearBmi = await fhevm.userDecryptEuint(
        FhevmType.euint32,
        encryptedBmi,
        healthMetricsContractAddress,
        signers.alice
      );

      expect(clearBmi).to.equal(25);
    });

    it("should retrieve and decrypt blood sugar correctly", async function () {
      const encryptedBloodSugar = await healthMetricsContract.connect(signers.alice).getBloodSugar();
      const clearBloodSugar = await fhevm.userDecryptEuint(
        FhevmType.euint32,
        encryptedBloodSugar,
        healthMetricsContractAddress,
        signers.alice
      );

      expect(clearBloodSugar).to.equal(100);
    });

    it("should retrieve and decrypt heart rate correctly", async function () {
      const encryptedHeartRate = await healthMetricsContract.connect(signers.alice).getHeartRate();
      const clearHeartRate = await fhevm.userDecryptEuint(
        FhevmType.euint32,
        encryptedHeartRate,
        healthMetricsContractAddress,
        signers.alice
      );

      expect(clearHeartRate).to.equal(75);
    });

    it("should get timestamp of submission", async function () {
      const timestamp = await healthMetricsContract.connect(signers.alice).getTimestamp();
      expect(timestamp).to.be.gt(0);
    });
  });

  describe("Multiple Users", function () {
    it("should track multiple users correctly", async function () {
      // Submit data for Alice
      const aliceData = { bmi: 25, bloodSugar: 100, heartRate: 75 };

      const aliceEncryptedBmi = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(aliceData.bmi)
        .encrypt();

      const aliceEncryptedBloodSugar = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(aliceData.bloodSugar)
        .encrypt();

      const aliceEncryptedHeartRate = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(aliceData.heartRate)
        .encrypt();

      await healthMetricsContract
        .connect(signers.alice)
        .submitHealthData(
          aliceEncryptedBmi.handles[0],
          aliceEncryptedBmi.inputProof,
          aliceEncryptedBloodSugar.handles[0],
          aliceEncryptedBloodSugar.inputProof,
          aliceEncryptedHeartRate.handles[0],
          aliceEncryptedHeartRate.inputProof
        );

      // Submit data for Bob
      const bobData = { bmi: 28, bloodSugar: 110, heartRate: 80 };

      const bobEncryptedBmi = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.bob.address)
        .add32(bobData.bmi)
        .encrypt();

      const bobEncryptedBloodSugar = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.bob.address)
        .add32(bobData.bloodSugar)
        .encrypt();

      const bobEncryptedHeartRate = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.bob.address)
        .add32(bobData.heartRate)
        .encrypt();

      await healthMetricsContract
        .connect(signers.bob)
        .submitHealthData(
          bobEncryptedBmi.handles[0],
          bobEncryptedBmi.inputProof,
          bobEncryptedBloodSugar.handles[0],
          bobEncryptedBloodSugar.inputProof,
          bobEncryptedHeartRate.handles[0],
          bobEncryptedHeartRate.inputProof
        );

      // Verify total users
      const totalUsers = await healthMetricsContract.getTotalUsers();
      expect(totalUsers).to.equal(2);

      // Verify both users have data
      expect(await healthMetricsContract.connect(signers.alice).hasHealthData()).to.equal(true);
      expect(await healthMetricsContract.connect(signers.bob).hasHealthData()).to.equal(true);

      // Verify Alice's data
      const aliceEncryptedScore = await healthMetricsContract.connect(signers.alice).getHealthScore();
      const aliceClearScore = await fhevm.userDecryptEuint(
        FhevmType.euint32,
        aliceEncryptedScore,
        healthMetricsContractAddress,
        signers.alice
      );

      const expectedAliceScore = 3 * aliceData.bmi + 5 * aliceData.bloodSugar + 2 * aliceData.heartRate;
      expect(aliceClearScore).to.equal(expectedAliceScore);

      // Verify Bob's data
      const bobEncryptedScore = await healthMetricsContract.connect(signers.bob).getHealthScore();
      const bobClearScore = await fhevm.userDecryptEuint(
        FhevmType.euint32,
        bobEncryptedScore,
        healthMetricsContractAddress,
        signers.bob
      );

      const expectedBobScore = 3 * bobData.bmi + 5 * bobData.bloodSugar + 2 * bobData.heartRate;
      expect(bobClearScore).to.equal(expectedBobScore);
    });

    it("should allow users to update their health data", async function () {
      // Initial submission
      const initialBmi = 25;
      let encryptedBmi = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(initialBmi)
        .encrypt();

      let encryptedBloodSugar = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(100)
        .encrypt();

      let encryptedHeartRate = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(75)
        .encrypt();

      await healthMetricsContract
        .connect(signers.alice)
        .submitHealthData(
          encryptedBmi.handles[0],
          encryptedBmi.inputProof,
          encryptedBloodSugar.handles[0],
          encryptedBloodSugar.inputProof,
          encryptedHeartRate.handles[0],
          encryptedHeartRate.inputProof
        );

      // Update with new data
      const updatedBmi = 23;
      encryptedBmi = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(updatedBmi)
        .encrypt();

      encryptedBloodSugar = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(95)
        .encrypt();

      encryptedHeartRate = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(70)
        .encrypt();

      await healthMetricsContract
        .connect(signers.alice)
        .submitHealthData(
          encryptedBmi.handles[0],
          encryptedBmi.inputProof,
          encryptedBloodSugar.handles[0],
          encryptedBloodSugar.inputProof,
          encryptedHeartRate.handles[0],
          encryptedHeartRate.inputProof
        );

      // Verify updated data
      const updatedEncryptedBmi = await healthMetricsContract.connect(signers.alice).getBmi();
      const clearBmi = await fhevm.userDecryptEuint(
        FhevmType.euint32,
        updatedEncryptedBmi,
        healthMetricsContractAddress,
        signers.alice
      );

      expect(clearBmi).to.equal(updatedBmi);

      // Verify user count didn't increase
      const totalUsers = await healthMetricsContract.getTotalUsers();
      expect(totalUsers).to.equal(1);
    });
  });

  describe("Edge Cases", function () {
    it("should handle zero values", async function () {
      const bmi = 0;
      const bloodSugar = 0;
      const heartRate = 0;

      const encryptedBmi = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(bmi)
        .encrypt();

      const encryptedBloodSugar = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(bloodSugar)
        .encrypt();

      const encryptedHeartRate = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(heartRate)
        .encrypt();

      await healthMetricsContract
        .connect(signers.alice)
        .submitHealthData(
          encryptedBmi.handles[0],
          encryptedBmi.inputProof,
          encryptedBloodSugar.handles[0],
          encryptedBloodSugar.inputProof,
          encryptedHeartRate.handles[0],
          encryptedHeartRate.inputProof
        );

      const encryptedHealthScore = await healthMetricsContract.connect(signers.alice).getHealthScore();
      const clearHealthScore = await fhevm.userDecryptEuint(
        FhevmType.euint32,
        encryptedHealthScore,
        healthMetricsContractAddress,
        signers.alice
      );

      expect(clearHealthScore).to.equal(0);
    });

    it("should handle large values", async function () {
      const bmi = 100;
      const bloodSugar = 200;
      const heartRate = 150;

      const expectedScore = 3 * bmi + 5 * bloodSugar + 2 * heartRate;

      const encryptedBmi = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(bmi)
        .encrypt();

      const encryptedBloodSugar = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(bloodSugar)
        .encrypt();

      const encryptedHeartRate = await fhevm
        .createEncryptedInput(healthMetricsContractAddress, signers.alice.address)
        .add32(heartRate)
        .encrypt();

      await healthMetricsContract
        .connect(signers.alice)
        .submitHealthData(
          encryptedBmi.handles[0],
          encryptedBmi.inputProof,
          encryptedBloodSugar.handles[0],
          encryptedBloodSugar.inputProof,
          encryptedHeartRate.handles[0],
          encryptedHeartRate.inputProof
        );

      const encryptedHealthScore = await healthMetricsContract.connect(signers.alice).getHealthScore();
      const clearHealthScore = await fhevm.userDecryptEuint(
        FhevmType.euint32,
        encryptedHealthScore,
        healthMetricsContractAddress,
        signers.alice
      );

      expect(clearHealthScore).to.equal(expectedScore);
    });
  });
});

