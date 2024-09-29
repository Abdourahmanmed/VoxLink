"use client";
// contexts/AppContext.tsx
import { CompagneSchema, ContactShema, qualificationSchema, RegisterSchema } from '@/Schemas';
import { createContext, useContext, useState, useTransition, ReactNode } from 'react';
import { z } from 'zod';
import { User } from '../AgentsTels/columns';
import { title } from 'process';
import { CompagneData } from '@/components/Superviseur/Culumns/CulumnsCompagner';
import { ImportedData } from '../Superviseur/Culumns/CulumnsDataImported';
import { Agents } from '../Superviseur/Culumns/CulumnsAgents';
import { useSession } from 'next-auth/react';
// Définir le type pour le contexte
interface AppContextType {
    onSubmit: (values: z.infer<typeof qualificationSchema>, id: string) => void;
    contacts: (id: string, title: string) => void;
    successMessage?: string;
    errorMessage?: string;
    isPending: boolean;
    loading: boolean;
    Data: User[];
    CompaData: CompagneData[];
    SetCompaData: (data: CompagneData[]) => void;
    onSubmitCompagne: (values: z.infer<typeof CompagneSchema>) => void;
    onSubmitUtilisateur: (values: z.infer<typeof RegisterSchema>) => void;
    setSuccessMessage: (data: string) => void;
    setErrorMessage: (data: string) => void;
    handleDelete: (event: React.FormEvent<HTMLFormElement>, id: string) => void;
    handleDeleteUser: (event: React.FormEvent<HTMLFormElement>, id: string) => void;
    EditerCompagne: (values: z.infer<typeof CompagneSchema>, id: string) => void;
    EditerContact: (values: z.infer<typeof ContactShema>, id: string) => void;
    ContactData: ImportedData[];
    setContactData: (data: ImportedData[]) => void;
    UsersData: Agents[],
    SetUsersData: (data: Agents[]) => void;
    EditerUser: (values: z.infer<typeof RegisterSchema>, id: string) => void;

}

