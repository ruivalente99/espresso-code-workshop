"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Pencil, ArrowLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery, useMutation } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { Coffee } from '@prisma/client'
import { getCoffee, updateCoffee } from "@/lib/coffeeClient"

export default function CoffeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEditMode = searchParams.get('edit') === 'true'
  const { data: coffee, isLoading } = useQuery({ queryKey: ['coffee', id], queryFn: getCoffee })
  const [isEditing, setIsEditing] = useState(isEditMode)
  const [formData, setFormData] = useState({ name: '', description: '', price: 0, image: '' })

  useEffect(() => {
    if (coffee) {
      setFormData({
        name: coffee.name || '',
        description: coffee.description || '',
        price: coffee.price || 0,
        image: coffee.image || '',
      });
    }
  }, [coffee]);

  const mutation = useMutation<
    Coffee,
    Error,
    { id: string; data: Partial<Coffee> },
    unknown
  >({
    mutationFn: ({ id, data }: { id: string; data: Partial<Coffee> }) => updateCoffee({ id, data }),
    onSuccess: () => {
      setIsEditing(false);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    mutation.mutate({ id, data: formData });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle><Skeleton className="h-8 w-[200px]" /></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-[200px] w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
            <Skeleton className="h-4 w-[100px]" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!coffee) {
    return <div>Coffee not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{isEditing ? 'Edit Coffee' : coffee.name}</CardTitle>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => router.push("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <Button onClick={handleSubmit}>Submit</Button>
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <Image
                  src={coffee.image || "/placeholder.svg"}
                  alt={coffee.name}
                  width={200}
                  height={200}
                  className="rounded-md"
                />
              </div>
              <p className="text-lg">{coffee.description}</p>
              <p className="text-xl font-bold">Price: ${coffee.price.toFixed(2)}</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
