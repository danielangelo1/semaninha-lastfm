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
import { getErrorKey } from "../../helpers/errors.helper";
import { useTranslation } from "react-i18next";

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
        toast.error(t(`errors.${getErrorKey(error)}`));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [data, userInput, t]);

  return (
    <>
      {loading && (
        <div 
          role="status" 
          aria-live="polite"
          aria-label={t("canvas.loading")}
        >
          <Audio
            height={80}
            width={80}
            color="red"
            ariaLabel={t("canvas.loadingAria")}
            wrapperClass="loading"
          />
        </div>
      )}
      {!loading && imageSrc && (
        <img 
          src={imageSrc} 
          alt={t("canvas.altText", {
            grid: gridLabel,
            type: t(`types.${userInput.type ?? "album"}`).toLocaleLowerCase(),
            user: userInput.user,
            period: t(`periods.${userInput.period}`).toLocaleLowerCase(),
          })}
          loading="lazy"
          decoding="async"
          role="img"
          style={{ maxWidth: "100%" }} 
        />
      )}
    </>
  );
};

export default memo(ImageRenderer);
