"use client";

import { DataTable } from "@/components/DataTable";
import { Livraison, Livraisoncolumns } from "../livreColumns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DemandeLivraison } from "@/Schemas";
import { DatePickerDemo } from "@/components/DatePickerDemo";
import { FormSucces } from "@/components/FormSucces";
import { FormError } from "@/components/FormError";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/components/context/AppContext";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function DemandeLivraisons() {
    //state 
    const { data: session, status } = useSession();
    const path = usePathname();
    const [livraisonData, setLivraisonData] = useState<Livraison[]>([]);
    const [selectCompagner, setselectCompagner] = useState([]);

    const [isPending, startTransition] = useTransition();
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const { loading } = useAppContext();

    // controle de formulaire d'ajouter une demande livraison
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

    //comportement

    //fontion pour ajouter une demande livraison.
    const onSubmits = (values: z.infer<typeof DemandeLivraison>) => {
        startTransition(async () => {

            const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=AjouterDemande&id=${session?.user?.id}`;
            // console.log(session?.user?.id);
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

    //Fetch compagnes logic here...
    const fetchCompagner = async () => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=Compagnes`;

        try {
            const response = await fetch(apiUrl, { method: 'GET' });

            // Vérification de la réponse
            if (!response.ok) {
                console.error("Erreur lors de l'exécution de la requête.");
                return;
            }

            const responseData = await response.json();

            // Vérification des erreurs dans la réponse
            if (responseData.error) {
                console.error("Erreur du serveur:", responseData.error);
                return;
            }

            // Mettre à jour l'état avec les données récupérées
            setselectCompagner(responseData);

        } catch (error) {
            console.error("Erreur lors de la récupération des campagnes:", error);
        }
    };

    //fonction de recuperer tous les demandes de livraison.
    const fetchDemandeLivraison = async () => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=DemandeLivraison`;
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

    //use effect traitement 
    useEffect(() => {
        fetchCompagner();
    }, []);

    //render
    return (
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
                                                                    {selectCompagner && selectCompagner.length > 0 ? (
                                                                        selectCompagner.map((items, index) => (
                                                                            <SelectItem value={items.Nom} key={index}>
                                                                                {items.Nom}
                                                                            </SelectItem>
                                                                        ))
                                                                    ) : (
                                                                        <p>Aucune campagne disponible</p> // Message à afficher si la liste est vide
                                                                    )}
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
    )
}