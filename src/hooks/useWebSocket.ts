// src/hooks/useWebSocket.ts  [v2.0 — real Socket.IO connection]
import { useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useStarkStore } from '../store/useStarkStore';
import { ENGINE_WS_URL } from '../lib/api';

export function useWebSocket() {
  const {
    setWsConnected, setWsLatency, addPrediction, updatePrediction,
    updateSlipStatus, setFormulaVersionBySport, setEngineHealth,
    addJob, updateJob, pushWsEvent,
  } = useStarkStore();

  const socketRef = useRef<Socket | null>(null);
  const pingRef   = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const socket = io(ENGINE_WS_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      timeout: 8000,
    });

    socketRef.current = socket;

    // ── Connection lifecycle ────────────────────────────────────────────────
    socket.on('connect', () => {
      setWsConnected(true);
      pushWsEvent({ type: 'connect', payload: { socketId: socket.id }, timestamp: new Date().toISOString() });

      // Subscribe to formula updates
      socket.emit('subscribe:formula');
    });

    socket.on('disconnect', () => {
      setWsConnected(false);
      pushWsEvent({ type: 'disconnect', payload: {}, timestamp: new Date().toISOString() });
    });

    socket.on('connect_error', (err) => {
      pushWsEvent({ type: 'error', payload: { message: err.message }, timestamp: new Date().toISOString() });
    });

    // ── Prediction events ───────────────────────────────────────────────────
    socket.on('prediction:complete', (data: { matchId: string; prediction: Record<string, unknown> }) => {
      const p = data.prediction as Record<string, unknown>;
      addPrediction({
        id:          (p.predictionId as string) || (p.matchId as string),
        sport:       (p.sport as 'FOOTBALL' | 'BASKETBALL') || 'FOOTBALL',
        match:       `${p.homeTeam} vs ${p.awayTeam}`,
        betType:     p.betType as string,
        betLine:     p.betLine as number | null,
        predicted:   p.predictedOutcome as string,
        confidence:  p.confidencePct as number,
        tier:        (p.confidenceTier as 'TIER1' | 'TIER2' | 'TIER3') || 'TIER2',
        keyDriver:   p.keyDriver as string,
        redFlags:    p.redFlags as string[],
        verdict:     p.verdict as string,
        rationale:   p.rationale as string,
        layerScores: p.layerScores as Record<string, number>,
        backToBackFlag: p.backToBackFlag as boolean,
        injuryImpact: (p.injuryImpact as 'NONE' | 'MINOR' | 'MAJOR' | 'CRITICAL') || 'NONE',
      });
      pushWsEvent({ type: 'prediction:complete', payload: data, timestamp: new Date().toISOString() });
    });

    socket.on('prediction:error', (data: { matchId: string; error: string }) => {
      pushWsEvent({ type: 'prediction:error', payload: data, timestamp: new Date().toISOString() });
    });

    // ── Formula events ───────────────────────────────────────────────────────
    socket.on('formula:patched', (data: { sport: string; failedLayer: string; newVersion: string; patchDescription: string }) => {
      const sport = (data.sport || 'FOOTBALL') as 'FOOTBALL' | 'BASKETBALL';
      setFormulaVersionBySport(sport, data.newVersion);
      pushWsEvent({ type: 'formula:patched', payload: data, timestamp: new Date().toISOString() });
    });

    socket.on('formula:drift_alert', (data: unknown) => {
      pushWsEvent({ type: 'formula:drift_alert', payload: data, timestamp: new Date().toISOString() });
    });

    socket.on('formula:rollback', (data: { sport: string; version: string }) => {
      const sport = (data.sport || 'FOOTBALL') as 'FOOTBALL' | 'BASKETBALL';
      setFormulaVersionBySport(sport, data.version);
      pushWsEvent({ type: 'formula:rollback', payload: data, timestamp: new Date().toISOString() });
    });

    // ── Latency ping ────────────────────────────────────────────────────────
    pingRef.current = setInterval(() => {
      if (!socket.connected) return;
      const t0 = Date.now();
      socket.emit('ping', () => { setWsLatency(Date.now() - t0); });
    }, 5000);

    return () => {
      if (pingRef.current) clearInterval(pingRef.current);
      socket.disconnect();
      setWsConnected(false);
    };
  }, []);

  /**
   * Subscribe to real-time updates for a specific slip
   */
  function subscribeToSlip(slipId: string) {
    socketRef.current?.emit('subscribe:slip', slipId);
  }

  return { socket: socketRef.current, subscribeToSlip };
}
