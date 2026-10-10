import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { VercelRequest, VercelResponse } from "@vercel/node";

type Handler = (req: VercelRequest, res: VercelResponse) => Promise<unknown>;

const createRes = () => {
  const res = {
    statusCode: 0,
    headers: {} as Record<string, string>,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
    setHeader(key: string, value: string) {
      this.headers[key] = value;
      return this;
    },
  };
  return res;
};

const importHandler = async (): Promise<Handler> => {
  vi.resetModules();
  const mod = await import("../../api/lastfm");
  return mod.default as Handler;
};

const asReq = (method = "GET", query: Record<string, string> = {}) =>
  ({ method, query }) as unknown as VercelRequest;
const asRes = (res: ReturnType<typeof createRes>) =>
  res as unknown as VercelResponse;

describe("api/lastfm", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("LASTFM_API_KEY", "server-side-key");
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("rejects non-GET methods with 405", async () => {
    const handler = await importHandler();
    const res = createRes();

    await handler(asReq("POST"), asRes(res));

    expect(res.statusCode).toBe(405);
    expect(res.headers["Allow"]).toBe("GET");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 500 when LASTFM_API_KEY is not configured", async () => {
    vi.unstubAllEnvs();
    const handler = await importHandler();
    const res = createRes();

    await handler(asReq("GET", { method: "user.gettopalbums" }), asRes(res));

    expect(res.statusCode).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("forwards query params and injects the server-side api key", async () => {
    fetchMock.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ topalbums: { album: [] } }),
    });

    const handler = await importHandler();
    const res = createRes();

    await handler(
      asReq("GET", {
        method: "user.gettopalbums",
        user: "dandowski",
        period: "7day",
        limit: "9",
      }),
      asRes(res),
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const requestedUrl = fetchMock.mock.calls[0][0] as string;
    expect(requestedUrl).toContain("method=user.gettopalbums");
    expect(requestedUrl).toContain("user=dandowski");
    expect(requestedUrl).toContain("period=7day");
    expect(requestedUrl).toContain("limit=9");
    expect(requestedUrl).toContain("api_key=server-side-key");
    expect(requestedUrl.startsWith("https://ws.audioscrobbler.com/2.0/")).toBe(true);
    expect(res.statusCode).toBe(200);
  });

  it("ignores a client-supplied api_key and uses the server-side one instead", async () => {
    fetchMock.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ topalbums: { album: [] } }),
    });

    const handler = await importHandler();
    const res = createRes();

    await handler(
      asReq("GET", { method: "user.gettopalbums", api_key: "attacker-supplied-key" }),
      asRes(res),
    );

    const requestedUrl = fetchMock.mock.calls[0][0] as string;
    expect(requestedUrl).toContain("api_key=server-side-key");
    expect(requestedUrl).not.toContain("attacker-supplied-key");
  });

  it("mirrors the upstream status code and body", async () => {
    fetchMock.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ error: 6, message: "User not found" }),
    });

    const handler = await importHandler();
    const res = createRes();

    await handler(asReq("GET", { method: "user.gettopalbums", user: "nonexistent" }), asRes(res));

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ error: 6, message: "User not found" });
  });

  it("returns 502 when Last.fm is unreachable", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network down"));

    const handler = await importHandler();
    const res = createRes();

    await handler(asReq("GET", { method: "user.gettopalbums" }), asRes(res));

    expect(res.statusCode).toBe(502);
  });
});
