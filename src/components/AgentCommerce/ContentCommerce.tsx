"use client";
import { ChangeEvent, useState } from "react";
import { DataTable } from "../DataTable";
import { Columns, User } from "./Columns";
import { Download } from 'lucide-react';
import { DataTableImportation } from "../ReUsableDataTable";
import { usePathname } from "next/navigation";
import { DataTableExportattion } from "./DataTableExportation";
import { DemandeColumns, DemandeLivraison } from "./livreColumns";
import { DataTableLivraison } from "./DataTableLivraison";


export default function ContentCommerce() {
    const [fileName, setFileName] = useState('');
    const path = usePathname();

    const Data: User[] = [  // Correction ici : data est maintenant un tableau d'objets User
        {
            id: '1',
            Nom: "Donald Trump",
            Telephone: 77323110
        },
        {
            id: '2',
            Nom: "fatouma ali",
            Telephone: 77323110
        },
        {
            id: '3',
            Nom: "teon hernandez",
            Telephone: 77323110
        },
        {
            id: '4',
            Nom: "Donald Trump",
            Telephone: 77323110
        },
        {
            id: '5',
            Nom: "fatouma ali",
            Telephone: 77323110
        },
        {
            id: '6',
            Nom: "teon hernandez",
            Telephone: 77323110
        },
        {
            id: '7',
            Nom: "Donald Trump",
            Telephone: 77323110
        },
        {
            id: '8',
            Nom: "fatouma ali",
            Telephone: 77323110
        },
        {
            id: '9',
            Nom: "teon hernandez",
            Telephone: 77323110
        },
        {
            id: '10',
            Nom: "teon hernandez",
            Telephone: 77323110
        }
    ];
    const Datas: DemandeLivraison[] = [  // Correction ici : data est maintenant un tableau d'objets User
        {
            id: "10",
            Nom: "abdi",
            Telephone: 77112110,
            adresse: "quartier 7",
            date: "27-01-2020"
        },
        {
            id: "11",
            Nom: "Ralia",
            Telephone: 77112110,
            adresse: "quartier 7",
            date: "27-01-2020"
        },
        {
            id: "12",
            Nom: "Halima",
            Telephone: 77112110,
            adresse: "quartier 7",
            date: "27-01-2020"
        },

    ];

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
        } else {
            setFileName('Aucun fichier sélectionné');
        }
    };


    return (
        <main>
            {path && path === "/Commercial/importation" && (
                <div className="h-max p-4 text-blue">
                    <form className="bg-blanc w-full h-max rounded-lg shadow-blue p-2 flex gap-2 flex-col">
                        <div className="w-full">
                            <select name="campagne" id="campagne" className="relative outline-none border border-blue rounded-lg px-4 w-max py-1 cursor-pointer">
                                <option value="Recouvrement">Recouvrement</option>
                                <option value="E-suuq">E-suuq</option>
                                <option value="Colis-Ems">Colis EMS</option>
                                <option value="petit_paquet">Petit Paquet</option>
                                <option value="Amazone">Amazone</option>
                            </select>
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
                    <DataTableImportation data={Data} columns={Columns} typeName="Nom" />
                </div>
            )}
            {path && path === "/Commercial/Exportation" && (
                <div className="h-max p-4 text-blue">
                    <div className="bg-blanc w-full h-max rounded-lg shadow-blue p-6 flex">
                        <select name="campagne" id="campagne" className="relative outline-none border border-blue rounded-lg px-4 w-full py-2 cursor-pointer">
                            <option value="Recouvrement">Recouvrement</option>
                            <option value="E-suuq">E-suuq</option>
                            <option value="Colis-Ems">Colis EMS</option>
                            <option value="petit_paquet">Petit Paquet</option>
                        </select>
                    </div>
                    <h1 className="text-md font-medium py-2">Liste de contact appeller et leur qualifcation</h1>
                    <DataTableExportattion data={Data} columns={Columns} typeName="Nom" />
                </div>
            )}
            {path && path === "/Commercial/Demande_livraison" && (
                <div className="h-max p-4 text-blue">
                    <h1 className="text-md font-medium py-2">Liste de demande livraison</h1>
                    <DataTableLivraison data={Datas} columns={DemandeColumns} typeName="Nom" />
                </div>
            )}

        </main>
    )
}