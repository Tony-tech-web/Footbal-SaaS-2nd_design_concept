import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  BrainCircuit, 
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  GitCompare
} from 'lucide-react';
import { useStarkStore, SlipStatus, ConfidenceTier } from '../../store/useStarkStore';
import { cn } from '../../lib/utils';

export function Predictions() {
  const { predictions } = useStarkStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState('ALL');

  const filteredPredictions = filter === 'ALL' 
    ? predictions 
    : predictions.filter(p => p.status === filter);

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-headline font-bold tracking-tight">Predictions</h1>
          <p className="text-xs md:text-sm text-white/40 mt-1">Multi-layer AI analysis and confidence scoring.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="glass-button px-4 py-2 flex items-center gap-2 text-xs font-bold bg-primary/10 border-primary/30 text-primary hover:bg-primary/20">
            <Plus className="w-4 h-4" />
            New Prediction
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input 
            type="text" 
            placeholder="Search matches, leagues, or teams..." 
            className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {['ALL', 'PREDICTED', 'PROCESSING', 'VERIFIED', 'FAILED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-mono uppercase tracking-widest border transition-all whitespace-nowrap",
                filter === f 
                  ? "bg-white/10 border-white/20 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]" 
                  : "bg-white/[0.02] border-white/[0.05] text-white/40 hover:text-white/60 hover:bg-white/[0.04]"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Predictions Table/List */}
      <div className="space-y-3">
        {filteredPredictions.map((p) => (
          <PredictionRow 
            key={p.id} 
            prediction={p} 
            isExpanded={expandedId === p.id}
            onToggle={() => setExpandedId(expandedId === p.id ? null : p.id)}
          />
        ))}
      </div>
    </div>
  );
}

function PredictionRow({ prediction, isExpanded, onToggle }: { prediction: any, isExpanded: boolean, onToggle: () => void }) {
  return (
    <div className={cn(
      "glass-panel overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
      isExpanded ? "ring-1 ring-primary/30" : ""
    )}>
      <div 
        onClick={onToggle}
        className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-10 h-10 rounded-2xl flex items-center justify-center border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]",
            prediction.tier === 'TIER1' ? "bg-primary/10 border-primary/20 text-primary" : 
            prediction.tier === 'TIER2' ? "bg-secondary/10 border-secondary/20 text-secondary" : 
            "bg-white/5 border-white/10 text-white/40"
          )}>
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-bold leading-tight">{prediction.match}</h3>
            <p className="text-[10px] md:text-xs text-white/40 mt-1">{prediction.league} • {prediction.time}</p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-6 md:gap-10 pl-14 sm:pl-0">
          <div className="text-left sm:text-right">
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-1">Prediction</p>
            <p className="text-xs md:text-sm font-bold text-white/90">{prediction.prediction}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-1">Confidence</p>
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-xs md:text-sm font-bold",
                prediction.finalConfidence > 75 ? "text-primary" : prediction.finalConfidence > 50 ? "text-secondary" : "text-white/40"
              )}>
                {prediction.finalConfidence}%
              </span>
              <div className="w-12 md:w-16 h-1.5 bg-white/5 rounded-full overflow-hidden hidden md:block">
                <div 
                  className={cn("h-full rounded-full", prediction.finalConfidence > 75 ? "bg-primary" : "bg-secondary")} 
                  style={{ width: `${prediction.finalConfidence}%` }} 
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={prediction.status} />
            {isExpanded ? <ChevronUp className="w-4 h-4 text-white/20" /> : <ChevronDown className="w-4 h-4 text-white/20" />}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-white/[0.05] bg-white/[0.01] p-5 md:p-8 animate-in slide-in-from-top-2 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* AI Reasoning */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <BrainCircuit className="w-5 h-5 text-primary" />
                <h4 className="text-sm font-bold uppercase tracking-widest text-white/60">AI Reasoning Engine</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-white/30 uppercase">Claude-3.5-Sonnet</span>
                    <span className="text-xs font-bold text-secondary">{prediction.claudeConfidence}%</span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed italic">"High probability of Home Win. Recent form and expected goals (xG) over the last 5 matches suggest a strong offensive advantage. Defensive line is stable."</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-white/30 uppercase">GPT-4o</span>
                    <span className="text-xs font-bold text-red-400">{prediction.gptConfidence}%</span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed italic">"Agree with offensive advantage, but noting slight vulnerability in transition. Midfield injuries for the away team are the deciding factor."</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-mono text-primary uppercase tracking-widest">Consensus Resolution</span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed">Both models show high alignment on Home Win. Confidence weighted towards Claude due to historical accuracy in the Premier League. Final resolution: <span className="text-primary font-bold">STABLE AGREEMENT</span>.</p>
              </div>
            </div>

            {/* Layer Scores */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <GitCompare className="w-5 h-5 text-secondary" />
                <h4 className="text-sm font-bold uppercase tracking-widest text-white/60">6-Layer Analysis</h4>
              </div>
              <div className="space-y-4">
                <LayerScore label="Form" score={88} />
                <LayerScore label="Squad" score={92} />
                <LayerScore label="Tactical" score={74} />
                <LayerScore label="Psychology" score={65} />
                <LayerScore label="Environment" score={81} />
                <LayerScore label="Simulation" score={89} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LayerScore({ label, score }: { label: string, score: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider">
        <span className="text-white/40">{label}</span>
        <span className="text-white/80">{score}%</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000", score > 80 ? "bg-secondary" : score > 60 ? "bg-primary" : "bg-white/20")} 
          style={{ width: `${score}%` }} 
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: SlipStatus }) {
  const styles = {
    [SlipStatus.PENDING]: "bg-white/5 text-white/40 border-white/10",
    [SlipStatus.PROCESSING]: "bg-secondary/10 text-secondary border-secondary/20 animate-pulse",
    [SlipStatus.PREDICTED]: "bg-primary/10 text-primary border-primary/20",
    [SlipStatus.VERIFIED]: "bg-green-500/10 text-green-400 border-green-500/20",
    [SlipStatus.FAILED]: "bg-red-500/10 text-red-400 border-red-500/20"
  };

  const icons = {
    [SlipStatus.PENDING]: Clock,
    [SlipStatus.PROCESSING]: RefreshCw,
    [SlipStatus.PREDICTED]: Zap,
    [SlipStatus.VERIFIED]: CheckCircle2,
    [SlipStatus.FAILED]: AlertCircle
  };

  const Icon = icons[status] || Zap;

  return (
    <div className={cn("px-2.5 py-1 rounded-lg border flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest", styles[status])}>
      <Icon className="w-3 h-3" />
      {status}
    </div>
  );
}

function RefreshCw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", props.className)}
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
