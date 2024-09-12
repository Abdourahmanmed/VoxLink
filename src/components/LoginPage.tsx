"use client";
import Image from "next/image";
import { Headset } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as  z from "zod";
import { LoginSchema } from "@/Schemas";
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
import { useState, useTransition } from "react";
import { login } from "@/actions/route";

export default function LoginPage() {

    const [error,setError] = useState<string|undefined>("");

    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: ''
        },
    });
    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("")
        startTransition(() => {
            login(values).then((data)=>{
                setError(data?.error);
            });
            
        })
    }
    return (
        <div className="h-screen w-screen flex justify-center items-center bg-blue">
            <div className="rounded-lg flex w-[60%] h-max max-w-4xl bg-white shadow-lg overflow-hidden">
                <div className="w-1/2 relative">
                    <Image
                        src="/image4.jpg"
                        alt="photo lateral"
                        fill
                        sizes="100%"
                        className="object-cover rounded-tl-lg rounded-bl-lg"
                    />
                </div>
                <div className="w-1/2 p-8 flex flex-col items-center mx-auto">
                    <h2 className="flex items-center pb-4 capitalize w-full text-center text-blue font-semibold text-2xl">
                        <Headset className="mx-2" />
                        call centre
                    </h2>
                    <p className="pt-4 pb-4 w-full ml-5 text-sm text-blue mb-4">
                        Bienvenue dans le système de gestion des appels. <br /> Veuillez procéder à votre identification pour continuer.
                    </p>

                    {/* form card */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-xs mx-auto">
                            <div className="space-y-2">
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
                            </div>
                            <FormError message={error}/>
                            <Button type="submit" className="w-full mt-2 bg-blue" disabled={isPending}>Se connecter</Button>
                        </form>

                    </Form>


                </div>

            </div>
        </div>
    );
}
