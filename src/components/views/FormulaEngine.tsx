// src/components/views/FormulaEngine.tsx
import React, { useState } from 'react';
import { GitMerge, RefreshCw, History, AlertTriangle, CheckCircle2, Layers, Cpu } from 'lucide-react';
import { useStarkStore } from '../../store/useStarkStore';
import { useFormula, useFormulaPatches, useFormulaAccuracy } from '../../hooks/useApi';
import { cn } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import type { Sport } from '../../lib/api';

const LAYER_COLORS: Record<string, string> = {
  L1: 'from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-400',
  L2: 'from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400',
  L3: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400',
  L4: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/20 text-yellow-400',
  L5: 'from-green-500/20 to-green-500/5 border-green-500/20 text-green-400',
  L6: 'from-primary/20 to-primary/5 border-primary/30 text-primary',
};

export function FormulaEngine() {
  const [sport, setSport] = useState<Sport>('FOOTBALL');
  const [patchLayer, setPatchLayer] = useState('');
  const { formulaLayers, formulaVersion, recentPatches, formulaAccuracy, footballFormulaVersion, basketballFormulaVersion } = useStarkStore();

  const { data: formulaData, isLoading: fLoading } = useFormula(sport);
  const { data: patchData,   isLoading: pLoading } = useFormulaPatches(patchLayer ? { layer: patchLayer } : undefined);
  const { data: accData } = useFormulaAccuracy(sport);

  const activeVersion = sport === 'FOOTBALL' ? footballFormulaVersion : basketballFormulaVersion;
  const accPct = typeof formulaAccuracy === 'number' ? Math.round(formulaAccuracy * 100) : null;

  const byTier = (accData as any)?.byTier || {};
  const byOutcome = (accData as any)?.byOutcome || {};

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-headline font-bold tracking-tight">Formula Engine</h1>
          <p className="text-xs md:text-sm text-white/40 mt-1">Versioned 6-layer formula · Self-healing patches · Per-sport accuracy</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/[0.03] border border-white/[0.05] rounded-xl p-0.5 gap-0.5">
            {(['FOOTBALL','BASKETBALL'] as const).map(s=>(
              <button key={s} onClick={()=>setSport(s)}
                className={cn("px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-widest transition-all",
                  sport===s?"bg-primary/20 border border-primary/30 text-primary":"text-white/30 hover:text-white/60")}>
                {s==='FOOTBALL'?'⚽ Football':'🏀 Basketball'}
              </button>
            ))}
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono text-primary font-bold">
            Active: {activeVersion}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Layers */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between px-1 mb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-white/40" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">Active Layers</h2>
            </div>
            <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Weights sum to 100%</span>
          </div>

          {fLoading && <p className="text-center py-10 text-white/20 text-xs font-mono">Loading formula...</p>}

          {formulaLayers.map((layer) => {
            const colorKey = layer.id.replace(/[^L0-9]/g,'').slice(0,2);
            const colorClass = LAYER_COLORS[colorKey] || LAYER_COLORS.L6;

            return (
              <div key={layer.id} className={cn("glass-panel p-4 bg-gradient-to-r border", colorClass)}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-lg border flex items-center justify-center text-[10px] font-mono font-bold bg-black/20", colorClass.split(' ')[2], colorClass.split(' ')[3])}>
                      {layer.id.slice(0,2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{layer.name}</p>
                      <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">v{layer.version} · {layer.patchCount} patches</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-headline font-bold">{layer.weight}%</p>
                    <p className="text-[9px] font-mono text-white/30 uppercase">weight</p>
                  </div>
                </div>

                {/* Weight bar */}
                <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-700")}
                    style={{ width:`${layer.weight}%`, background: colorClass.includes('blue')?'#3b82f6':colorClass.includes('purple')?'#a855f7':colorClass.includes('cyan')?'#06b6d4':colorClass.includes('yellow')?'#eab308':colorClass.includes('green')?'#22c55e':'#FF6B00' }} />
                </div>

                {layer.patchCount > 0 && (
                  <div className="mt-2 text-[9px] font-mono text-orange-400/70 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> {layer.patchCount} self-healing patch{layer.patchCount>1?'es':''} applied
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Accuracy */}
          <div className="glass-panel p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="w-4 h-4 text-secondary" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Accuracy Breakdown</h3>
            </div>

            {accPct != null && (
              <div className="text-center py-2">
                <p className={cn("text-4xl font-headline font-bold", accPct>=80?'text-green-400':accPct>=65?'text-yellow-400':'text-red-400')}>{accPct}%</p>
                <p className="text-[9px] font-mono text-white/30 mt-1 uppercase tracking-widest">Overall Accuracy</p>
              </div>
            )}

            {Object.keys(byTier).length > 0 && (
              <div className="space-y-2">
                {Object.entries(byTier).map(([tier, data]:any)=>(
                  <div key={tier} className="flex items-center justify-between text-xs">
                    <span className={cn("font-mono font-bold text-[10px]",tier==='TIER1'?'text-green-400':tier==='TIER2'?'text-yellow-400':'text-red-400')}>{tier}</span>
                    <div className="flex items-center gap-3 font-mono text-[10px]">
                      <span className="text-white/40">{data.total} preds</span>
                      <span className={cn("font-bold",data.accuracy>=80?'text-green-400':data.accuracy>=65?'text-yellow-400':'text-red-400')}>{data.accuracy!=null?`${data.accuracy}%`:'—'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {Object.keys(byOutcome).length > 0 && (
              <div className="pt-3 border-t border-white/[0.05] space-y-2">
                <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">By Bet Type</p>
                {Object.entries(byOutcome).slice(0,5).map(([outcome, data]:any)=>(
                  <div key={outcome} className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-white/40 uppercase">{outcome}</span>
                    <span className={cn("font-bold",data.accuracy>=80?'text-green-400':data.accuracy>=65?'text-yellow-400':'text-red-400')}>{data.accuracy!=null?`${data.accuracy}%`:'—'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Patch History */}
          <div className="glass-panel p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <History className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Self-Healing Patches</h3>
            </div>

            <div className="flex gap-1.5">
              {['','L1_FORM','L2_SQUAD','L2_ROSTER','L3_TACTICAL','L4_PSYCHOLOGY','L5_ENVIRONMENT','L6_SIMULATION'].map(l=>(
                <button key={l} onClick={()=>setPatchLayer(l)}
                  className={cn("px-1.5 py-0.5 rounded-md text-[8px] font-mono uppercase tracking-widest border transition-all whitespace-nowrap",
                    patchLayer===l?"bg-primary/20 border-primary/30 text-primary":"border-white/[0.06] text-white/30 hover:text-white/60")}>
                  {l||'All'}
                </button>
              ))}
            </div>

            {pLoading && <p className="text-[10px] font-mono text-white/20 text-center py-4">Loading patches...</p>}

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentPatches.length === 0 && !pLoading && (
                <p className="text-[10px] font-mono text-white/20 text-center py-4">No patches recorded yet</p>
              )}
              {recentPatches.map(patch=>(
                <div key={patch.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-orange-400 uppercase tracking-widest bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded-md">{patch.failedLayer}</span>
                    <span className="text-[9px] font-mono text-white/20">{patch.fromVersion}</span>
                  </div>
                  {patch.match && <p className="text-[10px] text-white/50 truncate">{patch.match}</p>}
                  <p className="text-[10px] text-white/60">{patch.patchDescription}</p>
                  <div className="flex items-center justify-between text-[9px] font-mono">
                    <span className="text-red-400">✗ {patch.predictedValue}</span>
                    <span className="text-green-400">✓ {patch.actualValue}</span>
                    <span className="text-white/20">{formatDistanceToNow(new Date(patch.appliedAt),{addSuffix:true})}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
