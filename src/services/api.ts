import axios from "axios";
import { env } from "../config/env";

export const api = axios.create({
  baseURL: env.VITE_LASTFM_URL,
});

export const spotifyApi = axios.create({
  baseURL: env.VITE_SPOTIFY_URL,
});

export const musicBrainzApi = axios.create({
  baseURL: env.VITE_MUSICBRAINZ_URL,
});
