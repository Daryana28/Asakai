import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const INDEX = path.join(DATA_DIR, "index.json");
const FILES_DIR = path.join(DATA_DIR, "files");

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const idxRaw = await fs.readFile(INDEX, "utf8");
    const list = JSON.parse(idxRaw) as any[];
    const item = list.find((x) => x.id === params.id);
    if (!item) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

    const filePath = path.join(FILES_DIR, item.file);
    const data = await fs.readFile(filePath);
    const inline = req.nextUrl.searchParams.get("inline") === "1";

    const ext = (item.file.split(".").pop() || "").toLowerCase();
    const mime =
      ext === "pdf"
        ? "application/pdf"
        : ext === "xlsx"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : ext === "xls"
        ? "application/vnd.ms-excel"
        : ext === "docx"
        ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        : ext === "doc"
        ? "application/msword"
        : "application/octet-stream";

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${encodeURIComponent(item.name)}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Failed to download" }, { status: 500 });
  }
}
