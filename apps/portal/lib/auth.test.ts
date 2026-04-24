import { expect, test } from "vitest"
import { type CobaltJwtPayloadInternal, transformCobaltData } from "./auth"
import { type JWTPayload } from "jose"

test("transformCobaltData", () => {
  const cookie = {
    cid: 10000005,
    display_name: "Web Five",
    facility_permissions: "ZDV:roster:read",
    global_permissions: "superadmin:usage",
    iss: "cobalt",
  } as CobaltJwtPayloadInternal & JWTPayload
  const data = transformCobaltData(cookie)

  expect(data).toEqual({
    cid: 10000005,
    display_name: "Web Five",
    facility_permissions: [
      {
        facility: "ZDV",
        object: "roster",
        action: "read",
      },
    ],
    global_permissions: [
      { facility: "*", object: "superadmin", action: "usage" },
    ],
    iss: "cobalt",
  })
})
