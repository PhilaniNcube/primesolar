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

type SolarPanel = {
  id: string
  name: string
  wattage: number
  efficiency: number
  pricePerUnit: number
  manufacturer: string
  warranty: number
  status: "active" | "inactive"
}

const initialPanels: SolarPanel[] = [
  {
    id: "1",
    name: "Standard Efficiency",
    wattage: 400,
    efficiency: 20.5,
    pricePerUnit: 3500,
    manufacturer: "Canadian Solar",
    warranty: 25,
    status: "active",
  },
  {
    id: "2",
    name: "High Efficiency",
    wattage: 450,
    efficiency: 22.0,
    pricePerUnit: 4200,
    manufacturer: "JA Solar",
    warranty: 25,
    status: "active",
  },
  {
    id: "3",
    name: "Premium",
    wattage: 550,
    efficiency: 23.5,
    pricePerUnit: 5500,
    manufacturer: "SunPower",
    warranty: 30,
    status: "active",
  },
  {
    id: "4",
    name: "Budget Option",
    wattage: 350,
    efficiency: 18.5,
    pricePerUnit: 2800,
    manufacturer: "Jinko Solar",
    warranty: 20,
    status: "inactive",
  },
]

export function SolarPanelsClient() {
  const [panels, setPanels] = useState<SolarPanel[]>(initialPanels)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPanel, setNewPanel] = useState<Partial<SolarPanel>>({
    name: "",
    wattage: 400,
    efficiency: 20,
    pricePerUnit: 3500,
    manufacturer: "",
    warranty: 25,
    status: "active",
  })

  const filteredPanels = panels.filter(
    (panel) =>
      panel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      panel.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddPanel = () => {
    const panel: SolarPanel = {
      id: Date.now().toString(),
      name: newPanel.name || "",
      wattage: newPanel.wattage || 400,
      efficiency: newPanel.efficiency || 20,
      pricePerUnit: newPanel.pricePerUnit || 3500,
      manufacturer: newPanel.manufacturer || "",
      warranty: newPanel.warranty || 25,
      status: newPanel.status || "active",
    }
    setPanels([...panels, panel])
    setIsAddDialogOpen(false)
    setNewPanel({
      name: "",
      wattage: 400,
      efficiency: 20,
      pricePerUnit: 3500,
      manufacturer: "",
      warranty: 25,
      status: "active",
    })
  }

  const handleDeletePanel = (id: string) => {
    setPanels(panels.filter((panel) => panel.id !== id))
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
          <h1 className="text-3xl font-bold tracking-tight">Solar Panels</h1>
          <p className="text-muted-foreground">Manage solar panel options and pricing</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger >
            <Button>
              <Plus className="mr-2 size-4" />
              Add Panel
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Solar Panel</DialogTitle>
              <DialogDescription>Enter the details for the new solar panel option.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newPanel.name}
                  onChange={(e) => setNewPanel({ ...newPanel, name: e.target.value })}
                  placeholder="e.g., High Efficiency"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="wattage">Wattage (W)</Label>
                  <Input
                    id="wattage"
                    type="number"
                    value={newPanel.wattage}
                    onChange={(e) =>
                      setNewPanel({
                        ...newPanel,
                        wattage: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="efficiency">Efficiency (%)</Label>
                  <Input
                    id="efficiency"
                    type="number"
                    step="0.1"
                    value={newPanel.efficiency}
                    onChange={(e) =>
                      setNewPanel({
                        ...newPanel,
                        efficiency: Number.parseFloat(e.target.value),
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
                    value={newPanel.pricePerUnit}
                    onChange={(e) =>
                      setNewPanel({
                        ...newPanel,
                        pricePerUnit: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="warranty">Warranty (years)</Label>
                  <Input
                    id="warranty"
                    type="number"
                    value={newPanel.warranty}
                    onChange={(e) =>
                      setNewPanel({
                        ...newPanel,
                        warranty: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={newPanel.manufacturer}
                  onChange={(e) => setNewPanel({ ...newPanel, manufacturer: e.target.value })}
                  placeholder="e.g., Canadian Solar"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPanel}>Add Panel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Panel Inventory</CardTitle>
          <CardDescription>{panels.length} panel options configured</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search panels..."
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
                  <TableHead className="text-right">Wattage</TableHead>
                  <TableHead className="text-right">Efficiency</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Warranty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPanels.map((panel) => (
                  <TableRow key={panel.id}>
                    <TableCell className="font-medium">{panel.name}</TableCell>
                    <TableCell>{panel.manufacturer}</TableCell>
                    <TableCell className="text-right">{panel.wattage}W</TableCell>
                    <TableCell className="text-right">{panel.efficiency}%</TableCell>
                    <TableCell className="text-right">{formatCurrency(panel.pricePerUnit)}</TableCell>
                    <TableCell className="text-right">{panel.warranty} yrs</TableCell>
                    <TableCell>
                      <Badge variant={panel.status === "active" ? "default" : "secondary"}>{panel.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeletePanel(panel.id)}>
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
