import { useState, useCallback, useMemo } from "react";
import "./Wrapped.css";
import { useWrappedData } from "../../hooks/useWrappedData";
import { generateWrappedCanvas } from "../../services/WrappedCanvasService";
import WrappedInput from "../../components/WrappedInput/WrappedInput";
import WrappedResult from "../../components/WrappedResult/WrappedResult";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { WRAPPED_MESSAGES } from "../../constants/wrapped";

const Wrapped = () => {
  const [username, setUsername] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { wrappedData, loading, fetchWrappedData } = useWrappedData();

  const handleGenerateWrapped = useCallback(async () => {
    setImageUrl(null);
    await fetchWrappedData(username);
  }, [username, fetchWrappedData]);

  useMemo(() => {
    if (wrappedData) {
      generateWrappedCanvas(wrappedData)
        .then((canvas) => {
          const url = canvas.toDataURL("image/png");
          setImageUrl(url);
        })
        .catch((error) => {
          console.error("Error generating canvas:", error);
        });
    }
  }, [wrappedData]);

  // const handleDownload = useCallback(() => {
  //   if (!imageUrl) return;

  //   const link = document.createElement("a");
  //   link.download = `${username}-wrapped-2025.png`;
  //   link.href = imageUrl;
  //   link.click();
  // }, [imageUrl, username]);

  return (
    <main className="wrapped">
      <div className="wrapped-header">
        <h1>🎵 Semaninha Wrapped</h1>
        <p>
          Descubra seus artistas, músicas e álbuns mais ouvidos do ano!
        </p>
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
        />
      )}

      {loading && <LoadingSpinner message={WRAPPED_MESSAGES.LOADING} />}
    </main>
  );
};

export default Wrapped;
