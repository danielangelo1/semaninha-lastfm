import { Artist } from "../types/apiResponse";
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

export const getArtistImage = async (artistName: string): Promise<T> => {
  const token = await getToken();
  const response = await spotifyApi.get(
    `/search?q=${encodeURIComponent(artistName)}&type=artist&limit=5`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const found = response.data.artists.items
    .filter((a) => a.images.length)
    .find(
      (artist: Artist) =>
        artist.name.toLowerCase() === artistName.toLowerCase(),
    );
  const spotifyObject = found || response.data.artists.items[0];
  return spotifyObject as SpotifyArtistResponse;
};
