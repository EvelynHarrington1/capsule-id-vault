import { ethers } from 'ethers';
import { useCallback, useState, useMemo } from 'react';
import type { FhevmInstance } from '../fhevm/fhevmTypes';
import { FhevmDecryptionSignature } from '../fhevm/FhevmDecryptionSignature';
import type { GenericStringStorage } from '../fhevm/GenericStringStorage';
import { getContractAddress, CONTRACT_ABI } from '../config/contract';

type HealthRecord = {
  encryptedHandles: {
    bmi: string;
    bloodSugar: string;
    heartRate: string;
    healthScore: string;
  };
  timestamp: bigint;
};

type DecryptedHealthData = {
  bmi: number;
  bloodSugar: number;
  heartRate: number;
  healthScore: number;
  timestamp: bigint;
};

type UseHealthMetricsParams = {
  instance: FhevmInstance | undefined;
  ethersSigner: ethers.JsonRpcSigner | undefined;
  fhevmDecryptionSignatureStorage: GenericStringStorage;
  chainId: number | undefined;
};

export const useHealthMetrics = ({
  instance,
  ethersSigner,
  fhevmDecryptionSignatureStorage,
  chainId,
}: UseHealthMetricsParams) => {
  const [status, setStatus] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [encryptedRecord, setEncryptedRecord] = useState<HealthRecord | undefined>(undefined);
  const [decryptedData, setDecryptedData] = useState<DecryptedHealthData | undefined>(undefined);

  // Get contract address based on current chain
  const contractAddress = useMemo(() => getContractAddress(chainId), [chainId]);

  const writeContract = useMemo(
    () => (ethersSigner ? new ethers.Contract(contractAddress, CONTRACT_ABI, ethersSigner) : undefined),
    [ethersSigner, contractAddress]
  );

  // Fetch encrypted health data from contract
  const fetchEncryptedData = useCallback(async () => {
    if (!writeContract) {
      setStatus('Contract not ready');
      return undefined;
    }

    setIsFetching(true);
    setStatus('Fetching encrypted data...');

    try {
      // First check if user has data to avoid unnecessary revert errors
      try {
        const hasData = await writeContract.hasHealthData();
        if (!hasData) {
          setEncryptedRecord(undefined);
          setStatus('No health data found');
          return undefined;
        }
      } catch (hasDataError: any) {
        // If hasHealthData fails (e.g., method not available), continue with direct fetch
        // This provides backward compatibility
        console.log('hasHealthData check failed, proceeding with direct fetch:', hasDataError.message);
      }

      const [bmi, bloodSugar, heartRate, healthScore, ts] = await Promise.all([
        writeContract.getBmi(),
        writeContract.getBloodSugar(),
        writeContract.getHeartRate(),
        writeContract.getHealthScore(),
        writeContract.getTimestamp(),
      ]);

      // Check if data exists
      const isEmptyHandle = (handle: string) => {
        return !handle || handle === '0x' || BigInt(handle).toString() === '0';
      };

      if (isEmptyHandle(bmi as string)) {
        setEncryptedRecord(undefined);
        setStatus('No health data found');
        return undefined;
      }

      const record: HealthRecord = {
        encryptedHandles: {
          bmi: bmi as string,
          bloodSugar: bloodSugar as string,
          heartRate: heartRate as string,
          healthScore: healthScore as string,
        },
        timestamp: ts as bigint,
      };

      setEncryptedRecord(record);
      setStatus('Encrypted data loaded');
      return record;
    } catch (error: any) {
      // Handle various "no data" scenarios
      const isNoDataError =
        error.message?.includes('No health data found') ||
        error.message?.includes('could not decode result data') ||
        error.message?.includes('missing revert data') ||
        error.message?.includes('execution reverted') ||
        error.code === 'BAD_DATA' ||
        error.code === 'CALL_EXCEPTION' ||
        error.reason === null;

      if (isNoDataError) {
        setEncryptedRecord(undefined);
        setStatus('No health data found');
      } else {
        console.error('Error fetching health data:', error);
        setStatus(`Failed to fetch data: ${error.message || 'Unknown error'}`);
      }
      return undefined;
    } finally {
      setIsFetching(false);
    }
  }, [writeContract]);

  // Decrypt encrypted handles
  const decryptHandles = useCallback(
    async (handles: `0x${string}`[]) => {
      if (!instance || !ethersSigner) {
        throw new Error('FHEVM instance or signer not ready');
      }

      const signature = await FhevmDecryptionSignature.loadOrSign(
        instance,
        [contractAddress as `0x${string}`],
        ethersSigner,
        fhevmDecryptionSignatureStorage,
      );

      if (!signature) {
        throw new Error('Unable to obtain FHEVM decryption signature');
      }

      const decryptResult = await instance.userDecrypt(
        handles.map((handle) => ({ handle, contractAddress: contractAddress as `0x${string}` })),
        signature.privateKey,
        signature.publicKey,
        signature.signature,
        signature.contractAddresses,
        signature.userAddress,
        signature.startTimestamp,
        signature.durationDays,
      );

      return decryptResult;
    },
    [instance, ethersSigner, fhevmDecryptionSignatureStorage, contractAddress],
  );

  // Submit health data
  const submitHealthData = useCallback(
    async (bmi: number, bloodSugar: number, heartRate: number) => {
      if (!writeContract || !instance || !ethersSigner) {
        setStatus('Wallet or FHEVM is not ready');
        return false;
      }

      setIsSubmitting(true);
      setStatus('Encrypting health data...');

      try {
        const playerAddress = await ethersSigner.getAddress();

        // Encrypt all three metrics
        const encrypted = await instance
          .createEncryptedInput(contractAddress as `0x${string}`, playerAddress as `0x${string}`)
          .add32(Math.round(bmi))
          .add32(Math.round(bloodSugar))
          .add32(Math.round(heartRate))
          .encrypt();

        setStatus('Submitting to blockchain...');

        const tx = await writeContract.submitHealthData(
          encrypted.handles[0],
          encrypted.inputProof,
          encrypted.handles[1],
          encrypted.inputProof,
          encrypted.handles[2],
          encrypted.inputProof,
        );

        setStatus('Waiting for confirmation...');
        await tx.wait();

        setStatus('✅ Transaction confirmed! Waiting for data to sync...');

        // Sepolia needs longer wait time due to network latency and ACL propagation
        const isSepolia = chainId === 11155111;
        const initialWait = isSepolia ? 10000 : 5000; // 10s for Sepolia, 5s for localhost
        const retryWait = isSepolia ? 5000 : 3000;    // 5s for Sepolia, 3s for localhost
        const maxRetries = isSepolia ? 5 : 3;         // More retries for Sepolia

        await new Promise(resolve => setTimeout(resolve, initialWait));

        setStatus('📡 Fetching your encrypted data...');

        // Try to fetch data with retries
        let retryCount = 0;
        
        while (retryCount < maxRetries) {
          const result = await fetchEncryptedData();
          
          if (result) {
            setStatus('✅ Health data loaded successfully!');
            return true;
          }
          
          if (retryCount < maxRetries - 1) {
            const networkName = isSepolia ? 'Sepolia' : 'localhost';
            setStatus(`🔄 ${networkName} syncing... (${retryCount + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, retryWait));
          }
          
          retryCount++;
        }

        setStatus('⚠️ Data submitted but not loaded yet. Please click Refresh.');
        return true;
      } catch (error: any) {
        // Handle user rejection gracefully
        if (error.code === 4001 || error.message?.includes('User denied') || error.message?.includes('user rejected')) {
          setStatus('Transaction cancelled by user');
        } else if (error.message?.includes('insufficient funds')) {
          setStatus('Insufficient funds. Please ensure you have enough ETH for gas fees.');
        } else if (error.message?.includes('network')) {
          setStatus('Network error. Please check your connection and try again.');
        } else {
          setStatus(`Submission failed: ${error.message || 'Unknown error'}`);
        }
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [writeContract, instance, ethersSigner, fetchEncryptedData],
  );

  // Decrypt the current encrypted record
  const decryptCurrentRecord = useCallback(async () => {
    if (!encryptedRecord) {
      setStatus('No encrypted data to decrypt');
      return;
    }

    setIsDecrypting(true);
    setStatus('Decrypting health data...');

    try {
      const handles = [
        encryptedRecord.encryptedHandles.bmi,
        encryptedRecord.encryptedHandles.bloodSugar,
        encryptedRecord.encryptedHandles.heartRate,
        encryptedRecord.encryptedHandles.healthScore,
      ] as `0x${string}`[];

      const decrypted = await decryptHandles(handles);

      const bmiValue = Number(BigInt(decrypted[encryptedRecord.encryptedHandles.bmi]));
      const bloodSugarValue = Number(BigInt(decrypted[encryptedRecord.encryptedHandles.bloodSugar]));
      const heartRateValue = Number(BigInt(decrypted[encryptedRecord.encryptedHandles.heartRate]));
      const healthScoreValue = Number(BigInt(decrypted[encryptedRecord.encryptedHandles.healthScore]));

      const data: DecryptedHealthData = {
        bmi: bmiValue,
        bloodSugar: bloodSugarValue,
        heartRate: heartRateValue,
        healthScore: healthScoreValue,
        timestamp: encryptedRecord.timestamp,
      };

      setDecryptedData(data);
      setStatus('Health data decrypted successfully');
    } catch (error: any) {
      setStatus(`Decryption failed: ${error.message}`);
    } finally {
      setIsDecrypting(false);
    }
  }, [encryptedRecord, decryptHandles]);

  return {
    status,
    isSubmitting,
    isDecrypting,
    isFetching,
    encryptedRecord,
    decryptedData,
    submitHealthData,
    fetchEncryptedData,
    decryptCurrentRecord,
  } as const;
};

