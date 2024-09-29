import { useState } from "react";
import { DataTableImportation } from "../ReUsableDataTable";
import { Report, ReportColumns } from "./Culumns/CulumnReport";
import { SelectionCompagne } from "@/Schemas";
import { z } from "zod";

export default function StateCAll() {
    const [StatusAppel, SetStatusAppel] = useState<Report[]>([]);
    //fonction qui permet de recupere les status des apples surtout les appelle positves 
    const FetchStatus = async (value: z.infer<typeof SelectionCompagne>) => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=AfficherAppelPositiveParCompagne`;
        try {
            const playload = {
                Compagne: value
            }
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(playload),
            })
            const responseData = await response.json();

            if (!response.ok || responseData.error) {
                console.log(responseData.error || "Une erreur réseau a été détectée.");
            } else {
                SetStatusAppel(responseData);
            }

        } catch (error) {
            console.log('Erreur : ', error);
        }
    }
    return (
        <div>
            <DataTableImportation data={StatusAppel} columns={ReportColumns} typeName="Nom" FetchData={FetchStatus} />
        </div>
    )
}