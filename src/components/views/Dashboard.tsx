import React from 'react';
import { 
  Activity, 
  TrendingUp, 
  Zap, 
  AlertCircle, 
  ChevronRight, 
  Clock, 
  CheckCircle2,
  BrainCircuit,
  Database
} from 'lucide-react';
import { useStarkStore, SlipStatus } from '../../store/useStarkStore';
import { cn } from '../../lib/utils';

export function Dashboard() {
  const { predictions, accuracy, jobs } = useStarkStore();
  const activeJobs = jobs.filter(j => j.status === 'active');

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-headline font-bold tracking-tight">System Overview</h1>
          <p className="text-xs md:text-sm text-white/40 mt-1">Real-time predictive analytics and engine health.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/40">
            Engine: <span className="text-secondary font-bold">STABLE</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/40">
            Uptime: <span className="text-white/80 font-bold">99.9%</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          icon={Activity} 
          label="Total Predictions" 
          value={predictions.length.toString()} 
          trend="+12%" 
          color="primary" 
        />
        <MetricCard 
          icon={TrendingUp} 
          label="Avg. Accuracy" 
          value={`${accuracy}%`} 
          trend="+0.4%" 
          color="secondary" 
        />
        <MetricCard 
          icon={Database} 
          label="Active Jobs" 
          value={activeJobs.length.toString()} 
          trend="Stable" 
          color="secondary" 
        />
        <MetricCard 
          icon={Zap} 
          label="Avg. Confidence" 
          value="84.2%" 
          trend="+2.1%" 
          color="primary" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="glass-panel p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-white/60">Live Prediction Feed</h2>
              </div>
              <button className="text-[10px] font-mono text-white/20 hover:text-white/40 uppercase tracking-widest flex items-center gap-1 transition-colors">
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {predictions.slice(0, 5).map((prediction) => (
                <PredictionItem key={prediction.id} prediction={prediction} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="glass-panel p-5 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <BrainCircuit className="w-4 h-4 text-secondary" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-white/60">Model Consensus</h2>
              </div>
              <div className="space-y-4">
                <ConsensusBar label="Claude-3.5-Sonnet" value={88} color="secondary" />
                <ConsensusBar label="GPT-4o" value={74} color="primary" />
                <ConsensusBar label="DeepSeek-V3" value={92} color="secondary" />
              </div>
            </div>
            <div className="glass-panel p-5 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-white/60">System Alerts</h2>
              </div>
              <div className="space-y-3">
                <AlertItem type="info" message="New formula v2.4.1 deployed successfully." />
                <AlertItem type="warning" message="High latency detected in Opta API stream." />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-4 md:space-y-6">
          <div className="glass-panel p-6">
            <h2 className="text-lg font-headline font-semibold mb-4">Queue Status</h2>
            <div className="space-y-4">
              {activeJobs.length > 0 ? activeJobs.map(job => (
                <div key={job.id} className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
                    <span className="text-white/40">{job.type} Job</span>
                    <span className="text-secondary">{job.progress}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: `${job.progress}%` }} />
                  </div>
                </div>
              )) : (
                <p className="text-xs text-white/20 italic">No active jobs in queue.</p>
              )}
            </div>
            <button className="w-full mt-6 py-2 text-xs font-mono text-white/30 hover:text-white uppercase tracking-widest border border-white/5 rounded-xl hover:bg-white/5 transition-all">
              Manage Queue
            </button>
          </div>

          <div className="glass-panel p-6 bg-primary/5 border-primary/20">
            <h2 className="text-lg font-headline font-semibold text-primary mb-2">Accuracy Target</h2>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-headline font-bold">98.2%</span>
              <span className="text-xs text-primary/60 font-mono">+0.4%</span>
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              System is currently outperforming the baseline by 4.2% following the v2.4.1 formula update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, trend, color }: { icon: any, label: string, value: string, trend: string, color: 'primary' | 'secondary' }) {
  return (
    <div className="glass-panel p-5 space-y-4 group hover:bg-white/[0.04] transition-all">
      <div className="flex items-center justify-between">
        <div className={cn(
          "w-10 h-10 rounded-2xl flex items-center justify-center border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]",
          color === 'primary' ? "bg-primary/10 border-primary/20 text-primary" : "bg-secondary/10 border-secondary/20 text-secondary"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={cn(
          "text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border",
          color === 'primary' ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary/10 text-secondary border-secondary/20"
        )}>
          {trend}
        </span>
      </div>
      <div>
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-headline font-bold">{value}</p>
      </div>
    </div>
  );
}

function PredictionItem({ prediction }: { prediction: any }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-colors">
          <Zap className="w-5 h-5 text-white/20 group-hover:text-primary transition-colors" />
        </div>
        <div>
          <h4 className="text-sm font-bold">{prediction.match}</h4>
          <p className="text-[10px] text-white/40 mt-0.5">{prediction.league} • {prediction.time}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right hidden sm:block">
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Confidence</p>
          <p className={cn(
            "text-xs font-bold",
            prediction.finalConfidence > 80 ? "text-primary" : "text-secondary"
          )}>{prediction.finalConfidence}%</p>
        </div>
        <div className={cn(
          "px-2 py-1 rounded-lg border text-[9px] font-mono uppercase tracking-widest",
          prediction.status === SlipStatus.PREDICTED ? "bg-primary/10 text-primary border-primary/20" : "bg-white/5 text-white/40 border-white/10"
        )}>
          {prediction.status}
        </div>
      </div>
    </div>
  );
}

function ConsensusBar({ label, value, color }: { label: string, value: number, color: 'primary' | 'secondary' }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
        <span className="text-white/40">{label}</span>
        <span className="text-white/80">{value}%</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000", color === 'primary' ? "bg-primary" : "bg-secondary")} 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );
}

function AlertItem({ type, message }: { type: 'info' | 'warning', message: string }) {
  return (
    <div className={cn(
      "p-3 rounded-xl border flex items-start gap-3",
      type === 'info' ? "bg-white/[0.02] border-white/10" : "bg-red-500/5 border-red-500/20"
    )}>
      <AlertCircle className={cn("w-4 h-4 mt-0.5", type === 'info' ? "text-white/20" : "text-red-400")} />
      <p className="text-[11px] text-white/60 leading-relaxed">{message}</p>
    </div>
  );
}
