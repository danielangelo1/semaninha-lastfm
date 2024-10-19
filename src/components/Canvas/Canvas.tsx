import { useEffect, useState } from "react";
import { ApiResponse } from "../../types/apiResponse";
import { UserRequest } from "../../types/userRequest";
import { setFont } from "../../utils/FontHandler";
import { Audio } from "react-loader-spinner";
import "./canvas.css";
import { toast } from "react-toastify";

interface ImageRendererProps {
  data: ApiResponse;
  userInput: UserRequest;
  loading: boolean;
  loadingHandler: (loading: boolean) => void;
}

const ImageRenderer = ({
  data,
  userInput,
  loading,
  loadingHandler,
}: ImageRendererProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const createImage = async (
    data: ApiResponse,
    userInput: UserRequest,
  ): Promise<string> => {
    if (data.topalbums.album.length < userInput.limit * userInput.limit) {
      toast.error(
        "Você não ouviu álbuns suficientes para gerar a imagem, diminua o tamanho",
      );
      loadingHandler(false);
      return Promise.reject("Not enough data");
    } else {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = 1250;
      canvas.height = 1250;

      if (context) {
        context.fillStyle = "#f5f5f5";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const { albumSize, artistSize, especialPlays } = setFont(
          context,
          userInput.limit,
        );

        const imagePromises = data.topalbums.album.map((album, index) => {
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
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
                context.fillText(album.artist.name, x + 2, artistSize + y);
                context.fillText(album.name, x + 2, y + (albumSize + 16));
              }
              if (userInput.showPlays) {
                context.fillText(
                  `Plays: ${album.playcount}`,
                  x + 2,
                  y + (especialPlays + 32),
                );
              }
              resolve();
            };
            img.onerror = () => {
              const x =
                (index % userInput.limit) * (canvas.width / userInput.limit);
              const y =
                Math.floor(index / userInput.limit) *
                (canvas.height / userInput.limit);
              context.fillStyle = "black";
              context.fillRect(
                x,
                y,
                canvas.width / userInput.limit,
                canvas.height / userInput.limit,
              );
              if (userInput.showAlbum) {
                context.fillStyle = "white";
                context.fillText(album.artist.name, x + 2, artistSize + y);
                context.fillText(album.name, x + 2, y + (albumSize + 16));
              }
              if (userInput.showPlays) {
                context.fillText(
                  `Plays: ${album.playcount}`,
                  x + 2,
                  y + (especialPlays + 32),
                );
              }
              resolve();
            };
          });
        });

        await Promise.all(imagePromises);
        loadingHandler(false);
        return canvas.toDataURL("image/png");
      }
    }
    return Promise.reject("Canvas context not available");
  };

  useEffect(() => {
    loadingHandler(true);
    createImage(data, userInput).then((src) => {
      setImageSrc(src);
    });
  }, [data]);

  return (
    <>
      {loading && (
        <Audio
          height={80}
          width={80}
          color="red"
          ariaLabel="loading"
          wrapperClass="loading"
        />
      )}
      {!loading && imageSrc && (
        <img src={imageSrc} alt="Album collage" style={{ maxWidth: "100%" }} />
      )}
    </>
  );
};

export default ImageRenderer;
