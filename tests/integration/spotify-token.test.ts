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
  const mod = await import("../../api/spotify-token");
  return mod.default as Handler;
};

const asReq = (method = "GET") => ({ method }) as VercelRequest;
const asRes = (res: ReturnType<typeof createRes>) =>
  res as unknown as VercelResponse;

describe("api/spotify-token", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("SPOTIFY_CLIENT_ID", "client-id");
    vi.stubEnv("SPOTIFY_CLIENT_SECRET", "client-secret");
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

  it("returns 500 when credentials are not configured", async () => {
    vi.stubEnv("SPOTIFY_CLIENT_ID", "");
    const handler = await importHandler();
    const res = createRes();

    await handler(asReq(), asRes(res));

    expect(res.statusCode).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fetches a token with basic auth and returns it", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ access_token: "spotify-token", expires_in: 3600 }),
    });
    const handler = await importHandler();
    const res = createRes();

    await handler(asReq(), asRes(res));

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      access_token: "spotify-token",
      expires_in: 3600,
    });
    expect(res.headers["Cache-Control"]).toBe("no-store");

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://accounts.spotify.com/api/token");
    expect(options.headers.Authorization).toBe(
      `Basic ${Buffer.from("client-id:client-secret").toString("base64")}`,
    );
  });

  it("serves the cached token without a second upstream call", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ access_token: "spotify-token", expires_in: 3600 }),
    });
    const handler = await importHandler();

    const first = createRes();
    await handler(asReq(), asRes(first));
    const second = createRes();
    await handler(asReq(), asRes(second));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(second.statusCode).toBe(200);
    expect((second.body as { access_token: string }).access_token).toBe(
      "spotify-token",
    );
  });

  it("returns 502 when Spotify responds with an error", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 400 });
    const handler = await importHandler();
    const res = createRes();

    await handler(asReq(), asRes(res));

    expect(res.statusCode).toBe(502);
  });

  it("returns 502 when Spotify is unreachable", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));
    const handler = await importHandler();
    const res = createRes();

    await handler(asReq(), asRes(res));

    expect(res.statusCode).toBe(502);
  });
});
