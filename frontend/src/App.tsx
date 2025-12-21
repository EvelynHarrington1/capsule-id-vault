import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from './config/wagmi';
import { InMemoryStorageProvider } from './hooks/useInMemoryStorage';
import Header from './components/Header';
import HealthDashboard from './components/HealthDashboard';
import Footer from './components/Footer';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider locale="en-US">
          <InMemoryStorageProvider>
            <div className="min-h-screen overflow-x-hidden flex flex-col relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none"></div>
              <Header />
              <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 relative z-10">
                <HealthDashboard />
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

