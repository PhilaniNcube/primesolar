"use client"

import { useActionState, useTransition, useEffect } from "react"
import { useForm } from "react-hook-form"
import { updateSolarPanel } from "@/dal/mutations/solar-panels"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/currency"
import { toast } from "sonner"

type EditSolarPanelFormData = {
  id: string
  brand: string
  model: string
  wattage: number
  efficiency: number
  dimensionsLengthMm: number
  dimensionsWidthMm: number
  pricePerUnit: number
  imageUrl: string
}

type SolarPanel = {
  id: string
  brand: string
  model: string
  wattage: number
  efficiency: number
  dimensionsLengthMm: number
  dimensionsWidthMm: number
  pricePerUnit: number
  imageUrl: string | null
  createdAt: Date
  updatedAt: Date
}

type EditSolarPanelDialogProps = {
  panel: SolarPanel
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditSolarPanelDialog({ panel, open, onOpenChange }: EditSolarPanelDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [state, formAction] = useActionState(updateSolarPanel, { success: false })

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<EditSolarPanelFormData>({
    defaultValues: {
      id: panel.id,
      brand: panel.brand,
      model: panel.model,
      wattage: panel.wattage,
      efficiency: panel.efficiency,
      dimensionsLengthMm: panel.dimensionsLengthMm,
      dimensionsWidthMm: panel.dimensionsWidthMm,
      pricePerUnit: panel.pricePerUnit,
      imageUrl: panel.imageUrl || "",
    },
  })

  // Reset form when panel changes or dialog opens
  useEffect(() => {
    if (open) {
      reset({
        id: panel.id,
        brand: panel.brand,
        model: panel.model,
        wattage: panel.wattage,
        efficiency: panel.efficiency,
        dimensionsLengthMm: panel.dimensionsLengthMm,
        dimensionsWidthMm: panel.dimensionsWidthMm,
        pricePerUnit: panel.pricePerUnit,
        imageUrl: panel.imageUrl || "",
      })
    }
  }, [panel, open, reset])

  // Handle server action response
  useEffect(() => {
    if (state.success) {
      toast.success("Solar panel updated successfully!")
      onOpenChange(false)
    } else if (state.error) {
      toast.error(state.error)
    }
  }, [state, onOpenChange])

  const onSubmit = handleSubmit((data) => {
    startTransition(() => {
      const formData = new FormData()
      formData.append("id", data.id)
      formData.append("brand", data.brand)
      formData.append("model", data.model)
      formData.append("wattage", data.wattage.toString())
      formData.append("efficiency", data.efficiency.toString())
      formData.append("dimensionsLengthMm", data.dimensionsLengthMm.toString())
      formData.append("dimensionsWidthMm", data.dimensionsWidthMm.toString())
      formData.append("pricePerUnit", data.pricePerUnit.toString())
      formData.append("imageUrl", data.imageUrl || "")

      formAction(formData)
    })
  })

  const watchedPrice = watch("pricePerUnit")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Solar Panel</DialogTitle>
          <DialogDescription>Update the solar panel details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  {...register("brand", {
                    required: "Brand is required",
                    minLength: { value: 1, message: "Brand is required" },
                  })}
                  disabled={isPending}
                />
                {errors.brand && <p className="text-sm text-destructive">{errors.brand.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  {...register("model", {
                    required: "Model is required",
                    minLength: { value: 1, message: "Model is required" },
                  })}
                  disabled={isPending}
                />
                {errors.model && <p className="text-sm text-destructive">{errors.model.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="wattage">Wattage (W)</Label>
                <Input
                  id="wattage"
                  type="number"
                  {...register("wattage", {
                    required: "Wattage is required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Wattage must be positive" },
                  })}
                  disabled={isPending}
                />
                {errors.wattage && <p className="text-sm text-destructive">{errors.wattage.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="efficiency">Efficiency (%)</Label>
                <Input
                  id="efficiency"
                  type="number"
                  step="0.1"
                  {...register("efficiency", {
                    required: "Efficiency is required",
                    valueAsNumber: true,
                    min: { value: 0, message: "Efficiency must be positive" },
                  })}
                  disabled={isPending}
                />
                {errors.efficiency && <p className="text-sm text-destructive">{errors.efficiency.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dimensionsLengthMm">Length (mm)</Label>
                <Input
                  id="dimensionsLengthMm"
                  type="number"
                  {...register("dimensionsLengthMm", {
                    required: "Length is required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Length must be positive" },
                  })}
                  disabled={isPending}
                />
                {errors.dimensionsLengthMm && (
                  <p className="text-sm text-destructive">{errors.dimensionsLengthMm.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dimensionsWidthMm">Width (mm)</Label>
                <Input
                  id="dimensionsWidthMm"
                  type="number"
                  {...register("dimensionsWidthMm", {
                    required: "Width is required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Width must be positive" },
                  })}
                  disabled={isPending}
                />
                {errors.dimensionsWidthMm && (
                  <p className="text-sm text-destructive">{errors.dimensionsWidthMm.message}</p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pricePerUnit">Price per Unit (cents)</Label>
              <Input
                id="pricePerUnit"
                type="number"
                {...register("pricePerUnit", {
                  required: "Price is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Price must be positive" },
                })}
                disabled={isPending}
              />
              {errors.pricePerUnit && <p className="text-sm text-destructive">{errors.pricePerUnit.message}</p>}
              <p className="text-sm text-muted-foreground">
                Display price: {formatCurrency(watchedPrice || 0)}
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                {...register("imageUrl")}
                placeholder="https://example.com/image.jpg"
                disabled={isPending}
              />
              {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
