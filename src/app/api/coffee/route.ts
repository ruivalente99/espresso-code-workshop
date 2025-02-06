import { NextResponse } from 'next/server'
import { db } from '@/server/db'
import { type Coffee } from '@prisma/client'

export async function GET() {
  const coffees = await db.coffee.findMany()
  return NextResponse.json(coffees, { status: 200 })
}

export async function POST(req: Request) {
  try {
    const { name, price, image }: Partial<Coffee> = await req.json() as Partial<Coffee>
    if(!name || !price || !image) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    const coffee = await db.coffee.create({
      data: { name, price, image },
    }) 
    return NextResponse.json(coffee, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error creating coffee' }, { status: 400 })
  }
}
