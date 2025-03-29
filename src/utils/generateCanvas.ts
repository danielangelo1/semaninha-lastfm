import { getArtistImageScraper } from "../services/scraper";
import { AlbumApiResponse, ArtistApiResponse } from "../types/apiResponse";
import { UserRequest } from "../types/userRequest";
import { drawTextOnCanvas, processImages } from "./canvasUtils";

export const createSpotifyImage = async (
  data: ArtistApiResponse,
  userInput: UserRequest,
) => {
  const imgs = await Promise.all(
    data.topartists.artist.map((artist) =>
      getArtistImageScraper(artist.url).then((image) => image),
    ),
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
