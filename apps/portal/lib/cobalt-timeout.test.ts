import { afterEach, expect, test, vi } from "vitest"
import {
  CobaltTimeoutError,
  cobaltRequest,
} from "@workspace/third-party/cobalt"

/**
 * Stands in for undici: never settles on its own, rejects with the signal's
 * reason when aborted. That is the shape that matters here — a backend which
 * accepts the connection and then stalls, rather than one which refuses it.
 */
function hangingFetch(): typeof globalThis.fetch {
  return vi.fn((_input: unknown, init?: RequestInit) => {
    return new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => {
        reject(init.signal?.reason)
      })
    })
  }) as unknown as typeof globalThis.fetch
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

test("a stalled backend throws CobaltTimeoutError rather than hanging", async () => {
  vi.stubGlobal("fetch", hangingFetch())

  const error = await cobaltRequest("news/page/1", { timeoutMs: 20 }).catch(
    (e: unknown) => e
  )

  expect(error).toBeInstanceOf(CobaltTimeoutError)
  expect(error).toMatchObject({
    method: "GET",
    timeoutMs: 20,
  })
  expect((error as CobaltTimeoutError).url).toContain("news/page/1")
})

test("a timeout writes a greppable line to the container log", async () => {
  vi.stubGlobal("fetch", hangingFetch())
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})

  await cobaltRequest("news/page/1", { timeoutMs: 20 }).catch(() => {})

  expect(consoleError).toHaveBeenCalledOnce()
  expect(JSON.parse(consoleError.mock.calls[0]![0] as string)).toMatchObject({
    msg: "cobalt_request_timeout",
    method: "GET",
    timeoutMs: 20,
  })
})

test("caller cancellation propagates untouched, not as a timeout", async () => {
  vi.stubGlobal("fetch", hangingFetch())
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})

  const controller = new AbortController()
  const pending = cobaltRequest("news/page/1", {
    signal: controller.signal,
    // Long enough that the caller's abort is unambiguously what fired.
    timeoutMs: 10_000,
  }).catch((e: unknown) => e)

  controller.abort(new Error("caller went away"))
  const error = await pending

  expect(error).not.toBeInstanceOf(CobaltTimeoutError)
  expect(error).toMatchObject({ message: "caller went away" })
  // A cancelled request is not a backend problem and must not look like one.
  expect(consoleError).not.toHaveBeenCalled()
})

test("a healthy backend is unaffected", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      Response.json({ success: true, items: [] })
    ) as unknown as typeof globalThis.fetch
  )

  await expect(cobaltRequest("news/page/1")).resolves.toEqual({
    success: true,
    items: [],
  })
})
