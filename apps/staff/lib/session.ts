import { cookies } from "next/headers"
import { getIronSession, type SessionOptions } from "iron-session"
import type {
  CobaltSession,
  CobaltPermission,
} from "@workspace/third-party/cobalt"

/**
 * Re-exported permission type used throughout the staff app for ACL checks.
 */
export type { CobaltPermission }

/**
 * Shape of the persisted iron-session for the staff application.
 *
 * Notes:
 * - This session is stored in the shared `vatusa_webapps` cookie, allowing
 *   multiple apps in the monorepo to read consistent auth state.
 * - `cobalt` is the canonical source of truth for permission-based access
 *   control (`global_permissions` / `facility_permissions`).
 * - `roles` is retained for compatibility with older role-based usage paths.
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
 * iron-session configuration for the shared authentication cookie.
 *
 * Security:
 * - `httpOnly`: prevents JavaScript access in browser runtime.
 * - `sameSite: "lax"`: helps mitigate CSRF for cross-site requests.
 * - `secure` in production: ensures cookie is transmitted over HTTPS only.
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
 * Returns the typed iron-session instance bound to the current request cookies.
 *
 * @returns Promise resolving to the mutable `UserSession` object.
 */
export async function getSession() {
  return getIronSession<UserSession>(await cookies(), sessionOptions)
}
