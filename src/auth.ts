import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from '@/Schemas';

export const { handlers: { GET, POST }, signIn, signOut, auth } = NextAuth({
    session: { strategy: 'jwt' },
    providers: [
        Credentials({
            async authorize(credentials) {
                const validCredentials = LoginSchema.safeParse(credentials);

                if (validCredentials.success) {
                    const { email, password } = validCredentials.data;
                    const payload = { email, password };

                    console.log(payload);

                    const response = await fetch('http://192.168.100.4:8080/Vox_Backend//api.php?method=Connexion', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload),
                    });


                    if (!response.ok) {
                        return null;
                    }

                    const user = await response.json();

                    return {
                        id: user.user.id,
                        name: user.user.Nom,
                        email: user.user.Email,
                        role: user.user.Role,
                    };
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if(user){
                token.role  = user.role;
                // console.log(token)
            }

            return token;
        },
        async session({ token, session }) {

              if(token){
                session.user.role = token.role;
                session.user.id = token.sub;
              }

            return session;

        },
    }
});
