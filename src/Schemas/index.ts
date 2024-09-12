import * as z from "zod";


export const LoginSchema = z.object({
    email: z.string().email({
        message: "l'email est obligatoire"
    }),
    password: z.string().min(1, {
        message: "le password est obligatoire."
    })
});

export const RegisterSchema = z.object({
    nom: z.string().min(1, { message: "le Nom  est obligatoire." }),
    email: z.string().email({
        message: "l'email est obligatoire"
    }),
    password: z.string().min(1, {
        message: "le password est obligatoire."
    }),
    telephone: z.string().min(1, {
        message: "le Telephone est obligatoire."
    }),
    adresse: z.string().min(1, {
        message: "l'adresse est obligatoire."
    })
});

export const CompagneSchema = z.object({
    nom: z.string().min(1, { message: "le Nom  est obligatoire." }),
    societe: z.string().min(1, {
        message: "la societe  est obligatoire"
    }),
    script: z.string().min(1, {
        message: "le script est obligatoire"
    }),

});

// Schéma Zod pour la validation
export const affectationSchema = z.object({
    campagne: z.enum(["Recouvrement", "E-suuq", "Colis-Ems", "petit_paquet", "Amazone", "Essuq-prospection"]),
    contactId: z.string(),
    agentsIds: z.array(z.string()).nonempty("Veuillez sélectionner au moins un contact.")
});

// Define Zod schema for form validation
export const qualificationSchema = z.object({
    qualifier: z.string().min(1, "Qualification est obligatoire."),
    commentaire: z.string().min(1, "le commentaire est obligatoire."),
});


// Pour la demande de livraison
export const DemandeLivraison = z.object({
    Compagne: z.string().min(1, "La sélection d'une compagne est obligatoire."),
    Nom: z.string().min(1, "Le nom est obligatoire."),
    Telephone: z.string().min(1, "Le numéro de téléphone est obligatoire."),
    Adresse: z.string().min(1, "L'adresse est obligatoire."),
    Date_livraison: z.string().min(1, "La date de livraison est obligatoire."),
});








