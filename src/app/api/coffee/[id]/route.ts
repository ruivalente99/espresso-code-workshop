import { NextResponse } from 'next/server'
import { db as prisma } from '@/server/db'
import { type Coffee } from '@prisma/client'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const coffee = await prisma.coffee.findUnique({
    where: { id: Number(id) },
  })

  if (!coffee) return NextResponse.json({ error: 'Coffee not found' }, { status: 404 })

  return NextResponse.json(coffee, { status: 200 })
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { name, price, image }: Partial<Coffee> = await req.json() as Partial<Coffee>
    
    const updatedCoffee = await prisma.coffee.update({
      where: { id: Number(id) },
      data: { name, price, image },
    })
    return NextResponse.json(updatedCoffee, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Error updating coffee' }, { status: 400 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.coffee.delete({
      where: { id: Number(id) },
    })
    return NextResponse.json({ message: 'Coffee deleted with success' }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Error deleting coffee' }, { status: 400 })
  }
}
