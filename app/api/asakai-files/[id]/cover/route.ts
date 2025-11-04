import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DB_FILE = path.join(process.cwd(), ".data/asakai-files.json");
const UPLOAD_DIR = path.join(process.cwd(), ".uploads");
const COVER_DIR = path.join(process.cwd(), ".data", "covers"); // jika kamu pakai folder ini juga

export async function GET(_req: Request, ctx: any) {
  try {
    const params = await ctx.params;
    const { id } = params || {};
    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    // baca DB (kalau ada field cover/coverPath)
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
      // ignore DB errors
    }

    // kandidat path cover yang mungkin
    const candidates: string[] = [];

    // 1) Pola default saat upload: .uploads/<id>_cover.(png|jpg|jpeg|webp)
    ["png", "jpg", "jpeg", "webp"].forEach((ext) =>
      candidates.push(path.join(UPLOAD_DIR, `${id}_cover.${ext}`))
    );

    // 2) Jika DB menyimpan nama file cover (relatif)
    if (coverFromDb) {
      // kalau absolute path di DB (lebih aman cek dulu)
      if (path.isAbsolute(coverFromDb) && fs.existsSync(coverFromDb)) {
        candidates.unshift(coverFromDb);
      } else {
        // coba di .uploads dan .data/covers
        candidates.push(path.join(UPLOAD_DIR, coverFromDb));
        candidates.push(path.join(COVER_DIR, coverFromDb));
      }
    }

    // pilih path yang benar-benar ada
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
    // deteksi content-type sesuai ekstensi
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
