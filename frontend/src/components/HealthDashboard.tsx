import { useState, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useFhevm } from '../fhevm/useFhevm';
import { useInMemoryStorage } from '../hooks/useInMemoryStorage';
import { useHealthMetrics } from '../hooks/useHealthMetrics';
import { useWagmiEthers } from '../hooks/wagmi/useWagmiEthers';
import HealthDataForm from './HealthDataForm';
import HealthDataDisplay from './HealthDataDisplay';
import StatsCard from './StatsCard';

export default function HealthDashboard() {
  const { address, isConnected, chain } = useAccount();
  const { storage } = useInMemoryStorage();
  const [mounted, setMounted] = useState(false);

  const { ethersSigner } = useWagmiEthers({ 31337: 'http://127.0.0.1:8545' });

  const provider = useMemo(() => {
    if (chain?.id === 31337) {
      return 'http://127.0.0.1:8545';
    }
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      return (window as any).ethereum;
    }
    return undefined;
  }, [chain?.id]);

  const { instance, status: fhevmStatus } = useFhevm({
    provider,
    chainId: chain?.id,
    initialMockChains: { 31337: 'http://127.0.0.1:8545' },
    enabled: isConnected,
  });

  const healthMetrics = useHealthMetrics({
    instance,
    ethersSigner,
    fhevmDecryptionSignatureStorage: storage,
    chainId: chain?.id,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && ethersSigner) {
      healthMetrics.fetchEncryptedData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, ethersSigner]);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Hero Section for non-connected users */}
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-4xl w-full">
            {/* Main Connect Card */}
            <div className="text-center glass-effect rounded-3xl p-12 max-w-2xl mx-auto gradient-border animate-fade-in">
              <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 flex items-center justify-center animate-pulse-slow">
                <svg
                  className="w-16 h-16 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Welcome to Capsule ID Vault
              </h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                Your private health metrics, protected by cutting-edge Fully Homomorphic Encryption.
                Connect your wallet to begin your journey to data sovereignty.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                <div className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30 text-blue-200 font-medium">
                  🔒 Military-Grade Encryption
                </div>
                <div className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-400/30 text-purple-200 font-medium">
                  ⚡ Lightning Fast
                </div>
                <div className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500/20 to-pink-600/20 border border-pink-400/30 text-pink-200 font-medium">
                  🌐 Blockchain Powered
                </div>
              </div>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="glass-effect rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-3">🔐</div>
                <h3 className="text-white font-bold mb-2">End-to-End Encrypted</h3>
                <p className="text-slate-400 text-sm">
                  Your data is encrypted before leaving your browser. Nobody can access it but you.
                </p>
              </div>
              <div className="glass-effect rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="text-white font-bold mb-2">Real-time Computation</h3>
                <p className="text-slate-400 text-sm">
                  Advanced FHE allows calculations on encrypted data without decryption.
                </p>
              </div>
              <div className="glass-effect rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-3">🔓</div>
                <h3 className="text-white font-bold mb-2">You Own Your Data</h3>
                <p className="text-slate-400 text-sm">
                  True data sovereignty. Only you hold the keys to decrypt your information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header Section */}
      <div className="text-center glass-effect rounded-3xl p-8 gradient-border">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-float">
            <span className="text-3xl">🏥</span>
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Privacy-First Health Analytics
          </h2>
        </div>
        <p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed">
          Submit your health metrics in <span className="text-blue-400 font-semibold">fully encrypted form</span>. 
          All calculations happen on encrypted data, ensuring <span className="text-purple-400 font-semibold">complete privacy</span> throughout the process.
        </p>
        
        {/* Security Badges */}
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          <div className="px-4 py-2 rounded-lg bg-green-500/20 border border-green-400/30 text-green-300 text-sm font-medium flex items-center gap-2">
            <span>✓</span> Zero-Knowledge Architecture
          </div>
          <div className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium flex items-center gap-2">
            <span>✓</span> FHE Computation
          </div>
          <div className="px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-400/30 text-purple-300 text-sm font-medium flex items-center gap-2">
            <span>✓</span> On-Chain Security
          </div>
        </div>
      </div>

      {/* Network Info */}
      {chain && (
        <div className={`glass-effect rounded-xl p-4 border-2 ${
          chain.id === 31337 
            ? 'border-green-500/30 bg-green-500/5' 
            : 'border-yellow-500/30 bg-yellow-500/5'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{chain.id === 31337 ? '🟢' : '🟡'}</span>
            <div>
              <div className="font-semibold text-white">
                Connected to {chain.name || 'Unknown Network'}
              </div>
              <div className="text-sm text-slate-400">
                {chain.id === 31337 
                  ? 'Fast local testing with instant confirmation' 
                  : 'Public testnet - Data sync may take 10-30 seconds after submission'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          title="Your Status"
          value={healthMetrics.encryptedRecord ? 'Active' : 'New'}
          icon="📊"
          description={healthMetrics.encryptedRecord ? 'Data submitted' : 'No data yet'}
          highlight={!!healthMetrics.encryptedRecord}
        />
        <StatsCard
          title="Encryption"
          value="FHE"
          icon="🔒"
          description="Fully Homomorphic"
          highlight={true}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="glass-effect rounded-2xl p-8 gradient-border hover:scale-[1.02] transition-transform duration-300 animate-slide-in-left">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-2xl font-bold text-white">
              Submit Health Data
            </h3>
          </div>
          <HealthDataForm healthMetrics={healthMetrics} fhevmStatus={fhevmStatus} />
        </div>

      {/* Right Column - Display */}
      <div className="glass-effect rounded-2xl p-8 gradient-border hover:scale-[1.02] transition-transform duration-300 animate-slide-in-right">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
              <span className="text-2xl">🔐</span>
            </div>
            <h3 className="text-2xl font-bold text-white">
              Your Encrypted Data
            </h3>
          </div>
          <HealthDataDisplay healthMetrics={healthMetrics} />
      </div>
      </div>

      {/* Info Section - How It Works */}
      <div className="glass-effect rounded-3xl p-10 gradient-border">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-bold text-white mb-3 flex items-center justify-center gap-3">
            <span className="text-4xl">💡</span>
            How It Works
          </h3>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Experience the future of private health data management with three simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="relative group">
            <div className="glass-effect rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 h-full border-2 border-blue-500/30">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-4xl shadow-lg group-hover:animate-pulse-slow">
                🔐
              </div>
              <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center shadow-lg">
                1
              </div>
              <h4 className="font-bold text-xl text-white mb-3">Client-Side Encryption</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Your health data is encrypted <span className="text-blue-400 font-semibold">directly in your browser</span> using advanced FHE before transmission.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative group">
            <div className="glass-effect rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 h-full border-2 border-purple-500/30">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-4xl shadow-lg group-hover:animate-pulse-slow">
                ⚡
              </div>
              <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center shadow-lg">
                2
              </div>
              <h4 className="font-bold text-xl text-white mb-3">Encrypted Computation</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Smart contracts perform <span className="text-purple-400 font-semibold">homomorphic calculations</span> on your encrypted data without ever decrypting it.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative group">
            <div className="glass-effect rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 h-full border-2 border-pink-500/30">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-4xl shadow-lg group-hover:animate-pulse-slow">
                🔓
              </div>
              <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-pink-500 text-white font-bold flex items-center justify-center shadow-lg">
                3
              </div>
              <h4 className="font-bold text-xl text-white mb-3">Secure Decryption</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                <span className="text-pink-400 font-semibold">Only you</span> hold the keys to decrypt and view your health score. Complete privacy guaranteed.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Info Banner */}
        <div className="mt-10 p-6 rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10">
          <div className="flex items-center justify-center gap-6 flex-wrap text-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              <span className="text-white font-medium">HIPAA Compliant</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-white/20"></div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              <span className="text-white font-medium">256-bit Encryption</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-white/20"></div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span className="text-white font-medium">Audited & Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

