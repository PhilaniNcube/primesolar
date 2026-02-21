"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Pencil, Trash2, Zap, Calendar, DollarSign, Percent, Bolt } from "lucide-react"
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
import { EditInverterDialog } from "./edit-inverter-dialog"

type Inverter = {
  id: string
  brand: string
  model: string
  type: string
  maxInputVoltage: number
  efficiency: number
  pricePerUnit: number
  createdAt: Date
  updatedAt: Date
}

const typeBadgeVariant: Record<string, "default" | "secondary" | "outline"> = {
  hybrid: "default",
  string: "secondary",
  microinverter: "outline",
}

export function InverterDetailClient({ inverter }: { inverter: Inverter | null }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  if (!inverter) {
    return (
      <div className="space-y-6">
        <Button variant="ghost">
          <Link href="/admin/inverters">
            <ArrowLeft className="mr-2 size-4" />
            Back to Inverters
          </Link>
        </Button>
        <Card>
          <CardContent className="flex h-64 items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Inverter Not Found</h2>
              <p className="mt-2 text-muted-foreground">The inverter could not be found.</p>
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
            <Link href="/admin/inverters">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {inverter.brand} {inverter.model}
            </h1>
            <p className="text-muted-foreground">Inverter Details</p>
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
              <Zap className="size-5 text-yellow-500" />
              Inverter Specifications
            </CardTitle>
            <CardDescription>Technical specifications and performance data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Type */}
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <div className="rounded-md bg-yellow-500/10 p-2">
                  <Zap className="size-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <Badge variant={typeBadgeVariant[inverter.type] ?? "outline"} className="mt-1 text-base">
                    {inverter.type.charAt(0).toUpperCase() + inverter.type.slice(1)}
                  </Badge>
                </div>
              </div>

              {/* Max Input Voltage */}
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <div className="rounded-md bg-blue-500/10 p-2">
                  <Bolt className="size-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Max Input Voltage</p>
                  <p className="text-2xl font-bold">{inverter.maxInputVoltage}V</p>
                </div>
              </div>

              {/* Efficiency */}
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <div className="rounded-md bg-green-500/10 p-2">
                  <Percent className="size-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Efficiency</p>
                  <p className="text-2xl font-bold">{inverter.efficiency}%</p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <div className="rounded-md bg-purple-500/10 p-2">
                  <DollarSign className="size-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price per Unit</p>
                  <p className="text-2xl font-bold">{formatCurrency(inverter.pricePerUnit)}</p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Calculated Metrics */}
            <div>
              <h3 className="mb-4 font-semibold">Calculated Metrics</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">Efficiency Rating</p>
                  <p className="text-lg font-semibold">
                    {inverter.efficiency >= 98
                      ? "Premium"
                      : inverter.efficiency >= 96
                        ? "High"
                        : "Standard"}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">Power Loss</p>
                  <p className="text-lg font-semibold">
                    {(100 - inverter.efficiency).toFixed(1)}%
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
                <p className="font-semibold">{inverter.brand}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Model</p>
                <p className="font-semibold">{inverter.model}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Inverter ID</p>
                <Badge variant="outline" className="font-mono">
                  {inverter.id}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Record History */}
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
                <p className="font-medium">{format(inverter.createdAt, "PPP")}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{format(inverter.updatedAt, "PPP")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <EditInverterDialog
        inverter={inverter}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Inverter</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the {inverter.brand} {inverter.model}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>
              <Button variant="destructive">
                <Link href="/admin/inverters">Delete Inverter</Link>
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
