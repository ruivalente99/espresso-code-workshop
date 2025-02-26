import { NextResponse } from 'next/server'
import { db } from '@/server/db'
import { type Coffee } from '@prisma/client'
import AWS from 'aws-sdk'
import { env } from '@/env'

const s3 = new AWS.S3({
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1',
})

export async function GET() {
  const coffees = await db.coffee.findMany()
  return NextResponse.json(coffees, { status: 200 })
}

export async function POST(req: Request) {
  try {
    const { name, price, image }: Partial<Coffee> = await req.json() as Partial<Coffee>
    if(!name || !price || !image) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const uploadParams = {
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: `${Date.now()}-${image.name}`,
      Body: image,
      ContentType: image.type,
    }

    const uploadResult = await s3.upload(uploadParams).promise()
    const imageUrl = uploadResult.Location

    const coffee = await db.coffee.create({
      data: { name, price, image: imageUrl },
    }) 
    return NextResponse.json(coffee, { status: 201 })
  } catch (error) {
    console.error('Error creating coffee:', error)
    return NextResponse.json({ error: 'Error creating coffee' }, { status: 400 })
  }
}
