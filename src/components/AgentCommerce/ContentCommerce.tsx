"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { DataTable } from "../DataTable";
import { Columns, User } from "./Columns";
import { Download } from 'lucide-react';
import { DataTableImportation } from "../ReUsableDataTable";
import { usePathname } from "next/navigation";
import { DataTableExportattion } from "./DataTableExportation";
import { DemandeColumns, DemandeLivraison } from "./livreColumns";
import { DataTableLivraison } from "./DataTableLivraison";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { SelectionCompagne } from "@/Schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";


export default function ContentCommerce() {
    const [fileName, setFileName] = useState('');
    const path = usePathname();
    const [DemandeLivraison, setDemandeLivraison] = useState<DemandeLivraison[]>([])
    const [ListeContact, setListeContact] = useState<User[]>([]);
    const [selectCompagner, setselectCompagner] = useState([]);


    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
        } else {
            setFileName('Aucun fichier sélectionné');
        }
    };
    // controle de la selection du compagne
    const selcte = useForm<z.infer<typeof SelectionCompagne>>({
        resolver: zodResolver(SelectionCompagne),
        defaultValues: {
            Compagne: ""
        },
    })
    
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

    // Fonction pour gérer les changements d'état et récupérer les contacts à rappeler
    const handleChange = async (value: z.infer<typeof SelectionCompagne>) => {
        fetchContactQualifier(value);
    };

    //fonction pour gerer
    const fetchDemandeLivraison = async () => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=DemandeLivraison`;
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
            });
            const responseData = await response.json();
            if (response.ok) {
                setDemandeLivraison(responseData);
            } else {
                console.error(responseData.error || "Erreur réseau détectée.");
            }
        } catch (error) {
            console.error("Erreur de requête", error);
        }
    }
    const fetchContactQualifier = async (value: z.infer<typeof SelectionCompagne>) => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=AfficherRapel`;
        try {
            const playload = {
                Compagne: value,
            }
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(playload),
            });
            const responseData = await response.json();
            if (response.ok) {
                setListeContact(responseData);
            } else {
                console.error(responseData.error || "Erreur réseau détectée.");
            }
        } catch (error) {
            console.error("Erreur de requête", error);
        }
    }

    useEffect(() => {
        fetchDemandeLivraison();
        fetchCompagner();
    }, [])

    return (
        <main>
            {path && path === "/Commercial/importation" && (
                <div className="h-max p-4 text-blue">
                    <form className="bg-blanc w-full h-max rounded-lg shadow-blue p-2 flex gap-2 flex-col">
                        <div className="w-full">
                            <Form {...selcte}>
                                <FormField
                                    control={selcte.control}
                                    name="Compagne"
                                    render={({ field }) => (
                                        <FormItem>
                                            {/* <FormLabel className="text-blue">Compagne</FormLabel> */}
                                            <FormControl>
                                                <Select
                                                    {...field}
                                                    onValueChange={(value) => {
                                                        field.onChange(value);  // Mettre à jour la valeur du formulaire
                                                        // handleChange(value);    // Effectuer des actions supplémentaires
                                                    }}
                                                >
                                                    <SelectTrigger className="shadow border border-blue rounded-[10px] w-full py-2 px-3 text-blue focus:outline-none placeholder-blue/70 caret-blue w-max">
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
                        </div>
                        <div className="w-full flex justify-center">
                            {/* Bouton d'importation avec icône */}
                            <label className="cursor-pointer inline-flex items-center bg-blue-500 text-blue font-bold py-2 px-4 rounded-lg">
                                <Download className="mr-2" />
                                Importation
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>

                            {/* Affichage du nom du fichier importé */}
                            {fileName && <p className="mt-2 text-blue">{fileName}</p>}
                        </div>
                        <div className="w-full flex justify-end px-2">
                            <button className="text-white bg-blue hover:bg-blue/90 duration-300 px-4 w-max py-1 rounded-lg inline-block">
                                Enregistrer
                            </button>
                        </div>



                    </form>
                    <h1 className="text-md font-medium py-2">Liste de contact appeller et leur qualifcation</h1>
                    <DataTableImportation data={ListeContact} columns={Columns} typeName="Nom" FetchData={handleChange} />
                </div>
            )}
            {path && path === "/Commercial/Exportation" && (
                <div className="h-max p-4 text-blue">
                    <div className="bg-blanc w-full h-max rounded-lg shadow-blue p-6 flex">
                        <Form {...selcte}>
                            <FormField
                                control={selcte.control}
                                name="Compagne"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        {/* <FormLabel className="text-blue">Compagne</FormLabel> */}
                                        <FormControl >
                                            <Select
                                                {...field}
                                                onValueChange={(value) => {
                                                    field.onChange(value);  // Mettre à jour la valeur du formulaire
                                                    handleChange(value);    // Effectuer des actions supplémentaires
                                                }}
                                            >
                                                <SelectTrigger className="shadow border border-blue rounded-[10px] w-full py-2 px-3 text-blue focus:outline-none placeholder-blue/70 caret-blue">
                                                    <SelectValue placeholder="Sélectionner une compagne" />
                                                </SelectTrigger>
                                                <SelectContent className="w-full">
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
                    </div>
                    <h1 className="text-md font-medium py-2">Liste de contact appeller et leur qualifcation</h1>
                    <DataTableExportattion data={ListeContact} columns={Columns} typeName="Nom" />
                </div>
            )}
            {path && path === "/Commercial/Demande_livraison" && (
                <div className="h-max p-4 text-blue">
                    <h1 className="text-md font-medium py-2">Liste de demande livraison</h1>
                    <DataTableLivraison data={DemandeLivraison} columns={DemandeColumns} typeName="Nom" />
                </div>
            )}

        </main>
    )
}