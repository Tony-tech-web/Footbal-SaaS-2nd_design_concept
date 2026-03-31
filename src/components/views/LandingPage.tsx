// src/components/views/LandingPage.tsx
// Original landing page preserved — updated branding to Sports Oracle
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, BrainCircuit, ShieldCheck, Database, Activity, ArrowRight, CheckCircle2, GitCompare, Cpu, RefreshCw, BarChart3, MessageSquare, FileText, Trophy } from 'lucide-react';
import { cn } from '../../lib/utils';

export function LandingPage({ onEnterApp }: { onEnterApp: (tab?: string) => void }) {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30 overflow-x-hidden">
      <Navbar onEnterApp={onEnterApp} />
      <HeroSection onEnterApp={onEnterApp} />
      <FeaturesSection />
      <MetricsSection />
      <CTASection onEnterApp={onEnterApp} />
      <Footer />
    </div>
  );
}

function Navbar({ onEnterApp }: { onEnterApp: (tab?: string) => void }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(255,107,0,0.4)]">
            <Trophy className="w-4 h-4 text-black" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight">SPORTS ORACLE</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Features','Engine','Accuracy'].map(item=>(
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-white/60 hover:text-white transition-colors">{item}</a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => onEnterApp()} className="text-sm font-medium text-white/60 hover:text-white transition-colors">Login</button>
          <button onClick={() => onEnterApp()} className="glass-button px-5 py-2 text-sm font-bold bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 shadow-[0_0_20px_rgba(255,107,0,0.1)]">Start Predicting</button>
        </div>
      </div>
    </nav>
  );
}

function HeroSection({ onEnterApp }: { onEnterApp: (tab?: string) => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-b from-black via-black/80 to-black z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,0,0.08)_0%,transparent_60%)]" />
      </div>
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.8}}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono uppercase tracking-widest mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"/>
            Multi-AI Consensus Engine — Football & Basketball
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-bold tracking-tight mb-6">
            <span className="text-gradient">Predict With</span>
            <br />
            <span className="text-gradient-primary">Oracle Precision</span>
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            6-layer AI formula · Claude primary + GPT-4 validator · Self-healing on failure · ⚽ Football & 🏀 Basketball
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <button onClick={() => onEnterApp()} className="glass-button px-8 py-4 text-sm md:text-base font-bold bg-primary/15 border-primary/40 text-primary hover:bg-primary/25 shadow-[0_0_40px_rgba(255,107,0,0.15)] flex items-center gap-2">
              Enter Oracle <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => onEnterApp('formula')} className="px-8 py-4 text-sm md:text-base font-medium text-white/50 hover:text-white transition-colors">View Formula →</button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8,delay:0.3}} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto">
          {[
            {value:'80%+',label:'Tier 1 Accuracy'},
            {value:'6',label:'Analysis Layers'},
            {value:'2',label:'AI Models'},
            {value:'Auto',label:'Self-Healing'},
          ].map(s=>(
            <div key={s.label} className="glass-panel p-5 text-center">
              <p className="text-3xl font-headline font-bold text-gradient-primary">{s.value}</p>
              <p className="text-xs text-white/40 mt-1 font-mono uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { icon:BrainCircuit, title:'Multi-AI Consensus', desc:'Claude (60%) + GPT-4 (40%) debate each prediction. Conflicts trigger a 2-round resolution protocol.', sport:'⚽🏀' },
    { icon:GitCompare, title:'Self-Healing Formula', desc:'Every failed prediction triggers forensic analysis. The exact failing layer is patched with surgical precision.', sport:'⚽🏀' },
    { icon:Database, title:'6-Layer Analysis', desc:'Form Engine, Squad Intelligence, Tactical Matrix, Psychology, Environment, Simulation — weighted by sport.', sport:'⚽🏀' },
    { icon:RefreshCw, title:'Basketball B2B Detection', desc:'NBA back-to-back fatigue detection. Cross-country + altitude compound penalties automatically applied.', sport:'🏀' },
    { icon:FileText, title:'Image OCR Ingestion', desc:'Drop a photo of any bet slip. Claude Vision extracts all matches, detects sport, and runs predictions.', sport:'⚽🏀' },
    { icon:Activity, title:'Real-Time WebSocket', desc:'Live prediction updates, formula patch notifications, and engine health — all streamed via Socket.IO.', sport:'⚽🏀' },
  ];

  return (
    <section id="features" className="py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4">Engine Architecture</h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">Production-grade prediction infrastructure built for accuracy, not marketing.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f,i)=>(
            <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{delay:i*0.1}} viewport={{once:true}}
              className="glass-panel p-6 space-y-4 hover:border-white/10 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-lg">{f.sport}</span>
              </div>
              <div>
                <h3 className="text-base font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MetricsSection() {
  return (
    <section id="accuracy" className="py-32 px-4 border-t border-white/5">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4">Formula Performance</h2>
        <p className="text-white/40 mb-16 max-w-xl mx-auto">Live data from the self-healing prediction engine. Formula version updates automatically when accuracy dips.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {label:'Tier 1 Target',value:'80%+',desc:'High-confidence predictions',color:'text-green-400'},
            {label:'Football Formula',value:'v3.1.1',desc:'Latest with L2 squad patch',color:'text-primary'},
            {label:'Basketball Formula',value:'v1.0.1',desc:'B2B compound penalty added',color:'text-secondary'},
          ].map(s=>(
            <div key={s.label} className="glass-panel p-8 text-center">
              <p className={cn("text-5xl font-headline font-bold",s.color)}>{s.value}</p>
              <p className="text-white/70 font-medium mt-2">{s.label}</p>
              <p className="text-xs text-white/30 mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ onEnterApp }: { onEnterApp: (tab?: string) => void }) {
  return (
    <section className="py-32 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="glass-panel p-12 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl font-headline font-bold">Start Predicting Now</h2>
          <p className="text-white/40">Upload a bet slip image or type matches manually. The Oracle analyses every factor and tells you exactly what to back.</p>
          <button onClick={() => onEnterApp()} className="glass-button px-10 py-4 text-sm md:text-base font-bold bg-primary/15 border-primary/40 text-primary hover:bg-primary/25 shadow-[0_0_40px_rgba(255,107,0,0.15)] flex items-center gap-2 mx-auto">
            Open Oracle <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-white/5 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
          <Trophy className="w-3.5 h-3.5 text-black" />
        </div>
        <span className="font-headline font-bold text-sm">SPORTS ORACLE</span>
      </div>
      <p className="text-white/20 text-xs font-mono uppercase tracking-widest">Formula Engine v3.1.1 · Basketball v1.0.1 · Claude + GPT-4 Consensus</p>
    </footer>
  );
}
