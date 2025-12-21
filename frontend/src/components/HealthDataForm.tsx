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
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Status Message */}
      {healthMetrics.status && (
        <div className={`rounded-lg p-3.5 text-sm backdrop-blur-sm ${
          healthMetrics.status.includes('success') || healthMetrics.status.includes('loaded')
            ? 'bg-green-500/10 border border-green-400/25 text-green-300/90'
            : healthMetrics.status.includes('failed') || healthMetrics.status.includes('Failed')
            ? 'bg-red-500/10 border border-red-400/25 text-red-300/90'
            : 'bg-blue-500/10 border border-blue-400/25 text-blue-300/90'
        }`}>
          <div className="flex items-center gap-2.5">
            {healthMetrics.status.includes('success') || healthMetrics.status.includes('loaded') ? (
              <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : healthMetrics.status.includes('failed') || healthMetrics.status.includes('Failed') ? (
              <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="text-xs leading-relaxed">{healthMetrics.status}</span>
          </div>
        </div>
      )}

      {/* BMI Input */}
      <div className="space-y-2">
        <label htmlFor="bmi" className="block text-xs font-medium text-slate-300 mb-1.5">
          BMI (Body Mass Index)
        </label>
        <input
          id="bmi"
          type="number"
          step="0.1"
          placeholder="e.g., 25.5"
          value={bmi}
          onChange={(e) => setBmi(e.target.value)}
          className="input-field w-full px-4 py-3 rounded-lg text-white text-sm placeholder-slate-500/60"
          required
        />
        <p className="text-xs text-slate-500/80 ml-0.5">Normal range: 18.5 - 24.9</p>
      </div>

      {/* Blood Sugar Input */}
      <div className="space-y-2">
        <label htmlFor="bloodSugar" className="block text-xs font-medium text-slate-300 mb-1.5">
          Blood Sugar Level (mg/dL)
        </label>
        <input
          id="bloodSugar"
          type="number"
          step="1"
          placeholder="e.g., 100"
          value={bloodSugar}
          onChange={(e) => setBloodSugar(e.target.value)}
          className="input-field w-full px-4 py-3 rounded-lg text-white text-sm placeholder-slate-500/60"
          required
        />
        <p className="text-xs text-slate-500/80 ml-0.5">Normal range: 70 - 100 mg/dL (fasting)</p>
      </div>

      {/* Heart Rate Input */}
      <div className="space-y-2">
        <label htmlFor="heartRate" className="block text-xs font-medium text-slate-300 mb-1.5">
          Heart Rate (bpm)
        </label>
        <input
          id="heartRate"
          type="number"
          step="1"
          placeholder="e.g., 75"
          value={heartRate}
          onChange={(e) => setHeartRate(e.target.value)}
          className="input-field w-full px-4 py-3 rounded-lg text-white text-sm placeholder-slate-500/60"
          required
        />
        <p className="text-xs text-slate-500/80 ml-0.5">Normal range: 60 - 100 bpm</p>
      </div>

      {/* Submit Button - Primary CTA */}
      <button
        type="submit"
        disabled={isLoading}
        className={`button-primary w-full py-3 rounded-lg font-medium text-white text-sm relative ${
          isLoading
            ? 'opacity-60 cursor-not-allowed'
            : ''
        }`}
      >
        {healthMetrics.isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Encrypting & Submitting...</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Submit Encrypted Data</span>
          </span>
        )}
      </button>

      {fhevmStatus !== 'ready' && (
        <div className="rounded-lg p-3 bg-yellow-500/8 border border-yellow-400/20">
          <p className="text-xs text-yellow-300/90 text-center flex items-center justify-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>FHEVM initializing... ({fhevmStatus})</span>
          </p>
        </div>
      )}
    </form>
  );
}
