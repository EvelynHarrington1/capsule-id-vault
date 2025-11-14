import { expect } from "chai";
import { ethers } from "hardhat";
import { HealthMetrics } from "../types/contracts/HealthMetrics";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("HealthMetrics - Batch Operations", function () {
  let healthMetrics: HealthMetrics;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const HealthMetricsFactory = await ethers.getContractFactory("HealthMetrics");
    healthMetrics = await HealthMetricsFactory.deploy();
    await healthMetrics.waitForDeployment();
  });

  describe("Emergency Controls", function () {
    it("Should allow emergency admin to activate emergency stop", async function () {
      await expect(healthMetrics.connect(owner).activateEmergencyStop())
        .to.emit(healthMetrics, "EmergencyStopActivated")
        .withArgs(owner.address);

      expect(await healthMetrics.emergencyStop()).to.be.true;
    });

    it("Should allow emergency admin to deactivate emergency stop", async function () {
      await healthMetrics.connect(owner).activateEmergencyStop();
      expect(await healthMetrics.emergencyStop()).to.be.true;

      await expect(healthMetrics.connect(owner).deactivateEmergencyStop())
        .to.emit(healthMetrics, "EmergencyStopDeactivated")
        .withArgs(owner.address);

      expect(await healthMetrics.emergencyStop()).to.be.false;
    });

    it("Should prevent health data submission during emergency stop", async function () {
      await healthMetrics.connect(owner).activateEmergencyStop();

      await expect(
        healthMetrics.connect(user1).submitHealthData(
          25, "0x", // BMI
          90, "0x", // Blood sugar
          70, "0x", // Heart rate
          120, "0x", // Systolic BP
          80, "0x"  // Diastolic BP
        )
      ).to.be.revertedWith("Contract is in emergency stop mode");
    });
  });

  describe("Demographics Integration", function () {
    it("Should allow users to set demographics", async function () {
      await expect(healthMetrics.connect(user1).setDemographics(30, 1))
        .to.emit(healthMetrics, "DemographicsUpdated")
        .withArgs(user1.address, 30, 1);

      const [age, gender, exists] = await healthMetrics.getDemographics(user1.address);
      expect(age).to.equal(30);
      expect(gender).to.equal(1);
      expect(exists).to.be.true;
    });

    it("Should validate age range", async function () {
      await expect(
        healthMetrics.connect(user1).setDemographics(17, 1)
      ).to.be.revertedWith("Age must be between 18 and 120");

      await expect(
        healthMetrics.connect(user1).setDemographics(121, 1)
      ).to.be.revertedWith("Age must be between 18 and 120");
    });

    it("Should validate gender codes", async function () {
      await expect(
        healthMetrics.connect(user1).setDemographics(30, 3)
      ).to.be.revertedWith("Invalid gender code");
    });
  });

  describe("Input Validation", function () {
    it("Should reject invalid health metrics", async function () {
      await expect(
        healthMetrics.connect(user1).submitHealthData(
          0, "0x", // Invalid BMI
          90, "0x",
          70, "0x",
          120, "0x",
          80, "0x"
        )
      ).to.be.revertedWith("Health metrics must be positive");
    });

    it("Should reject invalid blood pressure", async function () {
      await expect(
        healthMetrics.connect(user1).submitHealthData(
          25, "0x",
          90, "0x",
          70, "0x",
          80, "0x", // Systolic < Diastolic (invalid)
          120, "0x"
        )
      ).to.be.revertedWith("Systolic BP must be greater than diastolic BP");
    });

    it("Should accept valid health metrics", async function () {
      // Set demographics first
      await healthMetrics.connect(user1).setDemographics(30, 1);

      await expect(
        healthMetrics.connect(user1).submitHealthData(
          25, "0x", // BMI
          90, "0x", // Blood sugar
          70, "0x", // Heart rate
          120, "0x", // Systolic BP
          80, "0x"  // Diastolic BP
        )
      ).to.emit(healthMetrics, "HealthDataSubmitted");

      const [age, gender, exists] = await healthMetrics.getDemographics(user1.address);
      expect(exists).to.be.true;
    });
  });

  describe("Emergency Admin Management", function () {
    it("Should allow emergency admin to add new admins", async function () {
      await expect(healthMetrics.connect(owner).addEmergencyAdmin(user1.address))
        .to.emit(healthMetrics, "EmergencyAdminAdded")
        .withArgs(user1.address);

      expect(await healthMetrics.emergencyAdmins(user1.address)).to.be.true;
    });

    it("Should allow emergency admin to remove admins", async function () {
      await healthMetrics.connect(owner).addEmergencyAdmin(user1.address);
      expect(await healthMetrics.emergencyAdmins(user1.address)).to.be.true;

      await expect(healthMetrics.connect(owner).removeEmergencyAdmin(user1.address))
        .to.emit(healthMetrics, "EmergencyAdminRemoved")
        .withArgs(user1.address);

      expect(await healthMetrics.emergencyAdmins(user1.address)).to.be.false;
    });

    it("Should prevent non-admin from adding admins", async function () {
      await expect(
        healthMetrics.connect(user1).addEmergencyAdmin(user2.address)
      ).to.be.revertedWith("Only emergency admin can add admins");
    });

    it("Should prevent admin from removing themselves", async function () {
      await expect(
        healthMetrics.connect(owner).removeEmergencyAdmin(owner.address)
      ).to.be.revertedWith("Cannot remove yourself as admin");
    });
  });
});
