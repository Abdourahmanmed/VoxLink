import { useState } from "react";
import { Report, ReportColumns } from "./Culumns/CulumnReport";
import { SelectionCompagne } from "@/Schemas";
import { z } from "zod";
import { DataTableReaffect } from "./DataTableReaffect";

export default function Reacffectation() {
    const [StatusAppel, SetStatusAppel] = useState<Report[]>([]);
    //fonction qui permet de recupere les status des apples surtout les appelle positves 
    const FetchStatus = async (value: z.infer<typeof SelectionCompagne>) => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=AfficherAppelNegativeParCompagne`;
        try {
            const playload = {
                Compagne: value
            }
            // console.log(playload);
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(playload),
            })
            const responseData = await response.json();

            if (!response.ok) {
                console.log("Une erreur réseau a été détectée.");
            }

            if (responseData.error) {
                console.log(responseData.error);
            }
            SetStatusAppel(responseData);
            // console.log(responseData);

        } catch (error) {
            console.log('Erreur : ', error);
        }
    }
    return (
        <div>
            <DataTableReaffect data={StatusAppel} columns={ReportColumns} typeName="Nom" FetchData={FetchStatus} />
        </div>
    )
}