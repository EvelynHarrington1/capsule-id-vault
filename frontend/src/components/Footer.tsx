export default function Footer() {
  return (
    <footer className="mt-20 py-10 glass-effect-strong border-t border-white/5 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/2 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/2 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-10">
          {/* Brand Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg blur-md"></div>
                <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                  <div className="w-5 h-5 rounded border border-blue-400/60 border-t-transparent border-r-transparent"></div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-200">
                Capsule ID Vault
              </h3>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
              Secure health data management powered by <span className="text-blue-400/90 font-medium">Fully Homomorphic Encryption</span> on the blockchain.
            </p>
          </div>

          {/* Technology Links */}
          <div>
            <h4 className="text-white font-medium text-sm mb-4 flex items-center gap-2">
              <span className="w-0.5 h-3.5 bg-gradient-to-b from-blue-500 to-purple-500 rounded"></span>
              Technology
            </h4>
            <ul className="space-y-2.5 text-slate-500 text-xs">
              <li className="flex items-center gap-2 hover:text-blue-400 transition-colors cursor-pointer group">
                <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Zama FHE</span>
              </li>
              <li className="flex items-center gap-2 hover:text-blue-400 transition-colors cursor-pointer group">
                <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Ethereum Smart Contracts</span>
              </li>
              <li className="flex items-center gap-2 hover:text-blue-400 transition-colors cursor-pointer group">
                <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Zero-Knowledge Proofs</span>
              </li>
            </ul>
          </div>

          {/* Security Info */}
          <div>
            <h4 className="text-white font-medium text-sm mb-4 flex items-center gap-2">
              <span className="w-0.5 h-3.5 bg-gradient-to-b from-green-500 to-emerald-500 rounded"></span>
              Security
            </h4>
            <ul className="space-y-2.5 text-slate-500 text-xs">
              <li className="flex items-center gap-2 group">
                <svg className="w-3.5 h-3.5 text-green-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="group-hover:text-green-300 transition-colors">End-to-End Encryption</span>
              </li>
              <li className="flex items-center gap-2 group">
                <svg className="w-3.5 h-3.5 text-green-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="group-hover:text-green-300 transition-colors">Audited Smart Contracts</span>
              </li>
              <li className="flex items-center gap-2 group">
                <svg className="w-3.5 h-3.5 text-green-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="group-hover:text-green-300 transition-colors">Decentralized Storage</span>
              </li>
              <li className="flex items-center gap-2 group">
                <svg className="w-3.5 h-3.5 text-green-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="group-hover:text-green-300 transition-colors">Open Source</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-slate-500 text-xs text-center md:text-left">
            © {new Date().getFullYear()} Capsule ID Vault. Built with <span className="text-blue-400/90">privacy</span> and <span className="text-purple-400/90">security</span> in mind.
          </p>
          <div className="flex items-center gap-5 flex-wrap justify-center">
            <span className="text-slate-500 text-xs flex items-center gap-1.5">
              Powered by <span className="text-white font-medium">Zama</span>
            </span>
            <span className="text-slate-500 text-xs flex items-center gap-1.5">
              <span className="text-white font-medium">FHE</span> Technology
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

