import React, { useState } from 'react';
import { 
  GitMerge, 
  Settings, 
  Save, 
  RefreshCw, 
  Zap, 
  Activity, 
  Layers, 
  BrainCircuit, 
  Database, 
  ChevronRight,
  Info,
  History,
  CheckCircle2
} from 'lucide-react';
import { useStarkStore } from '../../store/useStarkStore';
import { cn } from '../../lib/utils';

export function FormulaEngine() {
  const { formulaLayers, formulaVersion, updateLayer, setFormulaVersion } = useStarkStore();
  const [isSaving, setIsSaving] = useState(false);
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setFormulaVersion(`v${(parseFloat(formulaVersion.slice(1)) + 0.1).toFixed(1)}`);
    }, 1500);
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-headline font-bold tracking-tight">Formula Engine</h1>
          <p className="text-xs md:text-sm text-white/40 mt-1">Configure the 6-layer AI weighting and model resolution.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/40">
            Current Version: <span className="text-primary font-bold">{formulaVersion}</span>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="glass-button px-4 py-2 flex items-center gap-2 text-xs font-bold bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Deploying...' : 'Deploy Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Layers Configuration */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">Model Layers</h2>
            <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Weight Distribution</span>
          </div>

          <div className="space-y-3">
            {formulaLayers.map((layer) => (
              <LayerCard 
                key={layer.id} 
                layer={layer} 
                isActive={activeLayer === layer.id}
                onSelect={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
                onUpdate={(score) => updateLayer(layer.id, score, layer.version)}
              />
            ))}
          </div>
        </div>

        {/* Sidebar Info & Presets */}
        <div className="space-y-6">
          <div className="glass-panel p-6 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <History className="w-5 h-5 text-secondary" />
              <h2 className="text-lg font-headline font-semibold">Deployment History</h2>
            </div>
            <div className="space-y-4">
              <HistoryItem version="v2.4.1" date="Today, 10:24" author="System" status="Active" />
              <HistoryItem version="v2.4.0" date="Yesterday, 18:45" author="Admin" status="Rolled Back" />
              <HistoryItem version="v2.3.9" date="Mar 28, 12:30" author="System" status="Archived" />
            </div>
            <button className="w-full py-2 text-xs font-mono text-white/30 hover:text-white uppercase tracking-widest border border-white/5 rounded-xl hover:bg-white/5 transition-all">
              View Full History
            </button>
          </div>

          <div className="glass-panel p-6 bg-secondary/5 border-secondary/20">
            <div className="flex items-center gap-2 mb-4">
              <BrainCircuit className="w-5 h-5 text-secondary" />
              <h2 className="text-lg font-headline font-semibold text-secondary">Presets</h2>
            </div>
            <div className="space-y-3">
              <PresetButton label="Aggressive Growth" description="High weight on form and tactical layers." />
              <PresetButton label="Conservative Stable" description="Balanced weight across all 6 layers." />
              <PresetButton label="Data Intensive" description="Focus on squad depth and simulation data." />
            </div>
          </div>

          <div className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-white/40" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-white/60">Engine Info</h2>
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              The 6-layer formula uses a weighted consensus algorithm. Each layer is processed independently by Claude and GPT models before being aggregated into the final prediction score.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LayerCard({ layer, isActive, onSelect, onUpdate }: { layer: any, isActive: boolean, onSelect: () => void, onUpdate: (score: number) => void }) {
  return (
    <div className={cn(
      "glass-panel transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
      isActive ? "ring-1 ring-primary/30 bg-white/[0.03]" : "hover:bg-white/[0.02]"
    )}>
      <div className="p-4 md:p-5 flex items-center justify-between gap-4 cursor-pointer" onClick={onSelect}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
            <Layers className="w-5 h-5 text-white/40" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-bold leading-tight">{layer.name}</h3>
            <p className="text-[10px] text-white/30 mt-1 uppercase tracking-widest font-mono">{layer.version}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 md:gap-10">
          <div className="w-24 md:w-48 space-y-1.5">
            <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-widest">
              <span className="text-white/20">Weight</span>
              <span className="text-white/60">{layer.score}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className={cn("h-full rounded-full transition-all duration-1000", layer.score > 80 ? "bg-secondary" : "bg-primary")} 
                style={{ width: `${layer.score}%` }} 
              />
            </div>
          </div>
          <ChevronRight className={cn("w-4 h-4 text-white/20 transition-transform duration-500", isActive ? "rotate-90" : "")} />
        </div>
      </div>

      {isActive && (
        <div className="p-5 md:p-8 border-t border-white/[0.05] bg-black/20 animate-in slide-in-from-top-2 duration-500">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold">Adjust Layer Weight</h4>
                <p className="text-xs text-white/40">Higher weight increases this layer's impact on final consensus.</p>
              </div>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={layer.score} 
                  onChange={(e) => onUpdate(parseInt(e.target.value))}
                  className="w-48 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
                />
                <span className="text-sm font-mono font-bold text-primary w-10">{layer.score}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                <h5 className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Data Sources</h5>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-lg bg-white/5 text-[9px] text-white/60 border border-white/10">Opta Stats</span>
                  <span className="px-2 py-1 rounded-lg bg-white/5 text-[9px] text-white/60 border border-white/10">SofaScore API</span>
                  <span className="px-2 py-1 rounded-lg bg-white/5 text-[9px] text-white/60 border border-white/10">Understat xG</span>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                <h5 className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Model Resolution</h5>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  <span className="text-xs text-white/60">High Precision (4096 tokens)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryItem({ version, date, author, status }: { version: string, date: string, author: string, status: string }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 text-[10px] font-mono text-white/40">
          {version.slice(1)}
        </div>
        <div>
          <p className="text-xs font-bold text-white/80">{version}</p>
          <p className="text-[10px] text-white/30">{date} • {author}</p>
        </div>
      </div>
      <span className={cn(
        "text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-md border",
        status === 'Active' ? "bg-green-500/10 text-green-400 border-green-500/20" : 
        status === 'Rolled Back' ? "bg-red-500/10 text-red-400 border-red-500/20" : 
        "bg-white/5 text-white/40 border-white/10"
      )}>
        {status}
      </span>
    </div>
  );
}

function PresetButton({ label, description }: { label: string, description: string }) {
  return (
    <button className="w-full p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-left hover:bg-white/[0.05] hover:border-secondary/30 transition-all group">
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-sm font-bold text-white/80 group-hover:text-secondary transition-colors">{label}</h4>
        <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-secondary transition-all" />
      </div>
      <p className="text-[10px] text-white/40 leading-relaxed">{description}</p>
    </button>
  );
}
