import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./Wrapped.css";
import { useWrappedData } from "../../hooks/useWrappedData";
import { generateWrappedCanvas } from "../../utils/generateWrappedCanvas";
import WrappedInput from "../../components/WrappedInput/WrappedInput";
import WrappedResult from "../../components/WrappedResult/WrappedResult";
import { WRAPPED_YEAR } from "../../constants/wrapped";

const Wrapped = () => {
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { wrappedData, loading, fetchWrappedData } = useWrappedData();

  const handleGenerateWrapped = useCallback(async () => {
    setImageUrl(null);
    await fetchWrappedData(username);
  }, [username, fetchWrappedData]);

  useEffect(() => {
    if (wrappedData) {
      // Re-runs on language change so the image text follows the UI
      generateWrappedCanvas(
        wrappedData,
        {
          subtitle: t("wrapped.canvas.subtitle"),
          scrobbles: t("wrapped.canvas.scrobbles"),
          artists: t("wrapped.canvas.artists"),
          albums: t("wrapped.canvas.albums"),
          tracks: t("wrapped.canvas.tracks"),
          topArtist: t("wrapped.canvas.topArtist"),
          plays: t("wrapped.canvas.plays"),
          dailyAverage: t("wrapped.canvas.dailyAverage"),
          topTracks: t("wrapped.canvas.topTracks"),
          topAlbums: t("wrapped.canvas.topAlbums"),
        },
        i18n.language,
      )
        .then((canvas) => {
          const url = canvas.toDataURL("image/png");
          setImageUrl(url);
        })
        .catch((error) => {
          console.error("Error generating canvas:", error);
        });
    }
  }, [wrappedData, t, i18n.language]);

  const handleDownload = useCallback(() => {
    if (!imageUrl) return;

    const link = document.createElement("a");
    link.download = `${username}-wrapped-${WRAPPED_YEAR}.png`;
    link.href = imageUrl;
    link.click();
  }, [imageUrl, username]);

  // Covers both the API calls and drawing the canvas (artist photos load there)
  const isPreparing = loading || (wrappedData !== null && imageUrl === null);

  return (
    <main className="wrapped">
      <div className="wrapped-hero">
        <span className="wrapped-eyebrow">
          {t("wrapped.eyebrow", { year: WRAPPED_YEAR })}
        </span>
        <h1>{t("wrapped.title")}</h1>
        <p>{t("wrapped.description", { year: WRAPPED_YEAR })}</p>
      </div>

      <WrappedInput
        username={username}
        loading={loading}
        onUsernameChange={setUsername}
        onGenerate={handleGenerateWrapped}
      />

      {imageUrl && (
        <WrappedResult
          imageUrl={imageUrl}
          username={username}
          onDownload={handleDownload}
        />
      )}

      {isPreparing && !imageUrl && (
        <div className="wrapped-placeholder" role="status">
          <span>{t("wrapped.loading")}</span>
        </div>
      )}
    </main>
  );
};

export default Wrapped;
