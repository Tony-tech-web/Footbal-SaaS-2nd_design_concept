import { create } from 'zustand';

export enum SlipStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PREDICTED = 'PREDICTED',
  VERIFIED = 'VERIFIED',
  FAILED = 'FAILED'
}

export enum ConfidenceTier {
  TIER1 = 'TIER1',
  TIER2 = 'TIER2',
  TIER3 = 'TIER3'
}

export interface Prediction {
  id: string;
  match: string;
  sport: string;
  league: string;
  claudeConfidence: number;
  gptConfidence: number;
  finalConfidence: number;
  status: SlipStatus;
  time: string;
  prediction: string;
  tier: ConfidenceTier;
}

export interface Job {
  id: string;
  type: 'predict' | 'verify';
  status: 'waiting' | 'active' | 'completed' | 'failed';
  progress: number;
  timestamp: string;
}

export interface FormulaLayer {
  id: string;
  name: string;
  score: number;
  version: string;
}

interface StarkState {
  predictions: Prediction[];
  jobs: Job[];
  formulaLayers: FormulaLayer[];
  formulaVersion: string;
  accuracy: number;
  wsConnected: boolean;
  
  setWsConnected: (connected: boolean) => void;
  addPrediction: (prediction: Prediction) => void;
  updatePrediction: (id: string, updates: Partial<Prediction>) => void;
  addJob: (job: Job) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  setFormulaVersion: (version: string) => void;
  updateLayer: (id: string, score: number, version: string) => void;
}

export const useStarkStore = create<StarkState>((set) => ({
  predictions: [
    { 
      id: '1', 
      match: "Arsenal vs Liverpool", 
      sport: "Football", 
      league: "Premier League", 
      prediction: "Home Win", 
      claudeConfidence: 82, 
      gptConfidence: 78, 
      finalConfidence: 80, 
      status: SlipStatus.PREDICTED, 
      time: "Just now",
      tier: ConfidenceTier.TIER1
    },
    { 
      id: '2', 
      match: "Real Madrid vs Barcelona", 
      sport: "Football", 
      league: "La Liga", 
      prediction: "Draw", 
      claudeConfidence: 45, 
      gptConfidence: 48, 
      finalConfidence: 46, 
      status: SlipStatus.PREDICTED, 
      time: "2m ago",
      tier: ConfidenceTier.TIER2
    }
  ],
  jobs: [
    { id: 'job_1', type: 'predict', status: 'active', progress: 45, timestamp: '10:24:00' },
    { id: 'job_2', type: 'verify', status: 'waiting', progress: 0, timestamp: '10:25:00' }
  ],
  formulaLayers: [
    { id: 'L1', name: 'Form', score: 88, version: 'v1.0.1' },
    { id: 'L2', name: 'Squad', score: 92, version: 'v1.0.0' },
    { id: 'L3', name: 'Tactical', score: 74, version: 'v1.0.2' },
    { id: 'L4', name: 'Psychology', score: 65, version: 'v1.0.0' },
    { id: 'L5', name: 'Environment', score: 81, version: 'v1.0.1' },
    { id: 'L6', name: 'Simulation', score: 89, version: 'v1.0.3' }
  ],
  formulaVersion: 'v2.4.1',
  accuracy: 98.2,
  wsConnected: false,

  setWsConnected: (connected) => set({ wsConnected: connected }),
  addPrediction: (prediction) => set((state) => ({ predictions: [prediction, ...state.predictions] })),
  updatePrediction: (id, updates) => set((state) => ({
    predictions: state.predictions.map((p) => p.id === id ? { ...p, ...updates } : p)
  })),
  addJob: (job) => set((state) => ({ jobs: [job, ...state.jobs] })),
  updateJob: (id, updates) => set((state) => ({
    jobs: state.jobs.map((j) => j.id === id ? { ...j, ...updates } : j)
  })),
  setFormulaVersion: (version) => set({ formulaVersion: version }),
  updateLayer: (id, score, version) => set((state) => ({
    formulaLayers: state.formulaLayers.map((l) => l.id === id ? { ...l, score, version } : l)
  }))
}));
