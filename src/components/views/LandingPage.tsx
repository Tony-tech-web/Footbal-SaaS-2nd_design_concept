import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  BrainCircuit, 
  ShieldCheck, 
  Database, 
  Activity, 
  ArrowRight, 
  CheckCircle2,
  GitCompare,
  Cpu,
  RefreshCw,
  BarChart3,
  MessageSquare,
  FileText
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function LandingPage({ onEnterApp }: { onEnterApp: () => void }) {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30 overflow-x-hidden">
      <Navbar onEnterApp={onEnterApp} />
      <HeroSection onEnterApp={onEnterApp} />
      <LiveEnginePreview />
      <FeaturesSection />
      <ChessSectionDebate />
      <ChessSectionFormula />
      <MetricsSection />
      <TestimonialsSection />
      <CTASection onEnterApp={onEnterApp} />
      <Footer />
    </div>
  );
}

function Navbar({ onEnterApp }: { onEnterApp: () => void }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(255,107,0,0.3)]">
            <span className="text-black font-bold text-sm">S</span>
          </div>
          <span className="font-headline font-bold text-xl tracking-tight">STARK</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">Features</a>
          <a href="#engine" className="text-sm text-white/60 hover:text-white transition-colors">Engine</a>
          <a href="#accuracy" className="text-sm text-white/60 hover:text-white transition-colors">Accuracy</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onEnterApp}
            className="text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            Login
          </button>
          <button 
            onClick={onEnterApp}
            className="glass-button px-5 py-2 text-sm font-bold bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 shadow-[0_0_20px_rgba(255,107,0,0.1)]"
          >
            Start Predicting
          </button>
        </div>
      </div>
    </nav>
  );
}

