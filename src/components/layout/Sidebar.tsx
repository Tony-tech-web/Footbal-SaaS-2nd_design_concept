// src/components/layout/Sidebar.tsx
import React from 'react';
import { Activity, LayoutDashboard, Zap, FileText, Settings, Database, GitMerge, X, Search, ChevronDown, Trophy } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStarkStore } from '../../store/useStarkStore';

interface SidebarProps { activeTab:string; setActiveTab:(tab:string)=>void; isOpen:boolean; onClose:()=>void }

export function Sidebar({ activeTab, setActiveTab, isOpen, onClose }: SidebarProps) {
  const { formulaAccuracy, footballFormulaVersion, basketballFormulaVersion, wsConnected } = useStarkStore();

  const navItems = [
    { id:'dashboard',   label:'Dashboard',     icon:LayoutDashboard, badge:null },
    { id:'live-engine', label:'Live Engine',    icon:Zap,             badge:'LIVE' },
    { id:'predictions', label:'Predictions',    icon:Activity,        badge:null },
    { id:'bet-slips',   label:'Bet Slips',      icon:FileText,        badge:null },
    { id:'queue',       label:'Queue Monitor',  icon:Database,        badge:null },
    { id:'formula',     label:'Formula Engine', icon:GitMerge,        badge:null },
    { id:'settings',    label:'Settings',       icon:Settings,        badge:null },
  ];

  return (
    <aside className={cn(
      "w-64 h-[100dvh] border-r border-white/[0.05] bg-[#0A0A0B] flex flex-col fixed left-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
      isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    )}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(255,107,0,0.35)]">
            <Trophy className="w-4 h-4 text-black" />
          </div>
          <div>
            <span className="font-headline font-bold text-sm tracking-tight">SPORTS ORACLE</span>
            <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Prediction Engine</div>
          </div>
        </div>
        <button onClick={onClose} className="md:hidden p-1 rounded-md hover:bg-white/5 text-white/40"><X className="w-4 h-4" /></button>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input type="text" placeholder="Search..." className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-primary/40 transition-all" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest px-2 mb-2 mt-1">Navigation</p>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group",
                isActive ? "bg-primary/10 border border-primary/20 text-primary shadow-[inset_0_1px_0_rgba(255,107,0,0.1)]"
                         : "text-white/50 hover:text-white/80 hover:bg-white/[0.04] border border-transparent"
              )}
            >
              <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-primary" : "text-white/40 group-hover:text-white/60")} />
              <span className="font-medium flex-1 text-left">{item.label}</span>
              {item.badge === 'LIVE' && wsConnected && (
                <span className="px-1.5 py-0.5 rounded-md bg-green-500/20 text-green-400 text-[8px] font-mono uppercase tracking-widest">Live</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Formula Status Footer */}
      <div className="p-4 border-t border-white/[0.04] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Formula Status</span>
          {formulaAccuracy != null && (
            <span className="text-[10px] font-mono text-primary font-bold">{Math.round(formulaAccuracy * 100)}% acc</span>
          )}
        </div>
        <div className="flex gap-2">
          <div className="flex-1 px-2 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-center">
            <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">⚽ Football</div>
            <div className="text-[10px] font-mono text-secondary font-bold mt-0.5">{footballFormulaVersion}</div>
          </div>
          <div className="flex-1 px-2 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-center">
            <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">🏀 Basketball</div>
            <div className="text-[10px] font-mono text-secondary font-bold mt-0.5">{basketballFormulaVersion}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
