import { useEffect, useRef, useState, memo } from "react";
import { useTranslation } from "react-i18next";
import { UserRequest } from "../../types/userRequest";
import { Audio } from "react-loader-spinner";
import "./canvas.css";
import { toast } from "react-toastify";
import { AlbumApiResponse, ArtistApiResponse, TrackApiResponse } from "../../types/apiResponse";
import { GeneratedImage } from "../../utils/canvasUtils";
import {
  createAlbumImage,
  createSpotifyImage,
  createTrackImage,
} from "../../utils/generateCanvas";

interface ImageRendererProps {
  data: ArtistApiResponse | AlbumApiResponse | TrackApiResponse;
  userInput: UserRequest;
}

const ImageRenderer = ({
  data,
  userInput,
}: ImageRendererProps) => {
  const { t } = useTranslation();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setImageSrc(null);

    const generateImage = async () => {
      try {
        let result: GeneratedImage | null = null;

        if ("topalbums" in data) {
          result = await createAlbumImage(data, userInput);
        } else if ("topartists" in data) {
          result = await createSpotifyImage(data, userInput);
        } else if ("toptracks" in data) {
          result = await createTrackImage(data, userInput);
        }

        if (!cancelled && result) {
          setImageSrc(result.dataURL);
          if (result.isPartial) {
            toast.info(t("canvas.partialGrid"), { toastId: "partial-grid" });
          }
        }
      } catch (error) {
        if (!cancelled && error instanceof Error) {
          toast.error(t(error.message, { defaultValue: error.message }));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    generateImage();

    return () => {
      cancelled = true;
    };
  }, [data, userInput, t]);

  useEffect(() => {
    if (imageSrc) {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [imageSrc]);

  const downloadName = `semaninha-${userInput.user}-${userInput.type}-${userInput.limit}x${userInput.limit}.jpg`;

  return (
    <div className="canvas-result" ref={containerRef}>
      {loading && (
        <div role="status" aria-live="polite" aria-label={t("canvas.loading")}>
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
        <>
          <img
            src={imageSrc}
            alt={t("canvas.altText", {
              size: userInput.limit,
              type: t(`types.${userInput.type}`),
              user: userInput.user,
              period: t(`periods.${userInput.period}`),
            })}
            loading="lazy"
            decoding="async"
            role="img"
            style={{ maxWidth: "100%" }}
          />
          <a
            className="download-button"
            href={imageSrc}
            download={downloadName}
          >
            {t("canvas.download")}
          </a>
        </>
      )}
    </div>
  );
};

export default memo(ImageRenderer);
