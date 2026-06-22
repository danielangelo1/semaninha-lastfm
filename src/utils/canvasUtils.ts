import { UserRequest } from "../types/userRequest";
import { setFont } from "./FontHandler";
import { CANVAS_CONFIG, ERROR_MESSAGES } from "../constants";

export const createCanvasContext = () => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error(ERROR_MESSAGES.CANVAS_CONTEXT_ERROR);
  }

  canvas.width = CANVAS_CONFIG.WIDTH;
  canvas.height = CANVAS_CONFIG.HEIGHT;
  context.fillStyle = CANVAS_CONFIG.BACKGROUND_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height);

  return { canvas, context };
};

const imageCache = new Map<string, HTMLImageElement>();

export const clearImageCache = () => imageCache.clear();

const loadImage = (src: string): Promise<HTMLImageElement> => {
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
  if (dataItems.length < userInput.limit * userInput.limit) {
    throw new Error(ERROR_MESSAGES.INSUFFICIENT_DATA);
  }

  const { canvas, context } = createCanvasContext();
  const { artistSize, albumSize, especialPlays } = await setFont(
    context,
    userInput.limit,
  );

  const imagePromises = dataItems.map(async (item, index) => {
    const x = (index % userInput.limit) * (canvas.width / userInput.limit);
    const y =
      Math.floor(index / userInput.limit) * (canvas.height / userInput.limit);
    const imgSrc = getImageSrc(item);

    await drawImageOnCanvas(
      context,
      imgSrc,
      x,
      y,
      canvas.width / userInput.limit,
      canvas.height / userInput.limit,
    );

    drawExtraDetails(context, item, x, y, artistSize, albumSize, especialPlays);
  });

  await Promise.all(imagePromises);

  return canvas.toDataURL("image/png");
};
