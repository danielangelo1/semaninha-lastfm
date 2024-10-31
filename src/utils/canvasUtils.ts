import { UserRequest } from "../types/userRequest";
import { setFont } from "./FontHandler";

export const createCanvasContext = () => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas context not found");
  }

  canvas.width = 1300;
  canvas.height = 1300;
  context.fillStyle = "#f5f5f5";
  context.fillRect(0, 0, canvas.width, canvas.height);

  return { canvas, context };
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
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgSrc;
    img.onload = () => {
      context.drawImage(img, x, y, width, height);
      resolve();
    };
    img.onerror = () => {
      console.log("Error loading image", imgSrc);
      context.fillStyle = errorFill;
      context.fillRect(x, y, width, height);
      resolve();
    };
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
    throw new Error(
      "Você não tem dados suficientes para gerar a imagem :(, tente diminuir o tamanho",
    );
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
