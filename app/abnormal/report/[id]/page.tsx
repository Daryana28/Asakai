"use client";

import { useEffect, useState } from "react";

const GREEN = {
  base: "#0E7B4A",
  soft: "#E9F4EE",
  sage: "#6C8B7B",
  ring: "#B9D7C8",
  border: "#E5ECE8",
};

export default function AbnormalReportPage({ params }: any) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/abnormal/${params.id}`);
        const json = await res.json();
        setData(json.data);
      } catch (err) {
        console.error("Failed to load abnormal:", err);
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  if (loading)
    return (
      <div className="text-center py-10 text-gray-600">Memuat data...</div>
    );

  if (!data)
    return (
      <div className="text-center py-10 text-red-500">
        Data tidak ditemukan.
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg p-10 rounded-3xl">
      <h1 className="text-2xl font-bold mb-6" style={{ color: GREEN.base }}>
        Laporan Abnormal Issue #{data.id}
      </h1>

      {/* --- INFORMASI PRODUKSI --- */}
      <section
        className="p-6 rounded-xl mb-8"
        style={{ background: GREEN.soft, border: `1px solid ${GREEN.ring}` }}
      >
        <h2 className="font-bold text-lg mb-3">Informasi Produksi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <strong>Model:</strong> {data.model}
          </div>
          <div>
            <strong>Line:</strong> {data.line}
          </div>
          <div>
            <strong>Plan:</strong> {data.plan}
          </div>
          <div>
            <strong>Actual:</strong> {data.actual}
          </div>
          <div>
            <strong>Achievement:</strong>{" "}
            <span
              className={
                data.achievement >= 100
                  ? "text-green-600"
                  : data.achievement >= 80
                  ? "text-yellow-600"
                  : "text-red-600"
              }
            >
              {data.achievement}%
            </span>
          </div>
          <div>
            <strong>Status:</strong>{" "}
            <span
              className={`px-3 py-1 text-white rounded-lg ${
                data.status === "DONE" ? "bg-green-600" : "bg-yellow-500"
              }`}
            >
              {data.status}
            </span>
          </div>
        </div>
      </section>

      {/* --- DETAIL MASALAH --- */}
      <section className="mb-8">
        <h2 className="font-bold text-lg mb-3">Detail Problem</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="p-6 rounded-xl"
            style={{
              background: "#FFFFFF",
              border: `1px solid ${GREEN.border}`,
            }}
          >
            <div className="mb-3">
              <strong>Deskripsi Problem:</strong>
              <p className="text-sm mt-1">{data.problem}</p>
            </div>

            <div className="mb-3">
              <strong>Temporary Action:</strong>
              <p className="text-sm mt-1">{data.tempAction}</p>
            </div>

            <div className="mb-3">
              <strong>Fix Action:</strong>
              <p className="text-sm mt-1">{data.fixAction}</p>
            </div>

            <div className="mb-3">
              <strong>4M Factor:</strong>
              <p className="text-sm mt-1">{data.fourM}</p>
            </div>

            <div>
              <strong>Rules Dilanggar:</strong>
              <p className="text-sm mt-1">{data.rules}</p>
            </div>
          </div>

          {/* --- FOTO ILUSTRASI --- */}
          <div
            className="p-6 rounded-xl flex flex-col items-center"
            style={{
              background: "#FFFFFF",
              border: `1px solid ${GREEN.border}`,
            }}
          >
            <strong className="mb-2">Ilustrasi</strong>
            {data.imageUrl ? (
              <img
                src={data.imageUrl}
                className="w-full h-64 object-cover rounded-lg shadow"
              />
            ) : (
              <div className="text-gray-500 italic">Tidak ada gambar</div>
            )}
          </div>
        </div>
      </section>

      {/* --- DETAIL PERBAIKAN --- */}
      <section className="mb-8">
        <h2 className="font-bold text-lg mb-3">Detail Perbaikan</h2>
        <div
          className="p-6 rounded-xl text-sm"
          style={{ background: "#FFFFFF", border: `1px solid ${GREEN.border}` }}
        >
          {data.repair || "-"}
        </div>
      </section>

      {/* --- WHY ANALYSIS --- */}
      <section>
        <h2 className="font-bold text-lg mb-3">WHY Analysis (5 WHY)</h2>

        <div className="grid grid-cols-1 gap-3">
          {[data.why1, data.why2, data.why3, data.why4, data.why5].map(
            (w, i) => (
              <div
                key={i}
                className="p-3 rounded-lg"
                style={{ border: `1px solid ${GREEN.border}` }}
              >
                <strong>Why {i + 1}:</strong> {w || "-"}
              </div>
            )
          )}
        </div>
      </section>

      {/* --- BUTTON KEMBALI --- */}
      <div className="mt-10">
        <button
          onClick={() => history.back()}
          className="px-6 py-3 bg-gray-300 rounded-xl shadow hover:bg-gray-400 transition"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
