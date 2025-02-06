"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  CoffeeIcon,
  DollarSign,
  Eye,
  Plus,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AddCoffeeDialog } from "./add-coffee-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Coffee } from "@prisma/client";
import { Key } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchCoffees, deleteCoffee, addCoffee } from "@/lib/coffeeClient";

export function CoffeeDashboard() {
  const queryClient = useQueryClient();
  const { data: coffees = [], isLoading } = useQuery({
    queryKey: ["coffees"],
    queryFn: fetchCoffees,
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [coffeeToDelete, setCoffeeToDelete] = useState<Key | null | undefined>(
    null,
  );

  const deleteMutation = useMutation<void, Error, Key | null | undefined>({
    mutationFn: deleteCoffee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coffees"] });
    },
  });

  const addMutation = useMutation<
    Partial<Coffee>,
    Error,
    Partial<Coffee>,
    unknown
  >({
    mutationFn: addCoffee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coffees"] });
    },
  });
  const totalCoffees = coffees.length;
  const averagePrice =
    coffees.reduce((sum: number, coffee: Coffee) => sum + coffee.price, 0) /
    totalCoffees;

  function handleDelete(id: Key | null | undefined): void {
    setCoffeeToDelete(id);
    setIsDeleteDialogOpen(true);
  }

  function confirmDelete(): void {
    if (coffeeToDelete) {
      deleteMutation.mutate(coffeeToDelete);
      setIsDeleteDialogOpen(false);
    }
  }

  function handleAdd(newCoffee: Partial<Coffee>): void {
    addMutation.mutate(newCoffee);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-foreground">
        Coffee Dashboard
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CoffeeIcon className="mr-2" />
              Total Coffees
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-3xl font-bold">{totalCoffees}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2" />
              Average Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-3xl font-bold">${averagePrice.toFixed(2)}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-foreground">Coffee List</h2>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="
        bg-orange-900
          dark:bg-orange-500
          hover:bg-orange-800
          dark:hover:bg-orange-400
        "
        >
          <Plus className="mr-2 h-4 w-4" />
          <CoffeeIcon className="mr-2 h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-12 w-12 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[200px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[300px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-[120px]" />
                      </TableCell>
                    </TableRow>
                  ))
                : coffees.map((coffee: Coffee) => (
                    <TableRow key={coffee.id}>
                      <TableCell>
                        <Image
                          src={coffee.image || "/placeholder.svg"}
                          alt={String(coffee.name || "Coffee Image")}
                          width={50}
                          height={50}
                          className="rounded-full object-cover"
                        />
                      </TableCell>
                      <TableCell>{coffee.name}</TableCell>
                      <TableCell>{coffee.description}</TableCell>
                      <TableCell>${coffee.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link href={`/coffee/${coffee.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </Link>
                          <Link href={`/coffee/${coffee.id}?edit=true`}>
                            <Button variant="outline" size="sm">
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(coffee.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddCoffeeDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onCoffeeAdded={handleAdd}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this coffee?</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
