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
import { FormError } from "@/components/FormError"
import { FormSucces } from "@/components/FormSucces"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { z } from "zod"
import { RegisterSchema } from "@/Schemas"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppContext } from "@/components/context/AppContext"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Agents = {
    id: string;
    Nom: string;
    Email: string;
    Telephone: number;
    Adresse: string;
    Password: string;
    Role: string;
};

export const AgentsColumns: ColumnDef<Agents>[] = [
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
            const user = row.original;
            const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
            const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
            const { handleDeleteUser, successMessage, errorMessage, setSuccessMessage, setErrorMessage, EditerUser, isPending } = useAppContext();
            const form = useForm<z.infer<typeof RegisterSchema>>({
                resolver: zodResolver(RegisterSchema),
                defaultValues: {
                    Nom: '',
                    Email: '',
                    Password: '',
                    Telephone: '',
                    Adresse: '',
                    Role: ''
                },
            });
            //fonction pour editer les informations du compagne
            const onEditSubmit = (values: z.infer<typeof RegisterSchema>) => {
                // console.log(values);
                EditerUser(values, user.id);
                // setIsEditDialogOpen(false);
            };

            //fonction pour recupere les information d'un compagne par son id 
            const fetchUser = async (id: string) => {
                const apiUrl = `http://127.0.0.1/Vox_Backend/api.php?method=AfficherUserById&id=${id}`;
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
                        form.setValue("Password", responseData.Password);
                        form.setValue("Telephone", responseData.Telephone);
                        form.setValue("Adresse", responseData.Adresse);
                        form.setValue("Role", responseData.Role);
                    }
                } catch (error) {
                    console.log(error);
                }
            };
            //appeller la fonction fetchCompagne ici
            useEffect(() => {
                if (user.id) {
                    fetchUser(user.id);
                }
            }, [user.id]); // Fetch data when the dialog is opened

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
                                <DialogTitle className="text-blue text-2xl mb-1 ml-[15%]">Editer un utilisateur</DialogTitle>
                                <DialogDescription>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onEditSubmit)} className="w-full max-w-xs mx-auto">
                                            <div className="space-y-2">
                                                <FormField
                                                    control={form.control}
                                                    name="Nom"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-blue">Nom</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="example:fatouma" type="text" disabled={isPending} className="text-blue font-bold" />
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
                                                            <FormLabel className="text-blue">Email</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="fatouma@example.com" type="email" disabled={isPending} className="text-blue font-bold" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="Password"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-blue">Password</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="***********" type="password" disabled={isPending} className="text-blue font-bold" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="Telephone"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-blue">Telephone</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="example:77101010" type="text" disabled={isPending} className="text-blue font-bold" />
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
                                                            <FormLabel className="text-blue">Adresse</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="example:quartier 1" type="text" disabled={isPending} className="text-blue font-bold" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="Role"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-blue">Adresse</FormLabel>
                                                            <FormControl>
                                                                <Select
                                                                    {...field}
                                                                    onValueChange={(value) => {
                                                                        field.onChange(value);  // Mettre à jour la valeur du formulaire
                                                                    }}
                                                                >
                                                                    <SelectTrigger className="shadow font-bold border border-blue rounded-[10px] w-full py-2 px-3 text-blue focus:outline-none placeholder-blue/70 caret-blue">
                                                                        <SelectValue placeholder="Sélectionner une compagne" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="Teleconseiller">Teleconseiller</SelectItem>
                                                                        <SelectItem value="AgentCommerce">Agent Commercial</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
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
                                <DialogTitle className="text-blue text-2xl mb-1 ml-[15%]">Supprimer un utilisateur</DialogTitle>
                                <DialogDescription>
                                    <form
                                        className="w-full max-w-xs mx-auto"
                                        onSubmit={(e) => handleDeleteUser(e, user.id)} // Appel de handleDelete avec id
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
