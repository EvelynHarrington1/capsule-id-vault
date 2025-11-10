// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title HealthMetrics - FHE-based health metrics analysis
/// @notice Allows users to submit encrypted health data and compute health scores
/// @dev Uses FHEVM for encrypted computation on health metrics
contract HealthMetrics is SepoliaConfig {
    // Encrypted health data storage
    mapping(address => euint32) private _bmi;
    mapping(address => euint32) private _bloodSugar;
    mapping(address => euint32) private _heartRate;
    mapping(address => euint32) private _healthScore;

    // User tracking
    mapping(address => bool) public hasHealthData;
    address[] private _users;

    // Events
    event HealthDataSubmitted(address indexed user);
    event HealthScoreCalculated(address indexed user, euint32 score);

    /// @notice Submit encrypted health metrics and calculate health score
    /// @param _bmi Encrypted BMI value
    /// @param _bmiProof ZK proof for BMI
    /// @param _bloodSugar Encrypted blood sugar value
    /// @param _bloodSugarProof ZK proof for blood sugar
    /// @param _heartRate Encrypted heart rate value
    /// @param _heartRateProof ZK proof for heart rate
    function submitHealthData(
        externalEuint32 _bmi,
        bytes calldata _bmiProof,
        externalEuint32 _bloodSugar,
        bytes calldata _bloodSugarProof,
        externalEuint32 _heartRate,
        bytes calldata _heartRateProof
    ) external {
        require(!hasHealthData[msg.sender], "Health data already submitted");

        // Decrypt and store encrypted values
        euint32 bmi = FHE.asEuint32(_bmi, _bmiProof);
        euint32 bloodSugar = FHE.asEuint32(_bloodSugar, _bloodSugarProof);
        euint32 heartRate = FHE.asEuint32(_heartRate, _heartRateProof);

        // Store encrypted values
        _bmi[msg.sender] = bmi;
        _bloodSugar[msg.sender] = bloodSugar;
        _heartRate[msg.sender] = heartRate;

        // Calculate health score: 3*BMI + 5*BloodSugar + 2*HeartRate
        euint32 score = FHE.add(
            FHE.add(
                FHE.mul(FHE.asEuint32(3), bmi),
                FHE.mul(FHE.asEuint32(5), bloodSugar)
            ),
            FHE.mul(FHE.asEuint32(2), heartRate)
        );

        _healthScore[msg.sender] = score;
        hasHealthData[msg.sender] = true;
        _users.push(msg.sender);

        emit HealthDataSubmitted(msg.sender);
        emit HealthScoreCalculated(msg.sender, score);
    }

    /// @notice Get encrypted BMI for caller
    function getBmi() external view returns (euint32) {
        require(hasHealthData[msg.sender], "No health data submitted");
        return _bmi[msg.sender];
    }

    /// @notice Get encrypted blood sugar for caller
    function getBloodSugar() external view returns (euint32) {
        require(hasHealthData[msg.sender], "No health data submitted");
        return _bloodSugar[msg.sender];
    }

    /// @notice Get encrypted heart rate for caller
    function getHeartRate() external view returns (euint32) {
        require(hasHealthData[msg.sender], "No health data submitted");
        return _heartRate[msg.sender];
    }

    /// @notice Get encrypted health score for caller
    function getHealthScore() external view returns (euint32) {
        require(hasHealthData[msg.sender], "No health data submitted");
        return _healthScore[msg.sender];
    }

    /// @notice Get total number of users with health data
    function getTotalUsers() external view returns (uint256) {
        return _users.length;
    }
}
