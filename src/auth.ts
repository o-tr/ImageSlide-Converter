import NextAuth from 'next-auth';
import Discord from 'next-auth/providers/discord';
import {authConfig} from "@/auth.config";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: {
        params: { scope: 'identify email' },
      },
    })
  ],
});
