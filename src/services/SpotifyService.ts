import { Image, SpotifyArtistResponse } from "../types/spotifyResponse";
import { musicBrainzApi, spotifyApi } from "./api";
import { API_CONFIG } from "../constants";

const TOKEN_ENDPOINT = "/api/spotify-token";

let tokenPromise: Promise<string> | null = null;
let tokenExpiresAt = 0;

const formatArtistName = (artistName: string) => {
  return artistName
    .toLowerCase()
    .replace(/\$/g, "s")
    .replace(/\s+/g, " ")
    .trim();
};

const fetchToken = async (): Promise<string> => {
  const response = await fetch(TOKEN_ENDPOINT);
  if (!response.ok) {
    throw new Error(`Spotify token request failed: ${response.status}`);
  }

  const data: { access_token: string; expires_in: number } =
    await response.json();

  tokenExpiresAt =
    Date.now() + data.expires_in * 1000 - API_CONFIG.SPOTIFY_TOKEN_BUFFER_MS;
  return data.access_token;
};

const getToken = (): Promise<string> => {
  if (tokenPromise && Date.now() < tokenExpiresAt) {
    return tokenPromise;
  }

  // Enquanto o fetch está pendente, chamadas concorrentes reusam a mesma Promise;
  // o valor real de expiração é definido quando o fetch resolve
  tokenExpiresAt = Number.MAX_SAFE_INTEGER;
  tokenPromise = fetchToken().catch((error) => {
    tokenPromise = null;
    tokenExpiresAt = 0;
    throw error;
  });

  return tokenPromise;
};

export const getArtistImage = async (artistName: string): Promise<Image> => {
  const token = await getToken();
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
    .find(
      (artist) => artist.name.toLowerCase() === formatArtistName(artistName),
    );
  const spotifyObject = found || response.data.artists.items[0];
  return spotifyObject?.images?.[0] ?? { url: "" };
};

export const getSpotifyIdFromMBID = async (mbid: string): Promise<string> => {
  const response = await musicBrainzApi.get(
    `/artist/${mbid}?fmt=json&inc=url-rels`,
  );

  const spotifyId = response.data.relations.find(
    (relation: { type: string }) => relation.type === "streamingmusic",
  );

  return spotifyId.url.split(":")[2];
};
