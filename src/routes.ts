/**
 * An array of routes used for authentication.
 * These routes will redirect logged-in users to their respective interfaces.
 * @type {string[]}
 */
export const authRoutes = [
    "/",
];

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are used for authentication purposes.
 * @type {string}
 */
export const ApiauthPrefix = "/api/auth";

/**
 * The default redirect path after logging in.
 * @type {string}
 */
export const default_loggin_redirect = "/Superviseur/Dashboard";

/**
 * The default redirect path after logging in for users with the role "superviseur".
 * @type {string}
 */
export const default_Superviseur_redirect = "/Superviseur/Dashbord";

/**
 * The default redirect path after logging in for users with the role "teleconseiller".
 * @type {string}
 */
export const default_Teleconseiller_redirect = "/Teleconseiller/E-suuq";

/**
 * The default redirect path after logging in for users with the role "AgentCommerce".
 * @type {string}
 */
export const default_AgentCommerce_redirect = "/Commercial/importation";

/**
 * An array of routes used for authenticated users with the role "superviseur".
 * These routes correspond to the superviseur's interface.
 * @type {string[]}
 */
export const SuperviseurRoutes = [
    "/Superviseur/Dashbord",
    "/Superviseur/Affectation",
    "/Superviseur/Agents",
    "/Superviseur/Compagner",
    "/Superviseur/Donne_importer",
    "/Superviseur/status_des_appelles",
    "/Superviseur/Rapport",
    "/Superviseur/ReAffectation",
    "/Superviseur/QuicPoste",
    "/Superviseur/Repartition_des_Contacts",
];

/**
 * An array of routes used for authenticated users with the role "teleconseiller".
 * These routes correspond to the teleconseiller's interface.
 * @type {string[]}
 */
export const TeleconseilRoutes = [
    "/Teleconseiller/E-suuq",
    "/Teleconseiller/Colis-Ems",
    "/Teleconseiller/Petite_paquet",
    "/Teleconseiller/Demande_livraison",
    "/Teleconseiller/Recouvrement/Retard_paiement",
    "/Teleconseiller/Recouvrement/Redevance_annee",
    "/Teleconseiller/Recouvrement/Nouveau_Abonne",
    "/Teleconseiller/Status_des_appels/Repondu",
    "/Teleconseiller/Status_des_appels/Rappeller",
    "/Teleconseiller/Status_des_appels/Indisponible",
    "/Teleconseiller/Status_des_appels/Abouti",
    "/Teleconseiller/Status_des_appels/Tous_les_Rappels",
    "/Teleconseiller/Cartin",
    "/Teleconseiller/Quick_poste",
    "/Teleconseiller/Maison_Du_citoyens",
    "/Teleconseiller/E-suuq_Prospection",
    "/Teleconseiller/Status_des_appels/Tous_les_Indisponibles",
    "/Teleconseiller/Bonne_reception_de_la_facture_BP",
];

/**
 * An array of routes used for authenticated users with the role "AgentCommerce".
 * These routes correspond to the AgentCommerce's interface.
 * @type {string[]}
 */
export const CommercialRoutes = [
    "/Commercial/importation",
    "/Commercial/Exportation",
    "/Commercial/Demande_livraison",
    "/Commercial/Quick_Poste",
];
