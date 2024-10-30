import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_LASTFM_URL,
});

export const spotifyApi = axios.create({
  baseURL: import.meta.env.VITE_SPOTIFY_URL,
});

export const musicBrainzApi = axios.create({
  baseURL: import.meta.env.VITE_MUSICBRAINZ_URL,
});
