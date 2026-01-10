"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

type Battery = {
  id: string
  name: string
  capacity: number
  voltage: number
  pricePerUnit: number
  manufacturer: string
  warranty: number
  cycles: number
  chemistry: string
  status: "active" | "inactive"
}

const initialBatteries: Battery[] = [
  {
    id: "1",
    name: "Standard LiFePO4",
    capacity: 5.12,
    voltage: 51.2,
    pricePerUnit: 42000,
    manufacturer: "Pylontech",
    warranty: 10,
    cycles: 6000,
    chemistry: "LiFePO4",
    status: "active",
  },
  {
    id: "2",
    name: "High Capacity",
    capacity: 10.24,
    voltage: 51.2,
    pricePerUnit: 78000,
    manufacturer: "Pylontech",
    warranty: 10,
    cycles: 6000,
    chemistry: "LiFePO4",
    status: "active",
  },
  {
    id: "3",
    name: "Premium Storage",
    capacity: 15.36,
    voltage: 51.2,
    pricePerUnit: 110000,
    manufacturer: "BYD",
    warranty: 12,
    cycles: 8000,
    chemistry: "LiFePO4",
    status: "active",
  },
  {
    id: "4",
    name: "Budget Option",
    capacity: 3.5,
    voltage: 48,
    pricePerUnit: 28000,
    manufacturer: "Hubble",
    warranty: 5,
    cycles: 3000,
    chemistry: "Li-ion",
    status: "inactive",
  },
]

export function BatteriesClient() {
  const [batteries, setBatteries] = useState<Battery[]>(initialBatteries)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newBattery, setNewBattery] = useState<Partial<Battery>>({
    name: "",
    capacity: 5.12,
    voltage: 51.2,
    pricePerUnit: 42000,
    manufacturer: "",
    warranty: 10,
    cycles: 6000,
    chemistry: "LiFePO4",
    status: "active",
  })

  const filteredBatteries = batteries.filter(
    (battery) =>
      battery.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      battery.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddBattery = () => {
    const battery: Battery = {
      id: Date.now().toString(),
      name: newBattery.name || "",
      capacity: newBattery.capacity || 5.12,
      voltage: newBattery.voltage || 51.2,
      pricePerUnit: newBattery.pricePerUnit || 42000,
      manufacturer: newBattery.manufacturer || "",
      warranty: newBattery.warranty || 10,
      cycles: newBattery.cycles || 6000,
      chemistry: newBattery.chemistry || "LiFePO4",
      status: newBattery.status || "active",
    }
    setBatteries([...batteries, battery])
    setIsAddDialogOpen(false)
    setNewBattery({
      name: "",
      capacity: 5.12,
      voltage: 51.2,
      pricePerUnit: 42000,
      manufacturer: "",
      warranty: 10,
      cycles: 6000,
      chemistry: "LiFePO4",
      status: "active",
    })
  }

  const handleDeleteBattery = (id: string) => {
    setBatteries(batteries.filter((battery) => battery.id !== id))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Batteries</h1>
          <p className="text-muted-foreground">Manage battery options and pricing</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger >
            <Button>
              <Plus className="mr-2 size-4" />
              Add Battery
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Battery</DialogTitle>
              <DialogDescription>Enter the details for the new battery option.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newBattery.name}
                  onChange={(e) => setNewBattery({ ...newBattery, name: e.target.value })}
                  placeholder="e.g., High Capacity"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="capacity">Capacity (kWh)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    step="0.01"
                    value={newBattery.capacity}
                    onChange={(e) =>
                      setNewBattery({
                        ...newBattery,
                        capacity: Number.parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="voltage">Voltage (V)</Label>
                  <Input
                    id="voltage"
                    type="number"
                    step="0.1"
                    value={newBattery.voltage}
                    onChange={(e) =>
                      setNewBattery({
                        ...newBattery,
                        voltage: Number.parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price per Unit (ZAR)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newBattery.pricePerUnit}
                    onChange={(e) =>
                      setNewBattery({
                        ...newBattery,
                        pricePerUnit: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cycles">Cycle Life</Label>
                  <Input
                    id="cycles"
                    type="number"
                    value={newBattery.cycles}
                    onChange={(e) =>
                      setNewBattery({
                        ...newBattery,
                        cycles: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={newBattery.manufacturer}
                    onChange={(e) => setNewBattery({ ...newBattery, manufacturer: e.target.value })}
                    placeholder="e.g., Pylontech"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="warranty">Warranty (years)</Label>
                  <Input
                    id="warranty"
                    type="number"
                    value={newBattery.warranty}
                    onChange={(e) =>
                      setNewBattery({
                        ...newBattery,
                        warranty: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBattery}>Add Battery</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Battery Inventory</CardTitle>
          <CardDescription>{batteries.length} battery options configured</CardDescription>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead className="text-right">Capacity</TableHead>
                  <TableHead className="text-right">Voltage</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Cycles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBatteries.map((battery) => (
                  <TableRow key={battery.id}>
                    <TableCell className="font-medium">{battery.name}</TableCell>
                    <TableCell>{battery.manufacturer}</TableCell>
                    <TableCell className="text-right">{battery.capacity} kWh</TableCell>
                    <TableCell className="text-right">{battery.voltage}V</TableCell>
                    <TableCell className="text-right">{formatCurrency(battery.pricePerUnit)}</TableCell>
                    <TableCell className="text-right">{battery.cycles.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={battery.status === "active" ? "default" : "secondary"}>{battery.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteBattery(battery.id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
