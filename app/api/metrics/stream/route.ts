// app/api/asakai-files/route.ts
import { NextResponse } from "next/server";

type IssueRow = {
  Category: "Safety" | "BNF" | "RIL" | "Delivery" | string;
  Title?: string;
  Dept?: string;
  Status?: string;
  Date?: string;
};

type AsakaiFile = {
  id: string;
  name: string;
  uploadedAt: string;
  rows: IssueRow[];
};

let STORE: AsakaiFile[] = []; 

export async function GET() {
  
  return NextResponse.json(
    STORE.map(({ id, name, uploadedAt }) => ({ id, name, uploadedAt }))
  );
}

export async function POST(req: Request) {
  
  const body = await req.json();
  const f: AsakaiFile = {
    id: Date.now().toString(),
    name: String(body.name || "Asakai.xlsx"),
    uploadedAt: new Date().toISOString(),
    rows: Array.isArray(body.rows) ? body.rows : [],
  };
  STORE.unshift(f);
  return NextResponse.json({ ok: true, id: f.id });
}

export async function PUT(req: Request) {
  
  const { id } = await req.json();
  const f = STORE.find((x) => x.id === String(id));
  if (!f) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, file: f });
}
