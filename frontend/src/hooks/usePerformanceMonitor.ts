import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  fheEncryptionTime: number;
  contractCallTime: number;
  decryptionTime: number;
  totalOperationTime: number;
  gasUsed?: bigint;
  timestamp: number;
}

interface PerformanceMonitorHook {
  startTiming: (operation: string) => void;
  endTiming: (operation: string, gasUsed?: bigint) => PerformanceMetrics | null;
  getAverageMetrics: () => {
    avgEncryptionTime: number;
    avgContractCallTime: number;
    avgDecryptionTime: number;
    avgTotalTime: number;
    totalOperations: number;
  };
  clearMetrics: () => void;
}

export function usePerformanceMonitor(): PerformanceMonitorHook {
  const timingsRef = useRef<Map<string, number>>(new Map());
  const metricsRef = useRef<PerformanceMetrics[]>([]);

  const startTiming = useCallback((operation: string) => {
    timingsRef.current.set(operation, performance.now());
  }, []);

  const endTiming = useCallback((operation: string, gasUsed?: bigint): PerformanceMetrics | null => {
    const startTime = timingsRef.current.get(operation);
    if (!startTime) return null;

    const endTime = performance.now();
    const duration = endTime - startTime;

    let metrics: PerformanceMetrics = {
      fheEncryptionTime: 0,
      contractCallTime: 0,
      decryptionTime: 0,
      totalOperationTime: duration,
      gasUsed,
      timestamp: Date.now()
    };

    // Categorize the timing based on operation type
    if (operation.includes('encrypt')) {
      metrics.fheEncryptionTime = duration;
    } else if (operation.includes('decrypt')) {
      metrics.decryptionTime = duration;
    } else if (operation.includes('contract') || operation.includes('submit')) {
      metrics.contractCallTime = duration;
    }

    metricsRef.current.push(metrics);
    timingsRef.current.delete(operation);

    // Keep only last 100 metrics to prevent memory leaks
    if (metricsRef.current.length > 100) {
      metricsRef.current = metricsRef.current.slice(-100);
    }

    return metrics;
  }, []);

  const getAverageMetrics = useCallback(() => {
    const metrics = metricsRef.current;
    if (metrics.length === 0) {
      return {
        avgEncryptionTime: 0,
        avgContractCallTime: 0,
        avgDecryptionTime: 0,
        avgTotalTime: 0,
        totalOperations: 0
      };
    }

    const totals = metrics.reduce(
      (acc, metric) => ({
        encryptionTime: acc.encryptionTime + metric.fheEncryptionTime,
        contractCallTime: acc.contractCallTime + metric.contractCallTime,
        decryptionTime: acc.decryptionTime + metric.decryptionTime,
        totalTime: acc.totalTime + metric.totalOperationTime
      }),
      { encryptionTime: 0, contractCallTime: 0, decryptionTime: 0, totalTime: 0 }
    );

    return {
      avgEncryptionTime: totals.encryptionTime / metrics.length,
      avgContractCallTime: totals.contractCallTime / metrics.length,
      avgDecryptionTime: totals.decryptionTime / metrics.length,
      avgTotalTime: totals.totalTime / metrics.length,
      totalOperations: metrics.length
    };
  }, []);

  const clearMetrics = useCallback(() => {
    metricsRef.current = [];
    timingsRef.current.clear();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timingsRef.current.clear();
      metricsRef.current = [];
    };
  }, []);

  return {
    startTiming,
    endTiming,
    getAverageMetrics,
    clearMetrics
  };
}

// Utility function to log performance metrics
export function logPerformanceMetrics(metrics: PerformanceMetrics, operation: string) {
  console.group(`🚀 Performance: ${operation}`);
  console.log(`Total Time: ${metrics.totalOperationTime.toFixed(2)}ms`);
  if (metrics.fheEncryptionTime > 0) {
    console.log(`FHE Encryption: ${metrics.fheEncryptionTime.toFixed(2)}ms`);
  }
  if (metrics.contractCallTime > 0) {
    console.log(`Contract Call: ${metrics.contractCallTime.toFixed(2)}ms`);
  }
  if (metrics.decryptionTime > 0) {
    console.log(`Decryption: ${metrics.decryptionTime.toFixed(2)}ms`);
  }
  if (metrics.gasUsed) {
    console.log(`Gas Used: ${metrics.gasUsed.toString()}`);
  }
  console.groupEnd();
}
