import { getArtistImage } from "../services/SpotifyService";
import {
  AlbumApiResponse,
  ArtistApiResponse,
  TrackApiResponse,
} from "../types/apiResponse";
import { UserRequest } from "../types/userRequest";
import { drawTextOnCanvas, processImages } from "./canvasUtils";

const SPOTIFY_CONCURRENCY = 5;

const mapWithConcurrency = async <T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> => {
  const results = new Array<R>(items.length);
  let next = 0;

  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (next < items.length) {
        const index = next++;
        results[index] = await fn(items[index]);
      }
    },
  );

  await Promise.all(workers);
  return results;
};

export const createSpotifyImage = async (
  data: ArtistApiResponse,
  userInput: UserRequest,
) => {
  const imgs = await mapWithConcurrency(
    data.topartists.artist,
    SPOTIFY_CONCURRENCY,
    (artist) =>
      getArtistImage(artist.name)
        .then((res) => res?.url ?? "")
        .catch(() => ""),
  );

  return processImages(
    data.topartists.artist,
    userInput,
    () => imgs.shift() || "",
    (context, item, x, y, artistSize, _, especialPlays) => {
      if (userInput.showAlbum)
        drawTextOnCanvas(context, item.name, x + 2, artistSize + y);
      if (userInput.showPlays)
        drawTextOnCanvas(
          context,
          `Plays: ${item.playcount}`,
          x + 2,
          y + (especialPlays + 18),
        );
    },
  );
};

interface MediaItem {
  name: string;
  playcount: string;
  artist: { name: string };
  image: { "#text": string }[];
}

const createMediaImage = (items: MediaItem[], userInput: UserRequest) => {
  return processImages(
    items,
    userInput,
    (item) => item.image[3]["#text"],
    (context, item, x, y, artistSize, albumSize, especialPlays) => {
      if (userInput.showAlbum) {
        drawTextOnCanvas(context, item.artist.name, x + 2, artistSize + y);
        drawTextOnCanvas(context, item.name, x + 2, y + (albumSize + 16));
      }
      if (userInput.showPlays)
        drawTextOnCanvas(
          context,
          `Plays: ${item.playcount}`,
          x + 2,
          y + (especialPlays + 30),
        );
    },
  );
};

export const createAlbumImage = (
  data: AlbumApiResponse,
  userInput: UserRequest,
) => createMediaImage(data.topalbums.album, userInput);

export const createTrackImage = (
  data: TrackApiResponse,
  userInput: UserRequest,
) => createMediaImage(data.toptracks.track, userInput);
