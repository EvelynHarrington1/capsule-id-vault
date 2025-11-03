import { useState } from 'react';

interface HealthDataFormProps {
  healthMetrics: any;
  fhevmStatus: string;
}

export default function HealthDataForm({ healthMetrics, fhevmStatus }: HealthDataFormProps) {
  const [bmi, setBmi] = useState('');
  const [bloodSugar, setBloodSugar] = useState('');
  const [heartRate, setHeartRate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs before submission
    const bmiNum = parseFloat(bmi);
    const bloodSugarNum = parseFloat(bloodSugar);
    const heartRateNum = parseFloat(heartRate);

    if (isNaN(bmiNum) || isNaN(bloodSugarNum) || isNaN(heartRateNum)) {
      alert('Please enter valid numbers for all fields');
      return;
    }

    const success = await healthMetrics.submitHealthData(bmiNum, bloodSugarNum, heartRateNum);

    if (success) {
      // Reset form
      setBmi('');
      setBloodSugar('');
      setHeartRate('');
    }
  };

  const isLoading = healthMetrics.isSubmitting || fhevmStatus !== 'ready';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status Message */}
      {healthMetrics.status && (
        <div className={`rounded-lg p-4 text-sm ${
          healthMetrics.status.includes('success') || healthMetrics.status.includes('loaded')
            ? 'bg-green-500/10 border border-green-500 text-green-400'
            : healthMetrics.status.includes('failed') || healthMetrics.status.includes('Failed')
            ? 'bg-red-500/10 border border-red-500 text-red-400'
            : 'bg-blue-500/10 border border-blue-500 text-blue-400'
        }`}>
          {healthMetrics.status}
        </div>
      )}

      {/* BMI Input */}
      <div>
        <label htmlFor="bmi" className="block text-sm font-medium text-slate-300 mb-2">
          BMI (Body Mass Index)
        </label>
        <input
          id="bmi"
          type="number"
          step="0.1"
          placeholder="e.g., 25.5"
          value={bmi}
          onChange={(e) => setBmi(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          required
        />
        <p className="mt-1 text-xs text-slate-500">Normal range: 18.5 - 24.9</p>
      </div>

      {/* Blood Sugar Input */}
      <div>
        <label htmlFor="bloodSugar" className="block text-sm font-medium text-slate-300 mb-2">
          Blood Sugar Level (mg/dL)
        </label>
        <input
          id="bloodSugar"
          type="number"
          step="1"
          placeholder="e.g., 100"
          value={bloodSugar}
          onChange={(e) => setBloodSugar(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          required
        />
        <p className="mt-1 text-xs text-slate-500">Normal range: 70 - 100 mg/dL (fasting)</p>
      </div>

      {/* Heart Rate Input */}
      <div>
        <label htmlFor="heartRate" className="block text-sm font-medium text-slate-300 mb-2">
          Heart Rate (bpm)
        </label>
        <input
          id="heartRate"
          type="number"
          step="1"
          placeholder="e.g., 75"
          value={heartRate}
          onChange={(e) => setHeartRate(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          required
        />
        <p className="mt-1 text-xs text-slate-500">Normal range: 60 - 100 bpm</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
          isLoading
            ? 'bg-slate-700 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
        }`}
      >
        {healthMetrics.isSubmitting ? '🔐 Encrypting & Submitting...' : '🚀 Submit Encrypted Data'}
      </button>

      {fhevmStatus !== 'ready' && (
        <p className="text-xs text-yellow-400 text-center">
          ⚠️ FHEVM is initializing... Status: {fhevmStatus}
        </p>
      )}
    </form>
  );
}
