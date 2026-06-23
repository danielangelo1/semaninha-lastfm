import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { getTopAlbums, getTopArtists, getTopTracks, getUserInfo } from "../../src/services/LastFMService";
import { UserRequest } from "../../src/types/userRequest";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("LastFM Service (MSW Integration)", () => {
  const baseRequest: UserRequest = {
    user: "testuser",
    period: "7day",
    limit: 3,
    type: "album",
  };

  describe("getTopAlbums", () => {
    it("should return album data successfully", async () => {
      const result = await getTopAlbums(baseRequest);

      expect(result.topalbums).toBeDefined();
      expect(result.topalbums.album).toHaveLength(9);
      expect(result.topalbums.album[0]).toHaveProperty("name");
      expect(result.topalbums.album[0]).toHaveProperty("artist");
      expect(result.topalbums.album[0]).toHaveProperty("playcount");
    });

    it("should throw error for non-existent user", async () => {
      const request = { ...baseRequest, user: "nonexistent" };

      await expect(getTopAlbums(request)).rejects.toThrow("User not found");
    });

    it("should throw on network failure", async () => {
      server.use(
        http.get("http://ws.audioscrobbler.com/2.0/", () => {
          return HttpResponse.error();
        })
      );

      await expect(getTopAlbums(baseRequest)).rejects.toThrow();
    });

    it("should throw on server error (500)", async () => {
      server.use(
        http.get("http://ws.audioscrobbler.com/2.0/", () => {
          return HttpResponse.json({ error: "server" }, { status: 500 });
        })
      );

      await expect(getTopAlbums(baseRequest)).rejects.toThrow();
    });
  });

  describe("getTopArtists", () => {
    it("should return artist data successfully", async () => {
      const request = { ...baseRequest, type: "artist" };
      const result = await getTopArtists(request);

      expect(result.topartists).toBeDefined();
      expect(result.topartists.artist).toHaveLength(9);
      expect(result.topartists.artist[0].name).toBe("Artist 0");
      expect(result.topartists.artist[0].playcount).toBe("15");
    });
  });

  describe("getTopTracks", () => {
    it("should return track data successfully", async () => {
      const request = { ...baseRequest, type: "track" };
      const result = await getTopTracks(request);

      expect(result.toptracks).toBeDefined();
      expect(result.toptracks.track).toHaveLength(9);
      expect(result.toptracks.track[0].name).toBe("Track 0");
    });
  });

  describe("getUserInfo", () => {
    it("should return user info successfully", async () => {
      const result = await getUserInfo("testuser");

      expect(result.user).toBeDefined();
      expect(result.user.name).toBe("testuser");
      expect(result.user.playcount).toBe("12345");
    });

    it("should throw error for non-existent user", async () => {
      await expect(getUserInfo("nonexistent")).rejects.toThrow("User not found");
    });
  });

  describe("Edge cases", () => {
    it("should handle empty album list", async () => {
      server.use(
        http.get("http://ws.audioscrobbler.com/2.0/", () => {
          return HttpResponse.json({ topalbums: { album: [] } });
        })
      );

      const result = await getTopAlbums(baseRequest);
      expect(result.topalbums.album).toHaveLength(0);
    });

    it("should handle slow responses", async () => {
      server.use(
        http.get("http://ws.audioscrobbler.com/2.0/", async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return HttpResponse.json({ topalbums: { album: [] } });
        })
      );

      const result = await getTopAlbums(baseRequest);
      expect(result.topalbums.album).toHaveLength(0);
    });
  });
});
