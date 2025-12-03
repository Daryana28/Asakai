import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const update = await prisma.abnormal.update({
      where: { id: Number(body.id) },
      data: {
        problem: body.problem,
        tempAction: body.temporary,
        fixAction: body.fix,
        fourM: body.fourM,
        rules: body.rule,
        repair: body.repair,
        why1: body.why1,
        why2: body.why2,
        why3: body.why3,
        why4: body.why4,
        why5: body.why5,
        imageUrl: body.imageUrl ?? null,
        status: "DONE",
      },
    });

    return NextResponse.json({ ok: true, update });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
