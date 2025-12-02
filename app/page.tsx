"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useRealtimeEfficiency from "@/lib/useRealtimeEfficiency";

/* ===== Gauge setengah lingkaran ===== */
function ProjectArcSemi({
  value,
  size = 220,
  thickness = 26,
  colorDone = "#22A06B",
  colorProgress = "#0E5F3D",
  stripeColor = "#5A7C6B",
}: {
  value: number;
  size?: number;
  thickness?: number;
  colorDone?: string;
  colorProgress?: string;
  stripeColor?: string;
}) {
  const done = Math.max(0, Math.min(100, Math.round(value)));
  const progress = Math.max(0, Math.min(100 - done, 12));
  const pending = Math.max(0, 100 - done - progress);
  const pad = thickness + 8;
  const viewW = size + pad * 2;
  const viewH = size * 0.72 + pad * 2;
  const cx = pad + size / 2;
  const cy = pad + size / 2 + 28;
  const r = size / 2 - 10;
  const arcOf = (s: number, l: number) => {
    const EPS = 0.0001;
    const a = Math.PI + (s / 100) * Math.PI + EPS;
    const b = Math.PI + ((s + l) / 100) * Math.PI - EPS;
    return `M ${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)} A ${r} ${r} 0 ${
      b - a > Math.PI ? 1 : 0
    } 1 ${cx + r * Math.cos(b)} ${cy + r * Math.sin(b)}`;
  };
  const patId = React.useId();
  return (
    <div className="flex flex-col items-center">
      <svg
        width={viewW}
        height={viewH}
        viewBox={`0 0 ${viewW} ${viewH}`}
        aria-label="project-arc"
      >
        <defs>
          <pattern
            id={patId}
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect width="8" height="8" fill="white" opacity="0" />
            <rect width="4" height="8" fill={stripeColor} opacity="0.25" />
          </pattern>
        </defs>
        <path
          d={arcOf(0, 100)}
          stroke="#e5edf0"
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
        />
        {done > 0 && (
          <path
            d={arcOf(0, done)}
            stroke={colorDone}
            strokeWidth={thickness}
            fill="none"
            strokeLinecap="round"
          />
        )}
        {progress > 0 && (
          <path
            d={arcOf(done, progress)}
            stroke={colorProgress}
            strokeWidth={thickness}
            fill="none"
            strokeLinecap="round"
          />
        )}
        {pending > 0 && (
          <path
            d={arcOf(done + progress, pending)}
            stroke={`url(#${patId})`}
            strokeWidth={thickness}
            fill="none"
            strokeLinecap="round"
          />
        )}
      </svg>
      <div className="text-center -mt-6">
        <div className="text-5xl font-extrabold text-slate-900">
          {Math.round(value)}%
        </div>
        <div className="text-sm font-medium text-slate-600">
          Planning Achieved
        </div>
      </div>
      <div className="mt-3 flex items-center gap-6 text-sm text-slate-600">
        <span className="inline-flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: colorDone }}
          />
          Completed
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: colorProgress }}
          />
          In Progress
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-slate-400 [background:repeating-linear-gradient(45deg,_#5A7C6B22_0_6px,_transparent_6px_12px)]" />
          Pending
        </span>
      </div>
    </div>
  );
}

/* ===== Types & data awal (hanya untuk tampilan awal) ===== */
type SectionKey = "Injection" | "Surface Treatment" | "Assembly";
type SectionData = {
  target: number;
  result: number;
  gap: number;
  lineStop: string;
  efficiency: number;
};
const INITIAL: Record<SectionKey, SectionData> = {
  Injection: {
    target: 5250,
    result: 4310,
    gap: 940,
    lineStop: "02:05",
    efficiency: (4310 / 5250) * 100,
  },
  "Surface Treatment": {
    target: 5250,
    result: 3465,
    gap: 1785,
    lineStop: "02:05",
    efficiency: (3465 / 5250) * 100,
  },
  Assembly: {
    target: 5250,
    result: 5140,
    gap: 110,
    lineStop: "02:05",
    efficiency: (5140 / 5250) * 100,
  },
};

/* ===== ISSUE - hooks (biarkan punyamu, tidak diubah ikon) ===== */
type DocCard = {
  id: string;
  name: string;
  uploadedAt: string;
  type?: string;
  dept?: string;
};
const ext = (n: string) => (n.split(".").pop() || "").toLowerCase();
const guessType = (n: string) =>
  ["xlsx", "xls", "csv"].includes(ext(n))
    ? "excel"
    : ext(n) === "pdf"
    ? "pdf"
    : ["doc", "docx"].includes(ext(n))
    ? "word"
    : "file";
