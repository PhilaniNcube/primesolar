"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { z } from "zod";
import { createBattery } from "@/dal/mutations/batteries";
import { batteries as batteriesTable } from "@/db/schema";

const batteryFormSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  capacityKwh: z.number().positive("Capacity must be positive"),
  maxContinuousPowerKw: z.number().positive("Max power must be positive"),
  weightKg: z.number().positive("Weight must be positive"),
  pricePerUnit: z.number().int().positive("Price must be positive"),
});

type BatteryFormValues = z.infer<typeof batteryFormSchema>;
import { toast } from "sonner";

type Battery = typeof batteriesTable.$inferSelect;

type AddBatteryDialogProps = {
  onBatteryAdded: (battery: Battery) => void;
};

export function AddBatteryDialog({ onBatteryAdded }: AddBatteryDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createBattery, null);
  const handledStateRef = useRef(state);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BatteryFormValues>({
    resolver: zodResolver(batteryFormSchema),
    defaultValues: {
      brand: "",
      model: "",
      capacityKwh: 5.12,
      maxContinuousPowerKw: 5,
      weightKg: 0,
      pricePerUnit: 42000,
    },
  });

  useEffect(() => {
    if (state === handledStateRef.current) return;
    handledStateRef.current = state;
    if (state?.success && state.data) {
      toast.success("Battery added successfully");
      onBatteryAdded(state.data as Battery);
      reset();
      const timer = setTimeout(() => setOpen(false), 100);
      return () => clearTimeout(timer);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, reset, onBatteryAdded]);

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    formData.append("brand", data.brand);
    formData.append("model", data.model);
    formData.append("capacityKwh", String(data.capacityKwh));
    formData.append("maxContinuousPowerKw", String(data.maxContinuousPowerKw));
    formData.append("weightKg", String(data.weightKg));
    formData.append("pricePerUnit", String(data.pricePerUnit));
    startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 size-4" />
        Add Battery
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Battery</DialogTitle>
          <DialogDescription>
            Enter the details for the new battery option.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <FieldGroup className="py-4">
            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!errors.brand}>
                <FieldLabel htmlFor="brand">Brand</FieldLabel>
                <Input
                  id="brand"
                  {...register("brand")}
                  placeholder="e.g., Pylontech"
                />
                <FieldError errors={errors.brand ? [errors.brand] : undefined} />
              </Field>

              <Field data-invalid={!!errors.model}>
                <FieldLabel htmlFor="model">Model</FieldLabel>
                <Input
                  id="model"
                  {...register("model")}
                  placeholder="e.g., US5000"
                />
                <FieldError errors={errors.model ? [errors.model] : undefined} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!errors.capacityKwh}>
                <FieldLabel htmlFor="capacityKwh">Capacity (kWh)</FieldLabel>
                <Input
                  id="capacityKwh"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  {...register("capacityKwh", { valueAsNumber: true })}
                />
                <FieldError
                  errors={errors.capacityKwh ? [errors.capacityKwh] : undefined}
                />
              </Field>

              <Field data-invalid={!!errors.maxContinuousPowerKw}>
                <FieldLabel htmlFor="maxContinuousPowerKw">
                  Max Power (kW)
                </FieldLabel>
                <Input
                  id="maxContinuousPowerKw"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  {...register("maxContinuousPowerKw", { valueAsNumber: true })}
                />
                <FieldError
                  errors={
                    errors.maxContinuousPowerKw
                      ? [errors.maxContinuousPowerKw]
                      : undefined
                  }
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!errors.weightKg}>
                <FieldLabel htmlFor="weightKg">Weight (kg)</FieldLabel>
                <Input
                  id="weightKg"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  {...register("weightKg", { valueAsNumber: true })}
                />
                <FieldError
                  errors={errors.weightKg ? [errors.weightKg] : undefined}
                />
              </Field>

              <Field data-invalid={!!errors.pricePerUnit}>
                <FieldLabel htmlFor="pricePerUnit">
                  Price per Unit (ZAR)
                </FieldLabel>
                <Input
                  id="pricePerUnit"
                  type="number"
                  {...register("pricePerUnit", { valueAsNumber: true })}
                />
                <FieldError
                  errors={
                    errors.pricePerUnit ? [errors.pricePerUnit] : undefined
                  }
                />
              </Field>
            </div>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Battery"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
