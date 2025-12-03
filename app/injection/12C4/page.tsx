// app/injection/12C4/page.tsx
"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  LegendItem,
} from "chart.js";
import { Bar, getElementAtEvent } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const labels = [
  "5H45 RCL LENS",
  "5H45 TL LENS",
  "D30D RCL LENS",
  "231B RCL LENS",
  "231B BUL BODY",
];

const plan = [500, 500, 400, 300, 300];
const actual = [400, 500, 150, 400, 50];

export default function Page12C4() {
  const chartRef = useRef<any>(null);
  const router = useRouter();
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const [showPlan, setShowPlan] = React.useState(true);
  const [showActual, setShowActual] = React.useState(true);

  const datasets = [];

  if (showPlan) {
    datasets.push({
      label: "Plan",
      data: plan,
      backgroundColor: plan.map((_, i) =>
        hoverIndex === i ? "rgba(59,130,246,0.9)" : "rgba(59,130,246,0.6)"
      ),
      borderColor: plan.map((_, i) =>
        hoverIndex === i ? "rgba(59,130,246,1)" : "rgba(59,130,246,0.6)"
      ),
      borderWidth: hoverIndex !== null ? 2 : 1,
      borderRadius: 8,
      hoverBackgroundColor: "rgba(59,130,246,1)",
    });
  }

  if (showActual) {
    datasets.push({
      label: "Actual",
      data: actual,
      backgroundColor: actual.map((val, i) => {
        const achievement = (val / plan[i]) * 100;

        if (hoverIndex === i) {
          if (achievement >= 100) return "rgba(16,185,129,1)";
          if (achievement >= 80) return "rgba(245,158,11,1)";
          return "rgba(239,68,68,1)";
        }

        if (achievement >= 100) return "rgba(16,185,129,0.6)";
        if (achievement >= 80) return "rgba(245,158,11,0.6)";
        return "rgba(239,68,68,0.6)";
      }),
      borderColor: "rgba(0,0,0,0.2)",
      borderWidth: hoverIndex !== null ? 2 : 1,
      borderRadius: 8,
      hoverBackgroundColor: "rgba(239,68,68,1)",
    });
  }

  const data = { labels, datasets };

  const options: import("chart.js").ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "nearest",
      intersect: true,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 14 },
        },
        onClick: (_: any, legendItem: LegendItem) => {
          if (legendItem.text === "Plan") setShowPlan(!showPlan);
          if (legendItem.text === "Actual") setShowActual(!showActual);
        },
      },
      tooltip: {
        backgroundColor: "rgba(17,24,39,0.95)",
        padding: 12,
        cornerRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 13 },
      },
    },
    scales: {
      x: {
        ticks: { font: { size: 12 }, color: "#6b7280" },
        grid: { display: false },
      },
      y: {
        ticks: { font: { size: 12 }, color: "#6b7280" },
        grid: { color: "rgba(229,231,235,0.5)" },
        beginAtZero: true,
      },
    },
  };

  const handleHover = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!chartRef.current) {
      setHoverIndex(null);
      return;
    }
    const elements = getElementAtEvent(chartRef.current, event);
    if (!elements.length) {
      setHoverIndex(null);
      return;
    }
    setHoverIndex(elements[0].index);
  };

  const handleClick = async (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!chartRef.current) return;

    const elements = getElementAtEvent(chartRef.current, event);
    if (!elements.length) return;

    const index = elements[0].index;
    const label = labels[index];
    const planVal = plan[index];
    const actualVal = actual[index];
    const achievement = Math.round((actualVal / planVal) * 100);

    // Trigger abnormal only when ACTUAL < PLAN
    if (actualVal < planVal) {
      try {
        await fetch("/api/abnormal/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: label,
            line: "12C4",
            plan: planVal,
            actual: actualVal,
            achievement,
          }),
        });
      } catch (err) {
        console.error("Failed to create abnormal issue:", err);
      }

      router.push(
        `/abnormal/report?model=${encodeURIComponent(label)}&plan=${planVal}&actual=${actualVal}&achievement=${achievement}`
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-4 flex justify-center items-start overflow-hidden">
      <div className="w-full max-w-[100rem] bg-white rounded-3xl shadow-lg p-8">

        <h1 className="text-xl font-bold text-gray-800 mb-6">
          Pencapaian Model (Actual terhadap Plan) - Line 12C4
        </h1>

        <div className="bg-white rounded-2xl shadow-inner p-4 relative w-full h-[600px] overflow-hidden mx-auto">
          <Bar
            ref={chartRef}
            data={data}
            options={options}
            onMouseMove={handleHover}
            onMouseLeave={() => setHoverIndex(null)}
            onClick={handleClick}
          />
        </div>

        <div className="mt-6 flex justify-center gap-10 text-gray-600 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500 rounded"></div>
            <span>≥ 100% Excellent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500 rounded"></div>
            <span>80–99% Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>&lt; 80% Needs Improvement</span>
          </div>
        </div>

      </div>
    </div>
  );
}
