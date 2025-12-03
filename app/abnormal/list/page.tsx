// app/abnormal/list/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AbnormalListPage() {
  const [issues, setIssues] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [form, setForm] = useState({
    problem: "",
    temporary: "",
    fix: "",
    fourM: "",
    rule: "",
    repair: "",
    why1: "",
    why2: "",
    why3: "",
    why4: "",
    why5: "",
  });

  const isComplete =
    form.problem &&
    form.temporary &&
    form.fix &&
    form.fourM &&
    form.rule &&
    form.repair &&
    form.why1 &&
    form.why2 &&
    form.why3 &&
    form.why4 &&
    form.why5;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!isComplete) return;

    await fetch("/api/abnormal/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form }),
    });

    alert("Abnormal berhasil disimpan!");

    // Reset form setelah tersimpan
    setForm({
      problem: "",
      temporary: "",
      fix: "",
      fourM: "",
      rule: "",
      repair: "",
      why1: "",
      why2: "",
      why3: "",
      why4: "",
      why5: "",
    });

    setPreviewImage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewImage(url);
  };

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/abnormal/list");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setIssues(data.items || []);
      } catch (err) {
        console.error("Failed to load abnormal issues:", err);
        setIssues([]);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-100 p-6 flex justify-center items-start">
      <div className="w-full max-w-[90rem] bg-white rounded-3xl shadow-lg p-10">
        <h1 className="text-2xl font-bold mb-6">Input Abnormal Issue</h1>

        {/* BOX UTAMA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT BOX */}
          <div className="border-2 border-green-500 rounded-xl p-6 bg-white shadow">
            <div className="mb-6">
              <label className="font-bold">DESKRIPSI PROBLEM</label>
              <input
                name="problem"
                value={form.problem}
                onChange={handleChange}
                type="text"
                placeholder="Masukkan deskripsi problem"
                className="w-full mt-1 p-2 border rounded-lg"
              />
            </div>

            <div className="mb-6">
              <label className="font-bold">TEMPORARY ACTION</label>
              <input
                name="temporary"
                value={form.temporary}
                onChange={handleChange}
                type="text"
                placeholder="Masukkan temporary action"
                className="w-full mt-1 p-2 border rounded-lg"
              />
            </div>

            <div className="mb-6">
              <label className="font-bold">FIX ACTION</label>
              <input
                name="fix"
                value={form.fix}
                onChange={handleChange}
                type="text"
                placeholder="Masukkan fix action"
                className="w-full mt-1 p-2 border rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="font-bold">4M</label>
              <select
                name="fourM"
                value={form.fourM}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg"
              >
                <option value="">Pilih faktor 4M</option>
                <option value="Man">Man</option>
                <option value="Machine">Machine</option>
                <option value="Material">Material</option>
                <option value="Method">Method</option>
              </select>
            </div>
          </div>

          {/* RIGHT BOX */}
          <div className="border-2 border-green-500 rounded-xl p-6 bg-white shadow">
            <h3 className="font-bold mb-3">RULE</h3>
            <textarea
              name="rule"
              value={form.rule}
              onChange={handleChange}
              rows={7}
              className="w-full p-2 border rounded-lg"
              placeholder="Masukkan rule yang dilanggar"
            ></textarea>
          </div>
        </div>

        {/* ILUSTRASI & DETAIL PERBAIKAN */}
        <div className="mt-10">
          <h3 className="font-bold text-lg mb-4">ILUSTRASI</h3>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2">
              <div className="w-full h-64 bg-green-50 border rounded-xl flex items-center justify-center overflow-hidden">
                {previewImage ? (
                  <img
                    src={previewImage}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-green-700">
                    Upload Foto / Ilustrasi
                  </span>
                )}
              </div>

              <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer shadow hover:bg-green-700 transition w-fit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M4 12l4-4m0 0l4 4m-4-4v12"
                  />
                </svg>
                <span>Pilih Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            <div className="w-full md:w-1/2">
              <h4 className="font-bold mb-2">Detail Perbaikan</h4>
              <textarea
                name="repair"
                value={form.repair}
                onChange={handleChange}
                rows={6}
                className="w-full p-2 border rounded-lg"
                placeholder="Masukkan detail perbaikan..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* WHY ANALYSIS */}
        <div className="mt-10">
          <h3 className="font-bold text-lg mb-3">WHY ANALYSIS (5 WHY)</h3>

          <div className="grid grid-cols-1 gap-3">
            <input
              name="why1"
              value={form.why1}
              onChange={handleChange}
              type="text"
              placeholder="Why 1"
              className="p-2 border rounded-lg"
            />
            <input
              name="why2"
              value={form.why2}
              onChange={handleChange}
              type="text"
              placeholder="Why 2"
              className="p-2 border rounded-lg"
            />
            <input
              name="why3"
              value={form.why3}
              onChange={handleChange}
              type="text"
              placeholder="Why 3"
              className="p-2 border rounded-lg"
            />
            <input
              name="why4"
              value={form.why4}
              onChange={handleChange}
              type="text"
              placeholder="Why 4"
              className="p-2 border rounded-lg"
            />
            <input
              name="why5"
              value={form.why5}
              onChange={handleChange}
              type="text"
              placeholder="Why 5"
              className="p-2 border rounded-lg"
            />
          </div>
        </div>

        {/* BUTTON */}
        <div className="mt-10 flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className={`px-6 py-3 rounded-xl shadow text-white ${
              isComplete
                ? "bg-green-600 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Simpan Abnormal
          </button>

          <button
            onClick={() => history.back()}
            className="px-6 py-3 bg-gray-300 rounded-xl shadow"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
