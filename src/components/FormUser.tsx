"use client";
import Image from "next/image";
import { Headset } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as  z from "zod";
import { RegisterSchema } from "@/Schemas";
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

export default function CreateUser() {

    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            nom: '',
            email: '',
            password: '',
            telephone: '',
            adresse: ''
        },
    });
    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-blue">Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="fatouma@example.com" type="email" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-blue">Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="***********" type="password" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="telephone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-blue">Telephone</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="example:77101010" type="text" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="adresse"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-blue">Adresse</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="example:quartier 1" type="text" disabled={isPending} />
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
