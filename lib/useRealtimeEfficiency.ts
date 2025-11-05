"use client";
import { useEffect, useRef, useState } from "react";

type Section = { key: string; efficiency: number };
type Payload = { ts: number; sections: Section[] };

export default function useRealtimeEfficiency() {
  const [data, setData] = useState<Payload | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const esRef = useRef<EventSource | null>(null);
  const pollRef = useRef<any>(null);

  // --- SSE utama ---
  useEffect(() => {
    const es = new EventSource("/api/realtime/efficiency");
    esRef.current = es;

    es.onopen = () => {
      setConnected(true);
      setError(null);
    };

    es.onmessage = (ev) => {
      try {
        const payload: Payload = JSON.parse(ev.data);
        setData(payload);
      } catch {
      }
    };

    es.onerror = () => {
      setConnected(false);
      setError((prev) => prev ?? "disconnected");
    };

    return () => {
      es.close();
      esRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (connected) {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      return;
    }
    if (!pollRef.current) {
      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch("/api/realtime/efficiency?poll=1", { cache: "no-store" });
          if (!res.ok) throw new Error(String(res.status));
          const payload: Payload = await res.json();
          setData(payload);
        } catch {
        }
      }, 3000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
    };
  }, [connected]);

  return { data, connected, error };
}
