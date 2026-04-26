import { CobaltPermission } from "@workspace/third-party/cobalt"
import { type JWTPayload, decodeJwt } from "jose"
import { cookies } from "next/headers"

/**
 * Cobalt session data, directly parsed from the JWT.
 */
export type CobaltJwtPayloadInternal = {
  cid: number
  display_name: string
  facility_permissions: string
  global_permissions: string
}

/**
 * Cobalt session data.
 */
export type CobaltJwtPayload = {
  cid: number
  display_name: string
  facility_permissions: CobaltPermission[]
  global_permissions: CobaltPermission[]
}

/**
 * Decode the Cobalt JWT cookie and parse.
 *
 * @returns the JWT payload, or `null` if the cookie is not present
 */
export async function getCobaltSession(): Promise<CobaltJwtPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("vatusa-cobalt-token")?.value
  if (!token) {
    return null
  }
  try {
    // decode directly for the data that's in there
    const decoded = decodeJwt<CobaltJwtPayloadInternal>(token)
    if (decoded) {
      return transformCobaltData(decoded)
    }
    return null
  } catch (e: unknown) {
    console.error(`Error decoding/transforming Cobalt JWT: ${e}`)
    return null
  }
}

/**
 * Transform the Cobalt JWT into data for the app.
 */
export function transformCobaltData(
  decoded: CobaltJwtPayloadInternal & JWTPayload
): CobaltJwtPayload | null {
  // change the data to use permissions lists of strings; split on the comma, and map to object
  return {
    ...decoded,
    facility_permissions: decoded.facility_permissions
      .split(",")
      .filter((s) => s.length > 0)
      .map(
        (s: string): CobaltPermission => ({
          facility: s.split(":")[0]!,
          object: s.split(":")[1]!,
          action: s.split(":")[2]!,
        })
      ),
    global_permissions: decoded.global_permissions
      .split(",")
      .filter((s) => s.length > 0)
      .map(
        (s: string): CobaltPermission => ({
          facility: "*",
          object: s.split(":")[0]!,
          action: s.split(":")[1]!,
        })
      ),
  }
}
