import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { DownloadSimple } from '@phosphor-icons/react';
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
      <figure className="wrapped-figure">
        <img src={imageUrl} alt={t('wrapped.altText', { year: WRAPPED_YEAR, user: username })} />
      </figure>
      <button
        type="button"
        className="wrapped-download"
        onClick={onDownload}
        aria-label={t('wrapped.downloadAria')}
      >
        <DownloadSimple size={16} weight="bold" aria-hidden="true" />
        {t('wrapped.download')}
      </button>
    </div>
  );
};

export default memo(WrappedResult);
