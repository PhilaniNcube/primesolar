"use client"

import { useActionState, useTransition, useEffect } from "react"
import { useForm } from "react-hook-form"
import { updateInverter } from "@/dal/mutations/inverters"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/currency"
import { toast } from "sonner"

type EditInverterFormData = {
  id: string
  brand: string
  model: string
  type: "microinverter" | "string" | "hybrid"
  maxInputVoltage: number
  efficiency: number
  pricePerUnit: number
}

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

type EditInverterDialogProps = {
  inverter: Inverter
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditInverterDialog({ inverter, open, onOpenChange }: EditInverterDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [state, formAction] = useActionState(updateInverter, { success: false })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EditInverterFormData>({
    defaultValues: {
      id: inverter.id,
      brand: inverter.brand,
      model: inverter.model,
      type: inverter.type as "microinverter" | "string" | "hybrid",
      maxInputVoltage: inverter.maxInputVoltage,
      efficiency: inverter.efficiency,
      pricePerUnit: inverter.pricePerUnit,
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        id: inverter.id,
        brand: inverter.brand,
        model: inverter.model,
        type: inverter.type as "microinverter" | "string" | "hybrid",
        maxInputVoltage: inverter.maxInputVoltage,
        efficiency: inverter.efficiency,
        pricePerUnit: inverter.pricePerUnit,
      })
    }
  }, [inverter, open, reset])

  useEffect(() => {
    if (state.success) {
      toast.success("Inverter updated successfully!")
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
      formData.append("type", data.type)
      formData.append("maxInputVoltage", data.maxInputVoltage.toString())
      formData.append("efficiency", data.efficiency.toString())
      formData.append("pricePerUnit", data.pricePerUnit.toString())
      formAction(formData)
    })
  })

  const watchedPrice = watch("pricePerUnit")
  const watchedType = watch("type")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Inverter</DialogTitle>
          <DialogDescription>Update the inverter details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  {...register("brand", { required: "Brand is required" })}
                  disabled={isPending}
                />
                {errors.brand && <p className="text-sm text-destructive">{errors.brand.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  {...register("model", { required: "Model is required" })}
                  disabled={isPending}
                />
                {errors.model && <p className="text-sm text-destructive">{errors.model.message}</p>}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={watchedType}
                onValueChange={(val) =>
                  setValue("type", val as "microinverter" | "string" | "hybrid")
                }
                disabled={isPending}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="microinverter">Microinverter</SelectItem>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="maxInputVoltage">Max Input Voltage (V)</Label>
                <Input
                  id="maxInputVoltage"
                  type="number"
                  {...register("maxInputVoltage", {
                    required: "Max input voltage is required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Must be positive" },
                  })}
                  disabled={isPending}
                />
                {errors.maxInputVoltage && (
                  <p className="text-sm text-destructive">{errors.maxInputVoltage.message}</p>
                )}
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
                    min: { value: 0.1, message: "Must be positive" },
                  })}
                  disabled={isPending}
                />
                {errors.efficiency && (
                  <p className="text-sm text-destructive">{errors.efficiency.message}</p>
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
              {errors.pricePerUnit && (
                <p className="text-sm text-destructive">{errors.pricePerUnit.message}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Display price: {formatCurrency(watchedPrice || 0)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
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
