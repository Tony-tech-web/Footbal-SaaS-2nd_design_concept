import React from 'react';
import { BrainCircuit, GitCompare, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export function LiveEngine() {
  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-headline font-bold tracking-tight">Live Engine</h1>
          <p className="text-xs md:text-sm text-white/40 mt-1">Multi-model consensus and debate visualization.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] self-start sm:self-auto">
          <AlertTriangle className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span className="text-[10px] md:text-xs font-medium">Drift Alert Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Debate Visualization */}
        <div className="glass-panel p-4 md:p-6 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-base md:text-lg font-headline font-semibold flex items-center gap-2">
              <GitCompare className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              Active Debate
            </h2>
            <span className="text-[9px] md:text-[10px] font-mono text-white/40 uppercase tracking-wider bg-white/5 px-2 py-1 rounded-md border border-white/10">ID: #88291</span>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-6 md:space-y-8 relative py-4">
            {/* Connecting Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent md:-translate-x-1/2" />

            {/* Model 1 */}
            <div className="flex flex-col md:flex-row gap-4 items-start relative z-10 pl-10 md:pl-0">
              <div className="absolute left-3 md:hidden top-6 w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(0,229,255,0.6)] -translate-x-1/2" />
              <div className="w-full md:w-1/2 md:text-right md:pr-8">
                <div className="inline-block p-3 md:p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.02)] backdrop-blur-xl w-full">
                  <div className="flex items-center md:justify-end gap-2 mb-2">
                    <span className="text-[10px] md:text-xs font-mono text-white/40">Claude-3.5-Sonnet</span>
                    <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
                  </div>
                  <p className="text-xs md:text-sm text-white/80 leading-relaxed">"High probability of Home Win. Recent form and expected goals (xG) over the last 5 matches suggest a strong offensive advantage."</p>
                  <div className="mt-3 flex items-center md:justify-end gap-2">
                    <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-secondary font-bold">Confidence: 85%</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block w-1/2" />
            </div>

            {/* Model 2 */}
            <div className="flex flex-col md:flex-row gap-4 items-start relative z-10 pl-10 md:pl-0">
              <div className="absolute left-3 md:hidden top-6 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] -translate-x-1/2" />
              <div className="hidden md:block w-1/2" />
              <div className="w-full md:w-1/2 md:pl-8">
                <div className="inline-block p-3 md:p-4 rounded-2xl bg-white/[0.02] border border-red-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.02)] backdrop-blur-xl relative overflow-hidden w-full">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                  <div className="flex items-center gap-2 mb-2">
                    <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                    <span className="text-[10px] md:text-xs font-mono text-white/40">GPT-4o</span>
                  </div>
                  <p className="text-xs md:text-sm text-white/80 leading-relaxed">"Disagree. Key player injuries in the midfield for the Home team significantly reduce their transition speed. Predicting a Draw."</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-red-400 font-bold">Confidence: 62%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resolution */}
            <div className="flex justify-center relative z-10 mt-6 md:mt-8 pl-10 md:pl-0">
              <div className="absolute left-3 md:hidden top-1/2 w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(255,107,0,0.8)] -translate-x-1/2 -translate-y-1/2 border-2 border-background" />
              <div className="glass-panel p-3 md:p-4 border-primary/30 flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 bg-primary/5 shadow-[0_8px_32px_rgba(255,107,0,0.1),inset_0_1px_0_0_rgba(255,255,255,0.05)] w-full md:w-auto max-w-md">
                <div className="p-2 rounded-xl bg-primary/10 shrink-0">
                  <BrainCircuit className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] font-mono text-white/50 uppercase tracking-wider mb-1">Consensus Engine Resolution</p>
                  <p className="text-xs md:text-sm font-medium leading-relaxed">Weighting towards Claude due to historical accuracy. Final: <span className="text-primary font-bold">Home Win (71%)</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Model Status & Drift */}
        <div className="space-y-4 md:space-y-6">
          <div className="glass-panel p-4 md:p-6">
            <h2 className="text-base md:text-lg font-headline font-semibold mb-4">Model Health</h2>
            <div className="space-y-2 md:space-y-3">
              <ModelStatus name="Claude-3.5-Sonnet" status="optimal" latency="120ms" accuracy="72.4%" />
              <ModelStatus name="GPT-4o" status="drift" latency="240ms" accuracy="65.1%" />
              <ModelStatus name="Gemini-1.5-Pro" status="optimal" latency="180ms" accuracy="69.8%" />
              <ModelStatus name="Llama-3-70b" status="offline" latency="--" accuracy="--" />
            </div>
          </div>

          <div className="glass-panel p-4 md:p-6 bg-red-500/5 border-red-500/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
            <h2 className="text-base md:text-lg font-headline font-semibold text-red-400 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
              Drift Analysis
            </h2>
            <p className="text-xs md:text-sm text-white/60 mb-4 leading-relaxed">GPT-4o is showing significant deviation from consensus on NBA totals over the last 48 hours. Recommend recalibration or weight reduction.</p>
            
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
              <button className="flex-1 glass-button py-2 md:py-2.5 text-xs font-medium bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20">
                Reduce Weight
              </button>
              <button className="flex-1 glass-button py-2 md:py-2.5 text-xs font-medium">
                View Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModelStatus({ name, status, latency, accuracy }: any) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] gap-3 sm:gap-0">
      <div className="flex items-center gap-3">
        {status === 'optimal' ? <CheckCircle2 className="w-4 h-4 text-secondary" /> :
         status === 'drift' ? <AlertTriangle className="w-4 h-4 text-red-400" /> :
         <XCircle className="w-4 h-4 text-white/30" />}
        <span className="text-xs md:text-sm font-medium text-white/90">{name}</span>
      </div>
      <div className="flex items-center gap-4 md:gap-6 text-[10px] md:text-xs font-mono pl-7 sm:pl-0">
        <div className="text-left sm:text-right">
          <span className="text-white/40 block mb-0.5">LATENCY</span>
          <span className={status === 'offline' ? 'text-white/30' : 'text-white/80'}>{latency}</span>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-white/40 block mb-0.5">ACCURACY</span>
          <span className={status === 'offline' ? 'text-white/30' : 'text-white/80'}>{accuracy}</span>
        </div>
      </div>
    </div>
  );
}
