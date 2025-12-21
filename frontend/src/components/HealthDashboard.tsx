import { useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useFhevm } from '../fhevm/useFhevm';
import { useInMemoryStorage } from '../hooks/useInMemoryStorage';
import { useHealthMetrics } from '../hooks/useHealthMetrics';
import { useWagmiEthers } from '../hooks/wagmi/useWagmiEthers';
import HealthDataForm from './HealthDataForm';
import HealthDataDisplay from './HealthDataDisplay';
import StatsCard from './StatsCard';

export default function HealthDashboard() {
  const { isConnected, chain } = useAccount();
  const { storage } = useInMemoryStorage();

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
    if (isConnected && ethersSigner) {
      healthMetrics.fetchEncryptedData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, ethersSigner]);

  if (!isConnected) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-5xl w-full">
            {/* Main Hero Card */}
            <div className="text-center glass-effect-strong rounded-2xl p-12 sm:p-16 max-w-3xl mx-auto animate-fade-in-scale relative overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/4 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/4 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl blur-xl"></div>
                  <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-12 h-12 text-blue-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>

                <h2 className="text-4xl sm:text-5xl font-semibold mb-5 tracking-tight">
                  <span className="text-slate-100">Welcome to </span>
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Capsule ID Vault</span>
                </h2>
                <p className="text-slate-400 text-base sm:text-lg mb-12 leading-relaxed max-w-2xl mx-auto">
                  Your private health metrics, protected by cutting-edge <span className="text-blue-400 font-medium">Fully Homomorphic Encryption</span>.
                  Connect your wallet to begin.
                </p>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-2.5 justify-center">
                  <div className="px-4 py-2 rounded-lg bg-blue-500/8 border border-blue-400/20 text-blue-300 text-sm font-medium backdrop-blur-sm">
                    End-to-End Encrypted
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-purple-500/8 border border-purple-400/20 text-purple-300 text-sm font-medium backdrop-blur-sm">
                    Homomorphic Computing
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-slate-700/30 border border-slate-600/30 text-slate-300 text-sm font-medium backdrop-blur-sm">
                    Blockchain Secured
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
              <div className="glass-effect rounded-xl p-8 card-hover group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-400/20 flex items-center justify-center mb-5 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2.5">Client-Side Encryption</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Data is encrypted <span className="text-blue-400/90">before leaving your browser</span>. Complete privacy guaranteed.
                  </p>
                </div>
              </div>
              <div className="glass-effect rounded-xl p-8 card-hover group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-400/20 flex items-center justify-center mb-5 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2.5">Encrypted Computation</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Calculations performed on <span className="text-purple-400/90">encrypted data</span> without decryption.
                  </p>
                </div>
              </div>
              <div className="glass-effect rounded-xl p-8 card-hover group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-slate-700/20 border border-slate-600/30 flex items-center justify-center mb-5 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2.5">Data Sovereignty</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    <span className="text-slate-300">Only you hold the keys</span> to decrypt your information.
                  </p>
                </div>
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
      <div className="text-center glass-effect-strong rounded-2xl p-10 sm:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-blue-500/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-purple-500/3 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 to-purple-600/15 rounded-xl blur-lg"></div>
              <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-7 h-7 text-blue-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
              <span className="text-slate-100">Privacy-First </span>
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Health Analytics</span>
            </h2>
          </div>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Submit your health metrics in <span className="text-blue-400 font-medium">fully encrypted form</span>. 
            All calculations happen on encrypted data, ensuring <span className="text-purple-400 font-medium">complete privacy</span>.
          </p>
          
          {/* Security Badges */}
          <div className="flex flex-wrap gap-2.5 justify-center">
            <div className="px-4 py-2 rounded-lg bg-green-500/8 border border-green-400/20 text-green-300/90 text-xs font-medium backdrop-blur-sm">
              Zero-Knowledge Architecture
            </div>
            <div className="px-4 py-2 rounded-lg bg-blue-500/8 border border-blue-400/20 text-blue-300/90 text-xs font-medium backdrop-blur-sm">
              FHE Computation
            </div>
            <div className="px-4 py-2 rounded-lg bg-purple-500/8 border border-purple-400/20 text-purple-300/90 text-xs font-medium backdrop-blur-sm">
              On-Chain Security
            </div>
          </div>
        </div>
      </div>

      {/* Network Info */}
      {chain && (
        <div className={`glass-effect rounded-xl p-4 border ${
          chain.id === 31337 
            ? 'border-green-500/25 bg-green-500/5' 
            : 'border-yellow-500/25 bg-yellow-500/5'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              chain.id === 31337 
                ? 'bg-green-500/15 border border-green-400/25' 
                : 'bg-yellow-500/15 border border-yellow-400/25'
            }`}>
              <div className={`w-2.5 h-2.5 rounded-full ${
                chain.id === 31337 ? 'bg-green-400' : 'bg-yellow-400'
              }`}></div>
            </div>
            <div className="flex-1">
              <div className="font-medium text-white text-sm mb-0.5">
                Connected to {chain.name || 'Unknown Network'}
              </div>
              <div className="text-xs text-slate-400">
                {chain.id === 31337 
                  ? 'Local development network' 
                  : 'Public testnet'}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <div className="glass-effect-strong rounded-xl p-8 card-hover animate-slide-in-left relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/3 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg blur-md"></div>
                <div className="relative w-11 h-11 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-400/20 flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-5 h-5 text-blue-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-white tracking-tight">
                Submit Health Data
              </h3>
            </div>
            <HealthDataForm healthMetrics={healthMetrics} fhevmStatus={fhevmStatus} />
          </div>
        </div>

        {/* Right Column - Display */}
        <div className="glass-effect-strong rounded-xl p-8 card-hover animate-slide-in-right relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/3 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-lg blur-md"></div>
                <div className="relative w-11 h-11 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-400/20 flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-5 h-5 text-purple-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-white tracking-tight">
                Your Encrypted Data
              </h3>
            </div>
            <HealthDataDisplay healthMetrics={healthMetrics} />
          </div>
        </div>
      </div>

      {/* Info Section - How It Works */}
      <div className="glass-effect-strong rounded-2xl p-10 sm:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/2 via-purple-500/2 to-blue-500/2"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-3 tracking-tight">
              How It Works
            </h3>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Three simple steps to secure, private health data management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="relative group">
              <div className="glass-effect rounded-xl p-8 card-hover h-full border border-blue-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="relative w-16 h-16 mx-auto mb-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl blur-md"></div>
                    <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-400/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/30 text-blue-300 text-sm font-semibold flex items-center justify-center backdrop-blur-sm">
                    1
                  </div>
                  <h4 className="font-semibold text-lg text-white mb-3">Client-Side Encryption</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Data encrypted <span className="text-blue-400/90 font-medium">directly in your browser</span> using advanced FHE before transmission.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="glass-effect rounded-xl p-8 card-hover h-full border border-purple-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="relative w-16 h-16 mx-auto mb-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl blur-md"></div>
                    <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-400/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-400/30 text-purple-300 text-sm font-semibold flex items-center justify-center backdrop-blur-sm">
                    2
                  </div>
                  <h4 className="font-semibold text-lg text-white mb-3">Encrypted Computation</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Smart contracts perform <span className="text-purple-400/90 font-medium">homomorphic calculations</span> on encrypted data without decryption.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="glass-effect rounded-xl p-8 card-hover h-full border border-slate-600/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-600/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="relative w-16 h-16 mx-auto mb-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-600/20 to-slate-700/20 rounded-xl blur-md"></div>
                    <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-slate-700/10 to-slate-800/10 border border-slate-600/30 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700/20 to-slate-800/20 border border-slate-600/30 text-slate-300 text-sm font-semibold flex items-center justify-center backdrop-blur-sm">
                    3
                  </div>
                  <h4 className="font-semibold text-lg text-white mb-3">Secure Decryption</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    <span className="text-slate-300 font-medium">Only you hold the keys</span> to decrypt and view your health score.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Info Banner */}
          <div className="mt-10 p-5 rounded-xl bg-slate-800/20 border border-white/5 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap text-center">
              <div className="text-slate-400 text-xs font-medium">HIPAA Compliant</div>
              <div className="hidden md:block w-px h-4 bg-white/10"></div>
              <div className="text-slate-400 text-xs font-medium">256-bit Encryption</div>
              <div className="hidden md:block w-px h-4 bg-white/10"></div>
              <div className="text-slate-400 text-xs font-medium">Audited & Secure</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

