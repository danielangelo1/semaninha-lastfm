import type { Page, Route } from "@playwright/test";
import { WRAPPED_ANNOUNCEMENT_KEY } from "../../../src/constants/wrapped";

// Users the mocked Last.fm knows about
export const USERS = {
  /** Plenty of data for any grid size */
  active: "rj",
  /** Only 4 albums: not enough for a 3x3 grid */
  sparse: "pouco",
  /** Last.fm answers 404 with error 6 */
  missing: "ninguem-xyz",
} as const;

const ALBUM_COUNT: Record<string, number> = { [USERS.active]: 120, [USERS.sparse]: 4 };

// 1x1 PNG, served for every cover/avatar so the canvas can draw without the network
const PIXEL_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

const image = (name: string) => [
  { "#text": "", size: "small" },
  { "#text": "", size: "medium" },
  { "#text": "", size: "large" },
  { "#text": `https://lastfm.freetls.fastly.net/i/u/300x300/${name}.png`, size: "extralarge" },
];

const artistRef = (i: number) => ({ mbid: "", name: `Artista ${i}`, url: "" });

const range = (count: number) => Array.from({ length: count }, (_, i) => i + 1);

const responses: Record<string, (user: string, limit: number) => unknown> = {
  "user.gettopalbums": (user, limit) => ({
    topalbums: {
      album: range(Math.min(limit, ALBUM_COUNT[user] ?? 0)).map((i) => ({
        artist: artistRef(i),
        image: image(`album-${i}`),
        mbid: "",
        name: `Álbum ${i}`,
        playcount: String(500 - i),
        url: "",
      })),
    },
  }),
  "user.gettopartists": (user, limit) => ({
    topartists: {
      artist: range(Math.min(limit, ALBUM_COUNT[user] ?? 0)).map((i) => ({
        ...artistRef(i),
        playcount: String(500 - i),
      })),
    },
  }),
  "user.getinfo": (user) => ({
    user: { name: user, playcount: "4321", image: image("avatar"), registered: { unixtime: "1600000000" } },
  }),
  "user.getweeklyartistchart": (_user, limit) => ({
    weeklyartistchart: {
      artist: range(Math.min(limit, 431)).map((i) => ({ name: `Artista ${i}`, playcount: String(900 - i) })),
    },
  }),
  "user.getweeklyalbumchart": (_user, limit) => ({
    weeklyalbumchart: {
      album: range(Math.min(limit, 704)).map((i) => ({
        name: `Álbum ${i}`,
        playcount: String(800 - i),
        artist: { "#text": `Artista ${i}` },
      })),
    },
  }),
  "user.getweeklytrackchart": (_user, limit) => ({
    weeklytrackchart: {
      track: range(Math.min(limit, 1000)).map((i) => ({
        name: `Música ${i}`,
        playcount: String(300 - i),
        artist: { "#text": `Artista ${i}` },
      })),
    },
  }),
  "user.getrecenttracks": () => ({ recenttracks: { "@attr": { total: "2537" } } }),
};

export interface LastFmMock {
  /** Every Last.fm call the page made, for asserting on parameters */
  calls: URLSearchParams[];
  /** Makes the next `times` calls to a method answer HTTP 500 */
  failNext: (method: string, times?: number) => void;
}

/**
 * Stands in for the /api/lastfm proxy and keeps the page off the network:
 * cover images are served locally; analytics, ads, fonts and Spotify are blocked.
 */
export const mockLastFm = async (page: Page): Promise<LastFmMock> => {
  const calls: URLSearchParams[] = [];
  const failures = new Map<string, number>();

  await page.route("**/api/lastfm**", async (route: Route) => {
    const params = new URL(route.request().url()).searchParams;
    calls.push(params);
    const method = params.get("method") ?? "";
    const user = params.get("user") ?? "";

    const pendingFailures = failures.get(method) ?? 0;
    if (pendingFailures > 0) {
      failures.set(method, pendingFailures - 1);
      return route.fulfill({ status: 500, json: { error: 8, message: "Operation failed" } });
    }
    if (user === USERS.missing) {
      return route.fulfill({ status: 404, json: { error: 6, message: "User not found" } });
    }

    const build = responses[method];
    if (!build) {
      return route.fulfill({ status: 400, json: { error: 3, message: "Invalid method" } });
    }
    return route.fulfill({ json: build(user, Number(params.get("limit") ?? 50)) });
  });

  await page.route(/^https?:\/\/(?!localhost)/, (route) => {
    const { hostname } = new URL(route.request().url());
    if (hostname.endsWith("fastly.net")) {
      return route.fulfill({
        body: PIXEL_PNG,
        contentType: "image/png",
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }
    return route.abort();
  });

  return {
    calls,
    failNext: (method, times = 1) => failures.set(method, times),
  };
};

/** Starts the page in Portuguese, without the Wrapped popup in the way */
export const seedStorage = async (
  page: Page,
  { language = "pt", announcementSeen = true }: { language?: "pt" | "en"; announcementSeen?: boolean } = {},
): Promise<void> => {
  await page.addInitScript(
    ({ language, announcementSeen, announcementKey }) => {
      // Only on the first load of the test, so a reload keeps what the page saved
      if (sessionStorage.getItem("e2e-seeded")) return;
      sessionStorage.setItem("e2e-seeded", "1");
      localStorage.setItem("i18nextLng", language);
      if (announcementSeen) localStorage.setItem(announcementKey, "true");
    },
    { language, announcementSeen, announcementKey: WRAPPED_ANNOUNCEMENT_KEY },
  );
};
