import { AlbumApiResponse, ArtistApiResponse } from "../types/apiResponse";
import { UserRequest } from "../types/userRequest";
import { api } from "./api";
import { ERROR_MESSAGES } from "../constants";

const ENDPOINTS = {
  TOP_ALBUMS: "?method=user.gettopalbums&",
  TOP_ARTISTS: "?method=user.gettopartists&",
  TOP_TRACKS: "?method=user.gettoptracks&",
} as const;

const buildLastFmUrl = (endpoint: string, user: string, period: string, limit: number): string => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    throw new Error("Last.fm API key is not configured");
  }
  
  return `${endpoint}user=${encodeURIComponent(user)}&period=${period}&limit=${limit}&api_key=${apiKey}&format=json`;
};

export const getTopAlbums = async (
  data: UserRequest,
): Promise<AlbumApiResponse> => {
  try {
    const gridSize = data.limit * data.limit;
    const url = buildLastFmUrl(ENDPOINTS.TOP_ALBUMS, data.user, data.period, gridSize);
    const response = await api.get(url);

    if (response.status !== 200) {
      throw new Error(ERROR_MESSAGES.API_REQUEST_ERROR);
    }
    
    // Check if the response contains an error from Last.fm API
    if (response.data.error) {
      throw new Error(response.data.message || ERROR_MESSAGES.USER_NOT_FOUND);
    }
    
    return response.data as AlbumApiResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(ERROR_MESSAGES.API_REQUEST_ERROR);
  }
};

export const getTopArtists = async (
  data: UserRequest,
): Promise<ArtistApiResponse> => {
  try {
    const gridSize = data.limit * data.limit;
    const url = buildLastFmUrl(ENDPOINTS.TOP_ARTISTS, data.user, data.period, gridSize);
    const response = await api.get(url);

    if (response.status !== 200) {
      throw new Error(ERROR_MESSAGES.API_REQUEST_ERROR);
    }
    
    // Check if the response contains an error from Last.fm API
    if (response.data.error) {
      throw new Error(response.data.message || ERROR_MESSAGES.USER_NOT_FOUND);
    }
    
    return response.data as ArtistApiResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(ERROR_MESSAGES.API_REQUEST_ERROR);
  }
};

export const getTopTracks = async (data: UserRequest) => {
  const gridSize = data.limit * data.limit;

  const response = await api.get(
    `?method=user.gettoptracks&user=${data.user}&period=${
      data.period
    }&limit=${gridSize}&api_key=${import.meta.env.VITE_API_KEY}&format=json`,
  );

  if (response.status !== 200) {
    throw new Error("Erro na requisição");
  }
  return response.data;
};
