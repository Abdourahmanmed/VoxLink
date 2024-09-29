// context/UserContext.tsx

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '@/auth'; // Assurez-vous que le chemin est correct

// Interface pour représenter les informations de l'utilisateur
interface User {
    id: string;
    name: string;
    email: string;
    // Ajoutez d'autres propriétés utilisateur selon vos besoins
}

interface UserContextType {
    user: User | null; // L'utilisateur peut être null si non authentifié
    loading: boolean;   // Indique si le chargement est en cours
}

// Création du contexte avec un type par défaut
const UserContext = createContext<UserContextType | undefined>(undefined);

// Props pour le provider
interface UserProviderProps {
    children: ReactNode;
}

// Composant UserProvider
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const session = await auth(); // Appel de la fonction d'authentification
                if (session?.user) {
                    setUser({
                        id: session.user.id,
                        name: session.user.name,
                        email: session.user.email,
                        // Ajoutez d'autres propriétés ici
                    });
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des informations utilisateur :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook personnalisé pour utiliser le contexte
export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
