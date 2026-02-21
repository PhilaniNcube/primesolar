"use client"

import { startTransition, useActionState, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { z } from "zod"
import { createInverter } from "@/dal/mutations/inverters"
import { inverters as invertersTable } from "@/db/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

const inverterFormSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  type: z.enum(["microinverter", "string", "hybrid"]),
  maxInputVoltage: z.number().int().positive("Max input voltage must be positive"),
  efficiency: z.number().positive("Efficiency must be positive"),
  pricePerUnit: z.number().int().positive("Price must be positive"),
})

type InverterFormValues = z.infer<typeof inverterFormSchema>

type Inverter = typeof invertersTable.$inferSelect

type AddInverterDialogProps = {
  onInverterAdded: (inverter: Inverter) => void
}

export function AddInverterDialog({ onInverterAdded }: AddInverterDialogProps) {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(createInverter, null)
  const handledStateRef = useRef(state)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<InverterFormValues>({
    resolver: zodResolver(inverterFormSchema),
    defaultValues: {
      brand: "",
      model: "",
      type: "hybrid",
      maxInputVoltage: 600,
      efficiency: 97.5,
      pricePerUnit: 15000,
    },
  })

  useEffect(() => {
    if (state === handledStateRef.current) return
    handledStateRef.current = state
    if (state?.success && state.data) {
      toast.success("Inverter added successfully")
      onInverterAdded(state.data as Inverter)
      reset()
      const timer = setTimeout(() => setOpen(false), 100)
      return () => clearTimeout(timer)
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state, reset, onInverterAdded])

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData()
    formData.append("brand", data.brand)
    formData.append("model", data.model)
    formData.append("type", data.type)
    formData.append("maxInputVoltage", String(data.maxInputVoltage))
    formData.append("efficiency", String(data.efficiency))
    formData.append("pricePerUnit", String(data.pricePerUnit))
    startTransition(() => {
      formAction(formData)
    })
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 size-4" />
        Add Inverter
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Inverter</DialogTitle>
          <DialogDescription>Enter the details for the new inverter.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <FieldGroup className="py-4">
            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!errors.brand}>
                <FieldLabel htmlFor="brand">Brand</FieldLabel>
                <Input id="brand" {...register("brand")} placeholder="e.g., Fronius" />
                <FieldError errors={errors.brand ? [errors.brand] : undefined} />
              </Field>
              <Field data-invalid={!!errors.model}>
                <FieldLabel htmlFor="model">Model</FieldLabel>
                <Input id="model" {...register("model")} placeholder="e.g., Symo 10.0-3-M" />
                <FieldError errors={errors.model ? [errors.model] : undefined} />
              </Field>
            </div>

            <Field data-invalid={!!errors.type}>
              <FieldLabel htmlFor="type">Type</FieldLabel>
              <Select
                defaultValue="hybrid"
                onValueChange={(val) =>
                  setValue("type", val as "microinverter" | "string" | "hybrid")
                }
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="microinverter">Microinverter</SelectItem>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={errors.type ? [errors.type] : undefined} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!errors.maxInputVoltage}>
                <FieldLabel htmlFor="maxInputVoltage">Max Input Voltage (V)</FieldLabel>
                <Input
                  id="maxInputVoltage"
                  type="number"
                  {...register("maxInputVoltage", { valueAsNumber: true })}
                />
                <FieldError
                  errors={errors.maxInputVoltage ? [errors.maxInputVoltage] : undefined}
                />
              </Field>
              <Field data-invalid={!!errors.efficiency}>
                <FieldLabel htmlFor="efficiency">Efficiency (%)</FieldLabel>
                <Input
                  id="efficiency"
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  {...register("efficiency", { valueAsNumber: true })}
                />
                <FieldError
                  errors={errors.efficiency ? [errors.efficiency] : undefined}
                />
              </Field>
            </div>

            <Field data-invalid={!!errors.pricePerUnit}>
              <FieldLabel htmlFor="pricePerUnit">Price per Unit (cents)</FieldLabel>
              <Input
                id="pricePerUnit"
                type="number"
                {...register("pricePerUnit", { valueAsNumber: true })}
              />
              <FieldError
                errors={errors.pricePerUnit ? [errors.pricePerUnit] : undefined}
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Inverter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
