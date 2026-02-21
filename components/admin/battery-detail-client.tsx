"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Pencil, Trash2, BatteryFull, Calendar, DollarSign, Zap, Weight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { formatCurrency } from "@/lib/currency"
import { format } from "date-fns"
import { EditBatteryDialog } from "./edit-battery-dialog"

type Battery = {
  id: string
  brand: string
  model: string
  capacityKwh: number
  maxContinuousPowerKw: number
  weightKg: number
  pricePerUnit: number
  createdAt: Date
  updatedAt: Date
}

export function BatteryDetailClient({ battery }: { battery: Battery | null }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  if (!battery) {
    return (
      <div className="space-y-6">
        <Button variant="ghost">
          <Link href="/admin/batteries">
            <ArrowLeft className="mr-2 size-4" />
            Back to Batteries
          </Link>
        </Button>
        <Card>
          <CardContent className="flex h-64 items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Battery Not Found</h2>
              <p className="mt-2 text-muted-foreground">
                The battery could not be found.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Link href="/admin/batteries">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {battery.brand} {battery.model}
            </h1>
            <p className="text-muted-foreground">Battery Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
            <Pencil className="mr-2 size-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 size-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Specs Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BatteryFull className="size-5 text-green-500" />
              Battery Specifications
            </CardTitle>
            <CardDescription>Technical specifications and performance data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Capacity */}
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <div className="rounded-md bg-green-500/10 p-2">
                  <BatteryFull className="size-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Capacity</p>
                  <p className="text-2xl font-bold">{battery.capacityKwh} kWh</p>
                </div>
              </div>

              {/* Max Continuous Power */}
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <div className="rounded-md bg-amber-500/10 p-2">
                  <Zap className="size-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Max Continuous Power</p>
                  <p className="text-2xl font-bold">{battery.maxContinuousPowerKw} kW</p>
                </div>
              </div>

              {/* Weight */}
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <div className="rounded-md bg-blue-500/10 p-2">
                  <Weight className="size-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="text-2xl font-bold">{battery.weightKg} kg</p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <div className="rounded-md bg-purple-500/10 p-2">
                  <DollarSign className="size-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price per Unit</p>
                  <p className="text-2xl font-bold">{formatCurrency(battery.pricePerUnit)}</p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Calculated Metrics */}
            <div>
              <h3 className="mb-4 font-semibold">Calculated Metrics</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">Cost per kWh</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(battery.pricePerUnit / battery.capacityKwh)}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">Cost per kW</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(battery.pricePerUnit / battery.maxContinuousPowerKw)}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">kWh per kg</p>
                  <p className="text-lg font-semibold">
                    {(battery.capacityKwh / battery.weightKg).toFixed(2)} kWh/kg
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Side Info */}
        <div className="space-y-6">
          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Brand</p>
                <p className="font-semibold">{battery.brand}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Model</p>
                <p className="font-semibold">{battery.model}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Battery ID</p>
                <Badge variant="outline" className="font-mono">
                  {battery.id}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="size-4" />
                Record History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{format(battery.createdAt, "PPP")}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{format(battery.updatedAt, "PPP")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <EditBatteryDialog
        battery={battery}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Battery</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the {battery.brand} {battery.model}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>
              <Button variant="destructive">
                <Link href="/admin/batteries">Delete Battery</Link>
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
