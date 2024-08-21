import {getIronSession, SessionOptions} from 'iron-session'

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

export const getSession = async (req: Request, res: Response) => {
  return getIronSession<Session>(req, res, sessionOptions)
}
