import React from 'react';
import { Bell, Search, User, ChevronDown, Menu } from 'lucide-react';

interface TopbarProps {
  onMenuToggle: () => void;
}

export function Topbar({ onMenuToggle }: TopbarProps) {
  return (
    <header className="h-14 md:h-16 border-b border-glass-border bg-black/20 backdrop-blur-[40px] saturate-150 sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 transition-all duration-300">
      <div className="flex items-center gap-3 flex-1">
        <button 
          onClick={onMenuToggle}
          className="md:hidden p-2 -ml-2 rounded-xl hover:bg-white/10 transition-colors active:scale-95"
        >
          <Menu className="w-5 h-5 text-white/80" />
        </button>
        <div className="relative w-full max-w-xs hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input 
            type="text" 
            placeholder="Search matches..." 
            className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl pl-9 pr-4 py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded-md bg-white/10 text-[9px] font-mono text-white/50">⌘K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Connection Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
          <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse-slow shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
          <span className="text-[10px] font-mono text-white/60 uppercase tracking-wider">WS: Connected</span>
          <span className="text-[10px] font-mono text-white/40 ml-1">14ms</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-white/10 transition-colors active:scale-95">
          <Bell className="w-4 h-4 text-white/70" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(255,107,0,0.8)]" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-glass-border cursor-pointer hover:opacity-80 transition-opacity active:scale-95">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-[0_0_15px_rgba(255,107,0,0.2)]">
            <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-black" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium leading-tight">Admin</p>
            <p className="text-[9px] text-white/40 uppercase tracking-wider">Level 4</p>
          </div>
          <ChevronDown className="w-4 h-4 text-white/40 hidden sm:block" />
        </div>
      </div>
    </header>
  );
}
