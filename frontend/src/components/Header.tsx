import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  return (
    <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Capsule ID" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-white">Capsule ID Vault</h1>
              <p className="text-xs text-slate-400">Encrypted Health Metrics Analysis</p>
            </div>
          </div>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}

