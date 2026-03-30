import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  Image as ImageIcon, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  ChevronRight,
  RefreshCw,
  Trash2,
  Edit2
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function BetSlips() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(selectedFile);
    setStatus('idle');
  };

  const handleUpload = () => {
    if (!file) return;
    setStatus('uploading');
    
    // Simulate upload and OCR processing
    setTimeout(() => {
      setStatus('processing');
      setTimeout(() => {
        setStatus('completed');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-headline font-bold tracking-tight">Bet Slips</h1>
          <p className="text-xs md:text-sm text-white/40 mt-1">OCR ingestion and match extraction engine.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative h-[400px] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all duration-500 cursor-pointer overflow-hidden group",
              isDragging ? "border-primary bg-primary/5 scale-[0.99]" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20",
              preview ? "border-solid" : ""
            )}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden" 
              accept="image/*"
            />
            
            {preview ? (
              <>
                <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 mb-4 shadow-2xl">
                    <ImageIcon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-sm font-bold text-white shadow-sm">{file?.name}</p>
                  <p className="text-xs text-white/60 mt-1">Click or drag to replace</p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center p-8">
                <div className="w-20 h-20 rounded-3xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Upload className="w-10 h-10 text-primary/50" />
                </div>
                <h3 className="text-xl font-headline font-bold mb-2">Upload Bet Slip</h3>
                <p className="text-sm text-white/40 max-w-xs leading-relaxed">Drag and drop your bet slip image here, or click to browse. Supports JPEG, PNG, and WebP.</p>
              </div>
            )}
          </div>

          {file && status === 'idle' && (
            <button 
              onClick={handleUpload}
              className="w-full glass-button py-4 text-base font-bold bg-primary text-black border-primary hover:bg-primary-light transition-all shadow-[0_0_40px_rgba(255,107,0,0.3)]"
            >
              Start OCR Extraction
            </button>
          )}

          {status !== 'idle' && status !== 'completed' && (
            <div className="glass-panel p-8 flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-white/5 border-t-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-primary animate-pulse" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-headline font-bold mb-2">
                  {status === 'uploading' ? 'Uploading Image...' : 'Extracting Matches...'}
                </h3>
                <p className="text-sm text-white/40 max-w-xs mx-auto">
                  {status === 'uploading' ? 'Sending encrypted payload to vision engine.' : 'Claude Vision is parsing text blocks and identifying match IDs.'}
                </p>
              </div>
            </div>
          )}

          {status === 'completed' && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-700">
              <div className="glass-panel p-6 bg-green-500/5 border-green-500/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-headline font-bold">Extraction Complete</h3>
                    <p className="text-xs text-white/40">3 matches identified with 98% OCR confidence.</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setFile(null); setPreview(null); setStatus('idle'); }}
                  className="text-xs font-mono text-white/30 hover:text-white uppercase tracking-widest"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-3">
                <ExtractedMatch match="Arsenal vs Liverpool" league="Premier League" time="Today, 16:30" />
                <ExtractedMatch match="Real Madrid vs Barcelona" league="La Liga" time="Tomorrow, 20:00" />
                <ExtractedMatch match="Bayern Munich vs BVB" league="Bundesliga" time="Today, 18:30" />
              </div>

              <button className="w-full glass-button py-4 text-base font-bold bg-secondary/10 border-secondary/30 text-secondary hover:bg-secondary/20 shadow-[0_0_40px_rgba(0,229,255,0.1)]">
                Queue 3 Predictions
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="glass-panel p-6">
            <h2 className="text-lg font-headline font-semibold mb-4">OCR System Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">Vision Engine</span>
                <span className="text-xs font-bold text-secondary">ONLINE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">Avg. Extraction Time</span>
                <span className="text-xs font-bold">2.4s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">OCR Accuracy</span>
                <span className="text-xs font-bold">99.1%</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 bg-primary/5 border-primary/20">
            <h2 className="text-lg font-headline font-semibold text-primary mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Pro Tip
            </h2>
            <p className="text-xs text-white/60 leading-relaxed">
              Ensure the bet slip is flat and well-lit for the highest extraction accuracy. Our engine automatically handles rotation and perspective correction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExtractedMatch({ match, league, time }: { match: string, league: string, time: string }) {
  return (
    <div className="glass-panel p-4 flex items-center justify-between group hover:bg-white/[0.04] transition-all">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-colors">
          <FileText className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
        </div>
        <div>
          <h4 className="text-sm font-bold">{match}</h4>
          <p className="text-[10px] text-white/40 mt-0.5">{league} • {time}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg hover:bg-white/10 text-white/30 hover:text-white transition-all">
          <Edit2 className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-all">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
