import React from 'react';
import { Activity, LayoutDashboard, Zap, FileText, Settings, Database, GitMerge, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ activeTab, setActiveTab, isOpen, onClose }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'live-engine', label: 'Live Engine', icon: Zap },
    { id: 'predictions', label: 'Predictions', icon: Activity },
    { id: 'bet-slips', label: 'Bet Slips', icon: FileText },
    { id: 'queue', label: 'Queue Monitor', icon: Database },
    { id: 'formula', label: 'Formula Engine', icon: GitMerge },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={cn(
      "w-64 h-[100dvh] border-r border-glass-border bg-black/40 backdrop-blur-[40px] saturate-150 flex flex-col fixed left-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
      isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    )}>
      {/* Logo Area */}
      <div className="h-14 md:h-16 flex items-center justify-between px-5 border-b border-glass-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(255,107,0,0.3)]">
            <span className="text-black font-bold text-xs">S</span>
          </div>
          <span className="font-headline font-bold tracking-widest text-sm">STARK</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/10 text-white/60 ml-1">v2.4</span>
        </div>
        <button onClick={onClose} className="md:hidden p-1.5 rounded-full hover:bg-white/10 transition-colors">
          <X className="w-4 h-4 text-white/70" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); onClose(); }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] relative group",
                isActive 
                  ? "text-white bg-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]" 
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full shadow-glow" />
              )}
              <Icon className={cn("w-4 h-4 transition-colors duration-300", isActive ? "text-primary" : "text-white/40 group-hover:text-white/70")} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom Status */}
      <div className="p-4 border-t border-glass-border">
        <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 flex items-center justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse-slow shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
            <span className="text-[10px] font-mono text-white/60 uppercase tracking-wider">Engine Online</span>
          </div>
          <span className="text-[10px] font-mono text-secondary">99.9%</span>
        </div>
      </div>
    </aside>
  );
}
