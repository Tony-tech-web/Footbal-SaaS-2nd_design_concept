// src/lib/api.ts
// Typed API client — connects to Sports Oracle backend
// Auto-detects sport per match, handles auth token injection

export type Sport = 'FOOTBALL' | 'BASKETBALL';
export type SlipStatus = 'PENDING' | 'PROCESSING' | 'PREDICTED' | 'VERIFIED' | 'FAILED';
export type ConfidenceTier = 'TIER1' | 'TIER2' | 'TIER3';
export type InjuryImpact = 'NONE' | 'MINOR' | 'MAJOR' | 'CRITICAL';

export interface MatchInput {
  sport?: Sport;
  homeTeam: string;
  awayTeam: string;
  betType: string;
  betLine?: number | null;
  betTarget?: string | null;
  competition?: string | null;
  scheduledAt?: string | null;
}

export interface Prediction {
  id: string;
  sport: Sport;
  match: string;
  betType: string;
  betLine?: number | null;
  predicted: string;
  actual?: string | null;
  score?: string | null;
  confidence: number;
  tier: ConfidenceTier;
  correct?: boolean | null;
  patched?: boolean;
  formulaVersion?: string;
  backToBackFlag?: boolean;
  injuryImpact?: InjuryImpact;
  keyDriver?: string;
  redFlags?: string[];
  verdict?: string;
  rationale?: string;
  layerScores?: Record<string, number>;
  simulationResults?: Record<string, number>;
}

export interface BetSlip {
  id: string;
  source: string;
  status: SlipStatus;
  sport?: Sport;
  createdAt: string;
  matches: MatchWithPrediction[];
}

export interface MatchWithPrediction {
  id: string;
  sport: Sport;
  homeTeam: string;
  awayTeam: string;
  betType: string;
  betLine?: number | null;
  competition?: string | null;
  prediction?: Prediction | null;
  result?: { homeScore: number; awayScore: number; actualOutcome: string } | null;
}

export interface FormulaVersion {
  version: string;
  sport?: Sport;
  isActive: boolean;
  changelog?: string;
  stats?: {
    totalPredictions: number;
    correctPredictions: number;
    accuracy: number | null;
    accuracy7d: number | null;
    accuracy30d: number | null;
    tier1Rate: number | null;
  };
  createdAt?: string;
  formulaJson?: Record<string, unknown>;
}

export interface FormulaPatch {
  id: string;
  fromVersion: string;
  match?: string;
  betType?: string;
  failedLayer: string;
  failureType: string;
  predictedValue: string;
  actualValue: string;
  patchDescription: string;
  modifierAdded?: Record<string, unknown>;
  appliedAt: string;
}

export interface UserStats {
  slips: number;
  predictions: number;
  verified: number;
  correct: number;
  accuracy: number | null;
  tier1Total: number;
  tier1Accuracy: number | null;
  avgConfidence: number | null;
}

export interface QueueStats {
  status: string;
  formula: string;
  queues: {
    predictions: { active: number; waiting: number; completed: number; failed: number };
    verifications: { active: number; waiting: number; completed: number; failed: number };
  };
  uptime: number;
}

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const API_BASE    = import.meta.env.VITE_API_URL    || 'http://localhost:3000';
const ENGINE_BASE = import.meta.env.VITE_ENGINE_URL || 'http://localhost:3001';

// Token resolver — in production this comes from Clerk
let _tokenResolver: (() => Promise<string | null>) | null = null;
export function setTokenResolver(fn: () => Promise<string | null>) { _tokenResolver = fn; }

async function getToken(): Promise<string | null> {
  return _tokenResolver ? _tokenResolver() : null;
}

// ─── HTTP ─────────────────────────────────────────────────────────────────────

class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(msg: string, status: number, details?: unknown) {
    super(msg); this.name = 'ApiError'; this.status = status; this.details = details;
  }
}

async function req<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  Object.assign(headers, options.headers || {});

  const res = await fetch(url, { ...options, headers });
  let body: Record<string, unknown>;
  try { body = await res.json(); } catch { body = { error: `HTTP ${res.status}` }; }
  if (!res.ok) throw new ApiError((body.error as string) || `HTTP ${res.status}`, res.status, body.details);
  return body as T;
}

const get  = <T>(path: string) => req<T>(`${API_BASE}${path}`);
const post = <T>(path: string, data: unknown) => req<T>(`${API_BASE}${path}`, { method: 'POST', body: JSON.stringify(data) });
const del  = <T>(path: string) => req<T>(`${API_BASE}${path}`, { method: 'DELETE' });
const eng  = <T>(path: string) => req<T>(`${ENGINE_BASE}${path}`);

