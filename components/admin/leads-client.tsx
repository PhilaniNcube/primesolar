"use client"

import { useState } from "react"
import { Search, Filter, Download, Mail, Phone, MapPin, Calendar, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

type Lead = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  status: "new" | "contacted" | "qualified" | "converted" | "lost"
  estimatedSystemSize: number
  estimatedCost: number
  monthlyBill: number
  createdAt: string
  source: string
}

const initialLeads: Lead[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+27 82 123 4567",
    address: "12 Main Road",
    city: "Cape Town",
    status: "new",
    estimatedSystemSize: 8.5,
    estimatedCost: 185000,
    monthlyBill: 2500,
    createdAt: "2024-01-15T10:30:00",
    source: "Website",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+27 83 234 5678",
    address: "45 Oak Avenue",
    city: "Johannesburg",
    status: "contacted",
    estimatedSystemSize: 12.0,
    estimatedCost: 245000,
    monthlyBill: 3500,
    createdAt: "2024-01-14T14:20:00",
    source: "Referral",
  },
  {
    id: "3",
    name: "Mike Peters",
    email: "mike.peters@example.com",
    phone: "+27 84 345 6789",
    address: "78 Beach Road",
    city: "Durban",
    status: "qualified",
    estimatedSystemSize: 6.0,
    estimatedCost: 142000,
    monthlyBill: 1800,
    createdAt: "2024-01-13T09:15:00",
    source: "Google Ads",
  },
  {
    id: "4",
    name: "Lisa Brown",
    email: "lisa.brown@example.com",
    phone: "+27 85 456 7890",
    address: "23 Hill Street",
    city: "Pretoria",
    status: "converted",
    estimatedSystemSize: 10.0,
    estimatedCost: 210000,
    monthlyBill: 2800,
    createdAt: "2024-01-12T16:45:00",
    source: "Website",
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.w@example.com",
    phone: "+27 86 567 8901",
    address: "56 Valley Road",
    city: "Port Elizabeth",
    status: "lost",
    estimatedSystemSize: 5.0,
    estimatedCost: 125000,
    monthlyBill: 1500,
    createdAt: "2024-01-11T11:00:00",
    source: "Facebook",
  },
]

const statusColors: Record<Lead["status"], "default" | "secondary" | "destructive" | "outline"> = {
  new: "default",
  contacted: "secondary",
  qualified: "default",
  converted: "default",
  lost: "destructive",
}

export function LeadsClient() {
  const [leads] = useState<Lead[]>(initialLeads)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const leadCounts = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    qualified: leads.filter((l) => l.status === "qualified").length,
    converted: leads.filter((l) => l.status === "converted").length,
    lost: leads.filter((l) => l.status === "lost").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">Manage and track customer inquiries</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 size-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Leads</CardDescription>
            <CardTitle className="text-2xl">{leadCounts.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>New</CardDescription>
            <CardTitle className="text-2xl text-blue-500">{leadCounts.new}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Contacted</CardDescription>
            <CardTitle className="text-2xl text-yellow-500">{leadCounts.contacted}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Qualified</CardDescription>
            <CardTitle className="text-2xl text-primary">{leadCounts.qualified}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Converted</CardDescription>
            <CardTitle className="text-2xl text-green-500">{leadCounts.converted}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Leads</CardTitle>
          <CardDescription>{filteredLeads.length} leads found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value ?? "all")}>
              <SelectTrigger className="w-full sm:w-45">
                <Filter className="mr-2 size-4" />
                <SelectValue  />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">System Size</TableHead>
                  <TableHead className="text-right">Est. Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="flex items-center gap-1">
                          <Mail className="size-3 text-muted-foreground" />
                          {lead.email}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="size-3" />
                          {lead.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3 text-muted-foreground" />
                        {lead.city}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{lead.estimatedSystemSize} kW</TableCell>
                    <TableCell className="text-right">{formatCurrency(lead.estimatedCost)}</TableCell>
                    <TableCell>
                      <Badge variant={statusColors[lead.status]}>{lead.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="size-3" />
                        {formatDate(lead.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedLead(lead)}>
                        <Eye className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>Full information for this lead</DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="mb-2 text-sm font-medium text-muted-foreground">Contact Information</h4>
                  <div className="space-y-2">
                    <p className="font-medium">{selectedLead.name}</p>
                    <p className="flex items-center gap-2 text-sm">
                      <Mail className="size-4 text-muted-foreground" />
                      {selectedLead.email}
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <Phone className="size-4 text-muted-foreground" />
                      {selectedLead.phone}
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <MapPin className="size-4 text-muted-foreground" />
                      {selectedLead.address}, {selectedLead.city}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium text-muted-foreground">System Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">System Size</span>
                      <span className="font-medium">{selectedLead.estimatedSystemSize} kW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Cost</span>
                      <span className="font-medium">{formatCurrency(selectedLead.estimatedCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Bill</span>
                      <span className="font-medium">{formatCurrency(selectedLead.monthlyBill)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Source</p>
                  <p className="font-medium">{selectedLead.source}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{formatDate(selectedLead.createdAt)}</p>
                </div>
                <Badge variant={statusColors[selectedLead.status]} className="text-sm">
                  {selectedLead.status}
                </Badge>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Mail className="mr-2 size-4" />
                  Send Email
                </Button>
                <Button>
                  <Phone className="mr-2 size-4" />
                  Call Lead
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
