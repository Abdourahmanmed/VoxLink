import { auth } from "@/auth";
import {
    authRoutes,
    ApiauthPrefix,
    default_loggin_redirect,
    default_Superviseur_redirect,
    default_Teleconseiller_redirect,
    default_AgentCommerce_redirect,
    SuperviseurRoutes,
    TeleconseilRoutes,
    CommercialRoutes,
} from "@/routes";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const role = req.auth?.user?.role;

    const isApiRoutes = nextUrl.pathname.startsWith(ApiauthPrefix);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isSuperviseurRoute = SuperviseurRoutes.includes(nextUrl.pathname);
    const isTeleconseillerRoute = TeleconseilRoutes.includes(nextUrl.pathname);
    const isCommercialRoute = CommercialRoutes.includes(nextUrl.pathname);

    // Vérifier si la route est une route API
    if (isApiRoutes) {
        return null;
    }

    // Si l'utilisateur est connecté
    if (isLoggedIn) {
        if (isSuperviseurRoute && role === "Superviseur") {
            return null; // Accès autorisé pour Superviseur
        }
        if (isTeleconseillerRoute && role === "Teleconseiller") {
            return null; // Accès autorisé pour Teleconseiller
        }
        if (isCommercialRoute && role === "AgentCommerce") {
            return null; // Accès autorisé pour AgentCommerce
        }

        // Redirection vers l'interface appropriée si l'utilisateur essaie d'accéder à une route qui ne lui est pas destinée
        if (role === "Superviseur") {
            return Response.redirect(new URL(default_Superviseur_redirect, nextUrl));
        }
        if (role === "Teleconseiller") {
            return Response.redirect(new URL(default_Teleconseiller_redirect, nextUrl));
        }
        if (role === "AgentCommerce") {
            return Response.redirect(new URL(default_AgentCommerce_redirect, nextUrl));
        }
    }

    // Redirection pour les utilisateurs non connectés vers la page d'accueil pour les routes protégées
    if (!isLoggedIn && !isAuthRoute) {
        return Response.redirect(new URL("/", nextUrl));
    }

    return null;
});

export const config = {
    matcher: [
        // Exclure les fichiers internes de Next.js et les fichiers statiques, sauf ceux trouvés dans les paramètres de recherche
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Toujours s'exécuter pour les routes API
        '/(api|trpc)(.*)',
    ],
};
