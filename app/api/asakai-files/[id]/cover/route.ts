import { NextResponse } from "next/server";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "asakai-files.json");
const COVERS_DIR = path.join(DATA_DIR, "covers");
const UPLOADS_DIR = path.join(process.cwd(), ".uploads");

function guessMime(p: string) {
  const ext = (p.split(".").pop() || "").toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "webp") return "image/webp";
  return "application/octet-stream";
}

async function findExisting(paths: string[]) {
  for (const p of paths) {
    if (p && fs.existsSync(p)) return p;
  }
  return null;
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params || {};
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    if (!fs.existsSync(DB_FILE)) {
      return NextResponse.json({ error: "DB not found" }, { status: 500 });
    }

    const db = JSON.parse(
      (await fsp.readFile(DB_FILE, "utf8")) || `{"files":[]}`
    );
    const item = db?.files?.find((x: any) => x.id === id);
    if (!item) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Prefer stored property first
    const stored = (item.coverPath || item.cover || "") as string;

    // Candidate names (by id and by stored name) & extensions
    const names: string[] = [];
    if (stored) {
      // If it's a full path, take filename; else it’s already a name
      names.push(path.basename(stored));
    }
    // try common naming conventions
    names.push(
      `${id}_cover.png`,
      `${id}_cover.jpg`,
      `${id}_cover.jpeg`,
      `${id}_cover.webp`
    );
    names.push(`${id}.png`, `${id}.jpg`, `${id}.jpeg`, `${id}.webp`);

    // Search in both likely folders + accept absolute stored path
    const candidates: string[] = [];
    for (const n of names) {
      candidates.push(path.join(COVERS_DIR, n));
      candidates.push(path.join(UPLOADS_DIR, n));
    }
    if (stored && path.isAbsolute(stored)) candidates.push(stored);

    const found = await findExisting(candidates);
    if (!found) {
      return NextResponse.json(
        { error: "Cover not found", tried: candidates },
        { status: 404 }
      );
    }

    const buf = await fsp.readFile(found);
    return new Response(buf, {
      headers: {
        "Content-Type": guessMime(found),
        "Content-Length": String(buf.length),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("cover/GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
