// src/store/useStarkStore.ts  [v2.0]
import { create } from 'zustand';
import type { BetSlip, Prediction, FormulaVersion, FormulaPatch, UserStats, Sport } from '../lib/api';
export { type BetSlip, type Prediction, type FormulaVersion, type FormulaPatch };

export enum SlipStatus  { PENDING='PENDING', PROCESSING='PROCESSING', PREDICTED='PREDICTED', VERIFIED='VERIFIED', FAILED='FAILED' }
export enum ConfidenceTier { TIER1='TIER1', TIER2='TIER2', TIER3='TIER3' }

export interface Job { id:string; type:'predict'|'verify'; status:'waiting'|'active'|'completed'|'failed'; progress:number; timestamp:string; label?:string }
export interface WsEvent { type:string; payload:unknown; timestamp:string }
export interface FormulaLayer { id:string; name:string; weight:number; score:number; version:string; patchCount:number }

interface OracleState {
  wsConnected:boolean; wsLatency:number;
  setWsConnected:(v:boolean)=>void; setWsLatency:(v:number)=>void;
  activeSport:Sport; setActiveSport:(s:Sport)=>void;
  userStats:UserStats|null; userPlan:string;
  setUserStats:(s:UserStats)=>void; setUserPlan:(p:string)=>void;
  slips:BetSlip[]; slipsLoading:boolean;
  setSlips:(s:BetSlip[])=>void; addSlip:(s:BetSlip)=>void; removeSlip:(id:string)=>void;
  updateSlipStatus:(id:string,status:string)=>void; setSlipsLoading:(v:boolean)=>void;
  predictions:Prediction[]; predictionsLoading:boolean;
  setPredictions:(p:Prediction[])=>void; addPrediction:(p:Prediction)=>void;
  updatePrediction:(id:string,u:Partial<Prediction>)=>void; setPredictionsLoading:(v:boolean)=>void;
  formulaVersion:string; footballFormulaVersion:string; basketballFormulaVersion:string;
  formulaLayers:FormulaLayer[]; recentPatches:FormulaPatch[]; formulaAccuracy:number|null;
  setFormulaVersion:(v:string)=>void; setFormulaVersionBySport:(sport:Sport,v:string)=>void;
  setFormulaLayers:(l:FormulaLayer[])=>void; setRecentPatches:(p:FormulaPatch[])=>void;
  setFormulaAccuracy:(a:number|null)=>void;
  updateLayer:(id:string,weight:number,version:string)=>void;
  jobs:Job[]; setJobs:(j:Job[])=>void; addJob:(j:Job)=>void; updateJob:(id:string,u:Partial<Job>)=>void;
  wsEventLog:WsEvent[]; pushWsEvent:(e:WsEvent)=>void;
  activePredictionId:string|null; setActivePredictionId:(id:string|null)=>void;
  engineHealth:Record<string,unknown>|null; setEngineHealth:(h:Record<string,unknown>)=>void;
}

export const useStarkStore = create<OracleState>((set) => ({
  wsConnected:false, wsLatency:0,
  setWsConnected:(v)=>set({wsConnected:v}), setWsLatency:(v)=>set({wsLatency:v}),
  activeSport:'FOOTBALL', setActiveSport:(s)=>set({activeSport:s}),
  userStats:null, userPlan:'FREE',
  setUserStats:(s)=>set({userStats:s}), setUserPlan:(p)=>set({userPlan:p}),
  slips:[], slipsLoading:false,
  setSlips:(s)=>set({slips:s}), addSlip:(s)=>set(st=>({slips:[s,...st.slips]})),
  removeSlip:(id)=>set(st=>({slips:st.slips.filter(x=>x.id!==id)})),
  updateSlipStatus:(id,status)=>set(st=>({slips:st.slips.map(s=>s.id===id?{...s,status:status as SlipStatus}:s)})),
  setSlipsLoading:(v)=>set({slipsLoading:v}),
  predictions:[], predictionsLoading:false,
  setPredictions:(p)=>set({predictions:p}),
  addPrediction:(p)=>set(st=>({predictions:[p,...st.predictions.slice(0,49)]})),
  updatePrediction:(id,u)=>set(st=>({predictions:st.predictions.map(p=>p.id===id?{...p,...u}:p)})),
  setPredictionsLoading:(v)=>set({predictionsLoading:v}),
  formulaVersion:'v3.1.0', footballFormulaVersion:'v3.1.1', basketballFormulaVersion:'v1.0.1',
  formulaLayers:[
    {id:'L1',name:'Form Engine',weight:22,score:88,version:'3.1.0',patchCount:0},
    {id:'L2',name:'Squad Intelligence',weight:20,score:75,version:'3.1.1',patchCount:1},
    {id:'L3',name:'Tactical Matrix',weight:16,score:82,version:'3.1.0',patchCount:0},
    {id:'L4',name:'Psychology',weight:14,score:79,version:'3.1.0',patchCount:0},
    {id:'L5',name:'Environment',weight:10,score:68,version:'3.1.0',patchCount:0},
    {id:'L6',name:'Simulation',weight:18,score:85,version:'3.1.0',patchCount:0},
  ],
  recentPatches:[], formulaAccuracy:null,
  setFormulaVersion:(v)=>set({formulaVersion:v}),
  setFormulaVersionBySport:(sport,v)=>sport==='FOOTBALL'?set({footballFormulaVersion:v,formulaVersion:v}):set({basketballFormulaVersion:v}),
  setFormulaLayers:(l)=>set({formulaLayers:l}),
  setRecentPatches:(p)=>set({recentPatches:p}),
  setFormulaAccuracy:(a)=>set({formulaAccuracy:a}),
  updateLayer:(id,weight,version)=>set(st=>({formulaLayers:st.formulaLayers.map(l=>l.id===id?{...l,weight,version}:l)})),
  jobs:[], setJobs:(j)=>set({jobs:j}), addJob:(j)=>set(st=>({jobs:[j,...st.jobs.slice(0,19)]})),
  updateJob:(id,u)=>set(st=>({jobs:st.jobs.map(j=>j.id===id?{...j,...u}:j)})),
  wsEventLog:[], pushWsEvent:(e)=>set(st=>({wsEventLog:[e,...st.wsEventLog.slice(0,49)]})),
  activePredictionId:null, setActivePredictionId:(id)=>set({activePredictionId:id}),
  engineHealth:null, setEngineHealth:(h)=>set({engineHealth:h}),
}));
