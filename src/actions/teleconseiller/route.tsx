


export const AfficherCompagne = async () => {
    try {
        // URL de l'API
        const url = "http://127.0.0.1/Vox_Backend/api.php?method=Compagnes";

        // Faire une requête GET à l'API
        const response = await fetch(url);

        // Vérifier si la requête est réussie
        if (!response.ok) {
            throw new Error(`Erreur HTTP! Status: ${response.status}`);
        }

        // Extraire les données au format JSON
        const data = await response.json();

        if (data.error) {
            return data.error;
        }

        // Retourner les données si vous voulez les utiliser ailleurs
        return data;
    } catch (error) {
        // Gérer les erreurs
        console.error("Erreur lors de la récupération des compagnes:", error);
        return null; // Retourner null ou une valeur par défaut en cas d'erreur
    }
};
