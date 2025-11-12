interface HealthDataDisplayProps {
  healthMetrics: any;
}

export default function HealthDataDisplay({ healthMetrics }: HealthDataDisplayProps) {
  const formatTimestamp = (ts: bigint) => {
    return new Date(Number(ts) * 1000).toLocaleString();
  };

  const getHealthScoreColor = (score: number) => {
    if (score <= 500) return 'text-green-400';
    if (score <= 750) return 'text-yellow-400';
    if (score <= 1000) return 'text-orange-400';
    return 'text-red-400';
  };

  const handleRefresh = async () => {
    await healthMetrics.fetchEncryptedData();
  };

  // Loading state
  if (healthMetrics.isFetching) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-slate-400 mb-3">Loading your health records...</p>
      </div>
    );
  }

  // No data state
  if (!healthMetrics.encryptedRecord) {
    return (
      <div className="space-y-4">
        {/* Status Message */}
        {healthMetrics.status && (
          <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-3 text-blue-400 text-sm">
            {healthMetrics.status}
          </div>
        )}

        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-700/50 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-slate-400 text-lg mb-2">No health data found</p>
          <p className="text-slate-500 text-sm mb-6">Submit your health metrics or click refresh to load existing data</p>
          <button
            onClick={handleRefresh}
            disabled={healthMetrics.isFetching}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {healthMetrics.isFetching ? '⏳ Loading...' : '🔄 Refresh Data'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status and Refresh */}
      <div className="flex items-center justify-between">
        {healthMetrics.status && (
          <div className="text-sm text-slate-400 flex-1">
            {healthMetrics.status}
          </div>
        )}
        <button
          onClick={handleRefresh}
          disabled={healthMetrics.isFetching}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition disabled:opacity-50"
        >
          🔄 {healthMetrics.isFetching ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Encrypted Data Status */}
      <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">BMI (Encrypted)</span>
          <span className="text-xs font-mono text-slate-500 truncate max-w-[200px]">
            {healthMetrics.encryptedRecord.encryptedHandles.bmi.substring(0, 20)}...
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Blood Sugar (Encrypted)</span>
          <span className="text-xs font-mono text-slate-500 truncate max-w-[200px]">
            {healthMetrics.encryptedRecord.encryptedHandles.bloodSugar.substring(0, 20)}...
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Heart Rate (Encrypted)</span>
          <span className="text-xs font-mono text-slate-500 truncate max-w-[200px]">
            {healthMetrics.encryptedRecord.encryptedHandles.heartRate.substring(0, 20)}...
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Health Score (Encrypted)</span>
          <span className="text-xs font-mono text-slate-500 truncate max-w-[200px]">
            {healthMetrics.encryptedRecord.encryptedHandles.healthScore.substring(0, 20)}...
          </span>
        </div>
      </div>

      {/* Decrypt Button or Decrypted Data */}
      {!healthMetrics.decryptedData ? (
        <button
          onClick={healthMetrics.decryptCurrentRecord}
          disabled={healthMetrics.isDecrypting}
          className={`w-full py-3 rounded-lg font-semibold transition-all ${
            healthMetrics.isDecrypting
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {healthMetrics.isDecrypting ? '🔓 Decrypting...' : '🔐 Decrypt My Data'}
        </button>
      ) : (
        <div className="space-y-4">
          {/* Decrypted Data Display */}
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg p-6 border border-blue-400/30">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">BMI</p>
                <p className="text-2xl font-bold text-white">{healthMetrics.decryptedData.bmi}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Blood Sugar</p>
                <p className="text-2xl font-bold text-white">{healthMetrics.decryptedData.bloodSugar} mg/dL</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Heart Rate</p>
                <p className="text-2xl font-bold text-white">{healthMetrics.decryptedData.heartRate} bpm</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Health Score</p>
                <p className={`text-2xl font-bold ${getHealthScoreColor(healthMetrics.decryptedData.healthScore)}`}>
                  {healthMetrics.decryptedData.healthScore}
                </p>
              </div>
            </div>
          </div>

          {/* Score Interpretation */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-white mb-2">Score Interpretation</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>0-500: Excellent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span>501-750: Good</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span>751-1000: Fair</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span>1000+: Needs Attention</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timestamp */}
      <div className="text-center text-xs text-slate-500">
        Last updated: {formatTimestamp(healthMetrics.encryptedRecord.timestamp)}
      </div>

      {/* Privacy Notice */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
        <p className="text-xs text-green-300 leading-relaxed">
          ✨ <strong>Privacy Guaranteed:</strong> All data is stored in encrypted form on the blockchain.
          Only you can decrypt your health metrics using your private key.
        </p>
      </div>
    </div>
  );
}
