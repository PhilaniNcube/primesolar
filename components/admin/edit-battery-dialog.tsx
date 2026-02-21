"use client"

import { useActionState, useTransition, useEffect } from "react"
import { useForm } from "react-hook-form"
import { updateBattery } from "@/dal/mutations/batteries"
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

type EditBatteryFormData = {
  id: string
  brand: string
  model: string
  capacityKwh: number
  maxContinuousPowerKw: number
  weightKg: number
  pricePerUnit: number
}

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

type EditBatteryDialogProps = {
  battery: Battery
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditBatteryDialog({ battery, open, onOpenChange }: EditBatteryDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [state, formAction] = useActionState(updateBattery, { success: false })

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<EditBatteryFormData>({
    defaultValues: {
      id: battery.id,
      brand: battery.brand,
      model: battery.model,
      capacityKwh: battery.capacityKwh,
      maxContinuousPowerKw: battery.maxContinuousPowerKw,
      weightKg: battery.weightKg,
      pricePerUnit: battery.pricePerUnit,
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        id: battery.id,
        brand: battery.brand,
        model: battery.model,
        capacityKwh: battery.capacityKwh,
        maxContinuousPowerKw: battery.maxContinuousPowerKw,
        weightKg: battery.weightKg,
        pricePerUnit: battery.pricePerUnit,
      })
    }
  }, [battery, open, reset])

  useEffect(() => {
    if (state.success) {
      toast.success("Battery updated successfully!")
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
      formData.append("capacityKwh", data.capacityKwh.toString())
      formData.append("maxContinuousPowerKw", data.maxContinuousPowerKw.toString())
      formData.append("weightKg", data.weightKg.toString())
      formData.append("pricePerUnit", data.pricePerUnit.toString())
      formAction(formData)
    })
  })

  const watchedPrice = watch("pricePerUnit")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Battery</DialogTitle>
          <DialogDescription>Update the battery details below.</DialogDescription>
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
                <Label htmlFor="capacityKwh">Capacity (kWh)</Label>
                <Input
                  id="capacityKwh"
                  type="number"
                  step="0.01"
                  {...register("capacityKwh", {
                    required: "Capacity is required",
                    valueAsNumber: true,
                    min: { value: 0.01, message: "Capacity must be positive" },
                  })}
                  disabled={isPending}
                />
                {errors.capacityKwh && (
                  <p className="text-sm text-destructive">{errors.capacityKwh.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maxContinuousPowerKw">Max Power (kW)</Label>
                <Input
                  id="maxContinuousPowerKw"
                  type="number"
                  step="0.01"
                  {...register("maxContinuousPowerKw", {
                    required: "Max power is required",
                    valueAsNumber: true,
                    min: { value: 0.01, message: "Max power must be positive" },
                  })}
                  disabled={isPending}
                />
                {errors.maxContinuousPowerKw && (
                  <p className="text-sm text-destructive">{errors.maxContinuousPowerKw.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="weightKg">Weight (kg)</Label>
                <Input
                  id="weightKg"
                  type="number"
                  step="0.01"
                  {...register("weightKg", {
                    required: "Weight is required",
                    valueAsNumber: true,
                    min: { value: 0.01, message: "Weight must be positive" },
                  })}
                  disabled={isPending}
                />
                {errors.weightKg && (
                  <p className="text-sm text-destructive">{errors.weightKg.message}</p>
                )}
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
                {errors.pricePerUnit && (
                  <p className="text-sm text-destructive">{errors.pricePerUnit.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Display price: {formatCurrency(watchedPrice || 0)}
                </p>
              </div>
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
