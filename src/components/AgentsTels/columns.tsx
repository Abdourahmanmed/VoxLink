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
// Type for form data
type QualificationFormData = z.infer<typeof qualificationSchema>;

// This type is used to define the shape of our data.
export type User = {
    id: string;
    Nom: string;
    Telephone: number;
    Nombre_colis:string;
    Poids:string;
    Frais_Postaux :string,
    Frais_Douane :string,
    Provenance :string,
    Script: string;
};

export const columns: ColumnDef<User>[] = [
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
                    Nom
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
        accessorKey: "Nombre_colis",
        header: "Nombre colis",
    },
    {
        accessorKey: "Poids",
        header: "Poid",
    },
    {
        accessorKey: "Provenance",
        header: "Provenance",
    },
    {
        accessorKey: "Frais_Postaux",
        header: "Frais postaux",
    },
    {
        accessorKey: "Frais_Douane",
        header: "Frais Douane",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {

            const user = row.original;
            const { onSubmit, successMessage, errorMessage,isPending } = useAppContext();
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
                            Qualifier
                        </DialogTrigger>
                        <DialogContent className="bg-blanc">
                            <DialogHeader>
                                <DialogTitle className="text-blue text-2xl mb-1 ml-[15%]">Qualification</DialogTitle>
                            </DialogHeader>
                            <DialogDescription>
                                <div className="w-full max-w-xs mx-auto">
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit((values) => onSubmit(values, user.id))}>
                                            {/* Qualifier Field */}
                                            <div className="mb-4">
                                                <FormField
                                                    control={form.control}
                                                    name="qualifier"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-blue py-4">Qualifier</FormLabel>
                                                            <FormControl>
                                                                <Select {...field} onValueChange={(value) => field.onChange(value)} disabled={isPending}>
                                                                    <SelectTrigger className="shadow border border-blue rounded-[10px] w-full py-2 px-3 text-blue leading-tight focus:outline-none focus:shadow-outline">
                                                                        <SelectValue placeholder="Sélectionner une qualification" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="indisponible">Indisponible</SelectItem>
                                                                        <SelectItem value="abouti">Abouti</SelectItem>
                                                                        <SelectItem value="repondu">Répondu</SelectItem>
                                                                        <SelectItem value="rappeller">Rappeler</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>)}
                                                />
                                            </div>
                                            {/* Commentaire */}
                                            <div className="mb-4">
                                                <FormField
                                                    control={form.control}
                                                    name="commentaire"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-blue">Commentaire</FormLabel>
                                                            <FormControl>
                                                                <textarea
                                                                    {...field}
                                                                    className="shadow border rounded-[10px] border-blue w-full py-2 px-3 text-blue mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                                                    placeholder="Commentaire"
                                                                    disabled={isPending}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>)}
                                                />
                                            </div>
                                            {/* Status Messages */}
                                            <div className="mb-4">
                                                <FormSucces message={successMessage} />
                                                <FormError message={errorMessage} />
                                            </div>

                                            {/* Submit Button */}
                                            <div className="flex items-center">
                                                <button className="bg-blue hover:bg-blue/80 text-white font-bold py-2 px-4 rounded-[10px] w-full focus:outline-none focus:shadow-outline" type="submit" disabled={isPending}>
                                                    Enregistrer
                                                </button>
                                            </div>
                                        </form>
                                    </Form>
                                </div>
                            </DialogDescription>
                        </DialogContent>
                    </Dialog>

                </div>
            );
        },
    },
];
