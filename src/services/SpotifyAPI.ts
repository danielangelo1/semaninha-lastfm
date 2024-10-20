import { SpotifyArtistResponse } from "../types/spotify";
import { spotifyApi } from "./api";

const getToken = async () => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(
        `${import.meta.env.VITE_SPOTIFY_CLIENT_ID}:${
          import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
        }`,
      )}`,
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
};

export const getArtistImage = async (
  artistName: string,
): Promise<SpotifyArtistResponse> => {
  const token = await getToken();
  const response = await spotifyApi.get(
    `/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data as SpotifyArtistResponse;
};