// Créer le contexte avec un type générique
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [isPending, startTransition] = useTransition();
    const [Data, setData] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Indicateur de chargement
    const [CompaData, SetCompaData] = useState<CompagneData[]>([]); // c'est le gestion de data des compagnes .
    const [ContactData, setContactData] = useState<ImportedData[]>([]);
    const [UsersData, SetUsersData] = useState<Agents[]>([]);
    const { data: session, status } = useSession();
    const contacts = async (id: string, title: string) => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=ContactsTEleconseil&id=${id}`;
        // console.log(session?.user);
        try {
            setLoading(true); // Activation de l'indicateur de chargement
            const payload = {
                Nom: title
            };
            // console.log(title);
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
            }
        } catch (error) {
            console.error("Erreur lors de l'enregistrement des données:", error);
        } finally {
            setLoading(false); // Désactivation de l'indicateur de chargement
        }
    };
    
    // Ajouter utilisateur
    const onSubmitUtilisateur = async (values: z.infer<typeof RegisterSchema>) => {
        startTransition(async () => {
            const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=AjouterUser`;
            try {
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                });

                const responseData = await response.json();

                if (response.ok) {
                    setSuccessMessage(responseData.success);

                    // Ajoute la nouvelle compagne à la liste existante
                    SetUsersData((prevData) => [
                        ...prevData,
                        {
                            id: responseData.id,  // Assure-toi que l'API retourne un 'id'
                            Nom: values.Nom,      // Utilise la propriété 'Nom' avec une majuscule
                            Email: values.Email,
                            Password: values.Password,
                            Telephone: Number(values.Telephone),
                            Adresse: values.Adresse,
                            Role: values.Role,
                        }
                    ]);
                } else {
                    setErrorMessage(responseData.error || "Une erreur réseau a été détectée.");
                }
            } catch (error) {
                console.log(error);
                setErrorMessage("Une erreur est survenue lors de l'ajout de la compagne.");
            }
        });
    };
    // Ajouter une compagne
    const onSubmitCompagne = async (values: z.infer<typeof CompagneSchema>) => {
        startTransition(async () => {
            const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=AjouterCompagne&id=${session?.user?.id}`;
            try {
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                });

                const responseData = await response.json();

                if (response.ok) {
                    setSuccessMessage(responseData.success);

                    // Ajoute la nouvelle compagne à la liste existante
                    SetCompaData((prevData) => [
                        ...prevData,
                        {
                            id: responseData.id,  // Assure-toi que l'API retourne un 'id'
                            Nom: values.Nom,      // Utilise la propriété 'Nom' avec une majuscule
                            Societe: values.Societe,  // Propriété 'Societe' avec une majuscule
                            Script: values.Script,    // Propriété 'Script' avec une majuscule
                        }
                    ]);
                } else {
                    setErrorMessage(responseData.error || "Une erreur réseau a été détectée.");
                }
            } catch (error) {
                console.log(error);
                setErrorMessage("Une erreur est survenue lors de l'ajout de la compagne.");
            }
        });
    };
    // supprime une utilisateur
    const handleDeleteUser = async (event: React.FormEvent<HTMLFormElement>, id: string) => {
        event.preventDefault(); // Empêche la soumission par défaut du formulaire
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=SuprimerUser&id=${id}`;
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
            });
            const responseData = await response.json();

            if (!response.ok || responseData.error) {
                console.log(responseData.error || "Une erreur réseau a été détectée.");
                setErrorMessage(responseData.error || "Une erreur réseau a été détectée.");
            } else {
                setSuccessMessage(responseData.success);

                // Met à jour la liste des compagnes en filtrant l'élément supprimé
                SetUsersData(prevData => prevData.filter(compagne => compagne.id !== id));
            }
        } catch (error) {
            console.log("Une erreur est survenue :", error);
            setErrorMessage("Une erreur est survenue lors de la suppression de la compagne.");
        }
    };
    // supprime une compagne
    const handleDelete = async (event: React.FormEvent<HTMLFormElement>, id: string) => {
        event.preventDefault(); // Empêche la soumission par défaut du formulaire
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=DeleteCompagne&id=${id}`;
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
            });
            const responseData = await response.json();

            if (!response.ok || responseData.error) {
                console.log(responseData.error || "Une erreur réseau a été détectée.");
                setErrorMessage(responseData.error || "Une erreur réseau a été détectée.");
            } else {
                setSuccessMessage(responseData.success);

                // Met à jour la liste des compagnes en filtrant l'élément supprimé
                SetCompaData(prevData => prevData.filter(compagne => compagne.id !== id));
            }
        } catch (error) {
            console.log("Une erreur est survenue :", error);
            setErrorMessage("Une erreur est survenue lors de la suppression de la compagne.");
        }
    };
    // Fonction pour éditer une compagne
    const EditerCompagne = async (values: z.infer<typeof CompagneSchema>, id: string) => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=EditerCompagne&id=${id}`;

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values), // Transformation des données en JSON
            });

            const responseData = await response.json(); // Transformation de la réponse en JSON

            if (!response.ok) {
                // Gestion d'une réponse qui n'est pas ok (erreur)
                setErrorMessage("Une erreur est survenue lors de la modification.");
            }

            if (responseData.error) {
                // Gestion d'une réponse qui n'est pas ok (erreur)
                setErrorMessage(responseData.error);
            }

            // Mise à jour des messages de succès et des données si tout s'est bien passé
            setSuccessMessage(responseData.success);

            // Mise à jour de l'état local avec les nouvelles valeurs modifiées
            SetCompaData((prevCompaData) =>
                prevCompaData.map((compa) =>
                    compa.id === id ? { ...compa, ...values } : compa
                )
            );

        } catch (error) {
            // Affichage du message d'erreur
            console.error("Erreur lors de la modification de la compagne :", error);
        }
    };
    //fonction pour éditer un conctact
    const EditerContact = async (values: z.infer<typeof ContactShema>, id: string) => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=EditerUnContact&id=${id}`;

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values), // Transformation des données en JSON
            });

            const responseData = await response.json(); // Transformation de la réponse en JSON

            if (!response.ok) {
                // Gestion d'une réponse qui n'est pas ok (erreur)
                setErrorMessage("Une erreur est survenue lors de la modification.");
            }

            if (responseData.error) {
                // Gestion d'une réponse qui n'est pas ok (erreur)
                setErrorMessage(responseData.error);
            }

            // Mise à jour des messages de succès et des données si tout s'est bien passé
            setSuccessMessage(responseData.success);

            // Mise à jour de l'état local avec les nouvelles valeurs modifiées
            setContactData((prevCompaData) =>
                prevCompaData.map((compa) =>
                    compa.id === id ? { ...compa, ...values } : compa
                )
            );

        } catch (error) {
            // Affichage du message d'erreur
            console.error("Erreur lors de la modification de la compagne :", error);
        }
    };
    //fonction pour éditer un utilisateur
    const EditerUser = async (values: z.infer<typeof RegisterSchema>, id: string) => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=EditerUnUser&id=${id}`;

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values), // Transformation des données en JSON
            });

            const responseData = await response.json(); // Transformation de la réponse en JSON

            // Vérifier si la réponse est réussie (status code 2xx)
            if (!response.ok) {
                setErrorMessage(responseData.error || "Une erreur est survenue lors de la modification.");
                return;
            }

            // Si une erreur spécifique est retournée par l'API
            if (responseData.error) {
                setErrorMessage(responseData.error);
                return;
            }

            // Mise à jour des messages de succès et des données si tout s'est bien passé
            setSuccessMessage(responseData.success || "Modification réussie.");

            // Mise à jour de l'état local avec les nouvelles valeurs modifiées
            SetUsersData((prevCompaData) =>
                prevCompaData.map((compa) =>
                    compa.id === id ? { ...compa, ...values } : compa
                )
            );

        } catch (error) {
            // Affichage du message d'erreur dans la console en cas d'exception
            console.error("Erreur lors de la modification de l'utilisateur :", error);
            setErrorMessage("Une erreur est survenue lors de la modification.");
        }
    };






    // pour la qualification et gestion des appels.
    const onSubmit = async (values: z.infer<typeof qualificationSchema>, id: string) => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend/api.php?method=Appel`; // Correction du double slash
        const payload = {
            qualifier: values.qualifier,
            commentaire: values.commentaire,
            id_contact: id,
            id_teleconseil: session?.user?.id,
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

                    // Mettre à jour la liste des contacts pour ne plus afficher ceux qui ont été qualifiés
                    setData((prevContacts) =>
                        prevContacts.filter((contact) => contact.id !== id)
                    ); // Utilisation de id directement pour filtrer
                }
            } catch (error) {
                setErrorMessage("Error while saving data.");
            }
        });
    };


    return (
        <AppContext.Provider value={{ onSubmit, contacts, EditerCompagne, handleDeleteUser, successMessage, errorMessage, setSuccessMessage, setErrorMessage, isPending, Data, loading, CompaData, SetCompaData, onSubmitCompagne, handleDelete, EditerContact, ContactData, setContactData, UsersData, SetUsersData, onSubmitUtilisateur, EditerUser }}>
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
