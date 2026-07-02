import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const spotifyGetMock = vi.fn();

vi.mock("../api", () => ({
  spotifyApi: { get: spotifyGetMock },
  musicBrainzApi: { get: vi.fn() },
}));

const importService = async () => {
  vi.resetModules();
  return await import("../SpotifyService");
};

const tokenResponse = (token = "test-token") => ({
  ok: true,
  json: async () => ({ access_token: token, expires_in: 3600 }),
});

const artistSearchResponse = (
  items: { name: string; id: string; images: { url: string }[] }[],
) => ({ data: { artists: { items } } });

describe("SpotifyService", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
    spotifyGetMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("requests the token from /api/spotify-token and reuses it", async () => {
    fetchMock.mockResolvedValue(tokenResponse());
    spotifyGetMock.mockResolvedValue(
      artistSearchResponse([
        { name: "Artist", id: "1", images: [{ url: "img-url" }] },
      ]),
    );
    const { getArtistImage } = await importService();

    await getArtistImage("Artist");
    await getArtistImage("Artist");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("/api/spotify-token");
    expect(spotifyGetMock).toHaveBeenCalledTimes(2);
    expect(spotifyGetMock.mock.calls[0][1].headers.Authorization).toBe(
      "Bearer test-token",
    );
  });

  it("throws when the token endpoint fails and allows retry", async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 502 });
    const { getArtistImage } = await importService();

    await expect(getArtistImage("Artist")).rejects.toThrow(
      "Spotify token request failed: 502",
    );

    fetchMock.mockResolvedValueOnce(tokenResponse("second-token"));
    spotifyGetMock.mockResolvedValue(
      artistSearchResponse([
        { name: "Artist", id: "1", images: [{ url: "img-url" }] },
      ]),
    );

    const image = await getArtistImage("Artist");
    expect(image.url).toBe("img-url");
  });

  it("prefers the artist whose name matches exactly", async () => {
    fetchMock.mockResolvedValue(tokenResponse());
    spotifyGetMock.mockResolvedValue(
      artistSearchResponse([
        { name: "artist tribute band", id: "1", images: [{ url: "wrong" }] },
        { name: "the artist", id: "2", images: [{ url: "right" }] },
      ]),
    );
    const { getArtistImage } = await importService();

    const image = await getArtistImage("The Artist");
    expect(image.url).toBe("right");
  });

  it("returns an empty url when the search has no results", async () => {
    fetchMock.mockResolvedValue(tokenResponse());
    spotifyGetMock.mockResolvedValue(artistSearchResponse([]));
    const { getArtistImage } = await importService();

    const image = await getArtistImage("Unknown Artist");
    expect(image).toEqual({ url: "" });
  });
});
