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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { FormSucces } from "./FormSucces";

interface CreatePropsUser {
    onSubmit: (values: z.infer<typeof RegisterSchema>) => void;
    errorMessage:string | undefined;
    successMessage:string| undefined;
}

export default function CreateUser({ onSubmit,successMessage,errorMessage }: CreatePropsUser) {

    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            Nom: '',
            Email: '',
            Password: '',
            Telephone: '',
            Adresse: '',
            Role: ''
        },
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
                            name="Email"
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
                            name="Password"
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
                            name="Telephone"
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
                            name="Adresse"
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
                        <FormField
                            control={form.control}
                            name="Role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-blue">Adresse</FormLabel>
                                    <FormControl>
                                        <Select
                                            {...field}
                                            onValueChange={(value) => {
                                                field.onChange(value);  // Mettre à jour la valeur du formulaire
                                            }}
                                        >
                                            <SelectTrigger className="shadow border border-blue rounded-[10px] w-full py-2 px-3 text-blue focus:outline-none placeholder-blue/70 caret-blue">
                                                <SelectValue placeholder="Sélectionner une compagne" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Teleconseiller">Teleconseiller</SelectItem>
                                                <SelectItem value="AgentCommerce">Agent Commercial</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={errorMessage}/>
                    <FormSucces message={successMessage} />
                    <Button type="submit" className="w-full mt-2 bg-blue" disabled={isPending}>Enregistrer</Button>
                </form>

            </Form>


        </div>



    );
}
