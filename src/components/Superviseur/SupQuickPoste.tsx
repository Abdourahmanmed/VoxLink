import { useEffect } from "react";
import { Quickcolumns } from "../AgentsTels/QuickColumns";
import { QuickPostData } from "../AgentsTels/QuickPostData";
import { useAppContext } from "../context/AppContext";


export default function SupQuickPoste() {
    const { setQuickPoste,QuickPoste } = useAppContext();

    //fonction fetch QuickPoste 
    const fetchQuickPoste = async () => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=afficherQuickPoste`;

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
            setQuickPoste(responseData);

        } catch (error) {
            console.error("Erreur lors de la récupération des campagnes:", error);
        }
    };
    
    //useEffect Traitement 

    useEffect(() => {
        fetchQuickPoste();
    }, [])
    return (
        <div className="bg-white w-[100%] h-max rounded shadow-blue p-4 mb-4">
            <QuickPostData data={QuickPoste} columns={Quickcolumns} typeName="Nom" />
        </div>
    )
}