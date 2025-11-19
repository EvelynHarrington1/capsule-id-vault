import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from './config/wagmi';
import { InMemoryStorageProvider } from './hooks/useInMemoryStorage';
import { useErrorHandler } from './hooks/useErrorHandler';
import Header from './components/Header';
import HealthDashboard from './components/HealthDashboard';
import { HealthStats } from './components/HealthStats';
import { ErrorToast } from './components/ErrorToast';
import { PerformanceDashboard } from './components/PerformanceDashboard';
import Footer from './components/Footer';

const queryClient = new QueryClient();

function AppContent() {
  const { errors, removeError } = useErrorHandler();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider locale="en-US">
          <InMemoryStorageProvider>
            <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
              <Header />
              <main className="container mx-auto px-4 py-8 flex-1">
                <div className="space-y-8">
                  <HealthStats />
                  <HealthDashboard />
                </div>
              </main>

              {/* Error Toasts */}
              <div className="fixed top-4 right-4 z-50 space-y-2">
                {errors.map((error) => (
                  <ErrorToast
                    key={error.id}
                    error={error}
                    onClose={removeError}
                  />
                ))}
              </div>

              <Footer />

              {/* Performance Dashboard */}
              <PerformanceDashboard />
            </div>
          </InMemoryStorageProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider locale="en-US">
          <InMemoryStorageProvider>
            <AppContent />
          </InMemoryStorageProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;

