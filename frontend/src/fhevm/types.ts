// Enhanced FHEVM types for health metrics application

export interface FHEPublicKey {
  publicKey: string;
  verificationHash: string;
}

export interface FHEEncryptedValue {
  handles: string[];
  inputProof: string;
}

export interface HealthDataInput {
  bmi: FHEEncryptedValue;
  bloodSugar: FHEEncryptedValue;
  heartRate: FHEEncryptedValue;
  systolicBP: FHEEncryptedValue;
  diastolicBP: FHEEncryptedValue;
}

export interface HealthDataOutput {
  healthScore: FHEEncryptedValue;
  timestamp: number;
}

export interface UserDemographics {
  age: number;
  gender: 0 | 1 | 2; // 0: unspecified, 1: male, 2: female
  exists: boolean;
}

export interface HealthMetrics {
  bmi: number;
  bloodSugar: number;
  heartRate: number;
  systolicBP: number;
  diastolicBP: number;
  healthScore: number;
  timestamp: number;
  exists: boolean;
}

export interface PlatformStats {
  totalUsers: number;
  avgHealthScore: number;
  totalSubmissions: number;
  activeUsers: number;
}

export interface FHEContractError extends Error {
  code?: number;
  reason?: string;
  fheError?: boolean;
}

export interface ContractTransactionResult {
  success: boolean;
  txHash?: string;
  blockNumber?: number;
  gasUsed?: bigint;
  error?: string;
}

export interface HealthDataValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// FHEVM specific types
export interface FHEVMInstance {
  encrypt_uint32: (value: number) => Promise<FHEEncryptedValue>;
  encrypt_uint8: (value: number) => Promise<FHEEncryptedValue>;
  decrypt_uint32: (ciphertext: FHEEncryptedValue) => Promise<number>;
  decrypt_uint8: (ciphertext: FHEEncryptedValue) => Promise<number>;
}

export interface RelayerSDK {
  generatePublicKey: () => Promise<FHEPublicKey>;
  getPublicKey: (address: string) => Promise<FHEPublicKey | null>;
  setPublicKey: (publicKey: FHEPublicKey) => Promise<void>;
}

// Utility types for better type safety
export type HealthMetricType = 'bmi' | 'bloodSugar' | 'heartRate' | 'systolicBP' | 'diastolicBP';
export type GenderType = 0 | 1 | 2;
export type ErrorType = 'wallet' | 'network' | 'encryption' | 'contract' | 'validation';

export interface AppConfig {
  contractAddress: string;
  walletConnectProjectId: string;
  supportedChains: number[];
  fhevmEnabled: boolean;
}

export interface UIState {
  isLoading: boolean;
  isConnected: boolean;
  hasSubmittedData: boolean;
  hasDemographics: boolean;
}
