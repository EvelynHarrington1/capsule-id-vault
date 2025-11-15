import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from './config/wagmi';
import { InMemoryStorageProvider } from './hooks/useInMemoryStorage';
import Header from './components/Header';
import HealthDashboard from './components/HealthDashboard';
import { HealthStats } from './components/HealthStats';
import Footer from './components/Footer';

const queryClient = new QueryClient();

function App() {
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
              <Footer />
            </div>
          </InMemoryStorageProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;

