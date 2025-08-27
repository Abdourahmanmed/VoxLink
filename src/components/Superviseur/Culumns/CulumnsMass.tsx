"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type MassData = {
    id: string;
    Nom: string;
    Telephone: number;
    q1_utilisation_reguliere: string;
    q2_distance: string;
    q3_frequence: string;
    q4_problemes_techniques: string;
    q5_acces_amelioration: string;
    q6_satisfaction_localisation: string;
    q7_satisfaction_general: string;
    q8_plainte_ou_demande: string;
    q9_intrants_recus: string;
    q10_retards_difficultes: string;
    q11_tous_menages_servis: string;
    q12_plainte_beneficiaires: string;
    q13_traitement_plaintes: string;
    q14_qualite_intrants: string;
    q15_information_distribution: string;
    q16_problemes_gestion: string;
    q17_recommandations: string;
    q18_suggestions_plainte: string;
    q19_satisfaction_observee: string;
    date_enregistrement: string;
    agent: string;
};

export const MassSupColumns: ColumnDef<MassData>[] = [
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
        accessorKey: "q1_utilisation_reguliere",
        header: "utilisation reguliere",
    },
    {
        accessorKey: "q2_distance",
        header: "Distance",
    },
    {
        accessorKey: "q3_frequence",
        header: "Frequence",
    },
    {
        accessorKey: "q4_problemes_techniques",
        header: "problemes techniques",
    },
    {
        accessorKey: "q5_acces_amelioration",
        header: "acces amelioration",
    },
    {
        accessorKey: "q6_satisfaction_localisation",
        header: "satisfaction localisation",
    },
    {
        accessorKey: "q7_satisfaction_general",
        header: "satisfaction general",
    },
   
    {
        accessorKey: "q8_plainte_ou_demande",
        header: "plainte ou demande",
    },
    {
        accessorKey: "q9_intrants_recus",
        header: " intrants recus",
    },
    {
        accessorKey: "q10_retards_difficultes",
        header: "retards difficultes",
    },
    {
        accessorKey: "q11_tous_menages_servis",
        header: "tous menages servis",
    },
    {
        accessorKey: "q12_plainte_beneficiaires",
        header: "plainte beneficiaires",
    },
    {
        accessorKey: "q13_traitement_plaintes",
        header: "traitement plaintes",
    },
    {
        accessorKey: "q14_qualite_intrants",
        header: "qualite intrants",
    },
    {
        accessorKey: "q15_information_distribution",
        header: "information distribution",
    },
    {
        accessorKey: "q16_problemes_gestion",
        header: "problemes gestion",
    },
    {
        accessorKey: "q17_recommandations",
        header: "recommandations",
    },
    {
        accessorKey: "q18_suggestions_plainte",
        header: "suggestions plainte",
    },
    {
        accessorKey: "q19_satisfaction_observee",
        header: "satisfaction observee",
    },
    {
        accessorKey: "date_enregistrement",
        header: "date enregistrement",
    },
    {
        accessorKey: "agent",
        header: "agent",
    },
   
]
