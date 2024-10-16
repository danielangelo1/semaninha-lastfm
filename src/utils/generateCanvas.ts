import { ApiResponse } from "../types/apiResponse";

export const generateCanvas = (data: ApiResponse) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1250;
  canvas.height = 1250;
  const context = canvas.getContext("2d");

  if (context) {
    context.fillStyle = "#f5f5f5";
    context.fillRect(0, 0, canvas.width, canvas.height);

    data.topalbums.album.forEach((album, index) => {
      const x = (index % 5) * 250;
      const y = Math.floor(index / 5) * 250;

      const img = new Image();
      img.src = album.image[2]["#text"];
      img.onload = () => {
        context.drawImage(img, x, y, 250, 250);
      };
    });
  }

  return canvas;
};
