import { useEffect, useState, useTransition } from "react";
import CreateCompagne from "../FormCompagne";
import { ReUsableDataTableCrud } from "../ReUsableDataTableCrud";
import { CompagneColumns, CompagneData } from "../Superviseur/Culumns/CulumnsCompagner";
import * as z from "zod";
import { CompagneSchema } from "@/Schemas";
import { useAppContext } from "../context/AppContext";

export default function CrudCompagner() {
    const [loading, setLoading] = useState<boolean>(true); // Indicateur de chargement
    const [isPending, startTransition] = useTransition();
    const {CompaData, SetCompaData,onSubmitCompagne, successMessage, errorMessage,setSuccessMessage,setErrorMessage, } = useAppContext();
    // Récupérer les compagnes
    const fetchCompagne = async () => {
        const apiUrl = `http://127.0.0.1/Vox_Backend/api.php?method=Compagnes`;
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
            });

            const responseData = await response.json();

            if (!response.ok || responseData.error) {
                console.log(responseData.error || "Une erreur réseau a été détectée.");
                setErrorMessage(responseData.error || "Une erreur réseau a été détectée.");
            } else {
                SetCompaData(responseData);
            }
        } catch (error) {
            console.log("Une erreur est survenue :", error);
            setErrorMessage("Une erreur est survenue lors de la récupération des compagnes.");
        } finally {
            setLoading(false); // Désactiver le chargement
        }
    };

   


    useEffect(() => {
        fetchCompagne();
    }, []); // Ne pas inclure `onSubmit` dans les dépendances, car cela provoquerait des requêtes infinies

    return (
        <div>
            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-500 border-solid border-transparent"></div>
                    <small className="ml-2">Chargement...</small>
                </div>
            ) : (
                <ReUsableDataTableCrud
                    data={CompaData}
                    columns={CompagneColumns}
                    typeName="Nom"
                    poptitle="Ajouter une compagne"
                    children={
                        <CreateCompagne
                            successMessage={successMessage}
                            errorMessage={errorMessage}
                            isPending={isPending}
                            onSubmit={onSubmitCompagne}
                        />
                    }
                />
            )}
        </div>
    );
}
