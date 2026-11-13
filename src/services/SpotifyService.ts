import { Image, SpotifyArtistResponse } from "../types/spotifyResponse";
import { spotifyApi } from "./api";
import { getSpotifyToken } from "./spotifyAuth";
import { SpotifyHelper } from "../helpers/spotify.helper";

export const getArtistImage = async (artistName: string): Promise<Image> => {
  const token = await getSpotifyToken();
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
      (artist) =>
        artist.name.toLowerCase() === SpotifyHelper.formatArtistName(artistName),
    );
  const spotifyObject = found || response.data.artists.items[0];
  return spotifyObject.images[0];
};
