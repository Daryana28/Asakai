// app/api/asakai-upload/route.ts
import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import * as XLSX from "xlsx";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_DIR = path.join(process.cwd(), ".data");
const UP_DIR = path.join(process.cwd(), ".uploads");
const DB_FILE = path.join(DATA_DIR, "asakai-files.json");

type AsakaiDoc = {
  id: string;
  name: string;
  dept: string;
  uploadedAt: string;
  type: "excel" | "pdf" | "word" | "image" | "file";
  filePath: string;
  coverPath?: string;
  rows?: any[];           
};

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(UP_DIR)) fs.mkdirSync(UP_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ files: [] }, null, 2), "utf8");
  }
}
function readDB(): { files: AsakaiDoc[] } {
  ensure();
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8") || '{"files":[]}');
}
function writeDB(db: { files: AsakaiDoc[] }) {
  ensure();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
}
function extOf(name: string) {
  return (name.split(".").pop() || "").toLowerCase();
}
function guessType(name: string): AsakaiDoc["type"] {
  const ext = extOf(name);
  if (["xlsx", "xls", "csv"].includes(ext)) return "excel";
  if (ext === "pdf") return "pdf";
  if (["doc", "docx"].includes(ext)) return "word";
  if (["png", "jpg", "jpeg", "webp"].includes(ext)) return "image";
  return "file";
}

export async function POST(req: Request) {
  try {
    
    ensure();
    const form = await req.formData();
    const dept = String(form.get("dept") || "");
    const mainFile = form.get("file") as File | null;
    const coverFile = form.get("cover") as File | null;

    if (!dept) return NextResponse.json({ ok: false, error: "dept required" }, { status: 400 });
    if (!mainFile) return NextResponse.json({ ok: false, error: "file required" }, { status: 400 });

    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const mainName = (mainFile as any).name || "upload";
    const mainExt = extOf(mainName);
    const mainType = guessType(mainName);

    const mainBuf = Buffer.from(await mainFile.arrayBuffer());
    const mainFileName = `${id}.${mainExt || "bin"}`;
    const mainPath = path.join(UP_DIR, mainFileName);
    fs.writeFileSync(mainPath, mainBuf);

    let coverPath: string | undefined;
    if (coverFile) {
      const coverName = (coverFile as any).name || "cover";
      const coverExt = extOf(coverName) || "png";
      const coverBuf = Buffer.from(await coverFile.arrayBuffer());
      const out = path.join(UP_DIR, `${id}_cover.${coverExt}`);
      fs.writeFileSync(out, coverBuf);
      coverPath = out;
    }

    const doc: AsakaiDoc = {
      id,
      name: mainName,
      dept,
      uploadedAt: new Date().toISOString(),
      type: mainType,
      filePath: mainPath,
      coverPath,
    };

    if (mainType === "excel") {
      const wb = XLSX.read(mainBuf);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const arr = XLSX.utils.sheet_to_json(ws, { defval: "" });
      doc.rows = arr.slice(0, 200);
    }

    const db = readDB();
    db.files.unshift(doc);
    writeDB(db);

    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (e: any) {
    console.error("/api/asakai-upload error:", e);
    const msg = e && e.message ? String(e.message) : "upload failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
