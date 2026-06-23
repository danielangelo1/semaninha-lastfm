import { http, HttpResponse } from "msw";

const LASTFM_URL = "http://ws.audioscrobbler.com/2.0/";

export const mockAlbumResponse = {
  topalbums: {
    album: Array.from({ length: 9 }, (_, i) => ({
      artist: { mbid: `mbid-${i}`, name: `Artist ${i}`, url: "" },
      image: [
        { "#text": "", size: "small" },
        { "#text": "", size: "medium" },
        { "#text": "", size: "large" },
        { "#text": `https://lastfm.freetls.fastly.net/i/u/300x300/album-${i}.png`, size: "extralarge" },
      ],
      mbid: `album-mbid-${i}`,
      name: `Album ${i}`,
      playcount: `${(i + 1) * 10}`,
      url: "",
    })),
  },
};

export const mockArtistResponse = {
  topartists: {
    artist: Array.from({ length: 9 }, (_, i) => ({
      mbid: `mbid-${i}`,
      name: `Artist ${i}`,
      url: "",
      playcount: `${(i + 1) * 15}`,
    })),
  },
};

export const mockUserInfoResponse = {
  user: {
    name: "testuser",
    playcount: "12345",
    registered: { unixtime: "1609459200" },
  },
};

export const handlers = [
  http.get(LASTFM_URL, ({ request }) => {
    const url = new URL(request.url);
    const method = url.searchParams.get("method");
    const user = url.searchParams.get("user");

    if (user === "nonexistent") {
      return HttpResponse.json({
        error: 6,
        message: "User not found",
      });
    }

    switch (method) {
      case "user.gettopalbums":
        return HttpResponse.json(mockAlbumResponse);
      case "user.gettopartists":
        return HttpResponse.json(mockArtistResponse);
      case "user.gettoptracks":
        return HttpResponse.json({
          toptracks: {
            track: Array.from({ length: 9 }, (_, i) => ({
              artist: { mbid: `mbid-${i}`, name: `Artist ${i}`, url: "" },
              image: [
                { "#text": "", size: "small" },
                { "#text": "", size: "medium" },
                { "#text": "", size: "large" },
                { "#text": `https://lastfm.freetls.fastly.net/i/u/300x300/track-${i}.png`, size: "extralarge" },
              ],
              mbid: `track-mbid-${i}`,
              name: `Track ${i}`,
              playcount: `${(i + 1) * 5}`,
              url: "",
            })),
          },
        });
      case "user.getinfo":
        return HttpResponse.json(mockUserInfoResponse);
      default:
        return HttpResponse.json({ error: 3, message: "Invalid Method" }, { status: 400 });
    }
  }),
];
