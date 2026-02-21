"use client"

import { useCallback, useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { inverters as invertersTable } from "@/db/schema"
import { AddInverterDialog } from "@/components/admin/add-inverter-dialog"
import { formatCurrency } from "@/lib/currency"
import Link from "next/link"

type Inverter = typeof invertersTable.$inferSelect

type InvertersClientProps = {
  initialInverters: Inverter[]
}

const typeBadgeVariant: Record<string, "default" | "secondary" | "outline"> = {
  hybrid: "default",
  string: "secondary",
  microinverter: "outline",
}

export function InvertersClient({ initialInverters }: InvertersClientProps) {
  const [inverters, setInverters] = useState<Inverter[]>(initialInverters)
  const [searchQuery, setSearchQuery] = useState("")

  const handleInverterAdded = useCallback((inverter: Inverter) => {
    setInverters((prev) => [...prev, inverter])
  }, [])

  const filteredInverters = inverters.filter(
    (inverter) =>
      inverter.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inverter.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inverter.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inverters</h1>
          <p className="text-muted-foreground">Manage inverter options and pricing</p>
        </div>
        <AddInverterDialog onInverterAdded={handleInverterAdded} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inverter Inventory</CardTitle>
          <CardDescription>{inverters.length} inverter options configured</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search inverters..."
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
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Max Input (V)</TableHead>
                  <TableHead className="text-right">Efficiency (%)</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInverters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                      No inverters found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInverters.map((inverter) => (
                    <TableRow key={inverter.id}>
                      <TableCell className="font-medium">{inverter.brand}</TableCell>
                      <TableCell>{inverter.model}</TableCell>
                      <TableCell>
                        <Badge variant={typeBadgeVariant[inverter.type] ?? "outline"}>
                          {inverter.type.charAt(0).toUpperCase() + inverter.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{inverter.maxInputVoltage}V</TableCell>
                      <TableCell className="text-right">{inverter.efficiency}%</TableCell>
                      <TableCell className="text-right">{formatCurrency(inverter.pricePerUnit)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Link href={`/admin/inverters/${inverter.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
