import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const pets = await prisma.pet.findMany({ include: { medicalRecords: true } })
  return NextResponse.json(pets)
}

export async function POST(req: Request) {
  const data = await req.json()
  const pet = await prisma.pet.create({ data })
  return NextResponse.json(pet, { status: 201 })
}
