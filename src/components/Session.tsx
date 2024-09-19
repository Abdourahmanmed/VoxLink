'use client';
import { useSession } from 'next-auth/react';

export default function Session() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-6 w-5 border-t-4 border-green-500 border-solid border-transparent"></div>
            <small className="ml-2">Chargement...</small>
        </div>; // Afficher un message pendant le chargement
    }

    if (status === 'authenticated' && session?.user?.name) {
        return <span>{session.user.name}</span>; // Afficher le nom de l'utilisateur
    }

    return <span>Invité</span>;  // Si l'utilisateur n'est pas connecté
}
