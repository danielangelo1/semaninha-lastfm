import { z } from "zod";
import {
  AlbumApiResponse,
  ArtistApiResponse,
  TrackApiResponse,
  TagApiResponse,
  UserInfoApiResponse,
  WeeklyArtistChartResponse,
  WeeklyTrackChartResponse,
  WeeklyAlbumChartResponse,
} from "../types/apiResponse";
import {
  albumApiResponseSchema,
  artistApiResponseSchema,
  trackApiResponseSchema,
  tagApiResponseSchema,
  userInfoApiResponseSchema,
  weeklyArtistChartResponseSchema,
  weeklyTrackChartResponseSchema,
  weeklyAlbumChartResponseSchema,
  recentTracksTotalResponseSchema,
} from "../schemas/lastfmResponse.schema";
import { UserRequest } from "../types/userRequest";
import { api } from "./api";
import { ERROR_MESSAGES } from "../constants";
import { ServicesHelper } from "../helpers/services.helper";

const ENDPOINTS = {
  TOP_ALBUMS: "?method=user.gettopalbums&",
  TOP_ARTISTS: "?method=user.gettopartists&",
  TOP_TRACKS: "?method=user.gettoptracks&",
  TOP_TAGS: "?method=user.gettoptags&",
  USER_INFO: "?method=user.getinfo&",
  WEEKLY_ARTIST_CHART: "?method=user.getweeklyartistchart&",
  WEEKLY_TRACK_CHART: "?method=user.getweeklytrackchart&",
  WEEKLY_ALBUM_CHART: "?method=user.getweeklyalbumchart&",
  RECENT_TRACKS: "?method=user.getrecenttracks&",
} as const;

const requestLastFm = async <T>(
  url: string,
  schema: z.ZodType<T>,
): Promise<T> => {
  try {
    const response = await api.get(url);

    if (response.status !== 200) {
      throw new Error(ERROR_MESSAGES.API_REQUEST_ERROR);
    }

    // Check if the response contains an error from Last.fm API
    if (response.data.error) {
      throw new Error(response.data.message || ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return schema.parse(response.data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Last.fm response failed schema validation:", error.issues);
      throw new Error(ERROR_MESSAGES.API_REQUEST_ERROR);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(ERROR_MESSAGES.API_REQUEST_ERROR);
  }
};

const buildTopUrl = (endpoint: string, data: UserRequest): string => {
  const gridSize = data.limit * data.limit;
  return ServicesHelper.buildLastFmUrl(endpoint, data.user, data.period, gridSize);
};

export const getTopAlbums = (data: UserRequest): Promise<AlbumApiResponse> =>
  requestLastFm(buildTopUrl(ENDPOINTS.TOP_ALBUMS, data), albumApiResponseSchema);

export const getTopArtists = (data: UserRequest): Promise<ArtistApiResponse> =>
  requestLastFm(buildTopUrl(ENDPOINTS.TOP_ARTISTS, data), artistApiResponseSchema);

export const getTopTracks = (data: UserRequest): Promise<TrackApiResponse> =>
  requestLastFm(buildTopUrl(ENDPOINTS.TOP_TRACKS, data), trackApiResponseSchema);

export const getTopTags = (data: UserRequest): Promise<TagApiResponse> =>
  requestLastFm(buildTopUrl(ENDPOINTS.TOP_TAGS, data), tagApiResponseSchema);

export const getUserInfo = (username: string): Promise<UserInfoApiResponse> =>
  requestLastFm(
    `${ENDPOINTS.USER_INFO}user=${encodeURIComponent(username)}&format=json`,
    userInfoApiResponseSchema,
  );

/** A time range in Unix seconds, as accepted by Last.fm's from/to params. */
export interface DateRange {
  from: number;
  to: number;
}

const buildRangeUrl = (
  endpoint: string,
  username: string,
  { from, to }: DateRange,
  limit: number,
): string =>
  `${endpoint}user=${encodeURIComponent(username)}&from=${from}&to=${to}&limit=${limit}&format=json`;

// Unlike user.gettop*, the weekly chart methods accept an arbitrary range.
// Last.fm caps their size at 1000 entries.
export const getWeeklyArtistChart = (
  username: string,
  range: DateRange,
  limit: number,
): Promise<WeeklyArtistChartResponse> =>
  requestLastFm(
    buildRangeUrl(ENDPOINTS.WEEKLY_ARTIST_CHART, username, range, limit),
    weeklyArtistChartResponseSchema,
  );

export const getWeeklyTrackChart = (
  username: string,
  range: DateRange,
  limit: number,
): Promise<WeeklyTrackChartResponse> =>
  requestLastFm(
    buildRangeUrl(ENDPOINTS.WEEKLY_TRACK_CHART, username, range, limit),
    weeklyTrackChartResponseSchema,
  );

export const getWeeklyAlbumChart = (
  username: string,
  range: DateRange,
  limit: number,
): Promise<WeeklyAlbumChartResponse> =>
  requestLastFm(
    buildRangeUrl(ENDPOINTS.WEEKLY_ALBUM_CHART, username, range, limit),
    weeklyAlbumChartResponseSchema,
  );

/** Exact number of scrobbles in the range (from recenttracks' total). */
export const getScrobbleCount = async (
  username: string,
  range: DateRange,
): Promise<number> => {
  const data = await requestLastFm(
    buildRangeUrl(ENDPOINTS.RECENT_TRACKS, username, range, 1),
    recentTracksTotalResponseSchema,
  );
  return parseInt(data.recenttracks["@attr"].total, 10);
};
