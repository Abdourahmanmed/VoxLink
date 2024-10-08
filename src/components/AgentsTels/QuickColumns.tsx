"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"



// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type QuickLivraison = {
    id: string
    Nom: string
    Telephone: number
    Arecuperation: string
    Adresse_livraison: string
    Nombre_de_Voyages: string
    Description_du_Contenu: string
    Date: string
}

export const Quickcolumns: ColumnDef<QuickLivraison>[] = [
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
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nom
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "Telephone",
        header: "Telephone",
    },
    {
        accessorKey: "Arecuperation",
        header: "Adresse de recuperation",
    },
    {
        accessorKey: "Adresse_livraison",
        header: "Adresse de Livraison",
    },
    {
        accessorKey: "Description_du_Contenu",
        header: "Description du Contenu",
    },
    {
        accessorKey: "Nombre_de_Voyages",
        header: "Nombre de Voyages",
    },
    {
        accessorKey: "Date_livraison",
        header: "Date",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex gap-2">
                {/* Add other action buttons if needed */}
                ...
            </div>
        ),
    },
]
