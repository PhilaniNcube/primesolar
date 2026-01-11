"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createSolarPanel } from "@/dal/mutations/solar-panels";
import { toast } from "sonner";

interface FormData {
  brand: string;
  model: string;
  wattage: number;
  efficiency: number;
  dimensionsLengthMm: number;
  dimensionsWidthMm: number;
  pricePerUnit: number;
  imageUrl: string;
}

export function AddSolarPanelDialog() {
  const [state, formAction, isPending] = useActionState(createSolarPanel, null);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<FormData>({
    defaultValues: {
      brand: "",
      model: "",
      wattage: 400,
      efficiency: 20,
      dimensionsLengthMm: 1700,
      dimensionsWidthMm: 1000,
      pricePerUnit: 3500,
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (state?.success) {
      toast.success("Solar panel added successfully");
      reset();
      // Close dialog after a short delay to allow toast to be shown
      const timer = setTimeout(() => setOpen(false), 100);
      return () => clearTimeout(timer);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, reset]);

  const onSubmit = handleSubmit((data) => {
    // Client-side validation
    if (!data.brand.trim()) {
      setError("brand", { message: "Brand is required" });
      return;
    }
    if (!data.model.trim()) {
      setError("model", { message: "Model is required" });
      return;
    }
    if (data.wattage <= 0) {
      setError("wattage", { message: "Wattage must be positive" });
      return;
    }
    if (data.efficiency <= 0) {
      setError("efficiency", { message: "Efficiency must be positive" });
      return;
    }
    if (data.dimensionsLengthMm <= 0) {
      setError("dimensionsLengthMm", { message: "Length must be positive" });
      return;
    }
    if (data.dimensionsWidthMm <= 0) {
      setError("dimensionsWidthMm", { message: "Width must be positive" });
      return;
    }
    if (data.pricePerUnit <= 0) {
      setError("pricePerUnit", { message: "Price must be positive" });
      return;
    }
    if (data.imageUrl && data.imageUrl.trim()) {
      try {
        new URL(data.imageUrl);
      } catch {
        setError("imageUrl", { message: "Invalid URL" });
        return;
      }
    }

    const formData = new FormData();
    formData.append("brand", data.brand);
    formData.append("model", data.model);
    formData.append("wattage", data.wattage.toString());
    formData.append("efficiency", data.efficiency.toString());
    formData.append("dimensionsLengthMm", data.dimensionsLengthMm.toString());
    formData.append("dimensionsWidthMm", data.dimensionsWidthMm.toString());
    formData.append("pricePerUnit", data.pricePerUnit.toString());
    if (data.imageUrl) {
      formData.append("imageUrl", data.imageUrl);
    }
    startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>
          <Plus className="mr-2 size-4" />
          Add Panel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Solar Panel</DialogTitle>
          <DialogDescription>
            Enter the details for the new solar panel option.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                {...register("brand")}
                placeholder="e.g., Canadian Solar"
              />
              {errors.brand && (
                <p className="text-sm text-destructive">{errors.brand.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                {...register("model")}
                placeholder="e.g., HiKu6 Mono PERC"
              />
              {errors.model && (
                <p className="text-sm text-destructive">{errors.model.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="wattage">Wattage (W)</Label>
                <Input
                  id="wattage"
                  type="number"
                  {...register("wattage", { valueAsNumber: true })}
                />
                {errors.wattage && (
                  <p className="text-sm text-destructive">{errors.wattage.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="efficiency">Efficiency (%)</Label>
                <Input
                  id="efficiency"
                  type="number"
                  step="0.1"
                  {...register("efficiency", { valueAsNumber: true })}
                />
                {errors.efficiency && (
                  <p className="text-sm text-destructive">{errors.efficiency.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dimensionsLengthMm">Length (mm)</Label>
                <Input
                  id="dimensionsLengthMm"
                  type="number"
                  {...register("dimensionsLengthMm", { valueAsNumber: true })}
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
                  {...register("dimensionsWidthMm", { valueAsNumber: true })}
                />
                {errors.dimensionsWidthMm && (
                  <p className="text-sm text-destructive">{errors.dimensionsWidthMm.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pricePerUnit">Price per Unit (ZAR)</Label>
              <Input
                id="pricePerUnit"
                type="number"
                {...register("pricePerUnit", { valueAsNumber: true })}
              />
              {errors.pricePerUnit && (
                <p className="text-sm text-destructive">{errors.pricePerUnit.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL (optional)</Label>
              <Input
                id="imageUrl"
                {...register("imageUrl")}
                placeholder="https://example.com/image.jpg"
              />
              {errors.imageUrl && (
                <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Panel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
