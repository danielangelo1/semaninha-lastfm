import { z } from "zod";

const imageSchema = z.object({
  "#text": z.string(),
  size: z.string(),
});

// The artist reference nested inside an album/track does not carry a playcount,
// unlike an entry in the top-level `topartists` list.
const artistRefSchema = z.object({
  mbid: z.string(),
  name: z.string(),
  url: z.string(),
});

const artistSchema = artistRefSchema.extend({
  playcount: z.string(),
});

const albumSchema = z.object({
  artist: artistRefSchema,
  image: z.array(imageSchema),
  mbid: z.string(),
  name: z.string(),
  playcount: z.string(),
  url: z.string(),
});

const trackSchema = z.object({
  artist: artistRefSchema,
  image: z.array(imageSchema),
  mbid: z.string(),
  name: z.string(),
  playcount: z.string(),
  url: z.string(),
});

const attrSchema = z.object({ total: z.string() }).optional();

export const albumApiResponseSchema = z.object({
  topalbums: z.object({
    album: z.array(albumSchema),
    "@attr": attrSchema,
  }),
});

export const artistApiResponseSchema = z.object({
  topartists: z.object({
    artist: z.array(artistSchema),
    "@attr": attrSchema,
  }),
});

export const trackApiResponseSchema = z.object({
  toptracks: z.object({
    track: z.array(trackSchema),
    "@attr": attrSchema,
  }),
});

export const userInfoApiResponseSchema = z.object({
  user: z.object({
    name: z.string(),
    playcount: z.string(),
    image: z.array(imageSchema).optional(),
    registered: z.object({
      unixtime: z.string(),
    }),
  }),
});

// Weekly charts accept an arbitrary from/to range (used by the Wrapped). Their
// nested artist reference carries the name in "#text" instead of "name".
const chartArtistRefSchema = z.object({ "#text": z.string() });

const chartItemSchema = z.object({
  name: z.string(),
  playcount: z.string(),
});

export const weeklyArtistChartResponseSchema = z.object({
  weeklyartistchart: z.object({
    artist: z.array(chartItemSchema),
  }),
});

export const weeklyTrackChartResponseSchema = z.object({
  weeklytrackchart: z.object({
    track: z.array(chartItemSchema.extend({ artist: chartArtistRefSchema })),
  }),
});

export const weeklyAlbumChartResponseSchema = z.object({
  weeklyalbumchart: z.object({
    album: z.array(chartItemSchema.extend({ artist: chartArtistRefSchema })),
  }),
});

export const recentTracksTotalResponseSchema = z.object({
  recenttracks: z.object({
    "@attr": z.object({ total: z.string() }),
  }),
});

export type AlbumApiResponse = z.infer<typeof albumApiResponseSchema>;
export type ArtistApiResponse = z.infer<typeof artistApiResponseSchema>;
export type TrackApiResponse = z.infer<typeof trackApiResponseSchema>;
export type UserInfoApiResponse = z.infer<typeof userInfoApiResponseSchema>;
export type WeeklyArtistChartResponse = z.infer<typeof weeklyArtistChartResponseSchema>;
export type WeeklyTrackChartResponse = z.infer<typeof weeklyTrackChartResponseSchema>;
export type WeeklyAlbumChartResponse = z.infer<typeof weeklyAlbumChartResponseSchema>;
