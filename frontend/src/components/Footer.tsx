export default function Footer() {
  return (
    <footer className="mt-16 py-8 glass-effect border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-xl">🏥</span>
              </div>
              <h3 className="text-xl font-bold text-white">Capsule ID Vault</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Secure health data management powered by Fully Homomorphic Encryption on the blockchain.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Technology</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li className="hover:text-blue-400 transition-colors cursor-pointer">
                🔐 Zama FHE
              </li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">
                ⚡ Ethereum Smart Contracts
              </li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">
                🛡️ Zero-Knowledge Proofs
              </li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">
                🌐 IPFS Storage
              </li>
            </ul>
          </div>

          {/* Security Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Security</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                End-to-End Encryption
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Audited Smart Contracts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Decentralized Storage
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Open Source
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Capsule ID Vault. Built with privacy and security in mind.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400 text-sm flex items-center gap-2">
              <span className="text-blue-400">⚡</span>
              Powered by <span className="text-white font-semibold">Zama</span>
            </span>
            <span className="text-slate-400 text-sm flex items-center gap-2">
              <span className="text-purple-400">🔐</span>
              <span className="text-white font-semibold">FHE</span> Technology
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

