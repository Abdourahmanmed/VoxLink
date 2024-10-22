"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Ellipsis, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { FormQuickPost } from "@/Schemas"
import { useEffect, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { FormError } from "../FormError"
import { FormSucces } from "../FormSucces"
import { useAppContext } from "../context/AppContext"
import { DatePickerDemo } from "../DatePickerDemo"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "../ui/textarea"



// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type QuickLivraison = {
    id: string;
    Nom: string;
    Telephone: number;
    Arecuperation: string;
    Adresse_livraison: string;
    Nombre_de_Voyages: string;
    Description_du_Contenu: string;
    Agents: string;
    Date_livraison: string;
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
            );
        },
    },
    {
        accessorKey: "Telephone",
        header: "Téléphone",
    },
    {
        accessorKey: "Arecuperation",
        header: "Adresse de récupération",
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
        accessorKey: "Agents",
        header: "Agents",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const user = row.original;
            const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
            const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
            const { handleDeleteLivraison, successMessage, errorMessage, setSuccessMessage, setErrorMessage, EditerDemamnde, isPending } = useAppContext();

            const FormPoste = useForm<z.infer<typeof FormQuickPost>>({
                resolver: zodResolver(FormQuickPost),
                defaultValues: {
                    Nom: "",
                    Telephone: "",
                    Arecuperation: "",
                    Adresse_livraison: "",
                    Description_du_Contenu: "",
                    Nombre_de_Voyages: "",
                    Date_livraison: "",
                },
            });
            //fonction pour editer les informations du compagne
            const onEditSubmit = (values: z.infer<typeof FormQuickPost>) => {
                // console.log(values,user.id);
                EditerDemamnde(values, user.id);
                // setIsEditDialogOpen(false);
            };

            //fonction pour recupere les information d'un compagne par son id 
            const fetchUser = async (id: string) => {
                const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=afficherQuickPosteParId&id=${id}`;
                try {
                    const response = await fetch(apiUrl, {
                        method: "GET",
                    });

                    const responseData = await response.json();

                    if (!response.ok || responseData.error) {
                        setErrorMessage(responseData.error || "Network error detected.");
                    } else {
                        // Set form default values with the fetched data
                        FormPoste.setValue("Nom", responseData.Nom);
                        FormPoste.setValue("Telephone", responseData.Telephone);
                        FormPoste.setValue("Arecuperation", responseData.Arecuperation);
                        FormPoste.setValue("Adresse_livraison", responseData.Adresse_livraison);
                        FormPoste.setValue("Description_du_Contenu", responseData.Description_du_Contenu);
                        FormPoste.setValue("Nombre_de_Voyages", responseData.Nombre_de_Voyages);
                        FormPoste.setValue("Date_livraison", responseData.Date_livraison);
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
                            <DropdownMenuItem>
                                <button
                                    className="w-full bg-slate-500 text-blanc hover:bg-slate-500/90 hover:text-blanc duration-500 rounded-lg p-1"
                                    onClick={() => handlePrint(row.original)}
                                >
                                    imprimer
                                </button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Edit dialog */}
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogContent className="bg-blanc">
                            <DialogHeader>
                                <DialogTitle className="text-blue text-2xl mb-1 ml-[15%]">Editer une demande</DialogTitle>
                                <DialogDescription>
                                    <Form {...FormPoste}>
                                        <form onSubmit={FormPoste.handleSubmit(onEditSubmit)} className="flex gap-4 flex-col">
                                            <FormField
                                                control={FormPoste.control}
                                                name="Nom"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                type="text"
                                                                placeholder="Nom"
                                                                value={field.value}
                                                                className="text-blue font-semibold"
                                                                onChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={FormPoste.control}
                                                name="Telephone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                type="text"
                                                                placeholder="Téléphone"
                                                                value={field.value}
                                                                className="text-blue font-semibold"
                                                                onChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={FormPoste.control}
                                                name="Arecuperation"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                type="text"
                                                                placeholder="ex: adresse de récupération"
                                                                value={field.value}
                                                                className="text-blue font-semibold"
                                                                onChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={FormPoste.control}
                                                name="Adresse_livraison"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                type="text"
                                                                placeholder="ex: adresse 1, adresse 2, ..."
                                                                value={field.value}
                                                                className="text-blue font-semibold"
                                                                onChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={FormPoste.control}
                                                name="Description_du_Contenu"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="ex:Description du Contenu de livraison"
                                                                value={field.value}
                                                                className="text-blue font-semibold"
                                                                onChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={FormPoste.control}
                                                name="Nombre_de_Voyages"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                type="text"
                                                                placeholder="ex: Nombre de Voyages"
                                                                value={field.value}
                                                                className="text-blue font-semibold"
                                                                onChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={FormPoste.control}
                                                name="Date_livraison"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <DatePickerDemo
                                                                value={field.value ? new Date(field.value) : undefined}
                                                                onChange={(date) => {
                                                                    if (date) {
                                                                        // Formater la date pour le fuseau horaire de l'Arabie Saoudite
                                                                        const saudiDate = new Date(date).toLocaleString('en-GB', {
                                                                            timeZone: 'Asia/Riyadh',
                                                                            year: 'numeric',
                                                                            month: '2-digit',
                                                                            day: '2-digit',
                                                                        }).split('/').reverse().join('-'); // Format: YYYY-MM-DD

                                                                        field.onChange(saudiDate);
                                                                    } else {
                                                                        field.onChange("");
                                                                    }
                                                                }}
                                                            />

                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="mb-4">
                                                {successMessage && <FormSucces message={successMessage} />}
                                                {errorMessage && <FormError message={errorMessage} />}
                                            </div>
                                            <Button type="submit" className="w-full bg-blue" disabled={isPending}>
                                                Modifier
                                            </Button>
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
                                        onSubmit={(e) => handleDeleteLivraison(e, user.id)} // Appel de handleDelete avec id
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

// Print function
const handlePrint = (data: QuickLivraison) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
        printWindow.document.write(`
        <html>
            <head>
                <title>Imprimer Bon de Livraison</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        padding: 20px; 
                        margin: 0; 
                        position: relative; 
                        min-height: 100vh; 
                    }
                    h1 { text-align: center; font-size: 1.5em; }
                    .container { width: 80%; margin: auto; }
                    .section { margin-bottom: 20px; }
                    .section span { font-weight: bold; }
                    .header-section, .footer-section { 
                        text-align: center; 
                        margin-bottom: 20px; 
                        font-size: 0.9em; 
                    }
                    .signature { 
                        margin-top: 50px; 
                        text-align: left; 
                    }
                    .underline { 
                        border-bottom: 1px solid black; 
                        display: inline-block; 
                        width: 200px; 
                    }
                    .flex {
                        display:flex;
                        justify-content:space-between;
                    }
                    .mt-30 {
                        margin-top:10px;
                    }
                    .footer-section {
                        position: absolute; 
                        bottom: 150px; /* Adjust to ensure it is above the bottom edge */
                        left: 0; 
                        right: 0; 
                    }
                </style>
            </head>
            <body>
                <div class="header-section flex">
                    <div>
                        <p>
                            MINISTERE DE LA COMMUNICATION <br />
                            CHARGE DES POSTES <br />
                            ET DES TELECOMMUNICATIONS
                        </p>
                        <p>
                            LA POSTE DE DJIBOUTI S.A <br />
                            DIRECTION GENERALE <br />
                            Djibouti le ${new Date().toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <img src="${window.location.origin}/logo.png" alt="logo du poste" style="width: 150px; height: auto;" />
                    </div>
                </div>

                <h1>Formulaire de Livraison</h1>
                <div class="container">
                    <div class="section">
                        <span>Numéro de Bon de livraison:</span> ${data.id}
                    </div>
                    <div class="section">
                        <span>Adresse de Collecte:</span> ${data.Arecuperation}
                    </div>
                    <div class="section">
                        <span>Adresse de Livraison:</span> ${data.Adresse_livraison}
                    </div>
                    <div class="section">
                        <span>Nom:</span> ${data.Nom}
                    </div>
                    <div class="section">
                        <span>Téléphone:</span> ${data.Telephone}
                    </div>
                    <div class="section">
                        <span>Description du Contenu:</span> ${data.Description_du_Contenu}
                    </div>
                    <div class="section">
                        <span>Nombre de Voyages:</span> ${data.Nombre_de_Voyages}
                    </div>
                    <div class="section">
                        <span>Date de Livraison:</span> ${data.Date_livraison}
                    </div>
                    <div class="signature">
                        <span>Signature:</span> <span class="underline"></span>
                    </div>
                </div>

                <div class="footer-section mt-30">
                    <p>
                        REPUBLIQUE DE DJIBOUTI <br />
                        Unité – Egalité – Paix
                    </p>
                    <p>
                        SIEGE SOCIAL – Bd de la République – BP 557 – République de Djibouti <br />
                        Tél: (253) 21 35 72 73 – Fax: (253) 21 35 78 78 – E-mail: postdir@intnet.dj
                    </p>
                    <p>
                        CENTRE- EINGUELA – MARABOUT – NASSER – BALBALA – ARTA – ALI-SABIEH – DIKHIL – TADJOURAH – OBOCK
                    </p>
                </div>
            </body>
        </html>
        `);
        printWindow.document.close();
        printWindow.print();
    } else {
        console.error("Unable to open print window.");
    }
};
