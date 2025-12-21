import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  return (
    <header className="relative border-b border-white/5 bg-gradient-to-r from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-purple-500/3"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent"></div>
      <div className="container mx-auto px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg blur-md group-hover:blur-xl transition-all duration-500"></div>
              <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center backdrop-blur-sm shadow-lg">
                <div className="w-6 h-6 rounded border-2 border-blue-400/60 border-t-transparent border-r-transparent"></div>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300 bg-clip-text text-transparent">
                Capsule ID Vault
              </h1>
              <p className="text-xs text-slate-500 font-normal tracking-wide">Encrypted Health Metrics</p>
            </div>
          </div>
            <div className="relative">
          <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}

