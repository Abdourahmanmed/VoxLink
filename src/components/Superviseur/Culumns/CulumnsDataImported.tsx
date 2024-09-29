"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Ellipsis, MoreHorizontal } from "lucide-react"

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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormError } from "@/components/FormError"
import { FormSucces } from "@/components/FormSucces"
import { CompagneSchema, ContactShema } from "@/Schemas"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { useAppContext } from "@/components/context/AppContext"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ImportedData = {
    id: string;
    Nom: string;
    Email: string;
    Telephone: number;
    Adresse: string;
};

export const ImportedColumns: ColumnDef<ImportedData>[] = [
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
        accessorKey: "Email",
        header: "Email",
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
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const contact = row.original;
            const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
            const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
            const { handleDelete, successMessage, errorMessage, setSuccessMessage, setErrorMessage, EditerContact, isPending } = useAppContext();
            const form = useForm<z.infer<typeof ContactShema>>({
                resolver: zodResolver(ContactShema),
                defaultValues: {
                    Nom: "",
                    Email: "",
                    Telephone: "",
                    Adresse: "",
                    Provenance: "",
                    Date_Enregistrement: "",
                    Nombre_colis: 0,
                    Poids: "",
                    Frais_Postaux: "",
                    Frais_Douane: "",
                    Reference: "",
                    Date_Abonnement: "",
                    Nationalite: ""
                }
            });
            //fonction pour editer les informations du compagne
            const onEditSubmit = (values: z.infer<typeof ContactShema>) => {
                EditerContact(values, contact.id);
                // setIsEditDialogOpen(false);
            };

            //fonction pour recupere les information d'un compagne par son id 
            const fetchContact = async (id: string) => {
                const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=AfficherContactClassique&id=${id}`;
                try {
                    const response = await fetch(apiUrl, {
                        method: "GET",
                    });

                    const responseData = await response.json();

                    if (!response.ok || responseData.error) {
                        setErrorMessage(responseData.error || "Network error detected.");
                    } else {
                        // Set form default values with the fetched data
                        form.setValue("Nom", responseData.Nom);
                        form.setValue("Email", responseData.Email);
                        form.setValue("Telephone", responseData.Telephone);
                        form.setValue("Adresse", responseData.Adresse);
                        form.setValue("Provenance", responseData.Provenance);
                        form.setValue("Date_Enregistrement", responseData.Date_Enregistrement);
                        form.setValue("Nombre_colis", responseData.Nombre_colis);
                        form.setValue("Poids", responseData.Poids);
                        form.setValue("Frais_Postaux", responseData.Frais_Postaux);
                        form.setValue("Frais_Douane", responseData.Frais_Douane);
                        form.setValue("Reference", responseData.Reference);
                        form.setValue("Date_Abonnement", responseData.Date_Abonnement);
                        form.setValue("Nationalite", responseData.Nationaliter);
                    }
                } catch (error) {
                    console.log(error);
                }
            };
            //appeller la fonction fetchCompagne ici
            useEffect(() => {
                if (contact.id) {
                    fetchContact(contact.id);
                }
            }, [contact.id]); // Fetch data when the dialog is opened

            return (
                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Ellipsis className="" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <button
                                    className="w-full bg-blue text-blanc hover:bg-blue/90 hover:text-blanc duration-500 rounded-lg p-1"
                                    onClick={() => setIsEditDialogOpen(true)}
                                >
                                    Editer
                                </button>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <button
                                    className="w-full bg-red-500 text-blanc hover:bg-red-500/90 hover:text-blanc duration-500 rounded-lg p-1"
                                    onClick={() => setIsDeleteDialogOpen(true)}
                                >
                                    Supprimer
                                </button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Edit dialog */}
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogContent className="bg-blanc">
                            <DialogHeader>
                                <DialogTitle className="text-blue text-2xl mb-1 ml-[15%]">Editer un contact</DialogTitle>
                                <DialogDescription>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit((values) => onEditSubmit(values))} className="w-full max-w-xl mx-auto">
                                            <div className="space-y-2 w-full">
                                                <div className="flex gap-4 w-full">
                                                    <FormField
                                                        control={form.control}
                                                        name="Nom"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Nom</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} className="text-blue font-bold" placeholder="example:fatouma" type="text" disabled={isPending} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="Email"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Email</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} className="text-blue  font-bold" placeholder="fatouma@example.com" type="email" disabled={isPending} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="flex gap-4 w-full">
                                                    <FormField
                                                        control={form.control}
                                                        name="Telephone"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Telephone</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} className="text-blue font-bold" placeholder="telephone" type="text" disabled={isPending} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="Adresse"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Adresse</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} className="text-blue font-bold" placeholder="adresse" type="text" disabled={isPending} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="flex gap-4 w-full">
                                                    <FormField
                                                        control={form.control}
                                                        name="Provenance"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Provenance</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} className="text-blue font-bold" placeholder="Provenance" type="text" disabled={isPending} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="Date_Enregistrement"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Date Enregistrement</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} className="text-blue font-bold" placeholder="Date_Enregistrement" type="text" disabled={isPending} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="flex gap-4 w-full">
                                                    <FormField
                                                        control={form.control}
                                                        name="Nombre_colis"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Nombre colis</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} className="text-blue font-bold" placeholder="Nombre_colis" type="number" disabled={isPending} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="Poids"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Poids</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} className="text-blue font-bold" placeholder="Poids" type="text" disabled={isPending} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="flex gap-4 w-full">
                                                    <FormField
                                                        control={form.control}
                                                        name="Frais_Postaux"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Frais Postaux</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} className="text-blue font-bold" placeholder="Frais_Postaux" type="text" disabled={isPending} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="Reference"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Reference</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} className="text-blue font-bold" placeholder="Reference" type="text" disabled={isPending} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="flex gap-4 w-full">
                                                    <FormField
                                                        control={form.control}
                                                        name="Date_Abonnement"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Date Abonnement</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} placeholder=">Date Abonnement" type="text" disabled={isPending} className="text-blue font-bold" />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="Nationalite"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Nationalite</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} placeholder="Nationalite" type="text" disabled={isPending} className="text-blue font-bold" />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <FormError message={errorMessage} />
                                            <FormSucces message={successMessage} />
                                            <Button type="submit" className="w-full mt-2 bg-blue" disabled={isPending}>Enregistrer</Button>
                                        </form>

                                    </Form>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>

                    {/* Delete dialog */}
                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogContent className="bg-blanc">
                            <DialogHeader>
                                <DialogTitle className="text-blue text-2xl mb-1 ml-[15%]">Supprimer une compagne</DialogTitle>
                                <DialogDescription>
                                    <form
                                        className="w-full max-w-xs mx-auto"
                                        onSubmit={(e) => handleDelete(e, contact.id)} // Appel de handleDelete avec id
                                    >
                                        <FormError message={errorMessage} />
                                        <FormSucces message={successMessage} />
                                        <h1>Voulez-vous vraiment supprimer ?</h1>
                                        <div className="flex items-center">
                                            <button
                                                className="bg-red-500 hover:bg-red-500/80 text-white font-bold py-2 px-4 rounded-[10px] w-full focus:outline-none focus:shadow-outline mt-4"
                                                type="submit"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </form>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
            );
        },
    },
]