function useAsakaiDocs() {
  const [files, setFiles] = useState<DocCard[]>([]);
  useEffect(() => {
    fetch("/api/asakai-files", { cache: "no-store" })
      .then((r) => r.json())
      .then((arr) =>
        setFiles(
          arr.map((x: any) => ({ ...x, type: x.type || guessType(x.name) }))
        )
      )
      .catch(() => {});
  }, []);
  const remove = async (id: string) => {
    if (!confirm("Hapus file ini?")) return;
    const res = await fetch(`/api/asakai-files?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const j = await res.json();
    if (j?.ok) setFiles((p) => p.filter((f) => f.id !== id));
    else alert(j?.error || "Gagal menghapus.");
  };
  const open = (f: DocCard) => {
    if (f.type === "pdf")
      window.open(`/api/asakai-files/${f.id}/download?inline=1`, "_blank");
    else window.location.href = `/api/asakai-files/${f.id}/download`;
  };
  return { files, remove, open };
}

/* ===== Page ===== */
export default function Home() {
  const [data, setData] = useState<Record<SectionKey, SectionData>>(INITIAL);
  const { data: live, connected } = useRealtimeEfficiency();
  const lastTs = useRef<number | null>(null);
  const docs = useAsakaiDocs();

  // Terapkan update SSE → efisiensi
  useEffect(() => {
    if (!live?.sections?.length) return;
    setData((prev) => {
      const next = { ...prev };
      for (const s of live.sections) {
        const k = s.key as SectionKey;
        if (next[k]) next[k] = { ...next[k], efficiency: s.efficiency };
      }
      return next;
    });
    lastTs.current = live.ts || Date.now();
  }, [live]);

  // Simulator hanya jika tidak ada SSE 6 detik terakhir
  useEffect(() => {
    const id = setInterval(() => {
      if (lastTs.current && Date.now() - lastTs.current < 6000) return;
      setData((prev) => {
        const next = { ...prev };
        (Object.keys(next) as SectionKey[]).forEach((k) => {
          const s = next[k];
          const delta = Math.floor((Math.random() - 0.4) * 20);
          const result = Math.max(0, Math.min(s.target, s.result + delta));
          const gap = s.target - result;
          const eff = +(
            0.15 * ((result / s.target) * 100) +
            0.85 * s.efficiency
          ).toFixed(2);
          next[k] = { ...s, result, gap, efficiency: eff };
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const CARDS = useMemo(
    () =>
      (Object.keys(data) as SectionKey[]).map((k) => ({ key: k, ...data[k] })),
    [data]
  );
  const isLiveFresh =
    (connected && !!live?.ts) ||
    (!!lastTs.current && Date.now() - (lastTs.current || 0) < 6000);

  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen text-slate-900">
      {/* Card produksi */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CARDS.map((c) => (
          <div
            key={c.key}
            onClick={() => {
              if (c.key === "Injection") window.location.href = "/injection";
            }}
            className="cursor-pointer hover:shadow-md transition bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col items-center text-center"
          >
            <h2 className="text-2xl font-semibold mb-4">{c.key}</h2>
            <ProjectArcSemi
              value={c.efficiency}
              size={220}
              thickness={45}
              colorDone={
                c.key === "Injection"
                  ? "#22A06B" // Hijau
                  : c.key === "Surface Treatment"
                  ? "#EAB308" // Kuning (yellow-500)
                  : "#3B82F6" // Biru (blue-500)
              }
              colorProgress={
                c.key === "Injection"
                  ? "#0E5F3D"
                  : c.key === "Surface Treatment"
                  ? "#CA8A04" // yellow-600
                  : "#1D4ED8" // blue-700
              }
              stripeColor={
                c.key === "Injection"
                  ? "#5A7C6B"
                  : c.key === "Surface Treatment"
                  ? "#FACC15" // yellow-400
                  : "#60A5FA" // blue-400
              }
            />
            <div className="w-full my-4 border-t border-slate-200" />
            <div className="text-sm space-y-3 mb-2 text-slate-700 w-full">
              <div>
                <b>Production Target</b>
                <div>{c.target}</div>
              </div>
              <div>
                <b>Result</b>
                <div>{c.result}</div>
              </div>
              <div>
                <b>Gap</b>
                <div>{c.gap}</div>
              </div>
              <div>
                <b>Line Stop</b>
                <div>{c.lineStop}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== ISSUE ===== */}
      <div className="space-y-3 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">ISSUE</h3>
          {/* <span className="text-xs text-slate-500">Upload dari menu Input</span> */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {docs.files.length === 0 ? (
            <div className="text-sm text-slate-500">Belum ada issue.</div>
          ) : (
            docs.files.map((f) => (
              <div
                key={f.id}
                className="bg-white rounded-xl border border-slate-200 hover:shadow-md transition overflow-hidden flex flex-col"
                title={f.name}
              >
                {/* Cover */}
                <div className="w-full h-48 bg-slate-100 relative group">
                  <img
                    src={`/api/asakai-files/${f.id}/cover`}
                    alt={`cover-${f.name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const img = e.currentTarget;
                      img.style.display = "none";
                      img.insertAdjacentHTML(
                        "afterend",
                        `<div class='w-full h-full flex items-center justify-center text-slate-400'>
                           <svg class='w-16 h-16' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
                             <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2'
                               d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'/>
                           </svg>
                         </div>`
                      );
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div className="w-full text-white">
                      <div className="text-sm font-medium truncate">
                        {f.name}
                      </div>
                      <div className="text-xs opacity-75">
                        {new Date(f.uploadedAt).toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info + Actions */}
                <div className="p-4 flex-1">
                  <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    {f.dept || f.type || "file"}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => docs.open(f)}
                      className="flex-1 p-2 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-sm flex items-center justify-center gap-2 transition-colors"
                      title="Open / View"
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Buka
                    </button>
                    <a
                      href={`/api/asakai-files/${f.id}/download`}
                      className="flex-1 p-2 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm flex items-center justify-center gap-2 transition-colors"
                      title="Download"
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Unduh
                    </a>
                    <button
                      onClick={() => docs.remove(f.id)}
                      className="p-2 rounded-md bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                      title="Delete"
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
