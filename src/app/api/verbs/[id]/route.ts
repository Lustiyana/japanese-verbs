import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // await the Promise
  const verb = await prisma.verb.findUnique({
    where: { id: Number(id) },
  });

  if (!verb) {
    return NextResponse.json({ error: "Verb not found" }, { status: 404 });
  }

  return NextResponse.json(verb);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const data = await req.json();
  const updated = await prisma.verb.update({
    where: { id: Number(id) },
    data,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await prisma.verb.delete({
    where: { id: Number(id) },
  });
  return NextResponse.json({ message: "Deleted" });
}
