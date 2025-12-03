// app/api/asakai-files/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), ".data/asakai-files.json");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return NextResponse.json([]);
    }
    const db = JSON.parse(fs.readFileSync(DB_FILE, "utf8") || '{"files":[]}');
    // Map the files and include hasCover flag
    const files = db.files.map((f: any) => {
      const coverPath = path.join(
        process.cwd(),
        ".uploads",
        `${f.id}_cover.png`
      );
      const hasCover = fs.existsSync(coverPath);
      return {
        id: f.id,
        name: f.name,
        type: f.type,
        dept: f.dept,
        uploadedAt: f.uploadedAt,
        hasCover,
      };
    });
    return NextResponse.json(files);
  } catch (e) {
    console.error("Error reading files:", e);
    return NextResponse.json(
      { error: "Failed to list files" },
      { status: 500 }
    );
  }
}

// ... (GET/POST kamu yang lama tetap)

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Missing id" },
        { status: 400 }
      );
    }

    if (!fs.existsSync(DB_FILE)) {
      return NextResponse.json(
        { ok: false, error: "Not found" },
        { status: 404 }
      );
    }

    const db = JSON.parse(fs.readFileSync(DB_FILE, "utf8") || '{"files":[]}');
    const file = db.files.find((x: any) => x.id === id);
    if (!file) {
      return NextResponse.json(
        { ok: false, error: "Not found" },
        { status: 404 }
      );
    }

    // Delete physical files
    if (file.filePath && fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }
    if (file.coverPath && fs.existsSync(file.coverPath)) {
      fs.unlinkSync(file.coverPath);
    }

    // Update database
    db.files = db.files.filter((x: any) => x.id !== id);
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Error deleting file:", e);
    return NextResponse.json(
      { ok: false, error: "Failed to delete" },
      { status: 500 }
    );
  }
}
