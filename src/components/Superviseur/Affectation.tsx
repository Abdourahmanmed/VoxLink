"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { affectationSchema } from "@/Schemas";
import { z } from "zod";
import { ScrollArea } from "../ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState, useTransition } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { FormError } from "../FormError";
import { FormSucces } from "../FormSucces";

export default function Affectation() {
    // States
    const [isPending, startTransition] = useTransition();
    const [agents, setAgents] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [selectedContacts, setSelectedContacts] = useState([]); // Contacts sélectionnés
    const [selectCompagner, setselectCompagner] = useState([]);

    // Fetch agents  logic here...
    const fetchAgents = async () => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=AfficherPourSuperviseurTele`;
        try {
            const response = await fetch(apiUrl, { method: 'GET' });

            if (!response.ok) {
                console.error("Erreur lors de l'exécution de la requête.");
                return;
            }

            const responseData = await response.json();

            if (responseData.error) {
                console.error("Erreur du serveur:", responseData.error);
                return;
            }

            setAgents(responseData);
        } catch (error) {
            console.error("Erreur lors de la récupération des contacts:", error);
        }
    };

    // Fetch contacts logic here...
    const fetchContacts = async (value) => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=AfficherContactAujourdhui`;
        try {
            const playload = {
                Compagne: value
            }
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(playload),
            })
            const responseData = await response.json();

            if (!response.ok || responseData.error) {
                console.log(responseData.error || "Une erreur réseau a été détectée.");
                setContacts([]);
            } else {
                setContacts(responseData);
            }

        } catch (error) {
            console.log('Erreur : ', error);
        }
    };

    //Fetch compagnes logic here...
    const fetchCompagner = async () => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=Compagnes`;

        try {
            const response = await fetch(apiUrl, { method: 'GET' });

            // Vérification de la réponse
            if (!response.ok) {
                console.error("Erreur lors de l'exécution de la requête.");
                return;
            }

            const responseData = await response.json();

            // Vérification des erreurs dans la réponse
            if (responseData.error) {
                console.error("Erreur du serveur:", responseData.error);
                return;
            }

            // Mettre à jour l'état avec les données récupérées
            setselectCompagner(responseData);

        } catch (error) {
            console.error("Erreur lors de la récupération des campagnes:", error);
        }
    };

    //le useEffect pour afficher les donnes.
    useEffect(() => {
        fetchAgents();
        fetchCompagner();
    }, []);

    // Form initialization
    const form = useForm<z.infer<typeof affectationSchema>>({
        resolver: zodResolver(affectationSchema),
        defaultValues: {
            campagne: "",
            AgentsId: "",
            ContactIds: [], // Stocker les IDs des contacts sélectionnés
        },
    });

    // Gestion de la soumission du formulaire
    const onSubmit = (values: z.infer<typeof affectationSchema>) => {
        startTransition(async () => {
            const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=Affectation`;
            try {
                // Envoi de la requête POST avec les données du formulaire
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                });

                // Vérification de la requête
                if (!response.ok) {
                    setErrorMessage("Erreur lors de l'exécution de la requête.");
                    return; // Arrêter l'exécution si la requête a échoué
                }

                const responseData = await response.json();

                if (responseData.error) {
                    setErrorMessage(responseData.error);
                } else if (responseData.success) {
                    setSuccessMessage(responseData.success);

                    // Mettre à jour la liste des contacts pour ne plus afficher ceux qui ont été affectés
                    setContacts((prevContacts) => prevContacts.filter(
                        (contact) => !values.ContactIds.includes(String(contact.id))
                    ));

                    // Réinitialiser les contacts sélectionnés
                    setSelectedContacts([]);
                }

            } catch (error) {
                console.error("Erreur :", error);
                setErrorMessage("Une erreur est survenue lors de la soumission.");
            }
        });
    };



    // Gestion des contacts sélectionnés
    const handleContactSelection = (contactId: string, checked: boolean) => {
        if (checked) {
            setSelectedContacts((prev) => [...prev, contactId]); // Ajouter le contact s'il est coché
        } else {
            setSelectedContacts((prev) => prev.filter((id) => id !== contactId)); // Retirer s'il est décoché
        }
    };

    // Mettre à jour le champ ContactIds lorsque les contacts changent
    useEffect(() => {
        form.setValue("ContactIds", selectedContacts);
    }, [selectedContacts, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="h-max p-4 text-blue">
                    <div className="bg-blanc w-full h-max rounded-lg shadow-blue p-2 flex">
                        {/* Sélection de la campagne */}
                        <FormField
                            control={form.control}
                            name="campagne"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <Select onValueChange={(value) => {
                                        field.onChange(value);  // Mettre à jour la valeur du formulaire
                                        fetchContacts(value);    // Effectuer des actions supplémentaires
                                    }} value={field.value}>
                                        <SelectTrigger className="relative outline-none border border-blue rounded-lg px-4 flex flex-1 py-1 cursor-pointer">
                                            <SelectValue placeholder="Sélectionnez une campagne" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {selectCompagner && selectCompagner.length > 0 ? (
                                                selectCompagner.map((items, index) => (
                                                    <SelectItem value={items.Nom} key={index}>
                                                        {items.Nom}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <p>Aucune campagne disponible</p> // Message à afficher si la liste est vide
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Liste des agents */}
                <div className="h-max p-4 text-blue">
                    <div className="bg-blanc w-full h-max rounded-lg shadow-blue p-2 flex gap-8 flex-col">
                        <div className="flex gap-20 w-full">
                            <div className="px-2 w-1/2">
                                <h1 className="text-blue font-semibold py-2">Liste des agents</h1>
                                <ScrollArea className="border border-blue rounded-lg w-full h-[200px]">
                                    <FormField
                                        control={form.control}
                                        name="AgentsId"
                                        render={({ field }) => (
                                            <RadioGroup value={field.value} onValueChange={field.onChange}>
                                                {agents.length > 0 ? (
                                                    agents.map((agent) => (
                                                        <FormItem key={String(agent.id)}>
                                                            <div className="flex items-center space-x-2 p-2">
                                                                <RadioGroupItem value={String(agent.id)} id={String(agent.id)} />
                                                                <FormLabel htmlFor={String(agent.id)}>{agent.Nom}</FormLabel>
                                                            </div>
                                                        </FormItem>
                                                    ))
                                                ) : (
                                                    <div className="w-full text-blue">
                                                        Il n'y a plus d'agents à affecter.
                                                    </div>
                                                )}
                                            </RadioGroup>
                                        )}
                                    />
                                </ScrollArea>
                            </div>

                            {/* Liste des contacts avec checkboxes */}
                            <div className="px-2 w-1/2">
                                <h1 className="text-blue font-semibold py-2">Liste des contacts</h1>
                                <ScrollArea className="border border-blue rounded-lg w-full h-[200px]">
                                    <FormField
                                        control={form.control}
                                        name="ContactIds"
                                        render={({ field }) => (
                                            <>
                                                {contacts.length > 0 ? (
                                                    contacts.map((contact) => (
                                                        <FormItem key={String(contact.id)}>
                                                            <div className="w-full px-4 py-2 flex items-center gap-1">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        id={String(contact.id)}
                                                                        checked={selectedContacts.includes(String(contact.id))}
                                                                        onCheckedChange={(checked) => {
                                                                            handleContactSelection(String(contact.id), checked);
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel htmlFor={String(contact.id)}>{contact.Nom}</FormLabel>
                                                            </div>
                                                        </FormItem>
                                                    ))
                                                ) : (
                                                    <div className="w-full text-blue">
                                                        Il n'y a plus de contacts à affecter aujourd'hui.
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    />
                                </ScrollArea>
                            </div>
                        </div>

                        <FormError message={errorMessage} />
                        <FormSucces message={successMessage} />

                        {/* Bouton de soumission */}
                        <div className="w-full flex justify-end">
                            <button
                                type="submit"
                                className="w-max h-max p-2 rounded-lg bg-blue text-blanc hover:bg-blue/90 duration-500"
                            >
                                Affecter
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
}
