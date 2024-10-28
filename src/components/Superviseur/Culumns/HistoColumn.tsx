"use client";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type HistoData = {
    id: string;
    Nom: string;
    Telephone: string;
    Provenance: string;
    Date_Enregistrement	: string;
    Nombre_colis: string;
    Poids: string;
    Frais_Postaux: string;
    Reference: string;
    date_suppression: string;
    Agents:string;
};

export const HistoColumns: ColumnDef<HistoData>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "Nom",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Nom
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "Telephone",
        header: "Telephone",
    },
    {
        accessorKey: "Provenance",
        header: "Provenance",
    },
    {
        accessorKey: "Date_Enregistrement",
        header: "Date Enregistrement",
    },
    {
        accessorKey: "Nombre_colis",
        header: "Nombre colis",
    },
    {
        accessorKey: "Poids",
        header: "Poids",
    },
    {
        accessorKey: "Frais_Postaux",
        header: "Frais_Postaux",
    },
    {
        accessorKey: "Reference",
        header: "Reference",
    },
    {
        accessorKey: "date_suppression",
        header: "Date suppression",
    },
    {
        accessorKey: "Agents",
        header: "Suprimer par",
    },
    
];
