import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(posts)
}

export async function POST(req: Request) {
  const data = await req.json()
  const post = await prisma.post.create({ data })
  return NextResponse.json(post, { status: 201 })
}
