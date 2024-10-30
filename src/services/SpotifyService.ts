import { Image, SpotifyArtistResponse } from "../types/spotifyResponse";
import { musicBrainzApi, spotifyApi } from "./api";

let spotifyToken: string | null = null;
let tokenExpirationTime: number | null = null;

const getToken = async () => {
  const currentTime = Date.now();
  if (
    spotifyToken &&
    tokenExpirationTime &&
    currentTime < tokenExpirationTime
  ) {
    return spotifyToken;
  }

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
  spotifyToken = data.access_token;
  tokenExpirationTime = currentTime + data.expires_in * 1000 - 60000;
  return data.access_token;
};

const SpotifyTokenSingleton = (() => {
  let instance: Promise<string> | null = null;

  return {
    getInstance: async () => {
      if (!instance) {
        instance = getToken();
      }
      return await instance;
    },
  };
})();

export const getArtistImage = async (artistName: string): Promise<Image> => {
  const token = await SpotifyTokenSingleton.getInstance();
  const response = await spotifyApi.get<SpotifyArtistResponse>(
    `/search?q=${encodeURIComponent(artistName)}&type=artist&limit=5`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const found = response.data.artists.items
    .filter((a) => a.images.length)
    .find((artist) => artist.name.toLowerCase() === artistName.toLowerCase());
  const spotifyObject = found || response.data.artists.items[0];
  return spotifyObject.images[0];
};

export const getSpotifyIdFromMBID = async (mbid: string): Promise<string> => {
  const response = await musicBrainzApi.get(
    `/artist/${mbid}?fmt=json&inc=url-rels`,
  );

  console.log(response.data);

  const spotifyId = response.data.relations.find(
    (relation: { type: string }) => relation.type === "streamingmusic",
  );

  return spotifyId.url.split(":")[2];
};
