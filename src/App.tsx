// src/App.tsx  [v2.0 — connected to Sports Oracle backend]
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import { Dashboard }     from './components/views/Dashboard';
import { LiveEngine }    from './components/views/LiveEngine';
import { LandingPage }   from './components/views/LandingPage';
import { Predictions }   from './components/views/Predictions';
import { BetSlips }      from './components/views/BetSlips';
import { QueueMonitor }  from './components/views/QueueMonitor';
import { FormulaEngine } from './components/views/FormulaEngine';
import { useWebSocket }  from './hooks/useWebSocket';
import { Settings } from 'lucide-react';

// React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: 1000,
      staleTime: 10_000,
    },
  },
});

function PlaceholderView({ title, icon:Icon, description }: { title:string; icon:any; description:string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-3xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] mb-6">
        <Icon className="w-8 h-8 text-primary/50" />
      </div>
      <h1 className="text-2xl font-headline font-bold mb-2">{title}</h1>
      <p className="text-xs text-white/40 max-w-md">{description}</p>
      <div className="mt-8 px-5 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[10px] font-mono text-white/30 uppercase tracking-widest">Coming Soon</div>
    </div>
  );
}

function AppInner() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Initialize real Socket.IO connection
  useWebSocket();

  if (showLanding) return <LandingPage onEnterApp={() => setShowLanding(false)} />;

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':   return <Dashboard />;
      case 'live-engine': return <LiveEngine />;
      case 'predictions': return <Predictions />;
      case 'bet-slips':   return <BetSlips />;
      case 'queue':       return <QueueMonitor />;
      case 'formula':     return <FormulaEngine />;
      case 'settings':    return <PlaceholderView title="Settings" icon={Settings} description="API keys, notification preferences, and system configuration." />;
      default:            return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
