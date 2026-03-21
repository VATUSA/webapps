import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";

export interface UserSession {
  isLoggedIn: boolean;
  cid?: string;
  name?: string;
  roles: Array<{ role: string; facility: string }>;
}

export const sessionOptions: SessionOptions = {
  password: process.env.COOKIE_SECRET!,
  cookieName: "vatusa_webapps",
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
};

export async function getSession() {
  // @ts-expect-error the behavior is correct but TS is unhappy
  return getIronSession<UserSession>(await cookies(), sessionOptions);
}
