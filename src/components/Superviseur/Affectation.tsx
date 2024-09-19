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
import { useTransition } from "react";

// Import des composants du shadcn pour le formulaire
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

export default function Affectation() {

    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof affectationSchema>>({
        resolver: zodResolver(affectationSchema),
        defaultValues: {
            campagne: undefined, // Valeur initiale
            contactId: "", // Aucun contact sélectionné
            agentsIds: [] // Aucune case cochée
        },
    });

    const Contact = [
        { id: "1", Nom: "fatouma ali" },
        { id: "2", Nom: "Layla Ismael" },
        // ... autres contacts
    ];

    const agents = [
        { id: "1", Nom: "Loula yasser" },
        { id: "2", Nom: "Mousa Ismael" },
        // ... autres agents
    ];

    const onSubmit = (values: z.infer<typeof affectationSchema>) => {
        startTransition(() => {
            console.log(values);
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="h-max p-4 text-blue">
                    <div className="bg-blanc w-full h-max rounded-lg shadow-blue p-2 flex">
                        <FormField
                            control={form.control}
                            name="campagne"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger className="relative outline-none border border-blue rounded-lg px-4 flex flex-1 py-1 cursor-pointer">
                                            <SelectValue placeholder="Selection une compagne" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Recouvrement">Recouvrement</SelectItem>
                                            <SelectItem value="E-suuq">E-suuq</SelectItem>
                                            <SelectItem value="Colis-Ems">Colis Ems</SelectItem>
                                            <SelectItem value="petit_paquet">Petit Paquet</SelectItem>
                                            <SelectItem value="Amazone">Amazone</SelectItem>
                                            <SelectItem value="Essuq-prospection">Esuuq Prospections</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="h-max p-4 text-blue">
                    <div className="bg-blanc w-full h-max rounded-lg shadow-blue p-2 flex gap-8 flex-col">
                        <div className="flex gap-20 w-full">
                            <div className="px-2 w-1/2">
                                <h1 className="text-blue font-semibold py-2">Liste des agents</h1>
                                <ScrollArea className="border border-blue rounded-lg w-full h-[200px]">
                                    <FormField
                                        control={form.control}
                                        name="contactId"
                                        render={({ field }) => (
                                            <RadioGroup
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                {Contact.length > 0 ? (
                                                    Contact.map((cont) => (
                                                        <FormItem key={cont.id}>
                                                            <div className="flex items-center space-x-2 p-2">
                                                                <RadioGroupItem value={cont.id} id={cont.id} />
                                                                <FormLabel htmlFor={cont.id}>{cont.Nom}</FormLabel>
                                                            </div>
                                                        </FormItem>
                                                    ))
                                                ) : (
                                                    <div className="w-full text-blue">
                                                        il n'y a plus d'agents à affecter.
                                                    </div>
                                                )}
                                            </RadioGroup>
                                        )}
                                    />
                                </ScrollArea>
                            </div>
                            <div className="px-2 w-1/2">
                                <h1 className="text-blue font-semibold py-2">Liste des contacts</h1>
                                <ScrollArea className="border border-blue rounded-lg w-full h-[200px]">
                                    <FormField
                                        control={form.control}
                                        name="agentsIds"
                                        render={({ field }) => (
                                            <>
                                                {agents.length > 0 ? (
                                                    agents.map((agent) => (
                                                        <FormItem key={agent.id}>
                                                            <div className="w-full px-4 py-2 flex items-center gap-1">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        id={agent.id}
                                                                        checked={field.value.includes(agent.id)}
                                                                        onCheckedChange={(checked) => {
                                                                            if (checked) {
                                                                                field.onChange([...field.value, agent.id]);
                                                                            } else {
                                                                                field.onChange(field.value.filter(id => id !== agent.id));
                                                                            }
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel htmlFor={agent.id}>{agent.Nom}</FormLabel>
                                                            </div>
                                                        </FormItem>
                                                    ))
                                                ) : (
                                                    <div className="w-full text-blue">
                                                        il n'y a plus de contacts à affecter.
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    />
                                </ScrollArea>
                            </div>
                        </div>
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
