import { UserRequest } from "../types/userRequest";
import { setFont } from "./FontHandler";
import { CANVAS_CONFIG, ERROR_MESSAGES } from "../constants";
import { getGridDimensions } from "../helpers/grid.helper";
import { AppError } from "../helpers/errors.helper";

export const createCanvasContext = (
  width: number = CANVAS_CONFIG.WIDTH,
  height: number = CANVAS_CONFIG.HEIGHT,
) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error(ERROR_MESSAGES.CANVAS_CONTEXT_ERROR);
  }

  canvas.width = width;
  canvas.height = height;
  context.fillStyle = CANVAS_CONFIG.BACKGROUND_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height);

  return { canvas, context };
};

const imageCache = new Map<string, HTMLImageElement>();

export const clearImageCache = () => imageCache.clear();

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  const cached = imageCache.get(src);
  if (cached) {
    imageCache.delete(src);
    imageCache.set(src, cached);
    return Promise.resolve(cached);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => reject(new Error(`Failed to load: ${src}`));
    img.src = src;
  });
};

export const drawImageOnCanvas = (
  context: CanvasRenderingContext2D,
  imgSrc: string,
  x: number,
  y: number,
  width: number,
  height: number,
  errorFill = "black",
) => {
  return loadImage(imgSrc)
    .then((img) => {
      context.drawImage(img, x, y, width, height);
    })
    .catch(() => {
      console.log("Error loading image", imgSrc);
      context.fillStyle = errorFill;
      context.fillRect(x, y, width, height);
    });
};

export const drawTextOnCanvas = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color = "white",
) => {
  context.fillStyle = color;
  context.fillText(text, x, y);
};

export const processImages = async <T>(
  dataItems: T[],
  userInput: UserRequest,
  getImageSrc: (item: T) => string,
  drawExtraDetails: (
    context: CanvasRenderingContext2D,
    item: T,
    x: number,
    y: number,
    artistSize: number,
    albumSize: number,
    especialPlays: number,
  ) => void,
) => {
  const { columns, rows, tileSize, width, height } = getGridDimensions(
    userInput.limit,
  );

  if (dataItems.length < columns * rows) {
    throw new AppError("insufficientData");
  }

  const { canvas, context } = createCanvasContext(width, height);
  // Text is sized for the tile, which follows the longest side of the grid
  const { artistSize, albumSize, especialPlays } = await setFont(
    context,
    Math.max(columns, rows),
  );

  const imagePromises = dataItems.map(async (item, index) => {
    const x = (index % columns) * tileSize;
    const y = Math.floor(index / columns) * tileSize;
    const imgSrc = getImageSrc(item);

    await drawImageOnCanvas(context, imgSrc, x, y, tileSize, tileSize);

    drawExtraDetails(context, item, x, y, artistSize, albumSize, especialPlays);
  });

  await Promise.all(imagePromises);

  return canvas.toDataURL("image/png");
};
