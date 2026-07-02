import {
  AlbumApiResponse,
  ArtistApiResponse,
  TrackApiResponse,
  TagApiResponse,
  UserInfoApiResponse,
} from "../types/apiResponse";
import { UserRequest } from "../types/userRequest";
import { api } from "./api";
import { ERROR_KEYS, ERROR_MESSAGES } from "../constants";
import { env } from "../config/env";

const ENDPOINTS = {
  TOP_ALBUMS: "?method=user.gettopalbums&",
  TOP_ARTISTS: "?method=user.gettopartists&",
  TOP_TRACKS: "?method=user.gettoptracks&",
  TOP_TAGS: "?method=user.gettoptags&",
  USER_INFO: "?method=user.getinfo&",
} as const;

const buildLastFmUrl = (
  endpoint: string,
  user: string,
  period: string,
  limit: number,
): string => {
  return `${endpoint}user=${encodeURIComponent(user)}&period=${period}&limit=${limit}&api_key=${env.VITE_API_KEY}&format=json`;
};

const fetchTopData = async <T>(
  endpoint: string,
  data: UserRequest,
): Promise<T> => {
  try {
    const gridSize = data.limit * data.limit;
    const url = buildLastFmUrl(endpoint, data.user, data.period, gridSize);
    const response = await api.get(url);

    if (response.status !== 200) {
      throw new Error(ERROR_KEYS.API_REQUEST_ERROR);
    }

    // Check if the response contains an error from Last.fm API
    if (response.data.error) {
      throw new Error(response.data.message || ERROR_KEYS.USER_NOT_FOUND);
    }

    return response.data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(ERROR_KEYS.API_REQUEST_ERROR);
  }
};

export const getTopAlbums = (data: UserRequest): Promise<AlbumApiResponse> =>
  fetchTopData<AlbumApiResponse>(ENDPOINTS.TOP_ALBUMS, data);

export const getTopArtists = (data: UserRequest): Promise<ArtistApiResponse> =>
  fetchTopData<ArtistApiResponse>(ENDPOINTS.TOP_ARTISTS, data);

export const getTopTracks = (data: UserRequest): Promise<TrackApiResponse> =>
  fetchTopData<TrackApiResponse>(ENDPOINTS.TOP_TRACKS, data);

export const getTopTags = async (
  data: UserRequest,
): Promise<TagApiResponse> => {
  try {
    const gridSize = data.limit * data.limit;
    const url = buildLastFmUrl(
      ENDPOINTS.TOP_TAGS,
      data.user,
      data.period,
      gridSize,
    );
    const response = await api.get(url);

    if (response.status !== 200) {
      throw new Error(ERROR_MESSAGES.API_REQUEST_ERROR);
    }

    // Check if the response contains an error from Last.fm API
    if (response.data.error) {
      throw new Error(response.data.message || ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return response.data as TagApiResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(ERROR_MESSAGES.API_REQUEST_ERROR);
  }
};

export const getUserInfo = async (
  username: string,
): Promise<UserInfoApiResponse> => {
  try {
    const url = `${ENDPOINTS.USER_INFO}user=${encodeURIComponent(username)}&api_key=${env.VITE_API_KEY}&format=json`;
    const response = await api.get(url);

    if (response.status !== 200) {
      throw new Error(ERROR_MESSAGES.API_REQUEST_ERROR);
    }

    if (response.data.error) {
      throw new Error(response.data.message || ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return response.data as UserInfoApiResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(ERROR_MESSAGES.API_REQUEST_ERROR);
  }
};

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
  let lastError: unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const isLastAttempt = attempt === maxRetries - 1;

      if (isLastAttempt) {
        throw error;
      }

      // Wait 1 second between retries
      const waitTime = 1000;
      if (import.meta.env.DEV) {
        console.warn(
          `Tentativa ${attempt + 1}/${maxRetries} falhou, tentando novamente...`,
        );
      }
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
      const url = `${ENDPOINTS.TOP_TRACKS}user=${encodeURIComponent(username)}&period=${period}&limit=${limit}&page=${page}&api_key=${env.VITE_API_KEY}&format=json`;
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
