/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/views/Dashboard';
import { LiveEngine } from './components/views/LiveEngine';
import { Activity, FileText, Database, GitMerge, Settings } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'live-engine':
        return <LiveEngine />;
      case 'predictions':
        return <PlaceholderView title="Predictions" icon={Activity} description="Historical and upcoming prediction data." />;
      case 'bet-slips':
        return <PlaceholderView title="Bet Slips" icon={FileText} description="OCR processing and slip management." />;
      case 'queue':
        return <PlaceholderView title="Queue Monitor" icon={Database} description="Real-time job queue and processing status." />;
      case 'formula':
        return <PlaceholderView title="Formula Engine" icon={GitMerge} description="Model weighting and layer configuration." />;
      case 'settings':
        return <PlaceholderView title="Settings" icon={Settings} description="System configuration and API keys." />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

function PlaceholderView({ title, icon: Icon, description }: { title: string, icon: any, description: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] px-4">
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.02)] backdrop-blur-xl mb-6 md:mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
        <Icon className="w-8 h-8 md:w-10 md:h-10 text-primary/50 relative z-10" />
      </div>
      <h1 className="text-xl md:text-3xl font-headline font-bold tracking-tight mb-2 md:mb-3">{title}</h1>
      <p className="text-xs md:text-sm text-white/40 max-w-md leading-relaxed">{description}</p>
      <div className="mt-8 md:mt-10 px-4 md:px-6 py-2 md:py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] text-[10px] md:text-xs font-mono text-white/30 uppercase tracking-widest backdrop-blur-md">
        Module Offline
      </div>
    </div>
  );
}
