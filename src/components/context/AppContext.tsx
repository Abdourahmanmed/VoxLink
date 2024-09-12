"use client";
// contexts/AppContext.tsx
import { qualificationSchema } from '@/Schemas';
import { createContext, useContext, useState, useTransition, ReactNode } from 'react';
import { z } from 'zod';
import { User } from '../AgentsTels/columns';
import { title } from 'process';

// Définir le type pour le contexte
interface AppContextType {
    onSubmit: (values: z.infer<typeof qualificationSchema>, id: string) => void;
    contacts: (title: string) => void;
    successMessage?: string;
    errorMessage?: string;
    isPending: boolean;
    loading: boolean;
    Data:User[];

}

// Créer le contexte avec un type générique
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [isPending, startTransition] = useTransition();
    const [Data, setData] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Indicateur de chargement

    
    const contacts = async (title:string) => {
        const apiUrl = `http://127.0.0.1/Vox_Backend/api.php?method=ContactsTEleconseil`;
        try {
            setLoading(true); // Activation de l'indicateur de chargement
            const payload = {
                Nom: title
            };

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Erreur réseau détectée");
            }

            const responseData = await response.json();
            if (responseData.error) {
                console.log(responseData.error);
            } else {
                setData(responseData);
                console.log(responseData[0]?.Script);
            }
        } catch (error) {
            console.error("Erreur lors de l'enregistrement des données:", error);
        } finally {
            setLoading(false); // Désactivation de l'indicateur de chargement
        }
    };
    
    
    const onSubmit = async (values: z.infer<typeof qualificationSchema>, id: string) => {
        const apiUrl = `http://127.0.0.1/Vox_Backend/api.php?method=Appel`;
        const payload = {
            qualifier: values.qualifier,
            commentaire: values.commentaire,
            id_contact: id,
            id_teleconseil: "1",
        };

        startTransition(async () => {
            try {
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                const responseData = await response.json();

                if (!response.ok || responseData.error) {
                    setErrorMessage(responseData.error || "Network error detected.");
                } else {
                    setSuccessMessage(responseData.success);
                }
            } catch (error) {
                setErrorMessage("Error while saving data.");
            }
        });
    };

    return (
        <AppContext.Provider value={{ onSubmit,contacts, successMessage, errorMessage, isPending,Data,loading }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
