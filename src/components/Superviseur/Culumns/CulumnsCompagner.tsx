"use client";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FormError } from "@/components/FormError";
import { FormSucces } from "@/components/FormSucces";
import { useAppContext } from "@/components/context/AppContext";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CompagneSchema } from "@/Schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CompagneData = {
    id: string;
    Nom: string;
    Societe: string;
    Script: string;
};

export const CompagneColumns: ColumnDef<CompagneData>[] = [
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
        accessorKey: "Societe",
        header: "Societe",
    },
    {
        accessorKey: "Script",
        header: "Script",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const compagne = row.original;
            const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
            const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
            const { handleDelete, successMessage, errorMessage, setSuccessMessage, setErrorMessage, EditerCompagne, isPending } = useAppContext();
            const form = useForm<z.infer<typeof CompagneSchema>>({
                resolver: zodResolver(CompagneSchema),
                defaultValues: {
                    Nom: '',
                    Societe: '',
                    Script: '',
                }
            });
            //fonction pour editer les informations du compagne
            const onEditSubmit = (values: z.infer<typeof CompagneSchema>) => {
                EditerCompagne(values, compagne.id);
                // setIsEditDialogOpen(false);
            };

            //fonction pour recupere les information d'un compagne par son id 
            const fetchCompagne = async (id: string) => {
                const apiUrl = `http://127.0.0.1/Vox_Backend/api.php?method=AfficherCompagneParId&id=${id}`;
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
                        form.setValue("Societe", responseData.Societe);
                        form.setValue("Script", responseData.Script);
                    }
                } catch (error) {
                    console.log(error);
                }
            };
            //appeller la fonction fetchCompagne ici
            useEffect(() => {
                if (compagne.id) {
                    fetchCompagne(compagne.id);
                }
              }, [compagne.id]); // Fetch data when the dialog is opened

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
                                <DialogTitle className="text-blue text-2xl mb-1 ml-[15%]">Editer une compagne</DialogTitle>
                                <DialogDescription>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit((values) => onEditSubmit(values))} className="w-full max-w-xs mx-auto">
                                            <div className="space-y-2">
                                                <FormField
                                                    control={form.control}
                                                    name="Nom"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-blue">Nom</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="example:fatouma" type="text" disabled={isPending} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="Societe"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-blue">Societe</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="fatouma@example.com" type="text" disabled={isPending} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="Script"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-blue">Script</FormLabel>
                                                            <FormControl>
                                                                <Textarea {...field} placeholder="Entre le script ici" disabled={isPending} className="text-blue border-blue" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
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
                                        onSubmit={(e) => handleDelete(e, compagne.id)} // Appel de handleDelete avec id
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
];
