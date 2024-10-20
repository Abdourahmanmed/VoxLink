import { useEffect, useState } from "react";
import { DataTableImportation } from "../ReUsableDataTable";
import { ImportedData, ImportedColumns } from "./Culumns/CulumnsDataImported";
import { SelectionCompagne } from "@/Schemas";
import { z } from "zod";
import { useAppContext } from "../context/AppContext";

export default function DataImported() {
    //state 
    const { ContactData,setContactData } = useAppContext()

    //comportement
    const FetchCOntactData = async (value: z.infer<typeof SelectionCompagne>) => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=AfficherContactAujourdhui`;
        try {
            const playload = {
                Compagne : value
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
                setContactData([]);
            } else {
                setContactData(responseData);
            }

        } catch (error) {
            console.log('Erreur : ', error);
        }
    }
    //render
    return (
        <div>
            <DataTableImportation data={ContactData} columns={ImportedColumns} typeName="Nom" FetchData={FetchCOntactData} />
        </div>
    )
}