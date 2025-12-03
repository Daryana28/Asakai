// app/abnormal/report/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AbnormalReport() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/abnormal/list");
      const data = await res.json();
      setItems(data.items || []);
    }
    load();
  }, []);

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📄 Laporan Abnormal</h1>

      {items.length === 0 && (
        <p className="text-gray-500">Belum ada laporan abnormal.</p>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-xl border shadow bg-white flex justify-between"
          >
            <div>
              <p>
                <b>Problem:</b> {item.problem}
              </p>
              <p>
                <b>4M:</b> {item.fourM}
              </p>
            </div>

            <Link
              href={`/abnormal/report/${item.id}`}
              className="px-4 py-2 bg-green-600 rounded-lg text-white"
            >
              Detail
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
