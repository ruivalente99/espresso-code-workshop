"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { type Coffee } from '@prisma/client'

interface AddCoffeeDialogProps {
  isOpen: boolean
  onClose: () => void
  onCoffeeAdded: (newCoffee: Partial<Coffee>) => void
}

export function AddCoffeeDialog({ isOpen, onClose, onCoffeeAdded }: AddCoffeeDialogProps) {
  const [newCoffee, setNewCoffee] = useState<Omit<Coffee, "id" | "createdAt" | "updatedAt">>({
    name: "",
    description: "",
    price: 0,
    image: "/placeholder.svg?height=100&width=100",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewCoffee((prev) => ({ ...prev, [name]: name === "price" ? Number.parseFloat(value) : value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCoffeeAdded(newCoffee)
    onClose()
    setNewCoffee({
      name: "",
      description: "",
      price: 0,
      image: "/placeholder.svg?height=100&width=100",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Coffee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={newCoffee.name} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={newCoffee.description ?? ''} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={newCoffee.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" name="image" type="url" value={newCoffee.image} onChange={handleInputChange} required />
          </div>
          <Button type="submit">Add Coffee</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

