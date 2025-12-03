// components/LineDetailTemplate.tsx
"use client";

import React, { useEffect, useState } from "react";

export default function LineDetailTemplate({ process }: { process: string }) {
  const [data, setData] = useState<any>(null);
  const line = window.location.pathname.split("/").pop();

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/line-efficiency/${process}/${line}`);
      const json = await res.json();
      setData(json);
    }
    load();
  }, []);

  if (!data) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">
        {process.toUpperCase()} — Line {data.line}
      </h1>

      <div className="text-xl">
        <div>
          <b>Target:</b> {data.target}
        </div>
        <div>
          <b>Actual:</b> {data.result}
        </div>
        <div>
          <b>Gap:</b> {data.gap}
        </div>
        <div>
          <b>Line Stop:</b> {data.stop}
        </div>
        <div>
          <b>Efficiency:</b> {data.efficiency}%
        </div>
      </div>
    </div>
  );
}
