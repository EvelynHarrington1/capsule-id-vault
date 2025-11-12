// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Encrypted Health Metrics Analysis Contract
/// @author Capsule ID Team
/// @notice Demonstrates privacy-preserving health data analysis using Fully Homomorphic Encryption (FHE)
/// @dev Users can submit encrypted health metrics (BMI, blood sugar, heart rate) and receive an encrypted health score
contract HealthMetrics is SepoliaConfig {
    
    /// @notice Structure to store encrypted health data for a user
    struct HealthData {
        euint32 bmi;           // Encrypted BMI value
        euint32 bloodSugar;    // Encrypted blood sugar level
        euint32 heartRate;     // Encrypted heart rate
        euint32 systolicBP;    // Encrypted systolic blood pressure
        euint32 diastolicBP;   // Encrypted diastolic blood pressure
        euint32 healthScore;   // Encrypted calculated health score
        uint256 timestamp;     // Timestamp of submission
        bool exists;           // Flag to check if data exists
    }
    
    /// @notice Mapping from user address to their encrypted health data
    mapping(address => HealthData) private healthRecords;
    
    /// @notice Array to track all users who have submitted data
    address[] private users;
    
    /// @notice Event emitted when health data is submitted
    event HealthDataSubmitted(address indexed user, uint256 timestamp);
    
    /// @notice Event emitted when health score is calculated
    event HealthScoreCalculated(address indexed user, uint256 timestamp);
    
    /// @notice Submit encrypted health metrics and calculate health score
    /// @param _bmi Encrypted BMI value (external format)
    /// @param _bmiProof Proof for BMI encryption
    /// @param _bloodSugar Encrypted blood sugar value (external format)
    /// @param _bloodSugarProof Proof for blood sugar encryption
    /// @param _heartRate Encrypted heart rate value (external format)
    /// @param _heartRateProof Proof for heart rate encryption
    /// @dev Enhanced formula: healthScore = 2*bmi + 4*bloodSugar + 2*heartRate + systolicBP/10 + diastolicBP/10
    /// @dev Improved weighting with blood pressure factors for comprehensive health assessment
    function submitHealthData(
        externalEuint32 _bmi,
        bytes calldata _bmiProof,
        externalEuint32 _bloodSugar,
        bytes calldata _bloodSugarProof,
        externalEuint32 _heartRate,
        bytes calldata _heartRateProof,
        externalEuint32 _systolicBP,
        bytes calldata _systolicBPProof,
        externalEuint32 _diastolicBP,
        bytes calldata _diastolicBPProof
    ) external {
        // Convert external encrypted inputs to internal encrypted values
        euint32 encryptedBmi = FHE.fromExternal(_bmi, _bmiProof);
        euint32 encryptedBloodSugar = FHE.fromExternal(_bloodSugar, _bloodSugarProof);
        euint32 encryptedHeartRate = FHE.fromExternal(_heartRate, _heartRateProof);
        euint32 encryptedSystolicBP = FHE.fromExternal(_systolicBP, _systolicBPProof);
        euint32 encryptedDiastolicBP = FHE.fromExternal(_diastolicBP, _diastolicBPProof);

        // Calculate enhanced health score using homomorphic operations
        // Formula: healthScore = 2*bmi + 4*bloodSugar + 2*heartRate + systolicBP/10 + diastolicBP/10
        // Improved weighting with blood pressure factors for comprehensive assessment
        euint32 bmiWeighted = FHE.mul(encryptedBmi, FHE.asEuint32(2));
        euint32 bloodSugarWeighted = FHE.mul(encryptedBloodSugar, FHE.asEuint32(4));
        euint32 heartRateWeighted = FHE.mul(encryptedHeartRate, FHE.asEuint32(2));
        euint32 systolicWeighted = FHE.div(encryptedSystolicBP, FHE.asEuint32(10));
        euint32 diastolicWeighted = FHE.div(encryptedDiastolicBP, FHE.asEuint32(10));

        euint32 healthScore = FHE.add(
            FHE.add(FHE.add(FHE.add(bmiWeighted, bloodSugarWeighted), heartRateWeighted), systolicWeighted),
            diastolicWeighted
        );
        
        // Track new users
        if (!healthRecords[msg.sender].exists) {
            users.push(msg.sender);
        }
        
        // Store encrypted health data
        healthRecords[msg.sender] = HealthData({
            bmi: encryptedBmi,
            bloodSugar: encryptedBloodSugar,
            heartRate: encryptedHeartRate,
            systolicBP: encryptedSystolicBP,
            diastolicBP: encryptedDiastolicBP,
            healthScore: healthScore,
            timestamp: block.timestamp,
            exists: true
        });
        
        // Grant decryption permissions to the user
        FHE.allow(encryptedBmi, msg.sender);
        FHE.allow(encryptedBloodSugar, msg.sender);
        FHE.allow(encryptedHeartRate, msg.sender);
        FHE.allow(encryptedSystolicBP, msg.sender);
        FHE.allow(encryptedDiastolicBP, msg.sender);
        FHE.allow(healthScore, msg.sender);
        
        // Also allow contract to access for future operations
        FHE.allowThis(encryptedBmi);
        FHE.allowThis(encryptedBloodSugar);
        FHE.allowThis(encryptedHeartRate);
        FHE.allowThis(healthScore);
        
        emit HealthDataSubmitted(msg.sender, block.timestamp);
        emit HealthScoreCalculated(msg.sender, block.timestamp);
    }
    
    /// @notice Get encrypted BMI value for the caller
    /// @return Encrypted BMI value
    function getBmi() external view returns (euint32) {
        require(healthRecords[msg.sender].exists, "No health data found");
        return healthRecords[msg.sender].bmi;
    }
    
    /// @notice Get encrypted blood sugar value for the caller
    /// @return Encrypted blood sugar value
    function getBloodSugar() external view returns (euint32) {
        require(healthRecords[msg.sender].exists, "No health data found");
        return healthRecords[msg.sender].bloodSugar;
    }
    
    /// @notice Get encrypted heart rate value for the caller
    /// @return Encrypted heart rate value
    function getHeartRate() external view returns (euint32) {
        require(healthRecords[msg.sender].exists, "No health data found");
        return healthRecords[msg.sender].heartRate;
    }
    
    /// @notice Get encrypted health score for the caller
    /// @return Encrypted health score value
    function getHealthScore() external view returns (euint32) {
        require(healthRecords[msg.sender].exists, "No health data found");
        return healthRecords[msg.sender].healthScore;
    }
    
    /// @notice Get timestamp of last health data submission
    /// @return Timestamp value
    function getTimestamp() external view returns (uint256) {
        require(healthRecords[msg.sender].exists, "No health data found");
        return healthRecords[msg.sender].timestamp;
    }
    
    /// @notice Check if user has submitted health data
    /// @return True if user has data, false otherwise
    function hasHealthData() external view returns (bool) {
        return healthRecords[msg.sender].exists;
    }
    
    /// @notice Get total number of users who have submitted data
    /// @return Total user count
    function getTotalUsers() external view returns (uint256) {
        return users.length;
    }
    
    /// @notice Get user address at specific index
    /// @param index Index in the users array
    /// @return User address
    function getUserAtIndex(uint256 index) external view returns (address) {
        require(index < users.length, "Index out of bounds");
        return users[index];
    }
}

