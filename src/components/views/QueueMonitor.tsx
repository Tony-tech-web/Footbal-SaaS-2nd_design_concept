import React from 'react';
import { 
  Database, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Cpu, 
  Network, 
  Zap,
  Play,
  Pause,
  Trash2
} from 'lucide-react';
import { useStarkStore } from '../../store/useStarkStore';
import { cn } from '../../lib/utils';

export function QueueMonitor() {
  const { jobs, wsConnected } = useStarkStore();

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-headline font-bold tracking-tight">Queue Monitor</h1>
          <p className="text-xs md:text-sm text-white/40 mt-1">Real-time job processing and engine status.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn(
            "px-3 py-1.5 rounded-full border flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest transition-all",
            wsConnected ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
          )}>
            <div className={cn("w-1.5 h-1.5 rounded-full", wsConnected ? "bg-green-400 animate-pulse" : "bg-red-400")} />
            {wsConnected ? 'Engine Connected' : 'Engine Disconnected'}
          </div>
          <button className="glass-button px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10">
            Clear Completed
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Cpu} label="CPU Load" value="42%" subValue="8 Cores Active" color="secondary" />
        <StatCard icon={Network} label="Network Latency" value="12ms" subValue="Stable" color="primary" />
        <StatCard icon={Database} label="Active Jobs" value={jobs.filter(j => j.status === 'active').length.toString()} subValue="In Queue: 12" color="secondary" />
        <StatCard icon={Activity} label="Throughput" value="1.2k" subValue="req/min" color="primary" />
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">Active & Pending Jobs</h2>
          <div className="flex items-center gap-4 text-[10px] font-mono text-white/20 uppercase tracking-widest">
            <span>Type</span>
            <span className="w-32">Progress</span>
            <span className="w-24">Status</span>
            <span className="w-8"></span>
          </div>
        </div>

        <div className="space-y-3">
          {jobs.map((job) => (
            <JobRow key={job.id} job={job} />
          ))}
          
          {jobs.length === 0 && (
            <div className="glass-panel p-12 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <Database className="w-12 h-12 text-white/10" />
              <p className="text-sm text-white/40">No active jobs in queue.</p>
            </div>
          )}
        </div>
      </div>

      {/* Logs Section */}
      <div className="glass-panel overflow-hidden">
        <div className="p-4 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/40" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">System Logs</h3>
          </div>
          <button className="text-[10px] font-mono text-white/20 hover:text-white/40 uppercase tracking-widest">Download Logs</button>
        </div>
        <div className="p-4 bg-black/40 font-mono text-[10px] md:text-xs space-y-2 h-[200px] overflow-y-auto custom-scrollbar">
          <LogEntry time="10:24:01" type="INFO" message="Prediction engine initialized successfully." />
          <LogEntry time="10:24:05" type="DEBUG" message="Fetching match data for ID: 88291..." />
          <LogEntry time="10:24:08" type="SUCCESS" message="Match data retrieved. Starting analysis." />
          <LogEntry time="10:24:12" type="INFO" message="Claude-3.5-Sonnet analysis complete. Confidence: 82%." />
          <LogEntry time="10:24:15" type="INFO" message="GPT-4o analysis complete. Confidence: 78%." />
          <LogEntry time="10:24:18" type="SUCCESS" message="Consensus reached. Final confidence: 80%." />
          <LogEntry time="10:25:01" type="WARN" message="Network latency spike detected: 142ms." />
          <LogEntry time="10:25:05" type="INFO" message="Retrying connection to data source..." />
          <LogEntry time="10:25:08" type="SUCCESS" message="Connection restored. Latency: 12ms." />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, subValue, color }: { icon: any, label: string, value: string, subValue: string, color: 'primary' | 'secondary' }) {
  return (
    <div className="glass-panel p-5 space-y-4 group hover:bg-white/[0.04] transition-all">
      <div className="flex items-center justify-between">
        <div className={cn(
          "w-10 h-10 rounded-2xl flex items-center justify-center border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]",
          color === 'primary' ? "bg-primary/10 border-primary/20 text-primary" : "bg-secondary/10 border-secondary/20 text-secondary"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{label}</p>
          <p className="text-xl font-headline font-bold">{value}</p>
        </div>
      </div>
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="text-white/20 uppercase tracking-widest">Status</span>
        <span className={cn("font-bold", color === 'primary' ? "text-primary" : "text-secondary")}>{subValue}</span>
      </div>
    </div>
  );
}

function JobRow({ job }: { job: any }) {
  const statusStyles = {
    waiting: "bg-white/5 text-white/40 border-white/10",
    active: "bg-secondary/10 text-secondary border-secondary/20 animate-pulse",
    completed: "bg-green-500/10 text-green-400 border-green-500/20",
    failed: "bg-red-500/10 text-red-400 border-red-500/20"
  };

  const statusIcons = {
    waiting: Clock,
    active: RefreshCw,
    completed: CheckCircle2,
    failed: AlertCircle
  };

  const StatusIcon = statusIcons[job.status] || Clock;

  return (
    <div className="glass-panel p-4 flex items-center justify-between group hover:bg-white/[0.04] transition-all">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
          <Zap className="w-5 h-5 text-white/20" />
        </div>
        <div>
          <h4 className="text-sm font-bold">{job.id}</h4>
          <p className="text-[10px] text-white/40 mt-0.5">{job.timestamp}</p>
        </div>
      </div>

      <div className="flex items-center gap-8 md:gap-12 pr-4">
        <div className="hidden md:block">
          <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{job.type}</span>
        </div>
        
        <div className="w-32 space-y-1.5">
          <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-widest">
            <span className="text-white/20">Progress</span>
            <span className="text-white/60">{job.progress}%</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div 
              className={cn("h-full rounded-full transition-all duration-500", job.status === 'failed' ? 'bg-red-400' : 'bg-secondary')} 
              style={{ width: `${job.progress}%` }} 
            />
          </div>
        </div>

        <div className={cn("w-24 px-2 py-1 rounded-lg border flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest", statusStyles[job.status])}>
          <StatusIcon className={cn("w-3 h-3", job.status === 'active' ? 'animate-spin' : '')} />
          {job.status}
        </div>

        <div className="flex items-center gap-2">
          {job.status === 'active' ? (
            <button className="p-2 rounded-lg hover:bg-white/10 text-white/30 hover:text-white transition-all">
              <Pause className="w-4 h-4" />
            </button>
          ) : job.status === 'waiting' ? (
            <button className="p-2 rounded-lg hover:bg-white/10 text-white/30 hover:text-white transition-all">
              <Play className="w-4 h-4" />
            </button>
          ) : (
            <button className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function LogEntry({ time, type, message }: { time: string, type: string, message: string }) {
  const colors = {
    INFO: "text-blue-400",
    DEBUG: "text-purple-400",
    SUCCESS: "text-green-400",
    WARN: "text-yellow-400",
    ERROR: "text-red-400"
  };

  return (
    <div className="flex gap-3 leading-relaxed">
      <span className="text-white/20 whitespace-nowrap">[{time}]</span>
      <span className={cn("font-bold whitespace-nowrap", colors[type] || "text-white/40")}>{type}</span>
      <span className="text-white/60">{message}</span>
    </div>
  );
}
