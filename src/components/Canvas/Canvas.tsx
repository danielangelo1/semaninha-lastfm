import { ApiResponse } from "../../types/apiResponse";
import { useEffect, useRef } from "react";
import { UserRequest } from "../../types/userRequest";

interface CanvasProps {
  data: ApiResponse;
  userInput: UserRequest;
}

const Canvas = ({ data, userInput }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawCanvas = (
    canvas: HTMLCanvasElement,
    data: ApiResponse,
    userInput: UserRequest,
  ) => {
    const context = canvas.getContext("2d");
    canvas.width = 1250;
    canvas.height = 1250;

    if (context) {
      context.fillStyle = "#f5f5f5";
      context.fillRect(0, 0, canvas.width, canvas.height);

      const imagePromises = data.topalbums.album.map((album, index) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.src = album.image[3]["#text"];
          img.onload = () => {
            const x =
              (index % userInput.limit) * (canvas.width / userInput.limit);
            const y =
              Math.floor(index / userInput.limit) *
              (canvas.height / userInput.limit);
            context.drawImage(
              img,
              x,
              y,
              canvas.width / userInput.limit,
              canvas.height / userInput.limit,
            );
            if (userInput.showAlbum) {
              context.shadowColor = "#2b2b2b";
              context.shadowBlur = 0.3;
              context.shadowOffsetX = 1;
              context.shadowOffsetY = 1;
              context.fillStyle = "white";
              context.fillText(album.artist.name, x + 2, y + 1);
              context.fillText(album.name, x + 2, y + (1 + 16));
            }
            if (userInput.showPlays) {
              context.shadowColor = "#2b2b2b";
              context.shadowBlur = 0.3;
              context.shadowOffsetX = 1;
              context.shadowOffsetY = 1;
              context.fillStyle = "white";
              context.fillText(
                `Plays: ${album.playcount}`,
                x + 2,
                y + canvas.height / userInput.limit - 30,
              );
            }
            resolve();
          };
        });
      });

      return Promise.all(imagePromises);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      drawCanvas(canvas, data, userInput);
    }
  }, [data]);

  return <canvas ref={canvasRef} style={{ maxWidth: "100%" }} />;
};

export default Canvas;
