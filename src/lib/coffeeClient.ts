/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Coffee } from '@prisma/client'
import { Key } from 'react'

export async function fetchCoffees() {
  const response = await fetch('/api/coffee')
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export async function deleteCoffee(id: Key | null | undefined): Promise<void> {
  const response = await fetch(`/api/coffee/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
}

export async function addCoffee(newCoffee: Partial<Coffee>): Promise<Coffee> {
  const response = await fetch('/api/coffee', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newCoffee),
  })
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export async function getCoffee({ queryKey }: { queryKey: [string, string] }) {
  const [, id] = queryKey
  const response = await fetch(`/api/coffee/${id}`)
  if (!response.ok) throw new Error("Failed to fetch coffee")
  return response.json()
}

export async function updateCoffee({ id, data }: { id: string, data: Partial<Coffee> }) {
  const response = await fetch(`/api/coffee/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update coffee")
  return response.json()
}
