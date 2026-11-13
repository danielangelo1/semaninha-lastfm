import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { DownloadSimple, ShareNetwork } from "@phosphor-icons/react";
import { canShareImages, downloadImage, shareImage } from "../../utils/shareImage";
import "./ImageActions.css";

interface ImageActionsProps {
  imageUrl: string;
  fileName: string;
  shareText: string;
}

const ImageActions = ({ imageUrl, fileName, shareText }: ImageActionsProps) => {
  const { t } = useTranslation();
  // Checked once: the share sheet only exists on some (mostly mobile) browsers
  const [shareSupported] = useState(canShareImages);
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    setSharing(true);
    try {
      await shareImage(imageUrl, fileName, shareText);
    } catch {
      toast.error(t("share.error"));
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="image-actions">
      {shareSupported && (
        <button
          type="button"
          className="image-action image-action-primary"
          onClick={handleShare}
          disabled={sharing}
        >
          <ShareNetwork size={16} weight="bold" aria-hidden="true" />
          {t("share.share")}
        </button>
      )}
      <button
        type="button"
        className="image-action"
        onClick={() => downloadImage(imageUrl, fileName)}
      >
        <DownloadSimple size={16} weight="bold" aria-hidden="true" />
        {t("share.download")}
      </button>
    </div>
  );
};

export default memo(ImageActions);
