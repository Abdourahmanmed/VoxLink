"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Repartition = {
    id: string;
    Nom: string;
    Telephone: number;
    Adresse: string;
    Nombre_colis: string;
    Poids: string;
    Frais_Postaux: string;
    Frais_Douane: string;
    Date_affectation:string;
    qualification:string;
    Commentaire:string;
    Compagne:string;
};

export const RepartitionColumns: ColumnDef<Repartition>[] = [
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
        accessorKey: "Adresse",
        header: "Adresse",
    },
    {
        accessorKey: "Nombre_colis",
        header: "Nombre colis ",
    },
    {
        accessorKey: "Poids",
        header: "Poids ",
    },
    {
        accessorKey: "Frais_Postaux",
        header: "Frais postaux ",
    },
    {
        accessorKey: "Frais_Douane",
        header: "Frais Douane",
    },
    {
        accessorKey: "Date_affectation",
        header: "Date affectation",
    },
    {
        accessorKey: "qualification",
        header: "Status",
    },
    {
        accessorKey: "Commentaire",
        header: "Commentaire",
    },
    {
        accessorKey: "Compagne",
        header: "Compagne",
    },
]
