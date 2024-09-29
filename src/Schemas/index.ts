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
    Nom: z.string().min(1, { message: "le Nom  est obligatoire." }),
    Email: z.string().email({
        message: "l'email est obligatoire"
    }),
    Password: z.string().min(1, {
        message: "le password est obligatoire."
    }),
    Telephone: z.string().min(1, {
        message: "le Telephone est obligatoire."
    }),
    Adresse: z.string().min(1, {
        message: "l'adresse est obligatoire."
    }),
    Role: z.string().min(1, {
        message: "choisir un role."
    })
});

export const CompagneSchema = z.object({
    Nom: z.string().min(1, { message: "le Nom  est obligatoire." }),
    Societe: z.string().min(1, {
        message: "la societe  est obligatoire"
    }),
    Script: z.string().min(1, {
        message: "le script est obligatoire"
    }),

});

// Schéma Zod pour la validation
export const affectationSchema = z.object({
    campagne: z.string().min(1, "Veuillez sélectionner une campagne."),
    AgentsId: z.string().min(1, "Veuillez sélectionner un agent."),
    ContactIds: z.array(z.string()).min(1, "Veuillez sélectionner au moins un contact."),
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
// Pour la demande de livraison
export const SelectionCompagne = z.object({
    Compagne: z.string().min(1, "La sélection d'une compagne est obligatoire."),
});


export const ContactShema = z.object({
    Nom: z.string().min(1, "le Nom est obligatoire."),
    Email: z.string().email({
        message: "l'email est obligatoire"
    }),
    Telephone: z.string().min(1, "Telephone est obligatoire."),
    Adresse: z.string().min(1, "Adresse est obligatoire."),
    Provenance: z.string().min(1, "Provenance est obligatoire."),
    Date_Enregistrement: z.string().min(1, "Date Enregistrement est obligatoire."),
    Nombre_colis: z.number().min(1, "Nombre de colis est obligatoire."),
    Poids: z.string().min(1, "Le poid est obligatoire."),
    Frais_Postaux: z.string().min(1, "Frais_postaux est obligatoire."),
    Frais_Douane: z.string().min(1, "Frais douane est obligatoire."),
    Reference: z.string().min(1, "La reference est obligatoire."),
    Date_Abonnement: z.string().min(1, "Date abonnement  est obligatoire."),
    Nationalite: z.string().min(1, "Nationalite est obligatoire."),
})


// Schéma de validation avec Zod
export const FormSchema = z.object({
    Compagne: z.string().nonempty("Veuillez sélectionner une compagne"),  // Validation pour le champ 'Compagne'
    file: z.instanceof(File).nullable().refine((file) => file !== null, {
      message: "Veuillez importer un fichier",
    }),
  });
  






