import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const abnormal = await prisma.abnormal.create({
      data: {
        model: body.model,
        line: body.line,
        plan: body.plan,
        actual: body.actual,
        achievement: body.achievement,
        status: "PENDING",
      },
    });

    return NextResponse.json({ ok: true, abnormal });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
