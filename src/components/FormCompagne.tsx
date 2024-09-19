"use client";
import Image from "next/image";
import { Headset } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as  z from "zod";
import { CompagneSchema } from "@/Schemas";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FormError } from "./FormError";
import { Textarea } from "./ui/textarea";
import { FormSucces } from "./FormSucces";

interface CompagneProps {
    successMessage: string | undefined;
    errorMessage: string | undefined;
    isPending: boolean;
    onSubmit: (values: z.infer<typeof CompagneSchema>) => void;
}

export default function CreateCompagne({successMessage,errorMessage,isPending,onSubmit}:CompagneProps) {

    const form = useForm<z.infer<typeof CompagneSchema>>({
        resolver: zodResolver(CompagneSchema),
        defaultValues: {
            Nom: '',
            Societe: '',
            Script: '',
        }
    });

    

    return (
        <div className="w-full p-8 flex flex-col items-center mx-auto">


            {/* form card */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-xs mx-auto">
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="Nom"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-blue">Nom</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="example:fatouma" type="text" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="Societe"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-blue">Societe</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="fatouma@example.com" type="text" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="Script"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-blue">Script</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="Entre le script ici" disabled={isPending} className="text-blue border-blue" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={errorMessage} />
                    <FormSucces message={successMessage} />
                    <Button type="submit" className="w-full mt-2 bg-blue" disabled={isPending}>Enregistrer</Button>
                </form>

            </Form>


        </div>



    );
}
