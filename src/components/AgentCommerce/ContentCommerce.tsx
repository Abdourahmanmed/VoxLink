"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { DataTable } from "../DataTable";
import { Columns, User } from "./Columns";
import { Download } from "lucide-react";
import { DataTableImportation } from "../ReUsableDataTable";
import { usePathname } from "next/navigation";
import { DemandeColumns, DemandeLivraison } from "./livreColumns";
import { DataTableLivraison } from "./DataTableLivraison";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { FormSchema, SelectionCompagne } from "@/Schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DataTableExportattion } from "./DataTableExportation";
import * as XLSX from 'xlsx'; // Importer SheetJS pour lire le fichier Excel
export default function ContentCommerce() {
    const [fileName, setFileName] = useState("");
    const path = usePathname();
    const [DemandeLivraison, setDemandeLivraison] = useState<DemandeLivraison[]>(
        []
    );
    const [ListeContact, setListeContact] = useState<User[]>([]);
    const [selectCompagner, setselectCompagner] = useState([]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
        } else {
            setFileName("Aucun fichier sélectionné");
        }
    };

    const selcte = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            Compagne: "",
            file: null,
        },
    });

    const fetchCompagner = async () => {
        const apiUrl = `http://127.0.0.1/Vox_Backend/api.php?method=Compagnes`;

        try {
            const response = await fetch(apiUrl, { method: "GET" });

            if (!response.ok) {
                console.error("Erreur lors de l'exécution de la requête.");
                return;
            }

            const responseData = await response.json();

            if (responseData.error) {
                console.error("Erreur du serveur:", responseData.error);
                return;
            }

            setselectCompagner(responseData);
        } catch (error) {
            console.error("Erreur lors de la récupération des campagnes:", error);
        }
    };

    const handleChange = async (value: z.infer<typeof SelectionCompagne>) => {
        fetchContactQualifier(value);
    };

    const fetchDemandeLivraison = async () => {
        const apiUrl = `http://127.0.0.1/Vox_Backend/api.php?method=DemandeLivraison`;
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
    };

    const fetchContactQualifier = async (
        value: z.infer<typeof SelectionCompagne>
    ) => {
        const apiUrl = `http://127.0.0.1/Vox_Backend/api.php?method=AfficherRapel`;
        try {
            const playload = {
                Compagne: value,
            };
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
    };

    // Fonction pour lire et transformer le fichier Excel en JSON
    const readExcelFile = (file: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const binaryStr = e.target?.result;
                const workbook = XLSX.read(binaryStr, { type: 'binary' });

                const sheetName = workbook.SheetNames[0]; // Récupère la première feuille
                const sheet = workbook.Sheets[sheetName];

                // Convertir la feuille en JSON
                const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });
                resolve(jsonData);
            };

            reader.onerror = (err) => {
                reject(err);
            };

            reader.readAsBinaryString(file);
        });
    };

    const onsubmit = async (values: z.infer<typeof FormSchema>) => {
        const apiUrl = `http://127.0.0.1/Vox_Backend/api.php?method=InsertDataImported&id=7`; // Correction de l'URL
        try {
            // Lire le fichier Excel et convertir en JSON
            const data = await readExcelFile(values.file);

            // Préparation des données à envoyer
            const payload = {
                Compagne: values.Compagne,
                DataImport: data
            };

            // Envoi de la requête POST
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload), // Conversion en JSON
            });

            // Vérifier la réponse HTTP
            if (!response.ok) {
                throw new Error(`Erreur lors de l'exécution, statut: ${response.status}`);
            }

            // Traitement de la réponse JSON
            const responseData = await response.json();

            // Gestion des erreurs côté API
            if (responseData.error) {
                console.error('Erreur de l\'API :', responseData.error);
            } else if (responseData.success) {
                console.log('Succès :', responseData.success);
            } else {
                console.warn('Réponse inattendue:', responseData);
            }
        } catch (error) {
            // Gestion des erreurs locales
            console.error('Erreur lors de la soumission:', error);
        }
    };




    useEffect(() => {
        fetchDemandeLivraison();
        fetchCompagner();
    }, []);

    return (
        <main>
            {path && path === "/Commercial/importation" && (
                <div className="h-max p-4 text-blue">
                    <Form {...selcte} >
                        <form className="bg-blanc w-full h-max rounded-lg shadow-blue p-2 flex gap-2 flex-col" onSubmit={selcte.handleSubmit(onsubmit)}>
                            <div className="w-full">
                                <FormField
                                    control={selcte.control}
                                    name="Compagne"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Select
                                                    {...field}
                                                    onValueChange={(value) => field.onChange(value)}
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
                                                            <p>Aucune campagne disponible</p>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            {selcte.formState.errors.Compagne && (
                                                <FormMessage>
                                                    {selcte.formState.errors.Compagne.message}
                                                </FormMessage>
                                            )}
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="w-full flex justify-center">
                                <label className="cursor-pointer inline-flex items-center bg-blue-500 text-blue font-bold py-2 px-4 rounded-lg">
                                    <Download className="mr-2" />
                                    Importation
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => {
                                            handleFileChange(e);
                                            selcte.setValue("file", e.target.files?.[0] || null);
                                        }}
                                    />
                                </label>

                                {fileName && <p className="mt-2 text-blue">{fileName}</p>}
                                {selcte.formState.errors.file && (
                                    <FormMessage>
                                        {selcte.formState.errors.file.message}
                                    </FormMessage>
                                )}
                            </div>

                            <div className="w-full flex justify-end px-2">
                                <button
                                    type="submit"
                                    className="text-white bg-blue hover:bg-blue/90 duration-300 px-4 w-max py-1 rounded-lg inline-block"
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </Form>
                    <h1 className="text-md font-medium py-2">
                        Liste de contact à appeler et leur qualification
                    </h1>
                    <DataTableImportation
                        data={ListeContact}
                        columns={Columns}
                        typeName="Nom"
                        FetchData={handleChange}
                    />
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
                                        <FormControl>
                                            <Select
                                                {...field}
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                    handleChange(value);
                                                }}
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
                                                        <p>Aucune campagne disponible</p>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </Form>
                    </div>
                    <h1 className="text-md font-medium py-2">
                        Liste de contact à appeler et leur qualification
                    </h1>
                    <DataTableExportattion
                        data={ListeContact}
                        columns={Columns}
                        typeName="Nom"
                    />
                </div>
            )}

            {path && path === "/Commercial/Demande_livraison" && (
                <div className="h-max p-4 text-blue">
                    <h1 className="text-md font-medium py-2">
                        Liste de demande livraison
                    </h1>
                    <DataTableLivraison
                        data={DemandeLivraison}
                        columns={DemandeColumns}
                        typeName="Nom"
                    />
                </div>
            )}
        </main>
    );
}
