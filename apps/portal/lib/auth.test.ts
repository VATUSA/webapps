import { expect, test } from "vitest"
import { type CobaltJwtPayloadInternal, transformCobaltJwt } from "@workspace/third-party/cobalt"

test("transformCobaltJwt", () => {
  const cookie: CobaltJwtPayloadInternal = {
    cid: 10000005,
    display_name: "Web Five",
    facility_permissions: "ZDV:roster:read",
    global_permissions: "superadmin:usage",
  }
  const data = transformCobaltJwt(cookie)

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
  })
})