function HeroSection({ onEnterApp }: { onEnterApp: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Video/Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black z-10" />
        <img 
          src="https://picsum.photos/seed/stark-hero/1920/1080?blur=10" 
          alt="Hero Background" 
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono uppercase tracking-widest mb-8">
            <Zap className="w-3 h-3" />
            v2.4 Engine Live
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-bold tracking-tight mb-6 leading-[0.9]">
            Predict Smarter.<br />
            <span className="text-primary">Win Consistently.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed">
            Multi-AI consensus engine with real-time self-healing accuracy. The most advanced sports prediction pipeline ever built.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onEnterApp}
              className="w-full sm:w-auto glass-button px-8 py-4 text-base font-bold bg-primary text-black border-primary hover:bg-primary-light transition-all shadow-[0_0_40px_rgba(255,107,0,0.3)]"
            >
              Start Predicting
            </button>
            <button 
              onClick={() => document.getElementById('engine')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto glass-button px-8 py-4 text-base font-bold flex items-center justify-center gap-2"
            >
              View Live Engine
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Floating Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
          className="mt-20 relative"
        >
          <div className="glass-panel p-2 md:p-4 max-w-4xl mx-auto border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
            <div className="rounded-xl overflow-hidden border border-white/5 bg-black/40">
              <div className="h-8 bg-white/5 flex items-center px-4 gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
              </div>
              <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-headline font-bold">Match Confidence</h3>
                    <span className="text-primary font-mono font-bold">82%</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '82%' }}
                      transition={{ duration: 1.5, delay: 1 }}
                      className="h-full bg-primary shadow-[0_0_20px_rgba(255,107,0,0.5)]" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                      <p className="text-[10px] font-mono text-white/30 uppercase mb-1">Claude-3.5</p>
                      <p className="text-xl font-bold">78%</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                      <p className="text-[10px] font-mono text-white/30 uppercase mb-1">GPT-4o</p>
                      <p className="text-xl font-bold">74%</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center text-center p-8 rounded-2xl bg-primary/5 border border-primary/20">
                  <CheckCircle2 className="w-12 h-12 text-primary mb-4" />
                  <p className="text-sm font-mono text-primary uppercase tracking-widest mb-2">Agreement Status</p>
                  <p className="text-2xl font-headline font-bold">STABLE</p>
                  <p className="text-xs text-white/40 mt-2">Consensus reached across 6 layers</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function LiveEnginePreview() {
  return (
    <section id="engine" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-headline font-bold mb-4">Live Engine Preview</h2>
          <p className="text-white/40 max-w-xl mx-auto">Simulated real-time prediction pipeline processing live sports data.</p>
        </div>

        <div className="glass-panel p-6 md:p-10 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-headline font-bold">Arsenal vs Chelsea</h3>
                <p className="text-xs text-white/40 font-mono uppercase tracking-widest">Premier League • LIVE</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">Processing</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-white/40">Claude-3.5-Sonnet</span>
                <span className="text-xs font-bold">78%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-[78%]" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-white/40">GPT-4o</span>
                <span className="text-xs font-bold">74%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 w-[74%]" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-white/40">Final Consensus</span>
                <span className="text-xs font-bold text-primary">76%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[76%]" />
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-6 h-6 text-secondary" />
              <div>
                <p className="text-sm font-bold">Agreement: Stable</p>
                <p className="text-xs text-white/40">Confidence drift within acceptable parameters (4%)</p>
              </div>
            </div>
            <button className="text-xs font-bold text-primary hover:underline">View Full Analysis</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: BrainCircuit,
      title: "Multi-AI Consensus Engine",
      description: "Dual-model validation using Claude and GPT-4 to eliminate hallucinations and bias."
    },
    {
      icon: RefreshCw,
      title: "Self-Healing Predictions",
      description: "Failed predictions trigger automatic formula patches to improve future accuracy."
    },
    {
      icon: Database,
      title: "Queue-Based Processing",
      description: "High-throughput job queues ensure predictions are processed in milliseconds."
    },
    {
      icon: FileText,
      title: "OCR Bet Slip Ingestion",
      description: "Upload any bet slip image and our vision engine will parse matches instantly."
    },
    {
      icon: Zap,
      title: "Real-Time WebSocket Updates",
      description: "Live data stream keeps your dashboard updated with the latest engine resolutions."
    },
    {
      icon: ShieldCheck,
      title: "System Evolution",
      description: "STARK learns from every result, evolving its 6-layer formula dynamically."
    }
  ];

  return (
    <section id="features" className="py-24 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-headline font-bold mb-4">Engineered for Accuracy</h2>
          <p className="text-white/40 max-w-xl mx-auto">STARK isn't just a prediction tool. It's a real-time machine learning operations pipeline.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="glass-panel p-8 hover:bg-white/[0.04] transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 mb-6 group-hover:scale-110 transition-transform">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-headline font-bold mb-3">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChessSectionDebate() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="glass-panel p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <GitCompare className="w-5 h-5 text-red-400" />
                  <h3 className="text-lg font-headline font-bold text-red-400">Debate Protocol Triggered</h3>
                </div>
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Drift: 18%</span>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <p className="text-[10px] font-mono text-white/30 uppercase mb-2">Claude-3.5 Argument</p>
                  <p className="text-sm italic text-white/60">"Home team defensive stats are skewed by recent outlier performance. Suggesting lower confidence."</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <p className="text-[10px] font-mono text-white/30 uppercase mb-2">GPT-4o Counter-Argument</p>
                  <p className="text-sm italic text-white/60">"Injury report for Away team midfield is critical. Offsetting defensive concerns."</p>
                </div>
                <div className="flex justify-center">
                  <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                    Round 2: Re-evaluating...
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-5xl font-headline font-bold mb-6">AI Debate Engine</h2>
            <p className="text-lg text-white/40 mb-8 leading-relaxed">
              When our AIs disagree by more than 15%, STARK triggers a multi-round debate protocol. Models exchange reasoning, re-evaluate their positions, and converge on a higher-fidelity consensus.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-white/60">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Confidence drift detection (&gt;15%)
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                2-round maximum debate protocol
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Automated re-evaluation system
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChessSectionFormula() {
  return (
    <section className="py-24 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-headline font-bold mb-6">Self-Healing Formula</h2>
            <p className="text-lg text-white/40 mb-8 leading-relaxed">
              Predictions are never static. Every failure is an opportunity for evolution. When a prediction misses, STARK identifies the failing layer and deploys a versioned patch to the formula engine.
            </p>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-headline font-bold text-primary">v1.0.1</p>
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mt-1">Current Version</p>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="text-center">
                <p className="text-3xl font-headline font-bold text-secondary">42</p>
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mt-1">Patches Applied</p>
              </div>
            </div>
          </div>
          <div>
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-headline font-bold">Formula Evolution</h3>
                <span className="px-2 py-1 rounded bg-secondary/10 text-secondary text-[10px] font-mono border border-secondary/20">PATCH DEPLOYED</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Layer 3: Tactical</span>
                      <span className="text-[10px] font-mono text-white/30">v1.0.0</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-secondary w-full" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <motion.div 
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="w-4 h-4 text-white/20 rotate-90" />
                  </motion.div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Layer 3: Tactical (Patched)</span>
                      <span className="text-[10px] font-mono text-primary">v1.0.1</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-primary w-full shadow-[0_0_10px_rgba(255,107,0,0.5)]" />
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-[10px] text-white/40 mt-6 leading-relaxed">
                Failed prediction on match #88291 triggered Layer 3 re-calibration. Tactical transition weights increased by 4.2%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricsSection() {
  const metrics = [
    { label: "Accuracy", value: "98.2%", sub: "Last 30 days" },
    { label: "Predictions", value: "12K+", sub: "Daily volume" },
    { label: "Formula Layers", value: "6", sub: "Deep analysis" },
    { label: "Updates", value: "Real-Time", sub: "WebSocket sync" }
  ];

  return (
    <section id="accuracy" className="py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((m, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl md:text-6xl font-headline font-bold text-primary mb-2">{m.value}</p>
              <p className="text-sm font-bold text-white mb-1">{m.label}</p>
              <p className="text-xs text-white/30 font-mono uppercase tracking-widest">{m.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Alex Rivers",
      role: "Professional Analyst",
      text: "STARK's consensus engine is a game-changer. The way it handles AI disagreement is something I've never seen before."
    },
    {
      name: "Sarah Chen",
      role: "Data Scientist",
      text: "The self-healing formula is the real deal. You can actually see the system learning and evolving in real-time."
    },
    {
      name: "Marcus Thorne",
      role: "Elite Predictor",
      text: "Accuracy is one thing, but the transparency of the 6-layer analysis is what makes STARK indispensable."
    }
  ];

  return (
    <section className="py-24 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-headline font-bold mb-4">Trusted by Experts</h2>
          <p className="text-white/40 max-w-xl mx-auto">Join thousands of professional analysts using STARK to gain a competitive edge.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="glass-panel p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/10" />
                <div>
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed italic">"{t.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ onEnterApp }: { onEnterApp: () => void }) {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 z-0" />
      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        <h2 className="text-4xl md:text-6xl font-headline font-bold mb-8">Start Winning with STARK Today</h2>
        <button 
          onClick={onEnterApp}
          className="glass-button px-12 py-6 text-xl font-bold bg-primary text-black border-primary hover:bg-primary-light transition-all shadow-[0_0_60px_rgba(255,107,0,0.4)]"
        >
          Enter the Engine
        </button>
        <p className="mt-8 text-white/40 text-sm">No credit card required. Start with 5 free daily predictions.</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
            <span className="text-black font-bold text-[10px]">S</span>
          </div>
          <span className="font-headline font-bold text-sm tracking-tight">STARK</span>
        </div>
        
        <div className="flex items-center gap-8">
          <a href="#" className="text-xs text-white/40 hover:text-white transition-colors">Product</a>
          <a href="#" className="text-xs text-white/40 hover:text-white transition-colors">API Docs</a>
          <a href="#" className="text-xs text-white/40 hover:text-white transition-colors">Twitter</a>
          <a href="#" className="text-xs text-white/40 hover:text-white transition-colors">Discord</a>
        </div>

        <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">© 2026 STARK Prediction Engine</p>
      </div>
    </footer>
  );
}
