// app/api/abnormal/count/route.ts
import { NextResponse } from "next/server";
import  {prisma} from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.abnormal.count({
      where: {
        status: "PENDING",
      },
    });

    return NextResponse.json({ ok: true, count });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
