"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormSucces } from "../FormSucces";
import { FormError } from "../FormError";
import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { qualificationSchema } from "@/Schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useAppContext } from "../context/AppContext";
import EnqueteSatisfaction from "./EnqueteSatisfaction";


// This type is used to define the shape of our data.
export type User = {
    id: string;
    Nom: string;
    Telephone: number;
    Nombre_colis: string;
    localite: string;
    region: string;
    commande: string;
    Poids: string;
    Bp: string;
    Frais_Postaux: string,
    Frais_Douane: string,
    Provenance: string,
    Reference: string,
    Adresse: string,
    Date_Abonnement: string,
    Date_Enregistrement: string,
    Script: string;
};

export const MassDeleguercolumns: ColumnDef<User>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Deleguer
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "Telephone",
        header: "Telephone",
    },
    {
        accessorKey: "localite",
        header: "localité",
    },
    {
        accessorKey: "region",
        header: "Region",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {

            const user = row.original;
            const { onSubmit, successMessage, errorMessage, isPending } = useAppContext();
            const form = useForm<z.infer<typeof qualificationSchema>>({
                resolver: zodResolver(qualificationSchema),
                defaultValues: {
                    qualifier: '',
                    commentaire: ''
                },
            });


            return (
                <div className="flex gap-2">
                    <Dialog>
                        <DialogTrigger className="w-full bg-blue text-blanc hover:bg-blue/90 hover:text-blanc duration-500 rounded-lg p-1">
                            Mass deleguer
                        </DialogTrigger>
                        <DialogContent className="bg-blanc max-w-[900px] ">
                            <DialogHeader>
                                <DialogTitle className="text-blue text-2xl mb-1 ml-[15%]">Mass delguer</DialogTitle>
                            </DialogHeader>
                            <DialogDescription className="w-full">
                                <div className="w-full mx-auto">
                                   en developpement
                                </div>
                            </DialogDescription>
                        </DialogContent>
                    </Dialog>

                </div>
            );
        },
    },
];
