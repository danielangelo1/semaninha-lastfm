import { API_CONFIG } from "../constants";
import { env } from "../config/env";

let spotifyToken: string | null = null;
let tokenExpirationTime: number | null = null;
let pendingRequest: Promise<string> | null = null;

const requestToken = async (): Promise<string> => {
  const currentTime = Date.now();

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(
        `${env.VITE_SPOTIFY_CLIENT_ID}:${env.VITE_SPOTIFY_CLIENT_SECRET}`,
      )}`,
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  spotifyToken = data.access_token;
  tokenExpirationTime =
    currentTime + data.expires_in * 1000 - API_CONFIG.SPOTIFY_TOKEN_BUFFER_MS;
  return data.access_token;
};

export const getSpotifyToken = async (): Promise<string> => {
  const isValid =
    spotifyToken && tokenExpirationTime && Date.now() < tokenExpirationTime;
  if (isValid) {
    return spotifyToken as string;
  }

  if (!pendingRequest) {
    pendingRequest = requestToken().finally(() => {
      pendingRequest = null;
    });
  }

  return pendingRequest;
};
