import { getArtistImage } from "../services/SpotifyService";
import { AlbumApiResponse, ArtistApiResponse, TrackApiResponse } from "../types/apiResponse";
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

export const createAlbumImage = async (
  data: AlbumApiResponse,
  userInput: UserRequest,
) => {
  return processImages(
    data.topalbums.album,
    userInput,
    (album) => album.image[3]["#text"],
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

export const createTrackImage = async (
  data: TrackApiResponse,
  userInput: UserRequest,
) => {
  return processImages(
    data.toptracks.track,
    userInput,
    (track) => track.image[3]["#text"],
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
