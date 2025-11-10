# Capsule ID Vault - Encrypted Health Metrics Analysis

![Capsule ID Vault Logo](./frontend/public/logo.svg)

A privacy-first health metrics analysis DApp using **Fully Homomorphic Encryption (FHE)** technology powered by Zama's FHEVM. Users can submit their health data (BMI, blood sugar, heart rate) in encrypted form, and the smart contract calculates a health score without ever seeing the unencrypted data.

## 🚀 Live Demo

**Deployed Application**: [https://capsule-id.vercel.app/](https://capsule-id.vercel.app/)

📹 **Demo Video**: [Watch the demo](https://github.com/EvelynHarrington1/capsule-id-vault/raw/main/capsule-id.mp4)

## 🚀 Live Demo

**Deployed Application**: [https://capsule-id-vault.vercel.app/](https://capsule-id-vault.vercel.app/)

📹 **Demo Video**: [Watch the demo](https://github.com/EvelynHarrington1/capsule-id-vault/raw/main/capsule-id.mp4)

## 🌐 Network Support

This DApp supports **Fully Homomorphic Encryption (FHE)** on the following networks:

- ✅ **Localhost (Chain ID: 31337)** - Using local Hardhat network with `fhevm-hardhat-plugin`
- ✅ **Sepolia Testnet (Chain ID: 11155111)** - Using Zama's FHEVM Sepolia configuration

The contract uses `SepoliaConfig` from `@fhevm/solidity` to enable FHE operations on both networks.

## 🌟 Features

- **Complete Privacy**: Health data is encrypted before submission and remains encrypted on-chain
- **Homomorphic Computation**: Health scores are calculated on encrypted data
- **User-Controlled Decryption**: Only the data owner can decrypt their health metrics
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Seamless Wallet Integration**: Easy wallet connection with MetaMask
- **Network Detection**: Automatic detection and warning if connected to wrong network

## 🔐 Core Smart Contract

### HealthMetrics.sol

The main contract implements fully encrypted health metrics storage and computation using Zama's FHEVM:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {FHE} from "@fhevm/solidity/lib/FHE.sol";

contract HealthMetrics is SepoliaConfig {
    struct HealthData {
        euint32 bmi;           // Encrypted BMI
        euint32 bloodSugar;    // Encrypted blood sugar
        euint32 heartRate;     // Encrypted heart rate
        euint32 healthScore;   // Encrypted computed health score
        uint256 timestamp;
        bool exists;
    }
    
    mapping(address => HealthData) private healthRecords;
    
    // Submit encrypted health data
    function submitHealthData(
        externalEuint32 _bmi,
        bytes calldata _bmiProof,
        externalEuint32 _bloodSugar,
        bytes calldata _bloodSugarProof,
        externalEuint32 _heartRate,
        bytes calldata _heartRateProof
    ) external {
        // Convert external encrypted inputs to internal encrypted values
        euint32 encryptedBmi = FHE.fromExternal(_bmi, _bmiProof);
        euint32 encryptedBloodSugar = FHE.fromExternal(_bloodSugar, _bloodSugarProof);
        euint32 encryptedHeartRate = FHE.fromExternal(_heartRate, _heartRateProof);
        
        // Calculate encrypted health score using homomorphic operations
        // Formula: healthScore = 3 * BMI + 5 * bloodSugar + 2 * heartRate
        euint32 bmiWeighted = FHE.mul(encryptedBmi, FHE.asEuint32(3));
        euint32 bloodSugarWeighted = FHE.mul(encryptedBloodSugar, FHE.asEuint32(5));
        euint32 heartRateWeighted = FHE.mul(encryptedHeartRate, FHE.asEuint32(2));
        
        euint32 healthScore = FHE.add(FHE.add(bmiWeighted, bloodSugarWeighted), heartRateWeighted);
        
        // Store encrypted data
        healthRecords[msg.sender] = HealthData({
            bmi: encryptedBmi,
            bloodSugar: encryptedBloodSugar,
            heartRate: encryptedHeartRate,
            healthScore: healthScore,
            timestamp: block.timestamp,
            exists: true
        });
        
        // Grant decryption permissions to the user
        FHE.allowThis(encryptedBmi);
        FHE.allowThis(encryptedBloodSugar);
        FHE.allowThis(encryptedHeartRate);
        FHE.allowThis(healthScore);
        
        FHE.allow(encryptedBmi, msg.sender);
        FHE.allow(encryptedBloodSugar, msg.sender);
        FHE.allow(encryptedHeartRate, msg.sender);
        FHE.allow(healthScore, msg.sender);
    }
}
```

**Key Privacy Features:**
- ✅ All health metrics stored as `euint32` (32-bit encrypted integers)
- ✅ Homomorphic arithmetic on encrypted data
- ✅ Fine-grained access control via `FHE.allow()`
- ✅ Zero plaintext data exposure on-chain

## 🔒 Encryption & Decryption Flow

### Client-Side Encryption

Before submitting data, the frontend encrypts each metric using fhevmjs:

```typescript
import { createInstance } from 'fhevmjs';

// 1. Initialize FHEVM instance
const fhevmInstance = await createInstance({
  chainId: chainId,
  publicKey: await contract.getPublicKey()
});

// 2. Create encrypted input with user's data
const encryptedInput = await fhevmInstance.createEncryptedInput(
  contractAddress,
  userAddress
);

// 3. Add each metric (values are encrypted locally)
encryptedInput.add32(bmiValue);        // BMI (e.g., 25)
encryptedInput.add32(bloodSugarValue); // Blood sugar (e.g., 100 mg/dL)
encryptedInput.add32(heartRateValue);  // Heart rate (e.g., 75 bpm)

// 4. Encrypt all inputs with zero-knowledge proofs
const encryptedData = await encryptedInput.encrypt();

// 5. Submit to contract
await contract.submitHealthData(
  encryptedData.handles[0],    // Encrypted BMI handle
  encryptedData.inputProof,    // ZK proof for BMI
  encryptedData.handles[1],    // Encrypted blood sugar handle
  encryptedData.inputProof,    // ZK proof for blood sugar
  encryptedData.handles[2],    // Encrypted heart rate handle
  encryptedData.inputProof     // ZK proof for heart rate
);
```

### On-Chain Homomorphic Operations

The smart contract performs calculations without ever seeing plaintext values:

```solidity
// All operations on encrypted data (euint32 type)
euint32 bmiWeighted = FHE.mul(encryptedBmi, FHE.asEuint32(3));
euint32 bloodSugarWeighted = FHE.mul(encryptedBloodSugar, FHE.asEuint32(5));
euint32 heartRateWeighted = FHE.mul(encryptedHeartRate, FHE.asEuint32(2));

// Encrypted addition
euint32 healthScore = FHE.add(
    FHE.add(bmiWeighted, bloodSugarWeighted),
    heartRateWeighted
);

// Result: healthScore = Enc(3×BMI + 5×bloodSugar + 2×heartRate)
```

**Formula**: `healthScore = 3 × BMI + 5 × bloodSugar + 2 × heartRate`

This weighted sum emphasizes:
- **Blood Sugar** (coefficient 5) - Highest impact on health score
- **BMI** (coefficient 3) - Medium impact
- **Heart Rate** (coefficient 2) - Lower impact

### Authorized Decryption

Only authorized users can decrypt their health data:

```typescript
// 1. Request encrypted value from contract
const encryptedBmi = await contract.getBmi();
const encryptedBloodSugar = await contract.getBloodSugar();
const encryptedHeartRate = await contract.getHeartRate();
const encryptedHealthScore = await contract.getHealthScore();

// 2. Decrypt using FHEVM instance (requires permission from contract)
const decryptedBmi = await fhevmInstance.decrypt(
  contractAddress,
  encryptedBmi
);
const decryptedBloodSugar = await fhevmInstance.decrypt(
  contractAddress,
  encryptedBloodSugar
);
const decryptedHeartRate = await fhevmInstance.decrypt(
  contractAddress,
  encryptedHeartRate
);
const decryptedHealthScore = await fhevmInstance.decrypt(
  contractAddress,
  encryptedHealthScore
);

console.log(`BMI: ${decryptedBmi}`);
console.log(`Blood Sugar: ${decryptedBloodSugar} mg/dL`);
console.log(`Heart Rate: ${decryptedHeartRate} bpm`);
console.log(`Health Score: ${decryptedHealthScore}`);
```

**Access Control**: The contract grants decryption permissions only to data owners:

```solidity
// Grant user permission to decrypt their own data
FHE.allow(encryptedBmi, msg.sender);
FHE.allow(encryptedBloodSugar, msg.sender);
FHE.allow(encryptedHeartRate, msg.sender);
FHE.allow(healthScore, msg.sender);
```

### Privacy Guarantees

| Data             | Storage Form          | Computation          | Access Control      |
| ---------------- | --------------------- | -------------------- | ------------------- |
| **BMI**          | ✅ Encrypted (euint32) | ✅ Homomorphic       | ⚠️ Owner only       |
| **Blood Sugar**  | ✅ Encrypted (euint32) | ✅ Homomorphic       | ⚠️ Owner only       |
| **Heart Rate**   | ✅ Encrypted (euint32) | ✅ Homomorphic       | ⚠️ Owner only       |
| **Health Score** | ✅ Encrypted (euint32) | ✅ Computed on ciphertext | ⚠️ Owner only |
| **Timestamp**    | ❌ Public (uint256)    | ❌ N/A               | ✅ Public           |
| **User Address** | ❌ Public (mapping key)| ❌ N/A               | ✅ Public           |

### Key Homomorphic Operations

FHEVM supports various operations on encrypted data:

```solidity
// Arithmetic operations
euint32 sum = FHE.add(encVal1, encVal2);
euint32 product = FHE.mul(encVal1, encVal2);
euint32 difference = FHE.sub(encVal1, encVal2);

// Comparison operations (returns encrypted boolean)
ebool isGreater = FHE.gt(encVal1, encVal2);
ebool isEqual = FHE.eq(encVal1, encVal2);
ebool isLess = FHE.lt(encVal1, encVal2);

// Conditional selection (encrypted ternary operator)
euint32 result = FHE.select(condition, valueIfTrue, valueIfFalse);

// Bitwise operations
euint32 andResult = FHE.and(encVal1, encVal2);
euint32 orResult = FHE.or(encVal1, encVal2);

// Type conversion
euint32 converted = FHE.asEuint32(plaintextValue);
```

## 🧩 Technology Stack

### Backend
- **Solidity ^0.8.24**: Smart contract language
- **Hardhat**: Development environment and testing framework
- **FHEVM**: Zama's Fully Homomorphic Encryption library (`@fhevm/solidity ^0.8.0`)
- **TypeScript**: Type-safe testing and deployment scripts

### Frontend
- **Vite + React 18**: Modern frontend framework with fast HMR
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling framework
- **ethers.js 6**: Ethereum interaction library
- **fhevmjs**: Client-side FHE encryption library

### Deployment
- **Vercel**: Frontend hosting with automatic deployments
- **Sepolia Testnet**: Smart contract deployment

## 📁 Project Structure

```
capsule-id-vault/
├── contracts/              # Solidity smart contracts
│   └── HealthMetrics.sol   # Main FHE health metrics contract
├── deploy/                 # Deployment scripts
│   └── deploy.ts
├── test/                   # Test suites
│   ├── HealthMetrics.ts          # Local network tests
│   └── HealthMetricsSepolia.ts   # Sepolia testnet tests
├── tasks/                  # Hardhat task scripts
│   ├── accounts.ts         # Account management
│   └── HealthMetrics.ts    # Contract interaction tasks
├── scripts/                # Utility scripts
│   ├── deploy.ts           # Main deployment script
│   ├── check-user-data.ts  # Data verification utility
│   └── *.ps1               # PowerShell automation scripts
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React UI components
│   │   │   ├── Header.tsx
│   │   │   ├── HealthDashboard.tsx
│   │   │   ├── HealthDataForm.tsx
│   │   │   ├── HealthDataDisplay.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── StatsCard.tsx
│   │   ├── hooks/          # Custom React hooks
│   │   │   ├── useHealthMetrics.ts
│   │   │   └── wagmi/      # Wallet connection hooks
│   │   ├── config/         # Configuration files
│   │   │   ├── contract.ts # Contract addresses and ABIs
│   │   │   └── wagmi.ts    # Wallet configuration
│   │   ├── fhevm/          # FHE encryption utilities
│   │   │   ├── useFhevm.tsx
│   │   │   └── internal/   # Core FHE logic
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Application entry point
│   ├── public/             # Static assets
│   │   ├── logo.svg
│   │   └── favicon.ico
│   ├── package.json
│   └── vite.config.ts
├── types/                  # TypeScript type definitions
├── hardhat.config.ts       # Hardhat configuration
├── package.json            # Backend dependencies
├── start.ps1               # Quick start script (Sepolia)
├── start-local.ps1         # Quick start script (localhost)
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- npm >= 7.0.0
- MetaMask or compatible Web3 wallet

### Installation

1. **Install backend dependencies:**

```bash
npm install
```

2. **Install frontend dependencies:**

```bash
cd frontend
npm install
cd ..
```

### Setup

1. **Configure Hardhat:**

```bash
npx hardhat vars setup
```

Set the following variables:
- `MNEMONIC`: Your wallet mnemonic (12 or 24 words)
- `INFURA_API_KEY`: Infura API key for Sepolia network
- `PRIVATE_KEY`: (Optional) Private key for deployment

2. **Update contract address:**

After deployment, update `frontend/src/config/contract.ts` with your deployed contract address:

```typescript
export const CONTRACT_ADDRESS = '0xYourDeployedContractAddress';
```

### Local Development

1. **Start local Hardhat node:**

```bash
npx hardhat node
```

Keep this terminal running.

2. **Deploy contracts (in another terminal):**

```bash
npm run deploy:local
```

3. **Start frontend:**

```bash
cd frontend
npm run dev
```

4. **Open browser:**

Navigate to `http://localhost:3000`

### Quick Start (PowerShell)

Use the automated startup scripts:

**For localhost:**
```bash
.\start-local.ps1
```

**For Sepolia:**
```bash
.\start.ps1
```

These scripts will:
1. Start Hardhat node (if localhost)
2. Deploy contracts
3. Launch frontend development server

## 🧪 Testing

### Local Tests

```bash
npm test
```

This runs the comprehensive test suite on the local Hardhat network with FHEVM mocking.

### Sepolia Tests

```bash
npm run test:sepolia
```

Runs tests against the actual Sepolia testnet deployment.

### Task Commands

```bash
# View available accounts
npx hardhat accounts --network localhost

# Submit health data
npx hardhat healthmetrics:submit --bmi 25 --bloodsugar 100 --heartrate 75 --network localhost

# Get your health data
npx hardhat healthmetrics:getdata --network localhost

# Get total users
npx hardhat healthmetrics:totalusers --network localhost

# Check if you have data
npx hardhat healthmetrics:hasdata --network localhost
```

## 🌐 Deployment

### Deploy to Sepolia

1. **Set environment variables:**

```bash
npx hardhat vars set MNEMONIC
npx hardhat vars set INFURA_API_KEY
```

2. **Deploy:**

```bash
npm run deploy:sepolia
```

3. **Update frontend configuration:**

Edit `frontend/src/config/contract.ts` with the new contract address.

4. **Deploy frontend to Vercel:**

```bash
cd frontend
vercel --prod
```

## 🎨 Frontend Features

### Components

- **Header**: Logo display and wallet connection button
- **HealthDashboard**: Main dashboard with statistics and data management
- **HealthDataForm**: Form for submitting encrypted health metrics
- **HealthDataDisplay**: Display and decrypt user's health data
- **StatsCard**: Reusable card component for displaying statistics
- **Footer**: Application footer with links and information

### UI Highlights

- Modern glassmorphism design with gradient accents
- Fully responsive layout for mobile, tablet, and desktop
- Real-time transaction status updates with loading states
- Smooth animations and transitions
- Accessible design following WCAG guidelines
- Dark theme optimized for readability

## 🔒 Security Considerations

1. **Client-Side Encryption**: All sensitive data is encrypted on the client before transmission
2. **Zero-Knowledge Proofs**: Every encrypted submission includes cryptographic proofs
3. **Access Control**: Only data owners can decrypt their information via `FHE.allow()`
4. **On-Chain Privacy**: Health data stored on blockchain is fully encrypted (euint32)
5. **No Plaintext Leakage**: Smart contract never sees unencrypted health values
6. **Homomorphic Computation**: All calculations performed on ciphertext

## 📝 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🆘 Support

For issues, questions, or suggestions, please open an issue on GitHub.

## 🙏 Acknowledgments

- **Zama** for pioneering FHEVM technology and making FHE accessible
- **Hardhat** for the excellent development framework
- **Vite** for blazing fast frontend tooling

## 📚 Additional Resources

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [fhevmjs Library](https://github.com/zama-ai/fhevmjs)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Vite Documentation](https://vitejs.dev/)
- [FHEVM Whitepaper](https://github.com/zama-ai/fhevm/blob/main/fhevm-whitepaper.pdf)

---

**Built with ❤️ using Fully Homomorphic Encryption**
