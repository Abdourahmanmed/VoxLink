import { DataTable } from "@/components/DataTable";
import { Rappel, RappelColumn } from "../RappelColumn";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectionCompagne } from "@/Schemas";
import { useEffect, useState, useTransition } from "react";
import { useAppContext } from "@/components/context/AppContext";
import { useSession } from "next-auth/react";

export default function Rappeller() {
    //state 
    const { data: session, status } = useSession();
    const [isPending, startTransition] = useTransition();
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [selectCompagner, setselectCompagner] = useState([]);
    const [DataRapel, setDataRapel] = useState<Rappel[]>([])
    const { loading } = useAppContext();
    // controle de la selection du compagne
    const selcte = useForm<z.infer<typeof SelectionCompagne>>({
        resolver: zodResolver(SelectionCompagne),
        defaultValues: {
            Compagne: ""
        },
    })

    //comportement 
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
    // Fonction pour récupérer tous les contacts à rappeler par campagne
    const fetchRapeller = async (data: z.infer<typeof SelectionCompagne>) => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=AfficherParCompagne&id=${session?.user?.id}`;
        try {
            const playload = {
                Compagne: data
            }
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(playload),
            });

            // Vérifier si la réponse est OK
            const responseData = await response.json();
            if (response.ok) {
                if (responseData) {
                    setDataRapel(responseData);  // Utiliser un setter commençant par une minuscule
                } else {
                    console.error("Données reçues invalides.");
                }
            } else {
                console.error(responseData.error || "Erreur réseau détectée.");
            }
        } catch (error) {
            // Afficher les erreurs liées à la requête
            console.error("Erreur lors de la requête:", error);
        }
    };

    // Fonction pour gérer les changements d'état et récupérer les contacts à rappeler
    const handleChange = async (value: z.infer<typeof SelectionCompagne>) => {
        await fetchRapeller(value);
    };

    //use effect traitement 
    useEffect(() => {
        fetchCompagner();
    }, []);


    //render
    return (
        <div className="flex gap-4">
            <div className="bg-white w-[50%] h-max rounded p-4 shadow-blue">
                <h1 className="text-center capitalize p-4 text-blue font-semibold">Liste de contact à rappels</h1>
                <Form {...selcte}>
                    <FormField
                        control={selcte.control}
                        name="Compagne"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-blue">Compagne</FormLabel>
                                <FormControl>
                                    <Select
                                        {...field}
                                        onValueChange={(value) => {
                                            field.onChange(value);  // Mettre à jour la valeur du formulaire
                                            handleChange(value);    // Effectuer des actions supplémentaires
                                        }}
                                        disabled={isPending}
                                    >
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
                </Form>

                {loading ? (
                    <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-slate-500 border-solid border-transparent"></div>
                        <small className="ml-2">Chargement...</small>
                    </div>
                ) : (
                    <DataTable data={DataRapel} columns={RappelColumn} typeName="Nom" />
                )}
            </div>
            <div className="bg-white w-[50%] h-max rounded shadow-blue">
                <h1 className="text-center capitalize p-4 text-blue font-semibold">Script</h1>
                <div className="w-full h-full text-blue p-4">
                    {DataRapel && DataRapel.length > 0 ? (
                        <div>{DataRapel[0].Script}</div>
                    ) : (
                        <div>Il n'y a aucun contact pour le moment.</div>
                    )}
                </div>
            </div>
        </div>
    )
}