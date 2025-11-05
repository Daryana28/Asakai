import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let pool: mysql.Pool | null = null;
function getPool() {
  if (pool) return pool;
  const host = process.env.MYSQL_HOST;
  const user = process.env.MYSQL_USER;
  const password = process.env.MYSQL_PASSWORD;
  const database = process.env.MYSQL_DATABASE;
  const port = Number(process.env.MYSQL_PORT || 3306);

  if (host && user && database) {
    pool = mysql.createPool({
      host, user, password, database, port,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
    });
  }
  return pool;
}

async function fetchPayload() {
  const now = Date.now();
  const base = [
    { key: "Injection", target: 5250, result: 4310 },
    { key: "Surface Treatment", target: 5250, result: 3465 },
    { key: "Assembly", target: 5250, result: 5140 },
  ];

  try {
    const p = getPool();
    if (p) {
      const [rows] = await p.query<mysql.RowDataPacket[]>(
        "SELECT section_key AS `key`, efficiency FROM section_efficiency"
      );

      if (rows && rows.length) {
        const sections = rows.map((r) => ({
          key: String(r.key),
          efficiency: Math.max(0, Math.min(100, Number(r.efficiency) || 0)),
        }));
        return { ts: now, sections };
      }
    }
  } catch (e) {
   
  }

  const sections = base.map((s) => {
    const jitter = Math.sin(now / 3000 + s.key.length) * 2.5; // -2.5..+2.5
    const eff = Math.max(0, Math.min(100, ((s.result / s.target) * 100) + jitter));
    return { key: s.key, efficiency: Number(eff.toFixed(2)) };
  });
  return { ts: now, sections };
}

// --- SSE stream helper ---
function sseHeaders() {
  return {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    
    "X-Accel-Buffering": "no",
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  if (searchParams.get("poll")) {
    const data = await fetchPayload();
    return NextResponse.json(data, { headers: { "Cache-Control": "no-cache" } });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: any) => {
        controller.enqueue(`data: ${JSON.stringify(obj)}\n\n`);
      };

      send(await fetchPayload());

      const timer = setInterval(async () => {
        try {
          const data = await fetchPayload();
          send(data);
        } catch (e) {
          
          controller.enqueue(`event: error\ndata: ${JSON.stringify({ message: "fetch error" })}\n\n`);
        }
      }, 2000);

      const abort = (req as any).signal as AbortSignal;
      abort.addEventListener("abort", () => {
        clearInterval(timer);
        controller.close();
      });
    },
  });

  return new Response(stream, { headers: sseHeaders() });
}
