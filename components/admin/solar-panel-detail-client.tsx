"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Pencil, Trash2, Sun, Ruler, Calendar, DollarSign, Zap, Percent } from "lucide-react"
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
import { EditSolarPanelDialog } from "./edit-solar-panel-dialog"


type SolarPanel = {
  id: string
  brand: string
  model: string
  wattage: number
  efficiency: number
  dimensionsLengthMm: number
  dimensionsWidthMm: number
  pricePerUnit: number // Stored in cents
  imageUrl: string | null
  createdAt: Date
  updatedAt: Date
}



export function SolarPanelDetailClient({ panel }: { panel: SolarPanel | null }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)





  const calculateArea = (lengthMm: number, widthMm: number) => {
    return ((lengthMm * widthMm) / 1000000).toFixed(2)
  }


  if (!panel) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" >
          <Link href="/admin/solar-panels">
            <ArrowLeft className="mr-2 size-4" />
            Back to Solar Panels
          </Link>
        </Button>
        <Card>
          <CardContent className="flex h-64 items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Panel Not Found</h2>
              {/* <p className="mt-2 text-muted-foreground">The solar panel with ID &quot;{panel}&quot; could not be found.</p> */}
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
          <Button variant="ghost" size="icon" >
            <Link href="/admin/solar-panels">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {panel.brand} {panel.model}
            </h1>
            <p className="text-muted-foreground">Solar Panel Details</p>
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
        {/* Main Info Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="size-5 text-amber-500" />
              Panel Specifications
            </CardTitle>
            <CardDescription>Technical specifications and performance data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Wattage */}
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <div className="rounded-md bg-amber-500/10 p-2">
                  <Zap className="size-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Power Output</p>
                  <p className="text-2xl font-bold">{panel.wattage}W</p>
                </div>
              </div>

              {/* Efficiency */}
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <div className="rounded-md bg-green-500/10 p-2">
                  <Percent className="size-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Efficiency</p>
                  <p className="text-2xl font-bold">{panel.efficiency}%</p>
                </div>
              </div>

              {/* Dimensions */}
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <div className="rounded-md bg-blue-500/10 p-2">
                  <Ruler className="size-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dimensions</p>
                  <p className="text-lg font-semibold">
                    {panel.dimensionsLengthMm} x {panel.dimensionsWidthMm} mm
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Area: {calculateArea(panel.dimensionsLengthMm, panel.dimensionsWidthMm)} m²
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <div className="rounded-md bg-purple-500/10 p-2">
                  <DollarSign className="size-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price per Unit</p>
                  <p className="text-2xl font-bold">{formatCurrency(panel.pricePerUnit)}</p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Calculated Metrics */}
            <div>
              <h3 className="mb-4 font-semibold">Calculated Metrics</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">Cost per Watt</p>
                  <p className="text-lg font-semibold">{formatCurrency((panel.pricePerUnit / panel.wattage) * 100)}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">Watts per m²</p>
                  <p className="text-lg font-semibold">
                    {(panel.wattage / ((panel.dimensionsLengthMm * panel.dimensionsWidthMm) / 1000000)).toFixed(1)} W/m²
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">Cost per m²</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(
                      panel.pricePerUnit / ((panel.dimensionsLengthMm * panel.dimensionsWidthMm) / 1000000),
                    )}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Side Info Card */}
        <div className="space-y-6">
          {/* Brand & Model Card */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Brand</p>
                <p className="font-semibold">{panel.brand}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Model</p>
                <p className="font-semibold">{panel.model}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Panel ID</p>
                <Badge variant="outline" className="font-mono">
                  {panel.id}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Image Card */}
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              {panel.imageUrl ? (
                <img
                  src={panel.imageUrl || "/placeholder.svg"}
                  alt={`${panel.brand} ${panel.model}`}
                  className="aspect-square w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
                  <div className="text-center">
                    <Sun className="mx-auto size-12 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">No image available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timestamps Card */}
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
                <p className="font-medium">{format(panel.createdAt, 'PPP')}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{format(panel.updatedAt, 'PPP')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <EditSolarPanelDialog
        panel={panel}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Solar Panel</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the {panel.brand} {panel.model}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction >
              <Button variant="destructive" >
                <Link href="/admin/solar-panels">Delete Panel</Link>
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
