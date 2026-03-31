// src/components/views/BetSlips.tsx
import React, { useState, useRef } from 'react';
import { FileText, ImageIcon, X, AlertCircle, Zap, RefreshCw, Trash2, Plus, Type } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStarkStore } from '../../store/useStarkStore';
import { useSlips, useCreateSlip, useDeleteSlip, useUploadImage, useRunPrediction } from '../../hooks/useApi';
import { formatDistanceToNow } from 'date-fns';
import type { BetSlip, MatchInput } from '../../lib/api';

const STATUS_STYLES: Record<string, string> = {
  PENDING:    'text-white/40 bg-white/5 border-white/10',
  PROCESSING: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  PREDICTED:  'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  VERIFIED:   'text-green-400 bg-green-500/10 border-green-500/20',
  FAILED:     'text-red-400 bg-red-500/10 border-red-500/20',
};

export function BetSlips() {
  const [mode, setMode] = useState<'image'|'text'|'manual'>('image');
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File|null>(null);
  const [preview, setPreview] = useState<string|null>(null);
  const [textInput, setTextInput] = useState('');
  const [rows, setRows] = useState<Partial<MatchInput>[]>([{ sport:'FOOTBALL', homeTeam:'', awayTeam:'', betType:'HOME' }]);
  const [extracted, setExtracted] = useState<MatchInput[]|null>(null);
  const [error, setError] = useState<string|null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { slips, slipsLoading } = useStarkStore();
  useSlips();
  const create   = useCreateSlip();
  const remove   = useDeleteSlip();
  const upload   = useUploadImage();
  const runPred  = useRunPrediction();
  const busy     = create.isPending || upload.isPending;

  const onFile = (f: File) => {
    setFile(f); setError(null); setExtracted(null);
    const r = new FileReader(); r.onload = () => setPreview(r.result as string); r.readAsDataURL(f);
  };

  const submitImage = async () => {
    if (!file) return; setError(null);
    try {
      const ocr = await upload.mutateAsync(file);
      setExtracted(ocr.matches);
      await create.mutateAsync({ type:'image', payload:{ imageBase64: ocr.imageBase64, mimeType: ocr.mimeType } });
      setFile(null); setPreview(null);
    } catch(e:any) { setError(e.message || 'Upload failed'); }
  };

  const submitText = async () => {
    if (!textInput.trim()) return; setError(null);
    try { await create.mutateAsync({ type:'text', payload:{ rawInput: textInput } }); setTextInput(''); }
    catch(e:any) { setError(e.message || 'Parse failed'); }
  };

  const submitManual = async () => {
    const valid = rows.filter(r => r.homeTeam && r.awayTeam && r.betType) as MatchInput[];
    if (!valid.length) return; setError(null);
    try { await create.mutateAsync({ type:'manual', payload:{ matches: valid } }); setRows([{ sport:'FOOTBALL', homeTeam:'', awayTeam:'', betType:'HOME' }]); }
    catch(e:any) { setError(e.message || 'Submit failed'); }
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-headline font-bold tracking-tight">Bet Slips</h1>
          <p className="text-xs md:text-sm text-white/40 mt-1">Image OCR · Text parsing · Manual entry — ⚽🏀 multi-sport</p>
        </div>
        <div className="flex items-center bg-white/[0.03] border border-white/[0.05] rounded-xl p-0.5 gap-0.5">
          {(['image','text','manual'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={cn("px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-widest transition-all",
                mode===m ? "bg-primary/20 border border-primary/30 text-primary" : "text-white/30 hover:text-white/60")}>
              {m==='image'?'📷 Image':m==='text'?'📝 Text':'✏️ Manual'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-4">

          {/* IMAGE */}
          {mode==='image' && (
            <>
              <div onDragOver={e=>{e.preventDefault();setIsDragging(true);}} onDragLeave={()=>setIsDragging(false)}
                onDrop={e=>{e.preventDefault();setIsDragging(false);const f=e.dataTransfer.files[0];if(f?.type.startsWith('image/'))onFile(f);}}
                onClick={()=>!preview&&fileRef.current?.click()}
                className={cn("glass-panel p-8 text-center transition-all duration-300 min-h-[200px] flex items-center justify-center",
                  isDragging?"border-primary/60 bg-primary/5":"hover:border-white/20",preview?"":"cursor-pointer")}>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e=>e.target.files?.[0]&&onFile(e.target.files[0])} />
                {preview ? (
                  <div className="relative w-full">
                    <img src={preview} alt="preview" className="max-h-72 mx-auto rounded-xl object-contain" />
                    <button onClick={e=>{e.stopPropagation();setFile(null);setPreview(null);setExtracted(null);}}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-black text-white/70 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                    {extracted && (
                      <div className="mt-4 text-left space-y-1.5">
                        <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">✅ {extracted.length} matches extracted via OCR</p>
                        {extracted.map((m,i)=>(
                          <div key={i} className="text-[11px] font-mono text-white/50 px-3 py-1.5 bg-white/[0.03] rounded-lg">
                            {m.sport==='BASKETBALL'?'🏀':'⚽'} {m.homeTeam} vs {m.awayTeam} — <span className="text-primary/70">{m.betType}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto">
                      <ImageIcon className="w-6 h-6 text-white/30" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/70">Drop bet slip image here</p>
                      <p className="text-xs text-white/30 mt-1">or click to browse · JPEG/PNG/WebP · max 5MB</p>
                      <p className="text-[9px] font-mono text-primary/50 mt-2 uppercase tracking-widest">Claude Vision OCR · auto-detects sport</p>
                    </div>
                  </div>
                )}
              </div>
              <button onClick={submitImage} disabled={!file||busy}
                className="w-full glass-button px-6 py-3 flex items-center justify-center gap-2 text-sm font-bold bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 disabled:opacity-40 transition-all">
                {busy?<><RefreshCw className="w-4 h-4 animate-spin"/>Processing OCR...</>:<><Zap className="w-4 h-4"/>Extract & Analyse Slip</>}
              </button>
            </>
          )}

          {/* TEXT */}
          {mode==='text' && (
            <>
              <textarea value={textInput} onChange={e=>setTextInput(e.target.value)} rows={10}
                placeholder={"Paste your bet slip text here...\n\nExamples:\nArsenal vs Chelsea — Home Win\nReal Madrid vs Barcelona — Over 2.5\nLA Lakers vs Golden State — Moneyline\nDenver Nuggets vs Celtics — Spread -4.5\nOver/Under 224.5 total points"}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-sm text-white placeholder:text-white/20 font-mono resize-none focus:outline-none focus:border-primary/40 transition-all" />
              <button onClick={submitText} disabled={!textInput.trim()||busy}
                className="w-full glass-button px-6 py-3 flex items-center justify-center gap-2 text-sm font-bold bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 disabled:opacity-40 transition-all">
                {busy?<><RefreshCw className="w-4 h-4 animate-spin"/>Parsing...</>:<><Type className="w-4 h-4"/>Parse & Analyse</>}
              </button>
            </>
          )}

          {/* MANUAL */}
          {mode==='manual' && (
            <div className="space-y-3">
              {rows.map((row,i)=>(
                <div key={i} className="glass-panel p-4 space-y-3">
                  <div className="flex gap-1.5">
                    {(['FOOTBALL','BASKETBALL'] as const).map(s=>(
                      <button key={s} onClick={()=>setRows(r=>r.map((x,j)=>j===i?{...x,sport:s,betType:s==='BASKETBALL'?'MONEYLINE':'HOME'}:x))}
                        className={cn("flex-1 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-widest border transition-all",
                          row.sport===s?"bg-primary/20 border-primary/30 text-primary":"border-white/[0.06] text-white/30 hover:text-white/60")}>
                        {s==='FOOTBALL'?'⚽ Football':'🏀 Basketball'}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(['homeTeam','awayTeam'] as const).map(field=>(
                      <input key={field} value={row[field]||''} onChange={e=>setRows(r=>r.map((x,j)=>j===i?{...x,[field]:e.target.value}:x))}
                        placeholder={field==='homeTeam'?'Home Team':'Away Team'}
                        className="bg-white/[0.03] border border-white/[0.05] rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/40 transition-all" />
                    ))}
                    <select value={row.betType||''} onChange={e=>setRows(r=>r.map((x,j)=>j===i?{...x,betType:e.target.value}:x))}
                      className="bg-white/[0.03] border border-white/[0.05] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/40 transition-all">
                      {row.sport==='BASKETBALL'
                        ?['MONEYLINE','SPREAD','OVER_TOTAL','UNDER_TOTAL','FIRST_HALF_OVER','FIRST_HALF_UNDER','BOTH_OVER_100'].map(t=><option key={t}>{t}</option>)
                        :['HOME','AWAY','DRAW','OVER_1.5','OVER_2.5','OVER_3.5','UNDER_2.5','BTTS_YES','BTTS_NO'].map(t=><option key={t}>{t}</option>)
                      }
                    </select>
                    {(row.betType?.includes('SPREAD')||row.betType?.includes('TOTAL')||row.betType?.includes('1.5')||row.betType?.includes('2.5')||row.betType?.includes('3.5'))&&(
                      <input type="number" step="0.5" value={row.betLine??''} onChange={e=>setRows(r=>r.map((x,j)=>j===i?{...x,betLine:parseFloat(e.target.value)}:x))}
                        placeholder="Line (e.g. 224.5)" className="bg-white/[0.03] border border-white/[0.05] rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/40 transition-all" />
                    )}
                    <input value={row.competition||''} onChange={e=>setRows(r=>r.map((x,j)=>j===i?{...x,competition:e.target.value}:x))}
                      placeholder="Competition (optional)" className="col-span-2 bg-white/[0.03] border border-white/[0.05] rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/40 transition-all" />
                  </div>
                  {rows.length>1&&<button onClick={()=>setRows(r=>r.filter((_,j)=>j!==i))} className="w-full py-1 text-[9px] font-mono text-red-400/40 hover:text-red-400 transition-colors flex items-center justify-center gap-1"><X className="w-3 h-3"/>Remove</button>}
                </div>
              ))}
              <button onClick={()=>setRows(r=>[...r,{sport:'FOOTBALL',homeTeam:'',awayTeam:'',betType:'HOME'}])}
                className="w-full py-2 rounded-xl border border-dashed border-white/[0.06] text-[10px] text-white/30 hover:text-white/50 hover:border-white/20 transition-all flex items-center justify-center gap-1">
                <Plus className="w-3.5 h-3.5"/>Add Match
              </button>
              <button onClick={submitManual} disabled={busy}
                className="w-full glass-button px-6 py-3 flex items-center justify-center gap-2 text-sm font-bold bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 disabled:opacity-40 transition-all">
                {busy?<><RefreshCw className="w-4 h-4 animate-spin"/>Submitting...</>:<><Zap className="w-4 h-4"/>Analyse {rows.length} Match{rows.length!==1?'es':''}</>}
              </button>
            </div>
          )}

          {error&&<div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs"><AlertCircle className="w-4 h-4 flex-shrink-0"/>{error}</div>}
        </div>

        {/* Slips list */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">Recent Slips</h2>
            <span className="text-[10px] font-mono text-white/20">{slips.length}</span>
          </div>
          {slipsLoading&&<p className="text-center text-white/20 text-xs py-8 font-mono">Loading...</p>}
          {!slipsLoading&&slips.length===0&&(
            <div className="glass-panel p-10 text-center text-white/20 text-sm">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-20"/>No slips yet.
            </div>
          )}
          {slips.map(s=>(
            <div key={s.id} className="glass-panel p-4 space-y-3 hover:border-white/10 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{s.sport==='BASKETBALL'?'🏀':s.sport==='FOOTBALL'?'⚽':'🎯'}</span>
                  <div>
                    <p className="text-[10px] font-mono text-white/50">{s.id.slice(-8).toUpperCase()}</p>
                    <p className="text-[9px] text-white/25">{formatDistanceToNow(new Date(s.createdAt),{addSuffix:true})}</p>
                  </div>
                </div>
                <span className={cn("text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-md border",STATUS_STYLES[s.status]||STATUS_STYLES.PENDING)}>{s.status}</span>
              </div>
              <div className="space-y-1">
                {s.matches?.slice(0,3).map(m=>(
                  <div key={m.id} className="flex items-center gap-2 text-xs">
                    <span className="text-white/20 text-[10px]">{m.sport==='BASKETBALL'?'🏀':'⚽'}</span>
                    <span className="text-white/55 truncate flex-1">{m.homeTeam} vs {m.awayTeam}</span>
                    {m.prediction&&<span className={cn("text-[9px] font-mono font-bold",m.prediction.tier==='TIER1'?'text-green-400':m.prediction.tier==='TIER2'?'text-yellow-400':'text-red-400')}>{m.prediction.confidence}%</span>}
                  </div>
                ))}
                {(s.matches?.length??0)>3&&<p className="text-[9px] text-white/20">+{s.matches.length-3} more</p>}
              </div>
              <div className="flex items-center gap-2">
                {(s.status==='PENDING'||s.status==='FAILED')&&(
                  <button onClick={()=>runPred.mutate({type:'slip',id:s.id})}
                    className="flex-1 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[9px] font-mono uppercase tracking-widest hover:bg-primary/20 transition-all flex items-center justify-center gap-1">
                    <Zap className="w-3 h-3"/>Predict
                  </button>
                )}
                <button onClick={()=>remove.mutate(s.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all">
                  <Trash2 className="w-3.5 h-3.5"/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
