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
import { DemandeLivraison, FormQuickPost, SelectionCompagne } from "@/Schemas";
import { FormError } from "../FormError";
import { Button } from "../ui/button";
import { FormSucces } from "../FormSucces";
import { Rappel, RappelColumn } from "./RappelColumn";
import { useSession } from "next-auth/react";
import { useUser } from "../IdUserProviders";
import { Input } from "../ui/input";
import { QuickPostData } from "./QuickPostData";
import { QuickLivraison, Quickcolumns } from "./QuickColumns";
import DemandeLivraisons from "./comonents/DemandeLivraison";
import Rappeller from "./comonents/Rappeller";
import ReponduState from "./comonents/Repondu";
import Indisponible from "./comonents/Indisponible";
import AboutiState from "./comonents/Abouti";
import TousLeRappels from "./comonents/TousLesRapels";
import QuickPostes from "./comonents/QuickPoste";

interface TitleProps {
    title: string;
}

export default function Content({ title }: TitleProps) {
    const path = usePathname();
    const {contacts, Data} = useAppContext();
    
   
    const { data: session, status } = useSession();
    // Utilisation de useEffect pour déclencher la récupération des contacts à chaque changement de titre
    useEffect(() => {

        if (status === "authenticated" && session?.user?.id) {
            // Remplacez `contacts` par votre fonction pour récupérer les contacts
            contacts(session.user.id, title); // Assurez-vous que `title` est défini dans le composant
        }
    }, [status, session?.user?.id, title]);


    return (
        <>
            {path === "/Teleconseiller/Demande_livraison" ? (
              <DemandeLivraisons />
            ) : path === "/Teleconseiller/Status_des_appels/Rappeller" ? (
                <Rappeller />
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
            ) : (
                <div className="flex gap-4">
                    <div className="bg-white w-[50%] h-max rounded p-4 shadow-blue">
                        <h1 className="text-center capitalize p-4 text-blue font-semibold">Liste de contacts</h1>

                        {status === "loading" ? (
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
