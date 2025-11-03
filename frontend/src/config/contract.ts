// Contract addresses for different networks
// Both Sepolia and Localhost support FHE through SepoliaConfig
// Production deployment uses Sepolia for Vercel: https://capsule-id-vault.vercel.app/
export const CONTRACT_ADDRESSES = {
  localhost: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', // FHE-enabled (local development)
  sepolia: '0x1c39401C7e3908C24D9c4b732782151b1809D225',   // FHE-enabled (production on Vercel)
} as const;

export const NETWORK_CONFIG = {
  localhost: {
    chainId: 31337,
    name: 'Localhost',
    rpcUrl: 'http://localhost:8545',
    contractAddress: CONTRACT_ADDRESSES.localhost,
  },
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990',
    contractAddress: CONTRACT_ADDRESSES.sepolia,
  },
} as const;

// Helper function to get contract address based on chain ID
export function getContractAddress(chainId: number | undefined): string {
  if (chainId === 31337) {
    return CONTRACT_ADDRESSES.localhost;
  } else if (chainId === 11155111) {
    return CONTRACT_ADDRESSES.sepolia;
  }
  // Default to localhost
  return CONTRACT_ADDRESSES.localhost;
}

// For backward compatibility
export const CONTRACT_ADDRESS = CONTRACT_ADDRESSES.localhost;

// Import the generated ABI
import abiJson from './abi.json';

export const CONTRACT_ABI = abiJson;

