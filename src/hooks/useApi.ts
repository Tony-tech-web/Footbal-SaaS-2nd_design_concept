// src/hooks/useApi.ts
// React Query hooks — typed, cached, auto-refreshing API calls
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  userApi, slipsApi, predictApi, resultsApi, formulaApi, adminApi, engineApi, uploadApi,
  type MatchInput, type Sport,
} from '../lib/api';
import { useStarkStore } from '../store/useStarkStore';

// ─── USER ─────────────────────────────────────────────────────────────────────

export function useUser() {
  const setUserStats = useStarkStore(s => s.setUserStats);
  const setUserPlan  = useStarkStore(s => s.setUserPlan);

  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const data = await userApi.get();
      if (data.stats) setUserStats(data.stats);
      if (data.user?.plan) setUserPlan(data.user.plan as string);
      return data;
    },
    staleTime: 30_000,
    retry: false,
  });
}

// ─── SLIPS ────────────────────────────────────────────────────────────────────

export function useSlips(params?: Record<string, string>) {
  const setSlips   = useStarkStore(s => s.setSlips);
  const setLoading = useStarkStore(s => s.setSlipsLoading);

  return useQuery({
    queryKey: ['slips', params],
    queryFn: async () => {
      setLoading(true);
      try {
        const data = await slipsApi.list(params);
        setSlips(data.slips || []);
        return data;
      } finally { setLoading(false); }
    },
    refetchInterval: 10_000,
  });
}

export function useSlip(id: string) {
  return useQuery({
    queryKey: ['slip', id],
    queryFn: () => slipsApi.get(id),
    enabled: !!id,
    refetchInterval: (q) => {
      // Keep refreshing while processing
      const slip = q.state.data?.slip;
      return slip?.status === 'PROCESSING' || slip?.status === 'PENDING' ? 3000 : false;
    },
  });
}

export function useCreateSlip() {
  const qc      = useQueryClient();
  const addSlip = useStarkStore(s => s.addSlip);

  return useMutation({
    mutationFn: async ({ type, payload }: {
      type: 'text' | 'image' | 'manual';
      payload: { rawInput?: string; imageBase64?: string; mimeType?: string; matches?: MatchInput[] };
    }) => {
      if (type === 'text')   return slipsApi.fromText(payload.rawInput!);
      if (type === 'image')  return slipsApi.fromImage(payload.imageBase64!, payload.mimeType);
      return slipsApi.manual(payload.matches!);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['slips'] }),
  });
}

export function useDeleteSlip() {
  const qc         = useQueryClient();
  const removeSlip = useStarkStore(s => s.removeSlip);

  return useMutation({
    mutationFn: (id: string) => slipsApi.delete(id),
    onSuccess: (_, id) => {
      removeSlip(id);
      qc.invalidateQueries({ queryKey: ['slips'] });
    },
  });
}

// ─── IMAGE UPLOAD ─────────────────────────────────────────────────────────────

export function useUploadImage() {
  return useMutation({ mutationFn: (file: File) => uploadApi.image(file) });
}

// ─── PREDICTIONS ──────────────────────────────────────────────────────────────

export function usePredictions(params?: Record<string, string>) {
  const setPredictions = useStarkStore(s => s.setPredictions);
  const setLoading     = useStarkStore(s => s.setPredictionsLoading);

  return useQuery({
    queryKey: ['predictions', params],
    queryFn: async () => {
      setLoading(true);
      try {
        const data = await resultsApi.list(params);
        setPredictions(data.predictions || []);
        return data;
      } finally { setLoading(false); }
    },
    refetchInterval: 15_000,
  });
}

export function useRunPrediction() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ type, id }: { type: 'slip' | 'match'; id: string }) =>
      type === 'slip' ? predictApi.runSlip(id) : predictApi.runMatch(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['slips'] });
      qc.invalidateQueries({ queryKey: ['predictions'] });
    },
  });
}

// ─── RESULTS ──────────────────────────────────────────────────────────────────

export function useSubmitResult() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ matchId, homeScore, awayScore, extras }: {
      matchId: string; homeScore: number; awayScore: number;
      extras?: Record<string, unknown>;
    }) => resultsApi.submit(matchId, homeScore, awayScore, extras),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['predictions'] });
      qc.invalidateQueries({ queryKey: ['slips'] });
    },
  });
}

// ─── FORMULA ─────────────────────────────────────────────────────────────────

export function useFormula(sport?: Sport) {
  const store = useStarkStore();

  return useQuery({
    queryKey: ['formula', 'active', sport],
    queryFn: async () => {
      const data = await formulaApi.active(sport);
      if (data.version) {
        store.setFormulaVersionBySport(sport || 'FOOTBALL', `v${data.version}`);
        if (data.stats?.accuracy) store.setFormulaAccuracy(data.stats.accuracy);
        // Build layer cards from formulaJson
        const fj = data.formulaJson as Record<string, unknown>;
        if (fj?.layerWeights) {
          const lw = fj.layerWeights as Record<string, number>;
          const layers = Object.entries(lw).map(([key, weight]) => {
            const layerData = fj[key] as Record<string, unknown> | undefined;
            const patches   = (layerData?.patches as unknown[]) || [];
            return {
              id: key.replace('_', ''), name: key.replace('L1_FORM','Form Engine').replace('L2_SQUAD','Squad Intel').replace('L2_ROSTER','Roster Intel').replace('L3_TACTICAL','Tactical Matrix').replace('L4_PSYCHOLOGY','Psychology').replace('L5_ENVIRONMENT','Environment').replace('L6_SIMULATION','Simulation').replace(/_/g,' '),
              weight, score: 80, version: data.version, patchCount: patches.length,
            };
          });
          store.setFormulaLayers(layers);
        }
      }
      return data;
    },
    staleTime: 60_000,
  });
}

export function useFormulaPatches(params?: Record<string, string>) {
  const setPatches = useStarkStore(s => s.setRecentPatches);

  return useQuery({
    queryKey: ['formula', 'patches', params],
    queryFn: async () => {
      const data = await formulaApi.patches(params);
      setPatches(data.patches || []);
      return data;
    },
    staleTime: 30_000,
  });
}

export function useFormulaAccuracy(sport?: Sport) {
  return useQuery({
    queryKey: ['formula', 'accuracy', sport],
    queryFn:  () => formulaApi.accuracy(sport),
    staleTime: 60_000,
  });
}

// ─── ENGINE HEALTH ────────────────────────────────────────────────────────────

export function useEngineHealth() {
  const setHealth = useStarkStore(s => s.setEngineHealth);

  return useQuery({
    queryKey: ['engine', 'health'],
    queryFn:  async () => {
      const data = await engineApi.health();
      setHealth(data as Record<string, unknown>);
      return data;
    },
    refetchInterval: 10_000,
    retry: false,
  });
}

// ─── SYSTEM REPORT (admin) ───────────────────────────────────────────────────

export function useSystemReport() {
  return useQuery({
    queryKey: ['admin', 'report'],
    queryFn:  adminApi.report,
    staleTime: 60_000,
    retry: false,
  });
}
