import { useState, useEffect } from 'react';
import { getHealthScoreInfo } from '../utils/healthScore';
import HealthMetricBarCyber from './HealthMetricBarCyber';
import HealthAdvice from './HealthAdvice';
import EnergyRing from './EnergyRing';
import ParticleEffect from './ParticleEffect';

interface HealthDataDisplayProps {
  healthMetrics: any;
}

export default function HealthDataDisplay({ healthMetrics }: HealthDataDisplayProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  const formatTimestamp = (ts: bigint) => {
    return new Date(Number(ts) * 1000).toLocaleString();
  };


  // Animate score number
  useEffect(() => {
    if (healthMetrics.decryptedData?.healthScore) {
      const targetScore = healthMetrics.decryptedData.healthScore;
      const duration = 1500;
      const steps = 60;
      const stepValue = targetScore / steps;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const currentValue = Math.min(stepValue * currentStep, targetScore);
        setAnimatedScore(currentValue);
        
        if (currentStep >= steps) {
          clearInterval(interval);
          setAnimatedScore(targetScore);
        }
      }, stepDuration);
      
      return () => clearInterval(interval);
    }
  }, [healthMetrics.decryptedData?.healthScore]);

  const handleRefresh = async () => {
    await healthMetrics.fetchEncryptedData();
  };

  // Loading state
  if (healthMetrics.isFetching) {
    return (
      <div className="text-center py-16">
        <div className="relative w-12 h-12 mx-auto mb-5">
          <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-lg"></div>
          <div className="relative inline-block animate-spin rounded-full h-12 w-12 border-2 border-blue-500/20 border-t-blue-400"></div>
        </div>
        <p className="text-slate-500 text-sm">Loading health records...</p>
      </div>
    );
  }

  // No data state
  if (!healthMetrics.encryptedRecord) {
    return (
      <div className="space-y-8">
        {/* Status Message */}
        {healthMetrics.status && (
          <div className="rounded-lg p-3.5 bg-blue-500/10 border border-blue-400/25 text-blue-300/90 text-sm backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs">{healthMetrics.status}</span>
            </div>
          </div>
        )}

        <div className="text-center py-12">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 bg-slate-700/20 rounded-lg blur-lg"></div>
            <div className="relative w-16 h-16 rounded-lg bg-slate-800/40 border border-slate-700/40 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <p className="text-slate-300 text-base font-medium mb-1.5">No health data found</p>
          <p className="text-slate-500 text-xs mb-7 max-w-sm mx-auto">Submit your health metrics to get started</p>
          <button
            onClick={handleRefresh}
            disabled={healthMetrics.isFetching}
            className="button-secondary px-6 py-2.5 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {healthMetrics.isFetching ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh Data</span>
              </span>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Status and Refresh */}
      <div className="flex items-center justify-between gap-3">
        {healthMetrics.status && (
          <div className="text-xs text-slate-500 flex-1 rounded-lg px-3 py-2 bg-slate-800/30">
            {healthMetrics.status}
          </div>
        )}
        <button
          onClick={handleRefresh}
          disabled={healthMetrics.isFetching}
          className="button-secondary px-3 py-2 text-white text-xs rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap"
        >
          {healthMetrics.isFetching ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading...</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </>
          )}
        </button>
      </div>

      {/* Encrypted Data Status */}
      <div className="glass-effect rounded-lg p-4 space-y-3 border border-slate-700/40">
        <div className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
          <span className="text-xs font-medium text-slate-400">BMI (Encrypted)</span>
          <span className="text-xs font-mono text-slate-600 truncate max-w-[180px] bg-slate-900/40 px-2 py-1 rounded">
            {healthMetrics.encryptedRecord.encryptedHandles.bmi.substring(0, 18)}...
          </span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
          <span className="text-xs font-medium text-slate-400">Blood Sugar (Encrypted)</span>
          <span className="text-xs font-mono text-slate-600 truncate max-w-[180px] bg-slate-900/40 px-2 py-1 rounded">
            {healthMetrics.encryptedRecord.encryptedHandles.bloodSugar.substring(0, 18)}...
          </span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
          <span className="text-xs font-medium text-slate-400">Heart Rate (Encrypted)</span>
          <span className="text-xs font-mono text-slate-600 truncate max-w-[180px] bg-slate-900/40 px-2 py-1 rounded">
            {healthMetrics.encryptedRecord.encryptedHandles.heartRate.substring(0, 18)}...
          </span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-xs font-medium text-slate-400">Health Score (Encrypted)</span>
          <span className="text-xs font-mono text-slate-600 truncate max-w-[180px] bg-slate-900/40 px-2 py-1 rounded">
            {healthMetrics.encryptedRecord.encryptedHandles.healthScore.substring(0, 18)}...
          </span>
        </div>
      </div>

      {/* Decrypt Button or Decrypted Data */}
      {!healthMetrics.decryptedData ? (
        <button
          onClick={healthMetrics.decryptCurrentRecord}
          disabled={healthMetrics.isDecrypting}
          className={`button-secondary w-full py-3 rounded-lg font-medium text-sm transition-all ${
            healthMetrics.isDecrypting
              ? 'opacity-60 cursor-not-allowed'
              : ''
          }`}
        >
          {healthMetrics.isDecrypting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Decrypting...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span>Decrypt My Data</span>
            </span>
          )}
        </button>
      ) : (
        <div className="space-y-8">
          {(() => {
            const score = healthMetrics.decryptedData.healthScore;
            const scoreInfo = getHealthScoreInfo(score);
            const pulseClass = score > 1000 ? 'animate-border-pulse' : ''; // Only animate for critical status
            
            return (
              <>
                {/* Health Score Card - CYBERPUNK NEON DISPLAY */}
                <div className={`glass-effect-strong rounded-xl p-10 border relative overflow-hidden mb-12 ${pulseClass}`} 
                     style={{
                       borderColor: score <= 500 ? '#00ff00' : score <= 750 ? '#00ffff' : score <= 1000 ? '#ffff00' : '#ff0080',
                       boxShadow: `0 0 40px ${score <= 500 ? 'rgba(0,255,0,0.3)' : score <= 750 ? 'rgba(0,255,255,0.3)' : score <= 1000 ? 'rgba(255,255,0,0.3)' : 'rgba(255,0,128,0.3)'}`
                     }}>
                  
                  {/* Particle Effects */}
                  <ParticleEffect 
                    color={score <= 500 ? 'green' : score <= 750 ? 'blue' : score <= 1000 ? 'orange' : 'red'} 
                    enabled={true} 
                    particleCount={30} 
                  />

                  {/* Scanline Effect */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanLine" 
                       style={{ animation: 'scanLineVertical 3s ease-in-out infinite' }}
                  />

                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                      {/* Energy Ring */}
                      <div className="flex-shrink-0">
                        <EnergyRing
                          score={Math.round(animatedScore)}
                          maxScore={1500}
                          size={220}
                        />
                      </div>
                      
                      {/* Giant Neon Score */}
                      <div className="flex flex-col items-center md:items-start space-y-4">
                        {/* HEALTH SCORE Label */}
                        <div className="text-xs font-bold uppercase tracking-[0.3em]"
                             style={{
                               color: score <= 500 ? '#00ff00' : score <= 750 ? '#00ffff' : score <= 1000 ? '#ffff00' : '#ff0080',
                               textShadow: `0 0 20px currentColor`,
                             }}>
                          ⚡ HEALTH SCORE ⚡
                        </div>
                        
                        {/* Massive Glowing Number */}
                        <div className="relative">
                          <div 
                            className="text-[100px] md:text-[140px] font-black leading-none tracking-tighter font-mono"
                            style={{
                              color: score <= 500 ? '#00ff00' : score <= 750 ? '#00ffff' : score <= 1000 ? '#ffff00' : '#ff0080',
                              textShadow: `
                                0 0 10px currentColor,
                                0 0 20px currentColor,
                                0 0 40px currentColor,
                                0 0 80px currentColor,
                                0 0 120px currentColor
                              `,
                              animation: 'neonFlicker 3s ease-in-out infinite',
                            }}
                          >
                            {Math.round(animatedScore)}
                          </div>
                          
                          {/* Glitch effect overlay */}
                          <div 
                            className="absolute inset-0 text-[100px] md:text-[140px] font-black leading-none tracking-tighter font-mono opacity-50"
                            style={{
                              color: score <= 500 ? '#00ff00' : score <= 750 ? '#00ffff' : score <= 1000 ? '#ffff00' : '#ff0080',
                              textShadow: '0 0 10px currentColor',
                              animation: 'glitch 5s ease-in-out infinite',
                              clipPath: 'inset(0 0 95% 0)',
                            }}
                          >
                            {Math.round(animatedScore)}
                          </div>
                        </div>
                        
                        {/* Status with pulse */}
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full animate-pulse"
                               style={{
                                 backgroundColor: score <= 500 ? '#00ff00' : score <= 750 ? '#00ffff' : score <= 1000 ? '#ffff00' : '#ff0080',
                                 boxShadow: `0 0 20px currentColor`,
                               }}
                          />
                          <span className="text-sm font-bold uppercase tracking-wider"
                                style={{
                                  color: score <= 500 ? '#00ff00' : score <= 750 ? '#00ffff' : score <= 1000 ? '#ffff00' : '#ff0080',
                                }}>
                            {scoreInfo.message}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <style>{`
                  @keyframes neonFlicker {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.95; }
                    51% { opacity: 1; }
                    52% { opacity: 0.97; }
                  }
                  @keyframes glitch {
                    0%, 90%, 100% { transform: translate(0); }
                    91% { transform: translate(-2px, -2px); }
                    92% { transform: translate(2px, 2px); }
                    93% { transform: translate(-2px, 2px); }
                  }
                  @keyframes scanLineVertical {
                    0%, 100% { transform: translateY(0); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(500px); opacity: 0; }
                  }
                `}</style>

                {/* Individual Metrics - CYBERPUNK NEON BARS */}
                <div className="glass-effect rounded-xl p-6 space-y-4 relative overflow-hidden">
                  {/* Animated corner decorations */}
                  <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-cyan-400 opacity-50" 
                       style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)' }}
                  />
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-cyan-400 opacity-50"
                       style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)' }}
                  />
                  
                  <h4 className="text-sm font-black uppercase tracking-[0.3em] text-center relative z-10"
                      style={{
                        color: '#00ffff',
                        textShadow: '0 0 20px #00ffff',
                      }}>
                    <span className="inline-block animate-pulse">●</span> BIOMETRIC DATA <span className="inline-block animate-pulse">●</span>
                  </h4>
                  
                  <HealthMetricBarCyber
                    label="BMI"
                    value={healthMetrics.decryptedData.bmi}
                    normalRange={[18.5, 24.9]}
                    maxValue={40}
                    unit=""
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    }
                  />
                  <HealthMetricBarCyber
                    label="Blood Sugar"
                    value={healthMetrics.decryptedData.bloodSugar}
                    normalRange={[70, 100]}
                    maxValue={200}
                    unit="mg/dL"
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    }
                  />
                  <HealthMetricBarCyber
                    label="Heart Rate"
                    value={healthMetrics.decryptedData.heartRate}
                    normalRange={[60, 100]}
                    maxValue={120}
                    unit="bpm"
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    }
                  />
                </div>

                {/* Health Advice */}
                <HealthAdvice
                  score={score}
                  bmi={healthMetrics.decryptedData.bmi}
                  bloodSugar={healthMetrics.decryptedData.bloodSugar}
                  heartRate={healthMetrics.decryptedData.heartRate}
                />

                {/* Score Interpretation */}
                <div className="glass-effect rounded-lg p-4 border border-slate-700/40">
                  <h4 className="text-xs font-medium text-slate-400 mb-3 uppercase tracking-wider">Score Interpretation</h4>
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/8 border border-green-500/20">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span className="text-slate-300 font-normal">0-500: Excellent</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-500/8 border border-blue-500/20">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span className="text-slate-300 font-normal">501-750: Good</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-500/8 border border-orange-500/20">
                      <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                      <span className="text-slate-300 font-normal">751-1000: Fair</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/8 border border-red-500/20">
                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                      <span className="text-slate-300 font-normal">1000+: Needs Attention</span>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Timestamp */}
      <div className="text-center text-xs text-slate-600 py-1.5">
        <span className="inline-flex items-center gap-1.5">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Last updated: {formatTimestamp(healthMetrics.encryptedRecord.timestamp)}</span>
        </span>
      </div>

      {/* Privacy Notice */}
      <div className="rounded-lg p-3.5 bg-green-500/8 border border-green-400/20 backdrop-blur-sm">
        <p className="text-xs text-green-300/90 leading-relaxed flex items-start gap-2">
          <svg className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>
            <strong className="text-green-200/90 font-medium">Privacy Guaranteed:</strong> All data is stored in encrypted form on the blockchain. Only you can decrypt your health metrics using your private key.
          </span>
        </p>
      </div>
    </div>
  );
}
