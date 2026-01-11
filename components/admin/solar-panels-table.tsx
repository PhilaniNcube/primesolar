"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { useState } from "react";
import Link from "next/link";
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
import { useQueryState } from "nuqs";

type SolarPanel = {
  id: string;
  brand: string;
  model: string;
  wattage: number;
  efficiency: number;
  pricePerUnit: number;
  dimensionsLengthMm: number;
  dimensionsWidthMm: number;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

interface SolarPanelsTableProps {
  panels: SolarPanel[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const handleDeletePanel = (id: string) => {
  // TODO: Implement delete functionality with server action
  console.log("Delete panel:", id);
};

export function SolarPanelsTable({ panels }: SolarPanelsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchQuery, setSearchQuery] = useQueryState("search", {
    defaultValue: "",
  });

  const columns: ColumnDef<SolarPanel>[] = [
    {
      accessorKey: "model",
      header: "Model",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("model")}</div>
      ),
    },
    {
      accessorKey: "brand",
      header: "Brand",
    },
    {
      accessorKey: "wattage",
      header: "Wattage",
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("wattage")}W</div>
      ),
    },
    {
      accessorKey: "efficiency",
      header: "Efficiency",
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("efficiency")}%</div>
      ),
    },
    {
      accessorKey: "pricePerUnit",
      header: "Price",
      cell: ({ row }) => (
        <div className="text-left">
          {formatCurrency(row.getValue("pricePerUnit"))}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const panel = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Link href={`/admin/solar-panels/${panel.id}`}>
              <Button variant="ghost" size="icon">
                <Pencil className="size-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeletePanel(panel.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: panels,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
      globalFilter: searchQuery,
    },
    onGlobalFilterChange: setSearchQuery,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Panel Inventory</CardTitle>
        <CardDescription>
          {panels.length} panel options configured
        </CardDescription>
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
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
