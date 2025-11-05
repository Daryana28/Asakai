import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DB_FILE = path.join(process.cwd(), ".data/asakai-files.json");
const UPLOAD_DIR = path.join(process.cwd(), ".uploads");
const COVER_DIR = path.join(process.cwd(), ".data", "covers"); 

export async function GET(_req: Request, ctx: any) {
  try {
    const params = await ctx.params;
    const { id } = params || {};
    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    let coverFromDb: string | undefined;
    try {
      if (fs.existsSync(DB_FILE)) {
        const db = JSON.parse(
          fs.readFileSync(DB_FILE, "utf8") || '{"files":[]}'
        );
        const rec = (db.files || []).find((x: any) => x.id === id);
        if (rec) coverFromDb = rec.cover || rec.coverPath;
      }
    } catch {
      
    }

    const candidates: string[] = [];

    ["png", "jpg", "jpeg", "webp"].forEach((ext) =>
      candidates.push(path.join(UPLOAD_DIR, `${id}_cover.${ext}`))
    );

    if (coverFromDb) {
      
      if (path.isAbsolute(coverFromDb) && fs.existsSync(coverFromDb)) {
        candidates.unshift(coverFromDb);
      } else {
       
        candidates.push(path.join(UPLOAD_DIR, coverFromDb));
        candidates.push(path.join(COVER_DIR, coverFromDb));
      }
    }

    let found: string | null = null;
    for (const p of candidates) {
      if (p && fs.existsSync(p)) {
        found = p;
        break;
      }
    }

    if (!found) {
      return NextResponse.json({ error: "Cover not found" }, { status: 404 });
    }

    const buf = fs.readFileSync(found);
  
    const ext = path.extname(found).toLowerCase();
    const ct =
      ext === ".jpg" || ext === ".jpeg"
        ? "image/jpeg"
        : ext === ".webp"
        ? "image/webp"
        : "image/png";

    return new Response(buf, {
      headers: {
        "Content-Type": ct,
        "Content-Length": String(buf.length),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (e) {
    console.error("cover route error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
