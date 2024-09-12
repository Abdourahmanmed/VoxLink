"use server"
import { LoginSchema } from '@/Schemas';
import * as z from 'zod';
import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import {default_loggin_redirect} from "@/routes"

// fonction login 
export const login = async (data: z.infer<typeof LoginSchema>) => {
    const validcrendentiels = LoginSchema.safeParse(data);

    if(!validcrendentiels.success){
        return{error:"invalid Fields"};
    }
//   destructure email and password
    const {email ,password} = validcrendentiels.data;

    try {
        await signIn("credentials",{
            email,
            password,
            redirect:true,
        })
        
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type){
                case "CredentialsSignin":
                    return {error:"Mot de passe ou Email incorrect."}
                default:
                    return {error:"something went wrong.the server is not  open or your credentials is incorrect."}
            }
        }
        throw error;
    }


    
};



export const LogOutButton = async () => {
    await signOut({redirectTo:'/'});
};

