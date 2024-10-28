import { useState, useEffect } from "react";
import { HistoColumns, HistoData } from "./Culumns/HistoColumn";
import { DataTableLivraison } from "../AgentCommerce/DataTableLivraison";

export default function Historique() {
    // État pour stocker les données de l'historique
    const [historiqueData, setHistoData] = useState<HistoData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Fonction pour récupérer les données de l'API
    const fetchHistorique = async (): Promise<void> => {
        const api = `http://192.168.100.4:8080/Vox_Backend/api.php?method=showHistorique`;
        setLoading(true); // Indicateur de chargement
        try {
            const response = await fetch(api, { method: "GET" });
            if (!response.ok) {
                throw new Error(`Erreur ${response.status}: ${response.statusText}`);
            }
            const data: HistoData[] | { error: string } = await response.json();

            // Vérification et mise à jour des données si elles existent
            if ("error" in data) {
                setError(data.error);
            } else {
                setHistoData(data);
            }
        } catch (error) {
            setError("Erreur lors de la récupération des données.");
        } finally {
            setLoading(false); // Arrêter l'indicateur de chargement
        }
    };

    // Utiliser useEffect pour appeler fetchHistorique au montage du composant
    useEffect(() => {
        fetchHistorique();
    }, []);

    // Affichage des erreurs ou de l'indicateur de chargement
    if (loading) return <p>Chargement des données...</p>;
    if (error) return <p>{error}</p>;

    return (
        <DataTableLivraison data={historiqueData} columns={HistoColumns} typeName="Nom" />
    );
}
