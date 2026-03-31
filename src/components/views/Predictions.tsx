// src/components/views/Predictions.tsx
import React, { useState } from 'react';
import { Activity, Search, ChevronDown, ChevronUp, BrainCircuit, CheckCircle2, AlertCircle, GitCompare, RefreshCw } from 'lucide-react';
import { useStarkStore } from '../../store/useStarkStore';
import { usePredictions, useSubmitResult } from '../../hooks/useApi';
import { cn } from '../../lib/utils';
import type { Prediction } from '../../lib/api';

const TIER_CONFIG = {
  TIER1: { color:'text-green-400', bg:'bg-green-500/10', border:'border-green-500/20', bar:'bg-green-500', label:'HIGH' },
  TIER2: { color:'text-yellow-400', bg:'bg-yellow-500/10', border:'border-yellow-500/20', bar:'bg-yellow-500', label:'MOD' },
  TIER3: { color:'text-red-400', bg:'bg-red-500/10', border:'border-red-500/20', bar:'bg-red-500', label:'LOW' },
};

function ResultForm({ matchId, onDone }: { matchId: string; onDone: () => void }) {
  const [home, setHome] = useState('');
  const [away, setAway] = useState('');
  const [b2b, setB2b] = useState(false);
  const submit = useSubmitResult();

  const handle = async () => {
    if (!home || !away) return;
    await submit.mutateAsync({ matchId, homeScore: parseInt(home), awayScore: parseInt(away), extras: { backToBackOccurred: b2b } });
    onDone();
  };

  return (
    <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
      <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Submit Result → triggers self-healing if wrong</p>
      <div className="grid grid-cols-3 gap-2 items-center">
        <input value={home} onChange={e=>setHome(e.target.value)} type="number" min="0" placeholder="Home" className="bg-white/[0.03] border border-white/[0.05] rounded-xl px-3 py-2 text-sm text-white text-center placeholder:text-white/20 focus:outline-none focus:border-primary/40 transition-all" />
        <div className="text-center text-white/30 font-mono text-sm">vs</div>
        <input value={away} onChange={e=>setAway(e.target.value)} type="number" min="0" placeholder="Away" className="bg-white/[0.03] border border-white/[0.05] rounded-xl px-3 py-2 text-sm text-white text-center placeholder:text-white/20 focus:outline-none focus:border-primary/40 transition-all" />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={b2b} onChange={e=>setB2b(e.target.checked)} className="accent-primary w-3.5 h-3.5" />
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Back-to-back game (Basketball)</span>
      </label>
      <button onClick={handle} disabled={!home||!away||submit.isPending}
        className="w-full py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono uppercase tracking-widest hover:bg-primary/20 disabled:opacity-40 transition-all flex items-center justify-center gap-1">
        {submit.isPending?<><RefreshCw className="w-3 h-3 animate-spin"/>Verifying...</>:'Verify Result'}
      </button>
      {submit.data && (
        <div className={cn("text-[10px] font-mono p-2 rounded-lg border text-center",
          (submit.data as any).result?.wasCorrect ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-orange-500/10 border-orange-500/20 text-orange-400")}>
          {(submit.data as any).result?.wasCorrect ? '✅ Correct — formula accuracy updated' : `🔧 Wrong — self-healing triggered on ${(submit.data as any).result?.failedLayer}`}
        </div>
      )}
    </div>
  );
}

function PredRow({ p, isExpanded, onToggle }: { p: Prediction; isExpanded: boolean; onToggle: () => void }) {
  const [showResult, setShowResult] = useState(false);
  const tier = TIER_CONFIG[p.tier] || TIER_CONFIG.TIER3;

  return (
    <div className={cn("glass-panel transition-all duration-300", isExpanded ? "border-white/10" : "hover:border-white/[0.08]")}>
      <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={onToggle}>
        {/* Sport + tier indicator */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <span className="text-lg">{p.sport === 'BASKETBALL' ? '🏀' : '⚽'}</span>
          <div className={cn("px-1.5 py-0.5 rounded-md text-[8px] font-mono font-bold border", tier.color, tier.bg, tier.border)}>{tier.label}</div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{p.match}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-[10px] font-mono text-white/40 uppercase">{p.betType}</span>
            {p.betLine != null && <span className="text-[10px] font-mono text-primary/60">{p.betLine > 0 ? '+' : ''}{p.betLine}</span>}
            <span className="text-[10px] font-mono text-white/30">→</span>
            <span className="text-[10px] font-mono text-white/70 font-bold">{p.predicted}</span>
            {p.patched && <span className="text-[8px] font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded-md">PATCHED</span>}
          </div>
        </div>

        <div className="text-right flex-shrink-0 space-y-1">
          <div className="flex items-center gap-2 justify-end">
            {p.correct != null && (p.correct ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />)}
            <span className={cn("text-xl font-headline font-bold", tier.color)}>{p.confidence}%</span>
          </div>
          <div className="flex items-center gap-1 justify-end">
            <span className="text-[9px] font-mono text-white/20 uppercase">{p.formulaVersion || 'v3.1.0'}</span>
            <GitCompare className="w-3 h-3 text-white/20" />
          </div>
        </div>

        <div className={cn("transition-transform duration-300", isExpanded ? "rotate-180" : "")}>
          <ChevronDown className="w-4 h-4 text-white/30" />
        </div>
      </div>

      {/* Expanded */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/[0.04] pt-4">
          {/* Confidence bar */}
          <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full transition-all", tier.bar)} style={{ width: `${p.confidence}%` }} />
          </div>

          {/* Layer scores */}
          {p.layerScores && Object.keys(p.layerScores).length > 0 && (
            <div>
              <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-2">Layer Scores</p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(p.layerScores).map(([k, v]) => (
                  <div key={k} className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-center">
                    <p className="text-[8px] font-mono text-white/30 uppercase">{k}</p>
                    <p className={cn("text-sm font-bold font-mono mt-0.5", Number(v)>=80?'text-green-400':Number(v)>=65?'text-yellow-400':'text-red-400')}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key driver + red flags */}
          {p.keyDriver && (
            <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
              <p className="text-[9px] font-mono text-cyan-400/60 uppercase tracking-widest mb-1">Key Driver</p>
              <p className="text-xs text-white/70">{p.keyDriver}</p>
            </div>
          )}

          {p.redFlags && p.redFlags.length > 0 && (
            <div className="space-y-1">
              <p className="text-[9px] font-mono text-orange-400/60 uppercase tracking-widest">⚠️ Red Flags</p>
              {p.redFlags.map((f, i) => <p key={i} className="text-xs text-white/40 pl-3 border-l border-orange-500/20">{f}</p>)}
            </div>
          )}

          {/* Basketball extra */}
          {p.sport === 'BASKETBALL' && (
            <div className="flex items-center gap-4 text-[10px] font-mono">
              {p.backToBackFlag && <span className="text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-md">B2B GAME</span>}
              {p.injuryImpact && p.injuryImpact !== 'NONE' && <span className="text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-md">INJURY: {p.injuryImpact}</span>}
            </div>
          )}

          {p.verdict && <p className="text-xs text-white/50 leading-relaxed italic">"{p.verdict}"</p>}

          {/* Result submission */}
          {p.correct == null && !showResult && (
            <button onClick={()=>setShowResult(true)} className="text-[10px] font-mono text-white/30 hover:text-white/60 uppercase tracking-widest transition-colors flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3"/>Submit Result
            </button>
          )}
          {showResult && p.correct == null && (
            <ResultForm matchId={p.id} onDone={()=>setShowResult(false)} />
          )}
        </div>
      )}
    </div>
  );
}

export function Predictions() {
  const { predictions, predictionsLoading, activeSport } = useStarkStore();
  const [expandedId, setExpandedId] = useState<string|null>(null);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [sportFilter, setSportFilter] = useState<'ALL'|'FOOTBALL'|'BASKETBALL'>('ALL');

  usePredictions(activeSport !== 'FOOTBALL' && activeSport !== undefined ? { sport: activeSport } : undefined);

  const filtered = predictions.filter(p => {
    if (filter === 'TIER1' && p.tier !== 'TIER1') return false;
    if (filter === 'TIER2' && p.tier !== 'TIER2') return false;
    if (filter === 'TIER3' && p.tier !== 'TIER3') return false;
    if (filter === 'CORRECT' && !p.correct) return false;
    if (filter === 'WRONG' && p.correct !== false) return false;
    if (sportFilter !== 'ALL' && p.sport !== sportFilter) return false;
    if (search && !p.match.toLowerCase().includes(search.toLowerCase()) && !p.betType.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-headline font-bold tracking-tight">Predictions</h1>
          <p className="text-xs md:text-sm text-white/40 mt-1">Multi-layer AI analysis · Claude + GPT-4 consensus · Self-healing formula</p>
        </div>
        <div className="flex items-center bg-white/[0.03] border border-white/[0.05] rounded-xl p-0.5 gap-0.5">
          {(['ALL','FOOTBALL','BASKETBALL'] as const).map(s=>(
            <button key={s} onClick={()=>setSportFilter(s)}
              className={cn("px-2.5 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-widest transition-all",
                sportFilter===s?"bg-primary/20 border border-primary/30 text-primary":"text-white/30 hover:text-white/60")}>
              {s==='ALL'?'All':s==='FOOTBALL'?'⚽':' 🏀'}
            </button>
          ))}
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={e=>setSearch(e.target.value)} type="text" placeholder="Search matches or bet types..."
            className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {['ALL','TIER1','TIER2','TIER3','CORRECT','WRONG'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              className={cn("px-3 py-2 rounded-xl text-[9px] font-mono uppercase tracking-widest border transition-all whitespace-nowrap",
                filter===f?"bg-white/10 border-white/20 text-white":"bg-white/[0.02] border-white/[0.05] text-white/40 hover:text-white/60")}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label:'Total', value:predictions.length, color:'text-white/70' },
          { label:'Tier 1', value:predictions.filter(p=>p.tier==='TIER1').length, color:'text-green-400' },
          { label:'Correct', value:predictions.filter(p=>p.correct===true).length, color:'text-green-400' },
          { label:'Patched', value:predictions.filter(p=>p.patched).length, color:'text-orange-400' },
        ].map(s=>(
          <div key={s.label} className="glass-panel p-3 text-center">
            <p className={cn("text-xl font-headline font-bold", s.color)}>{s.value}</p>
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* List */}
      {predictionsLoading && <p className="text-center py-10 text-white/20 text-sm font-mono">Loading predictions...</p>}
      {!predictionsLoading && filtered.length === 0 && (
        <div className="glass-panel p-12 text-center text-white/20">
          <Activity className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No predictions match this filter.</p>
        </div>
      )}
      <div className="space-y-2">
        {filtered.map(p => (
          <PredRow key={p.id} p={p} isExpanded={expandedId===p.id} onToggle={()=>setExpandedId(expandedId===p.id?null:p.id)} />
        ))}
      </div>
    </div>
  );
}
