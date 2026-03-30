import React from 'react';
import { Activity, Cpu, Database, Server, ArrowUpRight, ArrowDownRight, Zap, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Dashboard() {
  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-headline font-bold tracking-tight">System Overview</h1>
          <p className="text-xs md:text-sm text-white/40 mt-1">Real-time monitoring of STARK prediction engine.</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button className="glass-button px-3 py-1.5 md:px-4 md:py-2 flex items-center gap-2 text-xs md:text-sm font-medium">
            <Database className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/60" />
            <span className="hidden sm:inline">Export Data</span>
            <span className="sm:hidden">Export</span>
          </button>
          <button className="glass-button px-3 py-1.5 md:px-4 md:py-2 flex items-center gap-2 text-xs md:text-sm font-medium bg-primary/10 border-primary/30 text-primary hover:bg-primary/20">
            <Zap className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Force Sync</span>
            <span className="sm:hidden">Sync</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <MetricCard title="API Latency" value="14ms" trend="-2ms" trendUp={false} icon={Activity} status="good" />
        <MetricCard title="Queue Load" value="84%" trend="+12%" trendUp={true} icon={Server} status="warning" />
        <MetricCard title="Active Models" value="4/4" trend="Stable" trendUp={true} icon={Cpu} status="good" />
        <MetricCard title="Accuracy" value="68.2%" trend="+1.4%" trendUp={true} icon={Zap} status="good" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Live Feed */}
        <div className="lg:col-span-2 glass-panel p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-headline font-semibold flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(255,107,0,0.8)]" />
              Live Oracle Feed
            </h2>
            <span className="text-[9px] md:text-[10px] font-mono text-white/40 uppercase tracking-wider border border-white/10 px-2 py-1 rounded-md bg-white/5">Auto-updating</span>
          </div>

          <div className="space-y-2 md:space-y-3">
            {[
              { match: "Arsenal vs Liverpool", league: "Premier League", prediction: "Home Win", confidence: 82, time: "Just now" },
              { match: "Real Madrid vs Barcelona", league: "La Liga", prediction: "Draw", confidence: 45, time: "2m ago" },
              { match: "Bayern Munich vs BVB", league: "Bundesliga", prediction: "Home Win", confidence: 91, time: "5m ago" },
              { match: "AC Milan vs Inter", league: "Serie A", prediction: "Away Win", confidence: 68, time: "12m ago" },
            ].map((item, i) => (
              <div key={i} className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all duration-300 cursor-pointer gap-3 sm:gap-0">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
                    <Zap className="w-4 h-4 md:w-5 md:h-5 text-primary/70 group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm md:text-base leading-tight">{item.match}</h3>
                    <p className="text-[10px] md:text-[11px] text-white/40 mt-1">{item.league} • {item.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 sm:gap-6 pl-11 sm:pl-0">
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <div className="flex items-center justify-between sm:justify-end gap-2">
                      <p className="text-xs md:text-sm font-medium text-white/90">{item.prediction}</p>
                      <span className="text-[9px] md:text-[10px] font-mono text-white/60 sm:hidden">{item.confidence}%</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="w-full sm:w-24 h-1.5 bg-white/5 rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-1000 ease-out", item.confidence > 75 ? "bg-primary shadow-[0_0_8px_rgba(255,107,0,0.5)]" : item.confidence > 50 ? "bg-secondary shadow-[0_0_8px_rgba(0,229,255,0.5)]" : "bg-white/30")} 
                          style={{ width: `${item.confidence}%` }} 
                        />
                      </div>
                      <span className="text-[9px] md:text-[10px] font-mono text-white/60 hidden sm:inline-block">{item.confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="glass-panel p-4 md:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-headline font-semibold">System Alerts</h2>
            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <span className="text-[10px] md:text-xs font-mono text-red-400">2</span>
            </div>
          </div>

          <div className="flex-1 space-y-2 md:space-y-3">
            <AlertCard type="error" title="Model Drift Detected" message="Claude-3.5-Sonnet showing 12% drift on NBA predictions." time="14m ago" />
            <AlertCard type="warning" title="High Queue Latency" message="Processing time exceeded 2000ms for batch #8921." time="1h ago" />
            <AlertCard type="info" title="Patch Deployed" message="Formula Engine updated to v2.4.1 successfully." time="3h ago" />
          </div>

          <button className="w-full mt-4 py-2.5 text-[10px] md:text-xs font-mono text-white/40 hover:text-white/80 transition-colors uppercase tracking-wider border-t border-white/5 pt-4">
            View All Logs
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, trendUp, icon: Icon, status }: any) {
  return (
    <div className="glass-panel p-3 md:p-5 relative overflow-hidden group">
      <div className="absolute -top-2 -right-2 md:top-0 md:right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        <Icon className="w-12 h-12 md:w-16 md:h-16" />
      </div>
      
      <div className="flex items-center justify-between mb-2 md:mb-4 relative z-10">
        <h3 className="text-[9px] md:text-xs font-mono text-white/50 uppercase tracking-wider truncate pr-2">{title}</h3>
        <div className={cn(
          "w-1.5 h-1.5 md:w-2 md:h-2 rounded-full shrink-0",
          status === 'good' ? "bg-secondary shadow-[0_0_8px_rgba(0,229,255,0.6)]" : 
          status === 'warning' ? "bg-primary shadow-[0_0_8px_rgba(255,107,0,0.6)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
        )} />
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-end gap-1 sm:gap-3 relative z-10">
        <span className="text-xl md:text-3xl font-headline font-bold tracking-tight leading-none">{value}</span>
        <div className={cn(
          "flex items-center text-[10px] md:text-xs font-medium",
          trendUp ? (status === 'warning' ? "text-red-400" : "text-secondary") : "text-white/60"
        )}>
          {trendUp ? <ArrowUpRight className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5" /> : <ArrowDownRight className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5" />}
          {trend}
        </div>
      </div>
    </div>
  );
}

function AlertCard({ type, title, message, time }: any) {
  return (
    <div className="p-2.5 md:p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex gap-2.5 md:gap-3 items-start shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
      <div className={cn(
        "mt-0.5 p-1.5 rounded-lg shrink-0",
        type === 'error' ? "bg-red-500/10 text-red-400 border border-red-500/20" :
        type === 'warning' ? "bg-primary/10 text-primary border border-primary/20" :
        "bg-secondary/10 text-secondary border border-secondary/20"
      )}>
        {type === 'error' ? <ShieldAlert className="w-3.5 h-3.5 md:w-4 md:h-4" /> :
         type === 'warning' ? <Activity className="w-3.5 h-3.5 md:w-4 md:h-4" /> :
         <Zap className="w-3.5 h-3.5 md:w-4 md:h-4" />}
      </div>
      <div className="min-w-0">
        <h4 className="text-xs md:text-sm font-medium text-white/90 truncate">{title}</h4>
        <p className="text-[10px] md:text-xs text-white/50 mt-0.5 md:mt-1 leading-relaxed line-clamp-2">{message}</p>
        <span className="text-[9px] md:text-[10px] font-mono text-white/30 mt-1.5 md:mt-2 block">{time}</span>
      </div>
    </div>
  );
}
