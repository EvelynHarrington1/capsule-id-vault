import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet } from 'wagmi/chains';
import { http } from 'viem';

const SEPOLIA_RPC_URL = 'https://1rpc.io/sepolia';

// Configure custom Sepolia chain with your Infura RPC
const sepolia = {
  id: 11155111,
  name: 'Sepolia',
  network: 'sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: [SEPOLIA_RPC_URL] },
    public: { http: [SEPOLIA_RPC_URL] },
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
  },
  testnet: true,
} as const;

// Configure custom localhost chain
const localhost = {
  id: 31337,
  name: 'Localhost',
  network: 'localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
  testnet: true,
} as const;

// For local development, you can use a placeholder Project ID
// For production, get a real Project ID from https://cloud.walletconnect.com
const WALLETCONNECT_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'placeholder_for_local_dev';

export const config = getDefaultConfig({
  appName: 'Capsule ID Vault',
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [sepolia, localhost, mainnet],
  transports: {
    [sepolia.id]: http(SEPOLIA_RPC_URL),
    [localhost.id]: http('http://127.0.0.1:8545'),
    [mainnet.id]: http(),
  },
  ssr: false,
});

