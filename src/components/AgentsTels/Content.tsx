"use client";
import { usePathname } from "next/navigation";
import { DataTable } from "../DataTable";
import { columns } from "./columns";
import { useEffect } from "react";
import { useAppContext } from "@/components/context/AppContext";
import { useSession } from "next-auth/react";
import { ScrollArea } from "../ui/scroll-area";
import DemandeLivraisons from "./comonents/DemandeLivraison";
import Rappeller from "./comonents/Rappeller";
import ReponduState from "./comonents/Repondu";
import Indisponible from "./comonents/Indisponible";
import AboutiState from "./comonents/Abouti";
import TousLeRappels from "./comonents/TousLesRapels";
import QuickPostes from "./comonents/QuickPoste";
import TousLesIndisponibles from "./comonents/TousLesInsponibles";
import { Masscolumns } from "./MassCol";
import MassDelguer from "./MassDelguer";

// Titre dynamique
interface TitleProps {
    title: string;
}

export default function Content({ title }: TitleProps) {
    const path = usePathname();
    const { contacts, Data } = useAppContext();
    const { data: session, status } = useSession();

    // Utilisation de useEffect pour déclencher la récupération des contacts
    useEffect(() => {
        if (status === "authenticated" && session?.user?.id) {
            contacts(session.user.id, title);
        }
    }, [status, session?.user?.id, title]);

    return (
        <>
            {path === "/Teleconseiller/Demande_livraison" ? (
                <DemandeLivraisons />
            ) : path === "/Teleconseiller/Status_des_appels/Rappeller" ? (
                <Rappeller />
            ) : path === "/Teleconseiller/Mass_delegue" ? (
                <MassDelguer title={title} />
            ) : path === "/Teleconseiller/Status_des_appels/Repondu" ? (
                <ReponduState />
            ) : path === "/Teleconseiller/Status_des_appels/Indisponible" ? (
                <Indisponible />
            ) : path === "/Teleconseiller/Status_des_appels/Abouti" ? (
                <AboutiState />
            ) : path === "/Teleconseiller/Status_des_appels/Tous_les_Rappels" ? (
                <TousLeRappels />
            ) : path === "/Teleconseiller/Quick_poste" ? (
                <QuickPostes />
            ) : path === "/Teleconseiller/Status_des_appels/Tous_les_Indisponibles" ? (
                <TousLesIndisponibles />
            ) : path === "/Teleconseiller/Mass" ? (
                <div className="bg-white w-full h-max rounded p-4 shadow-blue">
                    <h1 className="text-center capitalize p-4 text-blue font-semibold">
                        Liste de contacts
                    </h1>

                    {status === "loading" ? (
                        <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-slate-500 border-solid border-transparent"></div>
                            <small className="ml-2">Chargement...</small>
                        </div>
                    ) : (
                        <DataTable data={Data} columns={Masscolumns} typeName="Nom" />
                    )}
                </div>
            ) : (
                <div className="flex gap-4">
                    <div className="bg-white w-[50%] h-max rounded p-4 shadow-blue">
                        <h1 className="text-center capitalize p-4 text-blue font-semibold">
                            Liste de contacts
                        </h1>

                        {status === "loading" ? (
                            <div className="flex justify-center items-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-slate-500 border-solid border-transparent"></div>
                                <small className="ml-2">Chargement...</small>
                            </div>
                        ) : (
                            <DataTable data={Data} columns={columns} typeName="Nom" />
                        )}
                    </div>

                    <ScrollArea className="bg-white w-[50%] h-[446px] rounded shadow-blue overflow-hidden">
                        <h1 className="text-center capitalize p-4 text-blue font-semibold">
                            Script
                        </h1>
                        <div className="w-full h-full text-blue p-4">
                            {Data && Data.length > 0 ? (
                                <div>{Data[0].Script}</div>
                            ) : (
                                <div>Il n'y a aucun contact pour le moment.</div>
                            )}
                        </div>
                        {path === "/Teleconseiller/Maison_Du_citoyens" && (
                            <div className="w-full h-full text-blue p-4">
                                <h4 className="font-bold mt-2">
                                    TARIFICATION DE QUICK POST PENDANT LES JOURS OUVRABLES
                                </h4>

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
                                            <td className="border px-4 py-2">
                                                Quartier 1,2,3,4,5,6 et 7
                                            </td>
                                            <td className="border px-4 py-2">350 DJF</td>
                                        </tr>
                                        <tr>
                                            <td className="border px-4 py-2">3</td>
                                            <td className="border px-4 py-2">
                                                Q7bis, Ambouli, Jabel, Haramous, Gabode
                                            </td>
                                            <td className="border px-4 py-2">500 DJF</td>
                                        </tr>
                                        <tr>
                                            <td className="border px-4 py-2">4</td>
                                            <td className="border px-4 py-2">
                                                Cheick Moussa / Place Holl-Holl
                                            </td>
                                            <td className="border px-4 py-2">700 DJF</td>
                                        </tr>
                                        <tr>
                                            <td className="border px-4 py-2">5</td>
                                            <td className="border px-4 py-2">
                                                4ème Arrondissement / Place Hayableh / Barwaqo 1
                                            </td>
                                            <td className="border px-4 py-2">700 DJF</td>
                                        </tr>
                                        <tr>
                                            <td className="border px-4 py-2">6</td>
                                            <td className="border px-4 py-2">
                                                Hodan / PK12 / PK 13 / Nassib / Barwaqo 2
                                            </td>
                                            <td className="border px-4 py-2">1250 DJF</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <h4 className="font-bold mt-4">
                                    Frais de Livraison de 17h00 à 21h00 pour les jours ouvrables :
                                </h4>
                                <ul className="list-disc list-inside mt-2">
                                    <li>ZONE 1 & 2 : 500 DJF</li>
                                    <li>ZONE 3 : 750 DJF</li>
                                    <li>ZONE 4 & 5 : 1250 DJF</li>
                                    <li>ZONE 6 : 1500 DJF</li>
                                </ul>

                                <h4 className="font-bold mt-4">
                                    TARIFICATION DE QUICK POST PENDANT LES WEEKENDS
                                </h4>
                                <ul className="list-disc list-inside mt-2">
                                    <li>ZONE 1 & 2 : 500 DJF</li>
                                    <li>ZONE 3 : 750 DJF</li>
                                    <li>ZONE 4 & 5 : 1250 DJF</li>
                                    <li>ZONE 6 : 1500 DJF</li>
                                </ul>

                                <h4 className="font-bold mt-4">
                                    TARIFICATION DE QUICK POST POUR LES COLIS VOLUMINEUX
                                </h4>
                                <p>
                                    Frais de livraison de 8h00 à 17h00 pour les jours ouvrables et
                                    les weekends :
                                </p>
                                <ul className="list-disc list-inside mt-2">
                                    <li>ZONE 1, 2 & 3 : 1500 DJF</li>
                                    <li>ZONE 4, 5 & 6 : 3000 DJF</li>
                                </ul>

                                <p className="mt-4">
                                    Frais de livraison de 17h00 à 21h00 pour les jours ouvrables
                                    et les weekends :
                                </p>
                                <ul className="list-disc list-inside mt-2">
                                    <li>ZONE 1, 2 & 3 : 2000 DJF</li>
                                    <li>ZONE 4, 5 & 6 : 3500 DJF</li>
                                </ul>

                                <p className="font-bold mt-6">950 DJF</p>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            )}
        </>
    );
}
