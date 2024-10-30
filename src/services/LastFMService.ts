import { AlbumApiResponse, ArtistApiResponse } from "../types/apiResponse";
import { UserRequest } from "../types/userRequest";
import { api } from "./api";

const endpoint = "?method=user.gettopalbums&";

export const getTopAlbums = async (
  data: UserRequest,
): Promise<AlbumApiResponse> => {
  const gridSize = data.limit * data.limit;
  const response = await api.get(
    `${endpoint}user=${data.user}&period=${
      data.period
    }&limit=${gridSize}&api_key=${import.meta.env.VITE_API_KEY}&format=json`,
  );

  if (response.status !== 200) {
    throw new Error("Erro na requisição");
  }
  return response.data as AlbumApiResponse;
};

export const getTopArtists = async (
  data: UserRequest,
): Promise<ArtistApiResponse> => {
  const gridSize = data.limit * data.limit;

  const response = await api.get(
    `?method=user.gettopartists&user=${data.user}&period=${
      data.period
    }&limit=${gridSize}&api_key=${import.meta.env.VITE_API_KEY}&format=json`,
  );

  if (response.status !== 200) {
    throw new Error("Erro na requisição");
  }
  return response.data as ArtistApiResponse;
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
