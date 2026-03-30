import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  BrainCircuit, 
  Activity, 
  ChevronRight, 
  Shield, 
  Globe, 
  Cpu,
  RefreshCw,
  TrendingUp,
  MessageSquare,
  GitMerge
} from 'lucide-react';
import { useStarkStore } from '../../store/useStarkStore';
import { cn } from '../../lib/utils';

export function LiveEngine() {
  const { predictions, wsConnected } = useStarkStore();
  const [activeDebate, setActiveDebate] = useState(0);
  
  const latestPrediction = predictions[0];

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
      {/* Engine Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-headline font-bold tracking-tight">Live Oracle Engine</h1>
          <p className="text-xs md:text-sm text-white/40 mt-1">Real-time multi-model consensus and debate resolution.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn(
            "px-3 py-1.5 rounded-full border flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest transition-all",
            wsConnected ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
          )}>
            <div className={cn("w-1.5 h-1.5 rounded-full", wsConnected ? "bg-green-400 animate-pulse" : "bg-red-400")} />
            {wsConnected ? 'Live Stream Active' : 'Stream Offline'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Active Debate / Analysis */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="glass-panel p-4 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <BrainCircuit className="w-64 h-64" />
            </div>

            <div className="relative z-10 space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[9px] font-mono text-primary uppercase tracking-widest">Active Resolution</div>
                    <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">ID: {latestPrediction?.id || '88291'}</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-headline font-bold tracking-tight">{latestPrediction?.match || 'Arsenal vs Liverpool'}</h2>
                  <p className="text-sm md:text-base text-white/40">{latestPrediction?.league || 'Premier League'} • {latestPrediction?.time || 'Live'}</p>
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-1">
                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Final Confidence</span>
                  <span className="text-4xl md:text-6xl font-headline font-bold text-primary">{latestPrediction?.finalConfidence || 82}%</span>
                </div>
              </div>

              {/* Debate Visualization */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Model Debate Stream</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                      <span className="text-[10px] font-mono text-white/40">Claude</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-[10px] font-mono text-white/40">GPT</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <DebateBubble 
                    model="Claude-3.5-Sonnet" 
                    message="Analyzing xG trends for Arsenal. Home advantage coefficient is 1.42. Predicting strong offensive pressure in the first half." 
                    side="left" 
                    color="secondary"
                  />
                  <DebateBubble 
                    model="GPT-4o" 
                    message="Counter-point: Liverpool's defensive transition has improved by 12% since the last match. Midfield stability is higher than projected." 
                    side="right" 
                    color="primary"
                  />
                  <DebateBubble 
                    model="Claude-3.5-Sonnet" 
                    message="Agreed on transition, but noting key injury in Liverpool's left-back position. This creates a 0.85 vulnerability score." 
                    side="left" 
                    color="secondary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Model Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ModelStatusCard name="Claude-3.5" status="Analyzing" load={82} color="secondary" />
            <ModelStatusCard name="GPT-4o" status="Verifying" load={64} color="primary" />
            <ModelStatusCard name="DeepSeek-V3" status="Idle" load={12} color="secondary" />
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-4 md:space-y-6">
          <div className="glass-panel p-6 space-y-6">
            <h2 className="text-lg font-headline font-semibold flex items-center gap-2">
              <GitMerge className="w-5 h-5 text-primary" />
              6-Layer Resolution
            </h2>
            <div className="space-y-4">
              <LayerMetric label="Form Analysis" value={88} />
              <LayerMetric label="Squad Depth" value={92} />
              <LayerMetric label="Tactical Alignment" value={74} />
              <LayerMetric label="Psychological State" value={65} />
              <LayerMetric label="Environmental Factors" value={81} />
              <LayerMetric label="Simulation Data" value={89} />
            </div>
            <button className="w-full py-2 text-xs font-mono text-white/30 hover:text-white uppercase tracking-widest border border-white/5 rounded-xl hover:bg-white/5 transition-all">
              View Formula Details
            </button>
          </div>

          <div className="glass-panel p-6 bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-headline font-semibold text-primary">Engine Load</h2>
              <RefreshCw className="w-4 h-4 text-primary animate-spin" />
            </div>
            <div className="space-y-4">
              <div className="flex items-end justify-between gap-1 h-20">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75].map((h, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-primary/20 rounded-t-sm transition-all duration-500 hover:bg-primary/40" 
                    style={{ height: `${h}%` }} 
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest">
                <span>Throughput</span>
                <span className="text-primary font-bold">1.2k req/s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DebateBubble({ model, message, side, color }: { model: string, message: string, side: 'left' | 'right', color: 'primary' | 'secondary' }) {
  return (
    <div className={cn(
      "flex flex-col gap-1.5 max-w-[85%] animate-in slide-in-from-bottom-2 duration-500",
      side === 'right' ? "ml-auto items-end" : "items-start"
    )}>
      <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest px-2">{model}</span>
      <div className={cn(
        "p-3 rounded-2xl text-xs leading-relaxed border shadow-lg backdrop-blur-md",
        side === 'right' 
          ? "bg-primary/5 border-primary/20 text-white/80 rounded-tr-none" 
          : "bg-secondary/5 border-secondary/20 text-white/80 rounded-tl-none"
      )}>
        {message}
      </div>
    </div>
  );
}

function ModelStatusCard({ name, status, load, color }: { name: string, status: string, load: number, color: 'primary' | 'secondary' }) {
  return (
    <div className="glass-panel p-4 space-y-3 group hover:bg-white/[0.04] transition-all">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{name}</span>
        <div className={cn(
          "px-1.5 py-0.5 rounded-md text-[8px] font-mono uppercase tracking-widest border",
          status === 'Analyzing' ? "bg-secondary/10 text-secondary border-secondary/20 animate-pulse" : 
          status === 'Verifying' ? "bg-primary/10 text-primary border-primary/20" : 
          "bg-white/5 text-white/20 border-white/10"
        )}>
          {status}
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[9px] font-mono uppercase">
          <span className="text-white/20">Load</span>
          <span className="text-white/60">{load}%</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all duration-1000", color === 'primary' ? "bg-primary" : "bg-secondary")} 
            style={{ width: `${load}%` }} 
          />
        </div>
      </div>
    </div>
  );
}

function LayerMetric({ label, value }: { label: string, value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
        <span className="text-white/40">{label}</span>
        <span className="text-white/80">{value}%</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000", value > 80 ? "bg-secondary" : "bg-primary")} 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );
}
