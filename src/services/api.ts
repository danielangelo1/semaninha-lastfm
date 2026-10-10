import axios from "axios";
import { env } from "../config/env";

// Last.fm is proxied through our own serverless function so the API key
// never reaches the browser (see api/lastfm.ts).
export const api = axios.create({
  baseURL: "/api/lastfm",
});

export const spotifyApi = axios.create({
  baseURL: env.VITE_SPOTIFY_URL,
});

export const musicBrainzApi = axios.create({
  baseURL: env.VITE_MUSICBRAINZ_URL,
});
