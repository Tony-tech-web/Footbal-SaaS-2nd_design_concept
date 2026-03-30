import React from 'react';
import { 
  Activity, 
  LayoutDashboard, 
  Zap, 
  FileText, 
  Settings, 
  Database, 
  GitMerge, 
  X, 
  Search,
  ChevronDown,
  Briefcase,
  Users,
  Building2,
  BarChart3,
  Command,
  Hash
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ activeTab, setActiveTab, isOpen, onClose }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live-engine', label: 'Live Engine', icon: Zap },
    { id: 'predictions', label: 'Predictions', icon: Activity },
    { id: 'bet-slips', label: 'Bet Slips', icon: FileText },
    { id: 'queue', label: 'Queue Monitor', icon: Database },
    { id: 'formula', label: 'Formula Engine', icon: GitMerge },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const favorites = [
    { id: 'apple', label: 'Apple', type: 'COMPANY', icon: '🍎' },
    { id: 'google', label: 'Google', type: 'COMPANY', icon: 'G' },
    { id: 'figma', label: 'Figma', type: 'COMPANY', icon: 'F' },
    { id: 'aman', label: 'Aman', type: 'DESIGNER', icon: '👤' },
  ];

  const searches = [
    { id: 'success', label: 'Customer Success', color: 'bg-orange-500' },
    { id: 'outsourcing', label: 'Outsourcing', color: 'bg-teal-500' },
    { id: 'fundraising', label: 'Fundraising', color: 'bg-pink-500' },
    { id: 'recruiting', label: 'Recruiting', color: 'bg-blue-500' },
  ];

  return (
    <aside className={cn(
      "w-64 h-[100dvh] border-r border-white/[0.05] bg-[#0A0A0B] flex flex-col fixed left-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
      isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    )}>
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(255,107,0,0.3)]">
            <span className="text-black font-bold text-[10px]">S</span>
          </div>
          <span className="font-headline font-bold text-sm tracking-tight">STARK Inc</span>
          <ChevronDown className="w-3 h-3 text-white/40" />
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1 rounded-md hover:bg-white/5 text-white/40">
            <LayoutDashboard className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="md:hidden p-1 rounded-md hover:bg-white/5 text-white/40">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-4">
        <div className="relative group">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white/60 transition-colors" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl pl-9 pr-8 py-1.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/10 focus:bg-white/[0.05] transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
            <Command className="w-2.5 h-2.5 text-white/20" />
            <span className="text-[9px] font-mono text-white/20">K</span>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-2 space-y-6 pb-6">
        {/* Main Navigation */}
        <div>
          <p className="px-3 text-[10px] font-mono text-white/20 uppercase tracking-widest mb-2">Navigation</p>
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); onClose(); }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all group",
                    isActive 
                      ? "text-white bg-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]" 
                      : "text-white/40 hover:text-white/80 hover:bg-white/[0.03]"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn("w-3.5 h-3.5", isActive ? "text-primary" : "text-white/20 group-hover:text-white/40")} />
                    {item.label}
                  </div>
                  {isActive && <ChevronDown className="w-3 h-3 text-white/20" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Favorites */}
        <div>
          <p className="px-3 text-[10px] font-mono text-white/20 uppercase tracking-widest mb-2">Favorites</p>
          <div className="space-y-0.5">
            {favorites.map((fav) => (
              <button
                key={fav.id}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium text-white/40 hover:text-white/80 hover:bg-white/[0.03] transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded bg-white/5 flex items-center justify-center text-[10px] text-white/60 group-hover:text-white/90">
                    {fav.icon}
                  </div>
                  {fav.label}
                </div>
                <span className="text-[8px] font-mono text-white/10 group-hover:text-white/20">{fav.type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Searches */}
        <div>
          <p className="px-3 text-[10px] font-mono text-white/20 uppercase tracking-widest mb-2">Searches</p>
          <div className="space-y-0.5">
            {searches.map((search) => (
              <button
                key={search.id}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/40 hover:text-white/80 hover:bg-white/[0.03] transition-all group"
              >
                <div className={cn("w-3.5 h-3.5 rounded flex items-center justify-center", search.color)}>
                  <Hash className="w-2 h-2 text-black/60" />
                </div>
                {search.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Status */}
      <div className="p-4 mt-auto border-t border-white/[0.05]">
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 flex items-center justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Engine Online</span>
          </div>
          <span className="text-[10px] font-mono text-secondary">99.9%</span>
        </div>
      </div>
    </aside>
  );
}
