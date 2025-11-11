import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  return (
    <header className="border-b border-slate-700 bg-gradient-to-r from-slate-900/80 to-purple-900/20 backdrop-blur-lg">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo.svg" alt="Capsule ID" className="h-12 w-12" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Capsule ID Vault
              </h1>
              <p className="text-sm text-slate-300">Encrypted Health Metrics Analysis</p>
            </div>
          </div>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}

