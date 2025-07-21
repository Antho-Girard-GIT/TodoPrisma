import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
  const { pathname } = new URL(req.url);
  const id = Number(pathname.split("/").pop());
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
