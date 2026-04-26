import { type CobaltJwtPayload, decodeCobaltJwt } from "@workspace/third-party/cobalt"
import { cookies } from "next/headers"

export type { CobaltJwtPayload }

export async function getCobaltSession(): Promise<CobaltJwtPayload | null> {
  return decodeCobaltJwt(await cookies())
}
