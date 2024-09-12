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
import { useTransition } from "react";
import { Textarea } from "./ui/textarea";

export default function CreateCompagne() {

    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof CompagneSchema>>({
        resolver: zodResolver(CompagneSchema),
        defaultValues: {
            nom: '',
            societe: '',
            script: '',
        }
    });
    const onSubmit = (values: z.infer<typeof CompagneSchema>) => {
        startTransition(() => {
            console.log(values);
        })
    }
    return (


        <div className="w-full p-8 flex flex-col items-center mx-auto">


            {/* form card */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-xs mx-auto">
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="nom"
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
                            name="societe"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-blue">Societe</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="fatouma@example.com" type="email" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="script"
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
                    <FormError />
                    <Button type="submit" className="w-full mt-2 bg-blue" disabled={isPending}>Enregistrer</Button>
                </form>

            </Form>


        </div>



    );
}
