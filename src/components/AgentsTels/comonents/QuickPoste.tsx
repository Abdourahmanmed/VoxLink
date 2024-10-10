"use client";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Quickcolumns, QuickLivraison } from "../QuickColumns";
import { QuickPostData } from "../QuickPostData";
import { Input } from "@/components/ui/input";
import { FormSucces } from "@/components/FormSucces";
import { FormError } from "@/components/FormError";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useTransition } from "react";
import { z } from "zod";
import { FormQuickPost } from "@/Schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePickerDemo } from "@/components/DatePickerDemo";
import { useSession } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/components/context/AppContext";

export default function QuickPostes() {
    //state
    const [isPending, startTransition] = useTransition();
    const [successMessage1, setSuccessMessage1] = useState<string | undefined>(undefined);
    const [errorMessage1, setErrorMessage1] = useState<string | undefined>(undefined);
    const {setQuickPoste, successMessage, errorMessage,QuickPoste, setSuccessMessage, setErrorMessage} = useAppContext();
    const { data: session, status } = useSession();

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

    // Fonction pour ajouter une demande quick poste
    const onSubmitsQuick = async (values: z.infer<typeof FormQuickPost>) => {
        // console.log(values);
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=AjouterQuicposte&id=${session?.user?.id}`;
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
                setSuccessMessage1(responseData.success);
                setQuickPoste([...QuickPoste, values]);
            } else {
                setErrorMessage1(responseData.error || "Network error detected.");
            }
        } catch (error) {
            console.error("Erreur de requête", error);
        }
    };

    //fonction fetch QuickPoste 
    const fetchQuickPoste = async () => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=afficherQuickPoste`;

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
            setQuickPoste(responseData);

        } catch (error) {
            console.error("Erreur lors de la récupération des campagnes:", error);
        }
    };
    //useEffect Traitement 

    useEffect(() => {
        fetchQuickPoste();
    }, [])


    // Render
    return (
        <div className="flex flex-col gap-8">
            <div className="flex gap-4">
                <div className="bg-white w-[50%] h-max rounded p-4 shadow-blue ">
                    <h1 className="text-blue text-xl font-semibold p-4 text-center ">Livraison</h1>
                    <Form {...FormPoste}>
                        <form onSubmit={FormPoste.handleSubmit(onSubmitsQuick)} className="flex gap-4 flex-col">
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
                                {successMessage1 && <FormSucces message={successMessage1} />}
                                {errorMessage1 && <FormError message={errorMessage1} />}
                            </div>
                            <Button type="submit" className="w-full bg-blue" disabled={isPending}>
                                Enregistrer
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="bg-white w-[50%] h-[446px] overflow-hidden rounded shadow-blue">
                    <h1 className="text-center capitalize p-4 text-blue font-semibold">Script</h1>
                    <ScrollArea className="w-full h-full text-blue p-4">
                        <h4 className="font-bold mt-2">TARIFICATION DE QUICK POST PENDANT LES JOURS OUVRABLES</h4>

                        <table className="table-auto w-full mt-4 mb-4">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">Zone</th>
                                    <th className="px-4 py-2">Localité</th>
                                    <th className="px-4 py-2">Tarif</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border px-4 py-2">1</td>
                                    <td className="border px-4 py-2">Rasdika</td>
                                    <td className="border px-4 py-2">250 DJF</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">2</td>
                                    <td className="border px-4 py-2">Quartier 1,2,3,4,5,6 et 7</td>
                                    <td className="border px-4 py-2">350 DJF</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">3</td>
                                    <td className="border px-4 py-2">Q7bis, Ambouli, Jabel, Haramous, Gabode</td>
                                    <td className="border px-4 py-2">500 DJF</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">4</td>
                                    <td className="border px-4 py-2">Cheick Moussa / Place Holl-Holl</td>
                                    <td className="border px-4 py-2">700 DJF</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">5</td>
                                    <td className="border px-4 py-2">4ème Arrondissement / Place Hayableh / Barwaqo 1</td>
                                    <td className="border px-4 py-2">700 DJF</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">6</td>
                                    <td className="border px-4 py-2">Hodan / PK12 / PK 13 / Nassib / Barwaqo 2</td>
                                    <td className="border px-4 py-2">1250 DJF</td>
                                </tr>
                            </tbody>
                        </table>

                        <h4 className="font-bold mt-4">Frais de Livraison de 17h00 à 21h00 pour les jours ouvrables :</h4>
                        <ul className="list-disc list-inside mt-2">
                            <li>ZONE 1 & 2 : 500 DJF</li>
                            <li>ZONE 3 : 750 DJF</li>
                            <li>ZONE 4 & 5 : 1250 DJF</li>
                            <li>ZONE 6 : 1500 DJF</li>
                        </ul>

                        <h4 className="font-bold mt-4">TARIFICATION DE QUICK POST PENDANT LES WEEKENDS</h4>
                        <ul className="list-disc list-inside mt-2">
                            <li>ZONE 1 & 2 : 500 DJF</li>
                            <li>ZONE 3 : 750 DJF</li>
                            <li>ZONE 4 & 5 : 1250 DJF</li>
                            <li>ZONE 6 : 1500 DJF</li>
                        </ul>

                        <h4 className="font-bold mt-4">TARIFICATION DE QUICK POST POUR LES COLIS VOLUMINEUX</h4>
                        <p>Frais de livraison de 8h00 à 17h00 pour les jours ouvrables et les weekends :</p>
                        <ul className="list-disc list-inside mt-2">
                            <li>ZONE 1, 2 & 3 : 1500 DJF</li>
                            <li>ZONE 4, 5 & 6 : 3000 DJF</li>
                        </ul>

                        <p className="mt-4">Frais de livraison de 17h00 à 21h00 pour les jours ouvrables et les weekends :</p>
                        <ul className="list-disc list-inside mt-2">
                            <li>ZONE 1, 2 & 3 : 2000 DJF</li>
                            <li>ZONE 4, 5 & 6 : 3500 DJF</li>
                        </ul>

                        <p className="font-bold mt-6">950 DJF</p>
                    </ScrollArea>

                </div>
            </div>
            <div className="bg-white w-[100%] h-max rounded shadow-blue p-4 mb-4">
                <QuickPostData data={QuickPoste} columns={Quickcolumns} typeName="Nom" />
            </div>
        </div>
    );
}
