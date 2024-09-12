"use client";
import { usePathname } from "next/navigation";
import { DataTable } from "../DataTable";
import { User, columns } from "./columns";
import { Livraison, Livraisoncolumns } from "./livreColumns";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useAppContext } from "@/components/context/AppContext";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DatePickerDemo } from "../DatePickerDemo";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DemandeLivraison } from "@/Schemas";
import { FormError } from "../FormError";
import { Button } from "../ui/button";
import { FormSucces } from "../FormSucces";
import { RappelColumn } from "./RappelColumn";

interface TitleProps {
    title: string;
}

export default function Content({ title }: TitleProps) {
    const path = usePathname();
    const { onSubmit, contacts, Data, loading } = useAppContext();
    const [isPending, startTransition] = useTransition();
    const [livraisonData, setLivraisonData] = useState<Livraison[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    // Fonction pour récupérer les données de contacts
    const fetchContacts = useCallback(() => {
        if (contacts && typeof contacts === "function") {
            contacts(title);
        }
    }, [title]);

    // Utilisation de useEffect pour déclencher la récupération des contacts à chaque changement de titre
    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const form = useForm<z.infer<typeof DemandeLivraison>>({
        resolver: zodResolver(DemandeLivraison),
        defaultValues: {
            Compagne: "",
            Nom: "",
            Telephone: "",
            Adresse: "",
            Date_livraison: "",
        },
    });
 //fontion pour ajouter une demande livraison.
    const onSubmits = (values: z.infer<typeof DemandeLivraison>) => {
        startTransition(async () => {
            const apiUrl = `http://127.0.0.1/Vox_Backend/api.php?method=AjouterDemande&id=1`;
            try {
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                });
                const responseData = await response.json();
                if (response.ok) {
                    setSuccessMessage(responseData.success);
                } else {
                    setErrorMessage(responseData.error || "Network error detected.");
                }
            } catch (error) {
                console.error("Erreur de requête", error);
            }
        });
    };
