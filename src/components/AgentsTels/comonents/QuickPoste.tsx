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

export default function QuickPostes() {
    //state
    const [isPending, startTransition] = useTransition();
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [QuickPoste, setQuickPoste] = useState<QuickLivraison[]>([]);
    const [QuickPosteScript, setQuickPosteScript] = useState();
    const { data: session, status } = useSession();

    const FormPoste = useForm<z.infer<typeof FormQuickPost>>({
        resolver: zodResolver(FormQuickPost),
        defaultValues: {
            Nom: "",
            Telephone: "",
            Arecuperation: "",
            Adresse_livraison: "",
            Date_livraison: "",
        },
    });

    // Fonction pour ajouter une demande quick poste
    const onSubmitsQuick = async (values: z.infer<typeof FormQuickPost>) => {
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
                setSuccessMessage(responseData.success);
                setQuickPoste([...QuickPoste, values]);
            } else {
                setErrorMessage(responseData.error || "Network error detected.");
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
    const FetchQuickPosteScript = async () => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=FetchQuickPosteScript`;

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
            setQuickPosteScript(responseData.Script);

        } catch (error) {
            console.error("Erreur lors de la récupération des campagnes:", error);
        }
    };

    //useEffect Traitement 

    useEffect(()=>{
        fetchQuickPoste();
        FetchQuickPosteScript();
    },[])


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
                                name="Date_livraison"
                                render={({ field }) => (
                                    <FormItem>
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
                            <div className="mb-4">
                                {successMessage && <FormSucces message={successMessage} />}
                                {errorMessage && <FormError message={errorMessage} />}
                            </div>
                            <Button type="submit" className="w-full bg-blue" disabled={isPending}>
                                Enregistrer
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="bg-white w-[50%] h-max rounded shadow-blue">
                    <h1 className="text-center capitalize p-4 text-blue font-semibold">Script</h1>
                    <div className="w-full h-full text-blue p-4">
                       {QuickPosteScript}
                    </div>
                </div>
            </div>
            <div className="bg-white w-[100%] h-max rounded shadow-blue p-4 mb-4">
                <QuickPostData data={QuickPoste} columns={Quickcolumns} typeName="Nom" />
            </div>
        </div>
    );
}
