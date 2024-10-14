"use client";
import { useEffect, useState } from "react";
import { QuickPostData } from "../QuickPostData";
import { TousLescontact, TousLescontactColumns } from "../TousCallContac";

export default function TousLesIndisponibles() {
    // state
    const [QuickPoste, setQuickPoste] = useState<TousLescontact[]>([])

    //comportement 
    const fetchAllInsponibles = async () => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=AfficherTousLesInsdisponibles`;
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
            });

            // Vérifier si la réponse est OK
            const responseData = await response.json();
            if (response.ok) {
                if (responseData) {
                    setQuickPoste(responseData);  // Utiliser un setter commençant par une minuscule
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

     //use effect traitement 
     useEffect(() => {
        fetchAllInsponibles();
    }, []);

    //render
    return (
        <div className="bg-white w-[100%] h-max rounded shadow-blue p-4 mb-4">
            <QuickPostData data={QuickPoste} columns={TousLescontactColumns} typeName="Nom" />
        </div>
    )
}