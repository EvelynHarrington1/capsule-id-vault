import "@fhevm/hardhat-plugin";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";
import "@typechain/hardhat";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import type { HardhatUserConfig } from "hardhat/config";
import { vars } from "hardhat/config";
import "solidity-coverage";

import "./tasks/accounts";
import "./tasks/HealthMetrics";

// Run 'npx hardhat vars setup' to see the list of variables that need to be set

const MNEMONIC: string = vars.get("MNEMONIC", "test test test test test test test test test test test junk");
const INFURA_API_KEY: string = vars.get("INFURA_API_KEY", "");
const SEPOLIA_RPC_URL: string =
  INFURA_API_KEY !== "" ? `https://sepolia.infura.io/v3/${INFURA_API_KEY}` : vars.get("SEPOLIA_RPC_URL", "https://1rpc.io/sepolia");
const PRIVATE_KEY: string = vars.get("PRIVATE_KEY", "");

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  namedAccounts: {
    deployer: 0,
  },
  etherscan: {
    apiKey: {
      sepolia: vars.get("ETHERSCAN_API_KEY", ""),
    },
  },
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic: MNEMONIC,
      },
      chainId: 31337,
    },
    localhost: {
      accounts: {
        mnemonic: MNEMONIC,
        path: "m/44'/60'/0'/0/",
        count: 10,
      },
      chainId: 31337,
      url: "http://localhost:8545",
    },
    anvil: {
      accounts: {
        mnemonic: MNEMONIC,
        path: "m/44'/60'/0'/0/",
        count: 10,
      },
      chainId: 31337,
      url: "http://localhost:8545",
    },
    sepolia: {
      accounts:
        PRIVATE_KEY && PRIVATE_KEY.trim().length > 0
          ? [PRIVATE_KEY]
          : {
              mnemonic: MNEMONIC,
              path: "m/44'/60'/0'/0/",
              count: 10,
            },
      chainId: 11155111,
      url: SEPOLIA_RPC_URL,
      gasPrice: 20000000000, // 20 gwei for Sepolia
    },
    zamaTestnet: {
      accounts:
        PRIVATE_KEY && PRIVATE_KEY.trim().length > 0
          ? [PRIVATE_KEY]
          : {
              mnemonic: MNEMONIC,
              path: "m/44'/60'/0'/0/",
              count: 10,
            },
      chainId: 8009,
      url: "https://devnet.zama.ai",
      gasPrice: 1000000000, // 1 gwei for Zama testnet
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.24",
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/hardhat-template/issues/31
        bytecodeHash: "none",
      },
      // Enhanced optimizer settings for FHE operations
      optimizer: {
        enabled: true,
        runs: 1000, // Increased for better FHE operation optimization
        details: {
          yul: true,
          yulDetails: {
            stackAllocation: true,
          },
        },
      },
      evmVersion: "cancun",
      viaIR: true, // Enable IR-based compilation for better optimization
    },
  },
  typechain: {
    outDir: "types",
    target: "ethers-v6",
  },
};

export default config;

