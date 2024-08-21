import {getIronSession, SessionOptions} from 'iron-session'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import {IRON_SESSION_COOKIE_NAME, IRON_SESSION_PASSWORD} from "@/const/env";

export const sessionOptions: SessionOptions = {
  password: IRON_SESSION_PASSWORD,
  cookieName: IRON_SESSION_COOKIE_NAME,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}

type Session = {
  fileId: string[],
}

export const getSession = async (cookies: ReadonlyRequestCookies) => {
  return getIronSession<Session>(cookies, sessionOptions)
}
