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
  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewCoffee((prev) => ({ ...prev, [name]: name === "price" ? Number.parseFloat(value) : value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImageFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (imageFile) {
      const formData = new FormData()
      formData.append("name", newCoffee.name)
      formData.append("description", newCoffee.description || "")
      formData.append("price", newCoffee.price.toString())
      formData.append("image", imageFile)

      const response = await fetch("/api/coffee", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const addedCoffee = await response.json()
        onCoffeeAdded(addedCoffee)
        onClose()
        setNewCoffee({
          name: "",
          description: "",
          price: 0,
          image: "/placeholder.svg?height=100&width=100",
        })
        setImageFile(null)
      } else {
        console.error("Failed to add coffee")
      }
    }
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
            <Label htmlFor="image">Image File</Label>
            <Input id="image" name="image" type="file" accept="image/*" onChange={handleFileChange} required />
          </div>
          <Button type="submit">Add Coffee</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
