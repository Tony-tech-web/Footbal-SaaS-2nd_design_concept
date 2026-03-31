// src/components/views/QueueMonitor.tsx
import React from 'react';
import { Database, Activity, Cpu, Network, RefreshCw, CheckCircle2, AlertCircle, Clock, Zap } from 'lucide-react';
import { useStarkStore } from '../../store/useStarkStore';
import { useEngineHealth } from '../../hooks/useApi';
import { cn } from '../../lib/utils';

function StatCard({ icon:Icon, label, value, sub, color }: { icon:any; label:string; value:string; sub:string; color:'primary'|'secondary' }) {
  return (
    <div className="glass-panel p-5 space-y-3">
      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", color==='primary'?'bg-primary/10':'bg-secondary/10')}>
        <Icon className={cn("w-4 h-4", color==='primary'?'text-primary':'text-secondary')} />
      </div>
      <div>
        <p className="text-xl font-headline font-bold">{value}</p>
        <p className="text-xs text-white/40">{label}</p>
        <p className="text-[10px] font-mono text-white/25 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

function QueueBar({ name, data }: { name: string; data: any }) {
  const total = (data?.active||0) + (data?.waiting||0) + (data?.completed||0) + (data?.failed||0);
  const completedPct = total > 0 ? Math.round((data?.completed||0)/total*100) : 0;

  return (
    <div className="glass-panel p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium capitalize">{name} Queue</h3>
        <div className={cn("px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-widest border",
          (data?.active||0)>0 ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" : "bg-green-500/10 border-green-500/20 text-green-400")}>
          {(data?.active||0)>0 ? 'Active' : 'Idle'}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { label:'Active',    value: data?.active||0,    color:'text-yellow-400' },
          { label:'Waiting',   value: data?.waiting||0,   color:'text-white/50' },
          { label:'Completed', value: data?.completed||0, color:'text-green-400' },
          { label:'Failed',    value: data?.failed||0,    color:'text-red-400' },
        ].map(s=>(
          <div key={s.label} className="text-center p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <p className={cn("text-xl font-headline font-bold", s.color)}>{s.value}</p>
            <p className="text-[8px] font-mono text-white/30 uppercase tracking-widest mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-[9px] font-mono text-white/30">
          <span className="uppercase tracking-widest">Completion rate</span>
          <span className="text-green-400 font-bold">{completedPct}%</span>
        </div>
        <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-500 to-secondary rounded-full transition-all duration-700" style={{width:`${completedPct}%`}} />
        </div>
      </div>
    </div>
  );
}

export function QueueMonitor() {
  const { wsConnected, wsLatency, wsEventLog, engineHealth } = useStarkStore();
  const { isLoading, refetch, isRefetching } = useEngineHealth();

  const health = engineHealth as any;
  const queues = health?.queues || {};
  const uptime = health?.uptime ? Math.round(health.uptime / 60) : null;

  const totalActive = (queues.predictions?.active||0) + (queues.verifications?.active||0);
  const totalCompleted = (queues.predictions?.completed||0) + (queues.verifications?.completed||0);
  const totalFailed = (queues.predictions?.failed||0) + (queues.verifications?.failed||0);

  const predictionEvents = wsEventLog.filter(e => e.type === 'prediction:complete').length;
  const patchEvents = wsEventLog.filter(e => e.type === 'formula:patched').length;

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-headline font-bold tracking-tight">Queue Monitor</h1>
          <p className="text-xs md:text-sm text-white/40 mt-1">Bull job queue status · Engine health · Real-time throughput</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn("px-3 py-1.5 rounded-full border flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest",
            wsConnected ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400")}>
            <div className={cn("w-1.5 h-1.5 rounded-full", wsConnected?"bg-green-400 animate-pulse":"bg-red-400")} />
            {wsConnected ? 'Engine Connected' : 'Engine Offline'}
          </div>
          <button onClick={() => refetch()} disabled={isRefetching}
            className="glass-button px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <RefreshCw className={cn("w-3 h-3", isRefetching && "animate-spin")} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Cpu}      label="Active Jobs"   value={String(totalActive)}    sub="processing now"         color="primary" />
        <StatCard icon={Network}  label="WS Latency"    value={wsConnected?`${wsLatency}ms`:'—'}  sub={wsConnected?'stable':'disconnected'} color="secondary" />
        <StatCard icon={Database} label="Completed"     value={String(totalCompleted)} sub="total processed"        color="secondary" />
        <StatCard icon={Activity} label="Engine Uptime" value={uptime!=null?`${uptime}m`:'—'}     sub="since last restart"     color="primary" />
      </div>

      {/* Queue details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QueueBar name="Predictions" data={queues.predictions} />
        <QueueBar name="Verifications" data={queues.verifications} />
      </div>

      {/* Session events */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label:'Predictions Completed (session)', value:predictionEvents, color:'text-green-400', icon:CheckCircle2 },
          { label:'Formula Patches Applied (session)', value:patchEvents, color:'text-orange-400', icon:Zap },
          { label:'Failed Jobs', value:totalFailed, color:totalFailed>0?'text-red-400':'text-white/50', icon:AlertCircle },
        ].map(stat=>(
          <div key={stat.label} className="glass-panel p-4 flex items-center gap-4">
            <stat.icon className={cn("w-8 h-8 flex-shrink-0", stat.color)} />
            <div>
              <p className={cn("text-2xl font-headline font-bold", stat.color)}>{stat.value}</p>
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Engine Log */}
      <div className="glass-panel overflow-hidden">
        <div className="p-4 border-b border-white/[0.04] flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/40" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Real-Time Event Log</h3>
            {wsConnected && <span className="text-[9px] font-mono text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded-full">● LIVE</span>}
          </div>
          <span className="text-[9px] font-mono text-white/20">{wsEventLog.length} events</span>
        </div>
        <div className="p-4 max-h-72 overflow-y-auto font-mono text-[10px] space-y-1.5">
          {wsEventLog.length === 0 && <p className="text-white/20 text-center py-8">Connect to engine to see live events...</p>}
          {wsEventLog.map((e, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-white/20 flex-shrink-0 w-20">{new Date(e.timestamp).toLocaleTimeString()}</span>
              <span className={cn("uppercase tracking-widest font-bold flex-shrink-0 w-40",
                e.type==='prediction:complete'?'text-green-400':
                e.type==='formula:patched'?'text-orange-400':
                e.type==='connect'?'text-secondary':
                e.type==='disconnect'?'text-red-400':
                e.type==='formula:drift_alert'?'text-red-400':
                'text-white/30')}>{e.type}</span>
              <span className="text-white/30 truncate">{typeof e.payload === 'object' ? JSON.stringify(e.payload).slice(0,60) : String(e.payload)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
