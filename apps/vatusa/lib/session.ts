import { cookies } from "next/headers"
import { getIronSession, type SessionOptions } from "iron-session"
import type { CobaltSession } from "@workspace/third-party/cobalt"

/**
 * Shape of the persisted iron-session used by the VATUSA app.
 *
 * Notes:
 * - `isLoggedIn` is the primary auth flag used by UI and route checks.
 * - `cid`, `name`, and `roles` are compatibility fields still consumed by
 *   existing VATUSA UI components.
 * - `cobalt` stores the canonical Cobalt session payload (including permissions)
 *   and should be considered the source of truth for ACL-aware authorization.
 */
export interface UserSession {
  isLoggedIn: boolean
  cid?: string
  name?: string
  roles: Array<{ role: string; facility: string }>
  cobalt?: CobaltSession
  cobaltSyncedAt?: number
}


/**
 * Configuration for iron-session cookie behavior.
 *
 * Security considerations:
 * - `httpOnly`: blocks client-side JavaScript access to session cookie.
 * - `sameSite: "lax"`: mitigates CSRF in most cross-site contexts.
 * - `secure` in production: cookie is transmitted only over HTTPS.
 */
export const sessionOptions: SessionOptions = {
  password: process.env.COOKIE_SECRET!,
  cookieName: "vatusa_webapps",
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
}

/**
 * Returns a typed iron-session instance bound to the current request cookies.
 *
 * @returns Promise resolving to the mutable `UserSession` object.
 */
export async function getSession() {
  return getIronSession<UserSession>(await cookies(), sessionOptions)
}
