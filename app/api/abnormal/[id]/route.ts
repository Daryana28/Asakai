// app/api/abnormal/[id]/route.ts
import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(_: any, { params }: any) {
  try {
    const data = await prisma.abnormal.findUnique({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}