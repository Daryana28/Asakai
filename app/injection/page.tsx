"use client";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { useRouter } from "next/navigation";
import { getElementAtEvent } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const labels = [
  "12C4",
  "12D1",
  "12D6",
  "12D9",
  "12C3",
  "12D8",
  "12B4",
  "12D5",
  "12F1",
  "16A4",
  "16D4",
  "12A9",
  "12D11",
  "12D10",
  "12B7",
  "12B2",
  "12C4",
  "12D1",
  "12D6",
  "12D9",
  "12C3",
  "12D8",
  "12B4",
  "12D5",
  "12F1",
  "16A4",
  "16D4",
  "12A9",
  "12D11",
  "12D10",
  "12B7",
  "12B2",
];

const sampleDataZona1 = [
  80, 85, 40, 100, 20, 60, 80, 100, 10, 15, 35, 80, 40, 20, 60, 42,
];

const sampleDataZona2 = [
  75, 90, 55, 95, 30, 70, 85, 88, 25, 40, 50, 78, 55, 35, 65, 48,
];

const makeDataset = (data: number[], color: string) => ({
  labels,
  datasets: [
    {
      label: "",
      data,
      backgroundColor: data.map((val) =>
        val >= 80
          ? color
          : val >= 60
          ? "rgba(251, 191, 36, 4)"
          : "rgba(239, 68, 68, 4)"
      ),
      borderRadius: 8,
      borderSkipped: false,
    },
  ],
});

const chartOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false,
      position: "top",
      labels: {
        font: {
          size: 13,
          weight: 500,
        },
        padding: 15,
        usePointStyle: true,
        pointStyle: "circle",
      },
    },
    tooltip: {
      backgroundColor: "rgba(17, 24, 39, 0.95)",
      padding: 12,
      titleFont: {
        size: 14,
        weight: "bold",
      },
      bodyFont: {
        size: 13,
      },
      borderColor: "rgba(34, 197, 94, 0.3)",
      borderWidth: 1,
      cornerRadius: 8,
      callbacks: {
        label: (context) => {
          return ` Efisiensi: ${context.parsed.y}%`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 11,
          weight: 500,
        },
        color: "#6b7280",
      },
      border: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      max: 100,
      grid: {
        color: "rgba(229, 231, 235, 0.8)",
        lineWidth: 1,
      },
      ticks: {
        font: {
          size: 12,
          weight: 400,
        },
        color: "#6b7280",
        callback: (value) => value + "%",
        stepSize: 20,
      },
      border: {
        display: false,
      },
    },
  },
};

const StatCard = ({ title, value, subtitle, color }: any) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className={`text-3xl font-bold mt-1 ${color}`}>{value}%</p>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>
      <div
        className={`w-12 h-12 rounded-full ${color
          .replace("text", "bg")
          .replace("600", "100")} flex items-center justify-center`}
      >
        <svg
          className={`w-6 h-6 ${color}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
    </div>
  </div>
);

export default function InjectionGraphPage() {
  const chartRef1 = React.useRef(null);
  const chartRef2 = React.useRef(null);

  const router = useRouter();
  const handleClickZona = (event, chartRef) => {
    if (!chartRef.current) return;
    const elements = getElementAtEvent(chartRef.current, event);
    if (!elements.length) return;
    const index = elements[0].index;
    const lineName = labels[index];
    router.push(`/injection/${lineName}`);
  };

  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);
  const avgZona1 = Math.round(
    sampleDataZona1.reduce((a, b) => a + b, 0) / sampleDataZona1.length
  );
  const avgZona2 = Math.round(
    sampleDataZona2.reduce((a, b) => a + b, 0) / sampleDataZona2.length
  );

  return (
    <div
      className="h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 overflow-hidden no-scrollbar"
      style={{ overflow: "hidden" }}
    >
      <div className="h-full w-full px-4 flex flex-col">
        {/* Zona 1 Chart */}
        <div
          className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100 mb-4"
          style={{ height: "45%" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-lg font-bold text-gray-800">
              Efficiency Line Injection Zona 1
            </h2>
          </div>
          <div
            className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl p-3 overflow-x-auto h-full flex items-center"
            style={{ height: "calc(100% - 50px)" }}
          >
            <div
              style={{
                width: `${labels.length * 90}px`,
                height: "100%",
              }}
            >
              <Bar
                ref={chartRef1}
                data={makeDataset(sampleDataZona1, "rgba(34, 197, 94, 4)")}
                options={{ ...chartOptions, maintainAspectRatio: false }}
                onClick={(e) => handleClickZona(e, chartRef1)}
              />
            </div>
          </div>
        </div>

        {/* Zona 2 Chart */}
        <div
          className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100"
          style={{ height: "45%" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-lg font-bold text-gray-800">
              Efficiency Line Injection Zona 2
            </h2>
          </div>
          <div
            className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl p-3 overflow-x-auto h-full flex items-center"
            style={{ height: "calc(100% - 50px)" }}
          >
            <div
              style={{
                width: `${labels.length * 90}px`,
                height: "100%",
              }}
            >
              <Bar
                ref={chartRef2}
                data={makeDataset(sampleDataZona2, "rgba(34, 197, 94, 4)")}
                options={{ ...chartOptions, maintainAspectRatio: false }}
                onClick={(e) => handleClickZona(e, chartRef2)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
