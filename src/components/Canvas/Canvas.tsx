/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { UserRequest } from "../../types/userRequest";
import { Audio } from "react-loader-spinner";
import "./canvas.css";
import { toast } from "react-toastify";
import { AlbumApiResponse, ArtistApiResponse } from "../../types/apiResponse";
import {
  createAlbumImage,
  createSpotifyImage,
} from "../../utils/generateCanvas";

interface ImageRendererProps {
  data: ArtistApiResponse | AlbumApiResponse;
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

  useEffect(() => {
    loadingHandler(true);

    const fetchData = async () => {
      try {
        if ("topalbums" in data) {
          setImageSrc(await createAlbumImage(data, userInput));
        } else {
          setImageSrc(await createSpotifyImage(data, userInput));
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      } finally {
        loadingHandler(false);
      }
    };

    fetchData();
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
