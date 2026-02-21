"use client";

import { useCallback, useState } from "react";
import { Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { batteries as batteriesTable } from "@/db/schema";
import { AddBatteryDialog } from "@/components/admin/add-battery-dialog";
import Link from "next/link";

type Battery = typeof batteriesTable.$inferSelect;

type BatteriesClientProps = {
  initialBatteries: Battery[];
};

export function BatteriesClient({ initialBatteries }: BatteriesClientProps) {
  const [batteries, setBatteries] = useState<Battery[]>(initialBatteries);
  const [searchQuery, setSearchQuery] = useState("");

  const handleBatteryAdded = useCallback((battery: Battery) => {
    setBatteries((prev) => [...prev, battery]);
  }, []);

  const filteredBatteries = batteries.filter(
    (battery) =>
      battery.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      battery.model.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDeleteBattery = (id: string) => {
    setBatteries(batteries.filter((battery) => battery.id !== id));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Batteries</h1>
          <p className="text-muted-foreground">
            Manage battery options and pricing
          </p>
        </div>
        <AddBatteryDialog onBatteryAdded={handleBatteryAdded} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Battery Inventory</CardTitle>
          <CardDescription>
            {batteries.length} battery options configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search batteries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead className="text-right">Capacity (kWh)</TableHead>
                  <TableHead className="text-right">Max Power (kW)</TableHead>
                  <TableHead className="text-right">Weight (kg)</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBatteries.map((battery) => (
                  <TableRow key={battery.id}>
                    <TableCell className="font-medium">
                      {battery.brand}
                    </TableCell>
                    <TableCell>{battery.model}</TableCell>
                    <TableCell className="text-right">
                      {battery.capacityKwh} kWh
                    </TableCell>
                    <TableCell className="text-right">
                      {battery.maxContinuousPowerKw} kW
                    </TableCell>
                    <TableCell className="text-right">
                      {battery.weightKg} kg
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(battery.pricePerUnit)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/admin/batteries/${battery.id}`}
                        className="flex justify-end gap-2"
                      >
                        <Button variant="ghost" size="icon">
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteBattery(battery.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
