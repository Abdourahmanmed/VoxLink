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
export type Report = {
    id: string;
    Nom: string;
    Bp: string;
    commande: string;
    Telephone: number;
    Adresse: string;
    Nombre_colis: string;
    Poids: string;
    Frais_Postaux: string;
    Frais_Douane: string;
    Status: string;
    Commentaire: string;
    Date_appel: string;
    Date_Abonnement: string;
    Agents: string;
};

export const ReportColumns: ColumnDef<Report>[] = [
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
        accessorKey: "Bp",
        header: "Boite Postal",
    },
    {
        accessorKey: "commande",
        header: "Numero commande",
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
        accessorKey: "Qualification",
        header: "Status",
    },
    {
        accessorKey: "Commentaire",
        header: "Commentaire",
    },
    {
        accessorKey: "Date_appel",
        header: "Date D'appel",
    },
    {
        accessorKey: "Date_Abonnement",
        header: "Date D'abonnement",
    },
    {
        accessorKey: "Agents",
        header: "Agents",
    },
]