// ─── USER ─────────────────────────────────────────────────────────────────────

export const userApi = {
  get: () => get<{ user: Record<string, unknown>; limits: Record<string, unknown>; stats: UserStats }>('/api/users'),
};

// ─── SLIPS ────────────────────────────────────────────────────────────────────

export const slipsApi = {
  list:    (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return get<{ slips: BetSlip[]; pagination: Record<string, number> }>(`/api/slips${qs}`);
  },
  get:     (id: string) => get<{ slip: BetSlip; summary: Record<string, unknown> }>(`/api/slips/${id}`),
  delete:  (id: string) => del<{ success: boolean }>(`/api/slips/${id}`),

  fromText: (rawInput: string, autoPredict = true) =>
    post<{ slipId: string; matchesExtracted: number; sports: Record<string, number> }>('/api/slips', { source: 'TEXT', rawInput, autoPredict }),

  fromImage: (imageBase64: string, mimeType = 'image/jpeg', autoPredict = true) =>
    post<{ slipId: string; matchesExtracted: number; sports: Record<string, number> }>('/api/slips', { source: 'IMAGE', imageBase64, mimeType, autoPredict }),

  manual: (matches: MatchInput[], autoPredict = true) =>
    post<{ slipId: string; matchesExtracted: number; sports: Record<string, number> }>('/api/slips', { source: 'MANUAL', matches, autoPredict }),
};

// ─── UPLOAD ────────────────────────────────────────────────────────────────────

export const uploadApi = {
  image: async (file: File) => {
    const token = await getToken();
    const fd = new FormData(); fd.append('image', file);
    const res = await fetch(`${API_BASE}/api/upload`, { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: fd });
    const b = await res.json() as Record<string, unknown>;
    if (!res.ok) throw new ApiError((b.error as string) || 'Upload failed', res.status);
    return b as { matches: MatchInput[]; imageBase64: string; mimeType: string };
  },
};

// ─── PREDICTIONS ──────────────────────────────────────────────────────────────

export const predictApi = {
  forSlip:   (slipId: string) => get<{ slip: BetSlip }>(`/api/predict?slipId=${slipId}`),
  runSlip:   (slipId: string) => post<{ predictions: Prediction[]; summary: Record<string, unknown> }>('/api/predict', { slipId }),
  runMatch:  (matchId: string) => post<{ prediction: Prediction }>('/api/predict', { matchId }),
};

// ─── RESULTS ──────────────────────────────────────────────────────────────────

export const resultsApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return get<{ predictions: Prediction[]; stats: Record<string, unknown>; pagination: Record<string, number> }>(`/api/results${qs}`);
  },
  submit: (matchId: string, homeScore: number, awayScore: number, extras?: Record<string, unknown>) =>
    post<{ success: boolean; result: Record<string, unknown> }>('/api/results', { matchId, homeScore, awayScore, source: 'MANUAL', ...extras }),
  batch: (results: { matchId: string; homeScore: number; awayScore: number }[]) =>
    post<{ total: number; correct: number; accuracy: number }>('/api/results', { results }),
};

// ─── FORMULA ─────────────────────────────────────────────────────────────────

export const formulaApi = {
  active:   (sport?: Sport) => get<FormulaVersion>(`/api/formula?view=active${sport ? '&sport=' + sport : ''}`),
  history:  (sport?: Sport) => get<{ versions: FormulaVersion[] }>(`/api/formula?view=history${sport ? '&sport=' + sport : ''}`),
  patches:  (params?: Record<string, string>) => {
    const qs = new URLSearchParams({ view: 'patches', ...(params || {}) }).toString();
    return get<{ patches: FormulaPatch[] }>(`/api/formula?${qs}`);
  },
  accuracy: (sport?: Sport) => get<Record<string, unknown>>(`/api/formula?view=accuracy${sport ? '&sport=' + sport : ''}`),
};

// ─── ADMIN ────────────────────────────────────────────────────────────────────

export const adminApi = {
  report:   () => get<Record<string, unknown>>('/api/admin?view=report'),
  snapshot: () => post<{ success: boolean }>('/api/admin', { action: 'snapshot' }),
};

// ─── ENGINE ───────────────────────────────────────────────────────────────────

export const engineApi = {
  health: () => eng<QueueStats>('/health'),
};

export { ApiError };
export const ENGINE_WS_URL = ENGINE_BASE;
