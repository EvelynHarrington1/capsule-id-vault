import { useState, useCallback } from 'react';
import { useHealthMetrics } from './useHealthMetrics';

interface ExportData {
  userAddress: string;
  demographics: {
    age: number;
    gender: number;
    exists: boolean;
  };
  healthData: {
    bmi: number;
    bloodSugar: number;
    heartRate: number;
    systolicBP: number;
    diastolicBP: number;
    healthScore: number;
    timestamp: number;
    exists: boolean;
  };
  exportDate: string;
}

export function useDataExport() {
  const [isExporting, setIsExporting] = useState(false);
  const { contract, isConnected } = useHealthMetrics();

  const exportUserData = useCallback(async (): Promise<ExportData | null> => {
    if (!contract || !isConnected) {
      throw new Error('Contract not connected');
    }

    setIsExporting(true);
    try {
      const [signer] = await contract.runner?.provider?.listAccounts() || [];
      if (!signer) {
        throw new Error('No signer available');
      }

      // Get demographics
      const [age, gender, exists] = await contract.getDemographics(signer.address);

      // Get health data (this would need to be decrypted in a real implementation)
      // For demo purposes, we'll create a placeholder structure
      const exportData: ExportData = {
        userAddress: signer.address,
        demographics: {
          age: Number(age),
          gender: Number(gender),
          exists
        },
        healthData: {
          bmi: 0, // Would be decrypted value
          bloodSugar: 0, // Would be decrypted value
          heartRate: 0, // Would be decrypted value
          systolicBP: 0, // Would be decrypted value
          diastolicBP: 0, // Would be decrypted value
          healthScore: 0, // Would be decrypted value
          timestamp: Date.now(),
          exists: false // Would check if user has submitted data
        },
        exportDate: new Date().toISOString()
      };

      return exportData;
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, [contract, isConnected]);

  const downloadAsJSON = useCallback(async (filename?: string) => {
    try {
      const data = await exportUserData();
      if (!data) return;

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `health-data-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  }, [exportUserData]);

  const downloadAsCSV = useCallback(async (filename?: string) => {
    try {
      const data = await exportUserData();
      if (!data) return;

      // Create CSV content
      const csvContent = [
        'Field,Value',
        `User Address,${data.userAddress}`,
        `Age,${data.demographics.age}`,
        `Gender,${data.demographics.gender === 1 ? 'Male' : data.demographics.gender === 2 ? 'Female' : 'Unspecified'}`,
        `Demographics Set,${data.demographics.exists}`,
        `BMI,${data.healthData.bmi}`,
        `Blood Sugar,${data.healthData.bloodSugar}`,
        `Heart Rate,${data.healthData.heartRate}`,
        `Systolic BP,${data.healthData.systolicBP}`,
        `Diastolic BP,${data.healthData.diastolicBP}`,
        `Health Score,${data.healthData.healthScore}`,
        `Data Timestamp,${new Date(data.healthData.timestamp).toLocaleString()}`,
        `Has Health Data,${data.healthData.exists}`,
        `Export Date,${data.exportDate}`
      ].join('\n');

      const blob = new Blob([csvContent], {
        type: 'text/csv'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `health-data-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CSV download failed:', error);
      throw error;
    }
  }, [exportUserData]);

  return {
    exportUserData,
    downloadAsJSON,
    downloadAsCSV,
    isExporting
  };
}
