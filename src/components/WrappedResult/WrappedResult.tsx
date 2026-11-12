import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { WRAPPED_YEAR } from '../../constants/wrapped';
import './WrappedResult.css';

interface WrappedResultProps {
  imageUrl: string;
  username: string;
  onDownload: () => void;
}

const WrappedResult = ({ imageUrl, username, onDownload }: WrappedResultProps) => {
  const { t } = useTranslation();

  return (
    <div className="wrapped-result">
      <div className="wrapped-image-container">
        <img src={imageUrl} alt={t('wrapped.altText', { year: WRAPPED_YEAR, user: username })} />
      </div>
      <button
        className="download-button"
        onClick={onDownload}
        aria-label={t('wrapped.downloadAria')}
      >
        {t('wrapped.download')}
      </button>
    </div>
  );
};

export default memo(WrappedResult);
