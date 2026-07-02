import axios from "axios";
import { env } from "../config/env";
import { API_CONFIG } from "../constants";

export const api = axios.create({
  baseURL: env.VITE_LASTFM_URL,
  timeout: API_CONFIG.REQUEST_TIMEOUT_MS,
});

export const spotifyApi = axios.create({
  baseURL: env.VITE_SPOTIFY_URL,
  timeout: API_CONFIG.REQUEST_TIMEOUT_MS,
});

export const musicBrainzApi = axios.create({
  baseURL: env.VITE_MUSICBRAINZ_URL,
  timeout: API_CONFIG.REQUEST_TIMEOUT_MS,
});
