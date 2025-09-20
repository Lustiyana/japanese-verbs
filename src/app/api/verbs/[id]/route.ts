import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type Params = { params: { id: string } }

export async function GET(req: Request, { params }: Params) {
  const verb = await prisma.verb.findUnique({
    where: { id: Number(params.id) },
  })
  return NextResponse.json(verb)
}

export async function PUT(req: Request, { params }: Params) {
  const data = await req.json()
  const updated = await prisma.verb.update({
    where: { id: Number(params.id) },
    data,
  })
  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: Params) {
  await prisma.verb.delete({
    where: { id: Number(params.id) },
  })
  return NextResponse.json({ message: "Deleted" })
}
