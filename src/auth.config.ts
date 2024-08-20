import {authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes} from "@/routes"
import {NextAuthConfig} from "next-auth";

export const authConfig = {
  pages: {
    signIn: '/login',
    error: "/",
    newUser: "/mypage",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthRoute = authRoutes.includes(nextUrl.pathname);
      const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

      if (isAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }

        return true;
      }

      if (!isPublicRoute && !isLoggedIn) {
        return false;
      }

      return true;
    },
  },
  providers: []
} satisfies NextAuthConfig;
