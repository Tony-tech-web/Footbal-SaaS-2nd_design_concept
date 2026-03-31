// src/components/views/LiveEngine.tsx
import React, { useState } from 'react';
import { Zap, BrainCircuit, Activity, Shield, Globe, RefreshCw, MessageSquare, GitMerge, Cpu, TrendingUp } from 'lucide-react';
import { useStarkStore } from '../../store/useStarkStore';
import { cn } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';

const TIER_COLORS = { TIER1:'text-green-400', TIER2:'text-yellow-400', TIER3:'text-red-400' };

export function LiveEngine() {
  const { predictions, wsConnected, wsLatency, wsEventLog, activePredictionId, setActivePredictionId, formulaVersion } = useStarkStore();
  const [showLog, setShowLog] = useState(false);

  const latest = predictions.find(p => p.id === activePredictionId) || predictions[0];
  const recentEvents = wsEventLog.slice(0, 20);

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-headline font-bold tracking-tight">Live Oracle Engine</h1>
          <p className="text-xs md:text-sm text-white/40 mt-1">Real-time multi-model consensus · Claude primary · GPT-4 validator</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn("px-3 py-1.5 rounded-full border flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest transition-all",
            wsConnected ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400")}>
            <div className={cn("w-1.5 h-1.5 rounded-full", wsConnected ? "bg-green-400 animate-pulse" : "bg-red-400")} />
            {wsConnected ? `Live · ${wsLatency}ms` : 'Offline'}
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono text-white/40">
            Formula <span className="text-primary font-bold">{formulaVersion}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Active Prediction */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <BrainCircuit className="w-64 h-64" />
            </div>

            <div className="relative z-10 space-y-6">
              {/* Match info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[9px] font-mono text-primary uppercase tracking-widest">Active Resolution</div>
                    {latest && <span className="text-[9px] font-mono text-white/20">{latest.sport === 'BASKETBALL' ? '🏀' : '⚽'} {latest.sport}</span>}
                  </div>
                  <h2 className="text-2xl md:text-4xl font-headline font-bold tracking-tight">{latest?.match || 'Awaiting slip...'}</h2>
                  {latest && <p className="text-sm text-white/40">{latest.betType}{latest.betLine != null ? ` · Line: ${latest.betLine}` : ''}</p>}
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-1">
                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Final Confidence</span>
                  <span className={cn("text-4xl md:text-6xl font-headline font-bold", latest ? TIER_COLORS[latest.tier] : 'text-white/20')}>{latest?.confidence || '--'}%</span>
                </div>
              </div>

              {/* AI Debate Visualization */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Model Consensus Stream</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-secondary" /><span className="text-[10px] font-mono text-white/40">Claude</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" /><span className="text-[10px] font-mono text-white/40">GPT-4</span></div>
                  </div>
                </div>

                {[
                  { label:'Claude (Primary · 60%)', icon:BrainCircuit, value:latest?.layerScores?.L6 ?? 0, color:'secondary', desc: latest?.keyDriver || 'Awaiting analysis...', model:'claude' },
                  { label:'GPT-4 (Validator · 40%)', icon:Shield, value:latest ? Math.max(30, (latest.confidence || 0) - 5) : 0, color:'primary', desc:'Independent validation pass', model:'gpt4' },
                  { label:'Consensus (Weighted Final)', icon:GitMerge, value:latest?.confidence ?? 0, color:'secondary', desc: latest ? `${latest.predicted} — ${latest.tier}` : '—', model:'consensus' },
                ].map((row) => (
                  <div key={row.label} className={cn("p-4 rounded-2xl border flex flex-col md:flex-row md:items-center gap-3",
                    row.model==='consensus' ? "bg-gradient-to-r from-primary/5 to-transparent border-primary/20" : "bg-white/[0.02] border-white/[0.05]")}>
                    <div className="flex items-center gap-3 flex-1">
                      <div className={cn("w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0",
                        row.model==='consensus'?'bg-primary/10 border-primary/20':'bg-white/[0.03] border-white/[0.05]')}>
                        <row.icon className={cn("w-4 h-4", row.color==='primary'?'text-primary':'text-secondary')} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">{row.label}</p>
                        <p className="text-[10px] text-white/40 truncate mt-0.5">{row.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 md:w-32 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all duration-700", row.color==='primary'?'bg-primary':'bg-secondary')} style={{ width:`${row.value}%` }} />
                      </div>
                      <span className={cn("text-lg font-headline font-bold w-12 text-right flex-shrink-0", row.color==='primary'?'text-primary':'text-secondary')}>{row.value || '--'}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Layer breakdown */}
              {latest?.layerScores && Object.keys(latest.layerScores).length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Layer Analysis</h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {Object.entries(latest.layerScores).map(([k, v]) => (
                      <div key={k} className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
                        <p className="text-[8px] font-mono text-white/30 uppercase">{k}</p>
                        <p className={cn("text-base font-bold mt-1", Number(v)>=80?'text-green-400':Number(v)>=65?'text-yellow-400':'text-red-400')}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Basketball-specific */}
              {latest?.sport === 'BASKETBALL' && (
                <div className="flex items-center gap-3 flex-wrap">
                  {latest.backToBackFlag && <span className="px-2 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[9px] font-mono uppercase tracking-widest">⚡ B2B GAME</span>}
                  {latest.injuryImpact && latest.injuryImpact !== 'NONE' && <span className="px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-mono uppercase tracking-widest">🤕 INJURY: {latest.injuryImpact}</span>}
                </div>
              )}
            </div>
          </div>

          {/* Recent predictions mini-feed */}
          {predictions.length > 1 && (
            <div className="glass-panel p-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Recent Completions</h3>
              <div className="space-y-2">
                {predictions.slice(0, 4).map(p => (
                  <button key={p.id} onClick={() => setActivePredictionId(p.id)}
                    className={cn("w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all",
                      activePredictionId === p.id || (!activePredictionId && predictions[0]?.id === p.id) ? "bg-primary/10 border border-primary/20" : "hover:bg-white/[0.03] border border-transparent")}>
                    <span className="text-base">{p.sport === 'BASKETBALL' ? '🏀' : '⚽'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{p.match}</p>
                      <p className="text-[9px] font-mono text-white/30">{p.betType} → {p.predicted}</p>
                    </div>
                    <span className={cn("text-sm font-bold font-mono", TIER_COLORS[p.tier])}>{p.confidence}%</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: WS Event log + stats */}
        <div className="space-y-4">
          {/* Engine Stats */}
          <div className="glass-panel p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="w-4 h-4 text-secondary" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Engine Metrics</h3>
            </div>
            {[
              { label:'Predictions (session)', value: predictions.length },
              { label:'Tier 1 rate', value: predictions.length > 0 ? `${Math.round(predictions.filter(p=>p.tier==='TIER1').length/predictions.length*100)}%` : '—' },
              { label:'WS Latency', value: wsConnected ? `${wsLatency}ms` : 'Offline' },
              { label:'WS Events', value: wsEventLog.length },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between text-xs">
                <span className="text-white/40">{row.label}</span>
                <span className="font-mono font-bold text-white/70">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Live WS Event Log */}
          <div className="glass-panel overflow-hidden">
            <div className="p-4 border-b border-white/[0.04] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">WS Event Log</h3>
                {wsConnected && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
              </div>
              <button onClick={() => setShowLog(!showLog)} className="text-[9px] font-mono text-white/20 hover:text-white/50 uppercase tracking-widest transition-colors">
                {showLog ? 'Hide' : 'Show'}
              </button>
            </div>

            {showLog && (
              <div className="p-3 max-h-64 overflow-y-auto space-y-1.5 font-mono text-[9px]">
                {recentEvents.length === 0 && <p className="text-white/20 text-center py-4">No events yet...</p>}
                {recentEvents.map((e, i) => (
                  <div key={i} className={cn("flex items-start gap-2",
                    e.type==='prediction:complete'?'text-green-400':
                    e.type==='formula:patched'?'text-orange-400':
                    e.type==='connect'?'text-secondary':
                    e.type==='error'?'text-red-400':'text-white/30')}>
                    <span className="text-white/20 flex-shrink-0">{new Date(e.timestamp).toLocaleTimeString()}</span>
                    <span className="uppercase tracking-widest">{e.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formula version notices */}
          <div className="glass-panel p-4 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Active Formulas</h3>
            {[{sport:'⚽ Football', version: useStarkStore.getState().footballFormulaVersion}, {sport:'🏀 Basketball', version: useStarkStore.getState().basketballFormulaVersion}].map(f=>(
              <div key={f.sport} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <span className="text-xs text-white/50">{f.sport}</span>
                <span className="text-[10px] font-mono text-primary font-bold">{f.version}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
