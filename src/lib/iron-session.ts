import {getIronSession, SessionOptions} from 'iron-session'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

export const sessionOptions: SessionOptions = {
  password: process.env.IRON_SESSION_PASSWORD??"",
  cookieName: process.env.IRON_SESSION_COOKIE_NAME??"",
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
