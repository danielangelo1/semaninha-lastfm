import  { useEffect, useState, memo } from "react";
import { UserRequest } from "../../types/userRequest";
import { Audio } from "react-loader-spinner";
import "./canvas.css";
import { toast } from "react-toastify";
import { AlbumApiResponse, ArtistApiResponse, TrackApiResponse } from "../../types/apiResponse";
import {
  createAlbumImage,
  createSpotifyImage,
  createTrackImage,
} from "../../utils/generateCanvas";
import { parseGridSize } from "../../helpers/grid.helper";
import { useTranslation } from "react-i18next";
import ImageActions from "../ImageActions/ImageActions";

interface ImageRendererProps {
  data: ArtistApiResponse | AlbumApiResponse | TrackApiResponse;
  userInput: UserRequest;
}

const ImageRenderer = ({
  data,
  userInput,
}: ImageRendererProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { columns, rows } = parseGridSize(userInput.limit);
  const gridLabel = `${columns}x${rows}`;

  useEffect(() => {
    setLoading(true);
    setImageSrc(null);

    const fetchData = async () => {
      try {
        if ("topalbums" in data) {
          setImageSrc(await createAlbumImage(data, userInput));
        } else if ("topartists" in data) {
          setImageSrc(await createSpotifyImage(data, userInput));
        } else if ("toptracks" in data) {
          setImageSrc(await createTrackImage(data, userInput));
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [data, userInput]);

  return (
    <>
      {loading && (
        <div 
          role="status" 
          aria-live="polite"
          aria-label="Gerando colagem de álbuns"
        >
          <Audio
            height={80}
            width={80}
            color="red"
            ariaLabel="Carregando colagem de álbuns do Last.fm"
            wrapperClass="loading"
          />
        </div>
      )}
      {!loading && imageSrc && (
        <div className="collage-result">
          <img 
            src={imageSrc} 
            alt={`Colagem de ${gridLabel} álbuns mais escutados de ${userInput.user} no período de ${userInput.period}`}
            loading="lazy"
            decoding="async"
            role="img"
            style={{ maxWidth: "100%" }} 
          />
          <ImageActions
            imageUrl={imageSrc}
            fileName={`${userInput.user}-semaninha-${userInput.period}-${gridLabel}.png`}
            shareText={t("share.collageText")}
          />
        </div>
      )}
    </>
  );
};

export default memo(ImageRenderer);
