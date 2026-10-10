import { z } from "zod";
import {
  AlbumApiResponse,
  ArtistApiResponse,
  TrackApiResponse,
  TagApiResponse,
  UserInfoApiResponse,
} from "../types/apiResponse";
import {
  albumApiResponseSchema,
  artistApiResponseSchema,
  trackApiResponseSchema,
  tagApiResponseSchema,
  userInfoApiResponseSchema,
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

/**
 * Calculate total scrobbles for a period by fetching paginated tracks
 * This gives a more accurate count than just summing top tracks
 */
/**
 * Helper function to retry API calls with exponential backoff
 */
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
): Promise<T> => {
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const isLastAttempt = attempt === maxRetries - 1;

      if (isLastAttempt) {
        throw error;
      }

      // Wait 1 second between retries
      const waitTime = 1000;
      console.log(
        `Tentativa ${attempt + 1}/${maxRetries} falhou, tentando novamente...`,
      );
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
};

/**
 * Calculate total scrobbles for a period by fetching paginated tracks
 * Tries 3 times and throws error if fails
 */
export const getTotalScrobblesForPeriod = async (
  username: string,
  period: string,
): Promise<number> => {
  let totalScrobbles = 0;
  const limit = 1000;
  const maxPages = 3;

  for (let page = 1; page <= maxPages; page++) {
    const fetchPage = async () => {
      const url = `${ENDPOINTS.TOP_TRACKS}user=${encodeURIComponent(username)}&period=${period}&limit=${limit}&page=${page}&format=json`;
      const response = await api.get(url);

      if (response.status !== 200) {
        throw new Error(`Erro HTTP ${response.status}`);
      }

      if (response.data.error) {
        throw new Error(response.data.message || "Erro na API do Last.fm");
      }

      return response.data;
    };

    // Try 3 times with 1s delay between attempts
    const data = await retryWithBackoff(fetchPage, 3);

    const tracks = data.toptracks?.track || [];
    if (tracks.length === 0) {
      break;
    }

    const pageTotal = tracks.reduce(
      (sum: number, track: { playcount: string }) => {
        return sum + parseInt(track.playcount || "0");
      },
      0,
    );

    totalScrobbles += pageTotal;

    if (tracks.length < limit) {
      break;
    }
  }

  return totalScrobbles;
};
