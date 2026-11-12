import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./Wrapped.css";
import { useWrappedData } from "../../hooks/useWrappedData";
import { generateWrappedCanvas } from "../../utils/generateWrappedCanvas";
import WrappedInput from "../../components/WrappedInput/WrappedInput";
import WrappedResult from "../../components/WrappedResult/WrappedResult";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { WRAPPED_YEAR } from "../../constants/wrapped";

const Wrapped = () => {
  const { t } = useTranslation();
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
      generateWrappedCanvas(wrappedData, {
        scrobbles: t("wrapped.canvas.scrobbles"),
        artists: t("wrapped.canvas.artists"),
        albums: t("wrapped.canvas.albums"),
        tracks: t("wrapped.canvas.tracks"),
        topArtists: t("wrapped.canvas.topArtists"),
        topTracks: t("wrapped.canvas.topTracks"),
        topAlbums: t("wrapped.canvas.topAlbums"),
      })
        .then((canvas) => {
          const url = canvas.toDataURL("image/png");
          setImageUrl(url);
        })
        .catch((error) => {
          console.error("Error generating canvas:", error);
        });
    }
  }, [wrappedData, t]);

  const handleDownload = useCallback(() => {
    if (!imageUrl) return;

    const link = document.createElement("a");
    link.download = `${username}-wrapped-${WRAPPED_YEAR}.png`;
    link.href = imageUrl;
    link.click();
  }, [imageUrl, username]);

  return (
    <main className="wrapped">
      <div className="wrapped-header">
        <h1>{t("wrapped.title")}</h1>
        <p>{t("wrapped.description")}</p>
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

      {loading && <LoadingSpinner message={t("wrapped.loading")} />}
    </main>
  );
};

export default Wrapped;
