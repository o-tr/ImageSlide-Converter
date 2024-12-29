import { authConfig } from "@/auth.config";
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from "@/const/env";
import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

export const { auth, signIn, signOut, handlers } = NextAuth({
	...authConfig,
	providers: [
		Discord({
			clientId: DISCORD_CLIENT_ID,
			clientSecret: DISCORD_CLIENT_SECRET,
			authorization: {
				params: { scope: "identify email" },
			},
		}),
	],
});
