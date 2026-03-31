// src/components/views/Dashboard.tsx
import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Activity, 
  Zap, 
  Shield, 
  BrainCircuit, 
  TrendingUp, 
  Cpu, 
  RefreshCw, 
  ChevronRight, 
  AlertCircle, 
  Terminal,
  Database,
  BarChart3
} from 'lucide-react';
import { useStarkStore } from '../../store/useStarkStore';
import { userApi, formulaApi, slipsApi, adminApi, engineApi } from '../../lib/api';
import { cn } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';

const TIER_COLORS = { 
  TIER1: 'text-emerald-400', 
  TIER2: 'text-amber-400', 
  TIER3: 'text-rose-400' 
};

export function Dashboard() {
  const { 
    wsConnected, 
    wsLatency, 
    wsEventLog, 
    predictions, 
    footballFormulaVersion, 
    basketballFormulaVersion 
  } = useStarkStore();

  // ─── Data Fetching ──────────────────────────────────────────────────────────
  
  const { data: user } = useQuery({
    queryKey: ['user-stats'],
    queryFn: () => userApi.get(),
    refetchInterval: 30000,
  });

  const { data: formula } = useQuery({
    queryKey: ['formula-active'],
    queryFn: () => formulaApi.active(),
    refetchInterval: 60000,
  });

  const { data: recentSlips } = useQuery({
    queryKey: ['recent-slips'],
    queryFn: () => slipsApi.list({ limit: '5' }),
    refetchInterval: 15000,
  });

  const { data: engineHealth } = useQuery({
    queryKey: ['engine-health'],
    queryFn: () => engineApi.health(),
    refetchInterval: 10000,
  });

  const snapshotMutation = useMutation({
    mutationFn: () => adminApi.snapshot(),
  });

  // ─── Stats Formatting ───────────────────────────────────────────────────────
  
  const lastPrediction = predictions[0];
  const isAdmin = user?.user?.plan === 'ELITE';

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* ─── Hero Overview ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: 'Plan Tier', 
            inner: user?.user?.plan || 'PRO', 
            icon: Shield, 
            color: 'text-primary',
            desc: `Daily Slips: ${user?.stats?.slips ?? 0}/${user?.limits?.slips ?? 3}` 
          },
          { 
            label: 'Engine Accuracy', 
            inner: formula?.stats?.accuracy ? `${formula.stats.accuracy}%` : '---', 
            icon: BrainCircuit, 
            color: 'text-primary',
            isGradient: true,
            desc: `Last 30 Days Vol: ${formula?.stats?.totalPredictions ?? '---'}` 
          },
          { 
            label: 'Formula Layers', 
            inner: formula?.formulaJson?.layerWeights ? Object.keys((formula.formulaJson as any).layerWeights).length.toString() : '---', 
            icon: Cpu, 
            color: 'text-white',
            desc: 'Multi-Model Consensus' 
          },
          { 
            label: 'System Status', 
            inner: wsConnected ? 'LIVE' : 'OFFLINE', 
            icon: Zap, 
            color: wsConnected ? 'text-primary' : 'text-rose-500',
            desc: wsConnected ? `${wsLatency}ms Latency` : 'Reconnect active' 
          }
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 relative group transition-all hover:bg-white/4 overflow-hidden">
            <div className="absolute -right-4 -top-4 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity">
              <stat.icon className="w-16 h-16" />
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-xl bg-white/3 border border-white/5">
                <stat.icon className={cn("w-4 h-4", stat.color)} />
              </div>
              <div className="flex gap-1">
                {[1,2,3].map(d => <div key={d} className="w-0.5 h-3 bg-white/5 rounded-full" />)}
              </div>
            </div>
            
            <div>
              <p className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-white/20 mb-1">{stat.label}</p>
              <h3 className={cn("text-3xl font-headline font-extrabold tracking-tighter", stat.isGradient ? "text-gradient-primary" : "text-white")}>
                {stat.inner as any}
              </h3>
              <p className="text-[10px] text-white/30 mt-3 font-medium uppercase tracking-wider flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary" />
                {stat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ─── Center Column: Performance & Slips ────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Performance Matrix */}
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-secondary" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Confidence performance Matrix</h3>
              </div>
              <div className="px-3 py-1 rounded-full bg-white/2 border border-white/5 text-[9px] font-mono text-white/30 uppercase tracking-widest">
                Real-time validation
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['TIER1', 'TIER2', 'TIER3'].map((tier) => {
                const tierData = formula?.stats?.tier1Rate && tier === 'TIER1' ? formula.stats.tier1Rate * 100 : null;
                // Note: Simplified logic for tiers as standard active endpoint doesn't break out T2/T3 yet without deeper view param
                return (
                  <div key={tier} className="p-4 rounded-2xl bg-white/2 border border-white/5 relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col items-center">
                      <span className={cn("text-[9px] font-mono font-bold tracking-[0.2em] mb-4 uppercase", TIER_COLORS[tier as keyof typeof TIER_COLORS])}>
                        {tier} Range
                      </span>
                      <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="40" cy="40" r="36" fill="transparent" stroke="currentColor" strokeWidth="3" className="text-white/[0.03]" />
                          {tier === 'TIER1' && (
                            <circle 
                              cx="40" cy="40" r="36" fill="transparent" stroke="currentColor" strokeWidth="3" 
                              className={cn("transition-all duration-1000 ease-out", TIER_COLORS[tier as keyof typeof TIER_COLORS])}
                              strokeDasharray={226}
                              strokeDashoffset={226 - (226 * (tierData || 85)) / 100}
                              strokeLinecap="round"
                            />
                          )}
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-lg font-headline font-bold">
                          {tier === 'TIER1' ? (tierData ? `${Math.round(tierData)}%` : '85%+') : tier === 'TIER2' ? '70%+' : '50%+'}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/20 text-center px-4 leading-relaxed">
                        Expected accuracy based on multi-model consensus.
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Ingestion Feed */}
          <div className="glass-panel overflow-hidden">
            <div className="p-5 border-b border-white/4 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Recent Activity Stream</h3>
              </div>
              <button className="text-[10px] font-mono text-primary hover:text-primary/70 transition-colors uppercase tracking-[0.1em]">View all slips</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/4 text-[9px] font-mono uppercase text-white/20">
                    <th className="px-6 py-4 font-normal">Created</th>
                    <th className="px-6 py-4 font-normal">ID / Source</th>
                    <th className="px-6 py-4 font-normal">Matches</th>
                    <th className="px-6 py-4 font-normal">Sport</th>
                    <th className="px-6 py-4 font-normal text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {(!recentSlips?.slips || recentSlips.slips.length === 0) ? (
                    <tr><td colSpan={5} className="px-6 py-10 text-center text-white/20 italic">No recent slips detected...</td></tr>
                  ) : (
                    recentSlips.slips.map((slip) => (
                      <tr key={slip.id} className="border-b border-white/2 hover:bg-white/1 transition-colors group">
                        <td className="px-6 py-4 text-white/40 font-mono text-[10px]">
                          {formatDistanceToNow(new Date(slip.createdAt), { addSuffix: true })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-mono text-white/60">#{slip.id.slice(-6).toUpperCase()}</span>
                            <span className="text-[9px] text-white/20 uppercase tracking-widest mt-0.5">{slip.source}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-white/70">{slip.matches.length} matches</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-white/40">{slip.sport || '⚽'}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border", 
                            slip.status === 'PREDICTED' ? "bg-green-500/10 border-green-500/20 text-green-400" :
                            slip.status === 'PROCESSING' ? "bg-primary/10 border-primary/20 text-primary animate-pulse" :
                            "bg-white/5 border-white/10 text-white/30"
                          )}>
                            <div className={cn("w-1 h-1 rounded-full", slip.status === 'PREDICTED' ? "bg-green-400" : slip.status === 'PROCESSING' ? "bg-primary" : "bg-white/30")} />
                            {slip.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ─── Right Column: Logs, Admin & Settings ─────────────────────────────── */}
        <div className="space-y-6">
          
          {/* Live Engine Monitor (Matches image10.png) */}
          <div className="glass-panel p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-[0.02]">
              <Zap className="w-20 h-20" />
            </div>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                  <Zap className="w-5 h-5 text-primary animate-pulse" />
                </div>
                <div>
                  <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/30">Live Engine Preview</h3>
                  <p className="text-xs text-white/50">Processing real-time sports data</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[9px] font-mono font-bold text-primary uppercase tracking-widest">Processing</span>
              </div>
            </div>
            
            {lastPrediction ? (
              <div className="space-y-8 animate-in slide-in-from-right duration-500">
                <div>
                  <h4 className="text-2xl font-headline font-extrabold mb-1 tracking-tight">{lastPrediction.match}</h4>
                  <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-white/20 uppercase">Premier League • Live</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/2 border border-white/5 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Claude-3.5-Sonnet</span>
                    <span className="text-xs font-bold text-primary/80">78%</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/2 border border-white/5 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">GPT-4o</span>
                    <span className="text-xs font-bold text-primary/80">74%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-headline font-bold text-white/40 uppercase tracking-widest">Final Consensus</span>
                    <span className="text-lg font-headline font-extrabold text-primary">{lastPrediction.confidence}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(255,107,0,0.4)]" 
                      style={{ width: `${lastPrediction.confidence}%` }} 
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between group-hover:bg-primary/8 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/20 text-primary">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold">Agreement: Stable</p>
                      <p className="text-[9px] text-white/30">Confidence drift within parameters (4%)</p>
                    </div>
                  </div>
                  <button className="text-[9px] font-mono font-bold text-primary uppercase tracking-widest border-b border-primary/20 hover:border-primary">View Analysis</button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="relative">
                    <Activity className="w-10 h-10 text-white/5 animate-pulse" />
                    <BrainCircuit className="absolute inset-0 w-10 h-10 text-primary/20 animate-ping" />
                  </div>
                </div>
                <p className="text-[11px] text-white/20 uppercase font-mono tracking-[0.3em]">Synching with Oracle-V4...</p>
              </div>
            )}
          </div>

          {/* Admin System Controls (Elite Plan only) */}
          {isAdmin && (
            <div className="glass-panel p-5 border-secondary/20 bg-secondary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Shield className="w-16 h-16" />
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-secondary" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">System Control</h3>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => snapshotMutation.mutate()}
                  disabled={snapshotMutation.isPending}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-secondary/10 hover:border-secondary/20 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <RefreshCw className={cn("w-3.5 h-3.5 text-secondary", snapshotMutation.isPending && "animate-spin")} />
                    <span className="text-[10px] font-mono uppercase tracking-widest">Accuracy Snapshot</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-white/10 group-hover:text-secondary/50" />
                </button>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.1em] mb-2 flex items-center gap-1.5">
                    <Database className="w-3 h-3" /> Queue metrics
                  </p>
                  <div className="space-y-1.5">
                    {[
                      { label: 'Predictions', active: engineHealth?.queues?.predictions?.active ?? 0, waiting: engineHealth?.queues?.predictions?.waiting ?? 0 },
                      { label: 'Verifications', active: engineHealth?.queues?.verifications?.active ?? 0, waiting: engineHealth?.queues?.verifications?.waiting ?? 0 }
                    ].map(idx => (
                      <div key={idx.label} className="flex items-center justify-between text-[10px]">
                        <span className="text-white/40">{idx.label}</span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className={cn("font-bold", idx.active > 0 ? "text-primary" : "text-white/20")}>{idx.active}</span>
                          <span className="text-white/10">/</span>
                          <span className="text-white/40">{idx.waiting}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Real-time WS Terminal */}
          <div className="glass-panel overflow-hidden border-indigo-500/10">
            <div className="p-4 border-b border-white/4 flex items-center justify-between bg-black/30">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Event Terminal</h3>
              </div>
              {wsConnected && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.5)]" />}
            </div>
            <div className="p-3 max-h-[180px] overflow-y-auto space-y-1.5 bg-black/50 font-mono text-[9px] scrollbar-thin">
              {wsEventLog.length === 0 ? (
                <div className="text-white/10 text-center py-8">Initializing secure socket connection...</div>
              ) : (
                wsEventLog.slice(0, 15).map((ev, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-white/10 shrink-0">[{new Date(ev.timestamp).toLocaleTimeString([], { hour12: false })}]</span>
                    <span className={cn(
                      ev.type.includes('error') ? 'text-rose-500' :
                      ev.type.includes('complete') ? 'text-emerald-400' :
                      ev.type.includes('patched') ? 'text-amber-400' :
                      'text-indigo-300/60'
                    )}>
                      {ev.type.toUpperCase()}:
                    </span>
                    <span className="text-white/30 truncate select-all">
                      {ev.type.includes('prediction') 
                        ? `#${(ev.payload as any)?.matchId?.slice(-4) ?? 'ERR'} OK` 
                        : ev.type}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
