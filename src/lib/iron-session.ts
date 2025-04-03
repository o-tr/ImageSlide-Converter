import { IRON_SESSION_COOKIE_NAME, IRON_SESSION_PASSWORD } from "@/const/env";
import { type SessionOptions, getIronSession } from "iron-session";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export const sessionOptions: SessionOptions = {
  password: IRON_SESSION_PASSWORD,
  cookieName: IRON_SESSION_COOKIE_NAME,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

type Session = {
  fileId: string[];
};

export const getSession = async (cookies: ReadonlyRequestCookies) => {
  return getIronSession<Session>(cookies, sessionOptions);
};
