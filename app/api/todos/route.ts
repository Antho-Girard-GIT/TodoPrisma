import { NextResponse } from "next/server";
import { PrismaClient } from "../../../prisma/app/generated/prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const todos = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  const { liste } = await req.json();
  const todo = await prisma.post.create({ data: { liste } });
  return NextResponse.json(todo);
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = Number(url.pathname.split("/").pop());
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