//fonction de recuperer tous les demandes de livraison.
    const fetchDemandeLivraison = async () => {
        const apiUrl = `http://127.0.0.1/Vox_Backend/api.php?method=DemandeLivraison`;
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
            });
            const responseData = await response.json();
            if (response.ok) {
                setLivraisonData(responseData);
            } else {
                console.error(responseData.error || "Erreur réseau détectée.");
            }
        } catch (error) {
            console.error("Erreur de requête", error);
        }
    };

    useEffect(() => {
        if (path === "/Teleconseiller/Demande_livraison") {
            fetchDemandeLivraison();
        }
    }, [path, onSubmits]);

    return (
        <>
            {path === "/Teleconseiller/Demande_livraison" ? (
                <>
                    <h1 className="capitalize p-1 text-blue font-semibold">
                        Liste de demande livraison
                    </h1>

                    <div className="bg-white w-full h-max rounded p-4 shadow-blue">
                        <Dialog>
                            <DialogTrigger className="w-full bg-blue text-white hover:bg-blue/90 duration-500 rounded-lg p-1">
                                Ajouter
                            </DialogTrigger>
                            <DialogContent className="bg-white">
                                <DialogHeader>
                                    <DialogTitle className="text-blue text-2xl mb-2 ml-[15%]">
                                        Demande de livraison
                                    </DialogTitle>
                                    <DialogDescription>
                                        <Form {...form}>
                                            <form onSubmit={form.handleSubmit(onSubmits)} className="w-full max-w-xs mx-auto">
                                                <div className="space-y-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="Compagne"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-blue">Compagne</FormLabel>
                                                                <FormControl>
                                                                    <Select {...field} onValueChange={(value) => field.onChange(value)} disabled={isPending}>
                                                                        <SelectTrigger className="shadow border border-blue rounded-[10px] w-full py-2 px-3 text-blue focus:outline-none placeholder-blue/70 caret-blue">
                                                                            <SelectValue placeholder="Sélectionner une compagne" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="E-suuq">E-suuq</SelectItem>
                                                                            <SelectItem value="Recouvrement">Recouvrement</SelectItem>
                                                                            <SelectItem value="Petite paquet">Petite paquet</SelectItem>
                                                                            <SelectItem value="Colis-Ems">Colis Ems</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="Nom"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-blue">Nom</FormLabel>
                                                                <FormControl>
                                                                    <input
                                                                        {...field}
                                                                        className="shadow border border-blue rounded-[10px] w-full py-2 px-3 text-blue focus:outline-none placeholder-blue/70 caret-blue"
                                                                        type="text"
                                                                        placeholder="Nom"
                                                                    />
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
                                                                <FormLabel className="text-blue">Téléphone</FormLabel>
                                                                <FormControl>
                                                                    <input
                                                                        {...field}
                                                                        className="shadow border border-blue rounded-[10px] w-full py-2 px-3 text-blue focus:outline-none placeholder-blue/70 caret-blue"
                                                                        type="text"
                                                                        placeholder="Téléphone"
                                                                    />
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
                                                                    <input
                                                                        {...field}
                                                                        className="shadow border border-blue rounded-[10px] w-full py-2 px-3 text-blue focus:outline-none placeholder-blue/70 caret-blue"
                                                                        type="text"
                                                                        placeholder="Adresse"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="Date_livraison"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-blue">Date de livraison</FormLabel>
                                                                <FormControl>
                                                                    <DatePickerDemo
                                                                        value={field.value ? new Date(field.value) : undefined}
                                                                        onChange={(date) => field.onChange(date ? date.toISOString() : "")}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                {/* Status Messages */}
                                                <div className="mb-4">
                                                    <FormSucces message={successMessage} />
                                                    <FormError message={errorMessage} />
                                                </div>
                                                <Button type="submit" className="w-full mt-2 bg-blue" disabled={isPending}>
                                                    Soumettre
                                                </Button>
                                            </form>
                                        </Form>
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                        {loading ? (
                            <div className="flex justify-center items-center mt-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-slate-500 border-solid border-transparent"></div>
                                <small className="ml-2">Chargement...</small>
                            </div>
                        ) : (
                            <DataTable data={livraisonData} columns={Livraisoncolumns} typeName="Nom" />
                        )}

                    </div>
                </>
            ) : path === "/Teleconseiller/Rappels" ? (
                <div className="flex gap-4">
                    <div className="bg-white w-[50%] h-max rounded p-4 shadow-blue">
                        <h1 className="text-center capitalize p-4 text-blue font-semibold">Liste de Rappels</h1>
                        {loading ? (
                            <div className="flex justify-center items-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-slate-500 border-solid border-transparent"></div>
                                <small className="ml-2">Chargement...</small>
                            </div>
                        ) : (
                            <DataTable data={Data} columns={RappelColumn} typeName="Nom" />
                        )}
                    </div>
                    <div className="bg-white w-[50%] h-max rounded shadow-blue">
                        <h1 className="text-center capitalize p-4 text-blue font-semibold">Script</h1>
                        <div className="w-full h-full text-blue p-4">
                            {Data && Data.length > 0 ? (
                                <div>{Data[0].Script}</div>
                            ) : (
                                <div>Il n'y a aucun contact pour le moment.</div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex gap-4">
                    <div className="bg-white w-[50%] h-max rounded p-4 shadow-blue">
                        <h1 className="text-center capitalize p-4 text-blue font-semibold">Liste de contacts</h1>
                        {loading ? (
                            <div className="flex justify-center items-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-slate-500 border-solid border-transparent"></div>
                                <small className="ml-2">Chargement...</small>
                            </div>
                        ) : (
                            <DataTable data={Data} columns={columns} typeName="Nom" />
                        )}
                    </div>
                    <div className="bg-white w-[50%] h-max rounded shadow-blue">
                        <h1 className="text-center capitalize p-4 text-blue font-semibold">Script</h1>
                        <div className="w-full h-full text-blue p-4">
                            {Data && Data.length > 0 ? (
                                <div>{Data[0].Script}</div>
                            ) : (
                                <div>Il n'y a aucun contact pour le moment.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
