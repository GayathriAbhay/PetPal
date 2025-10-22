import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const records = await prisma.medicalRecord.findMany({ orderBy: { date: 'desc' } })
  return NextResponse.json(records)
}

export async function POST(req: Request) {
  const data = await req.json()
  const record = await prisma.medicalRecord.create({ data })
  return NextResponse.json(record, { status: 201 })
}
