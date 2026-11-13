import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { WRAPPED_YEAR } from '../../constants/wrapped';
import ImageActions from '../ImageActions/ImageActions';
import './WrappedResult.css';

interface WrappedResultProps {
  imageUrl: string;
  username: string;
}

const WrappedResult = ({ imageUrl, username }: WrappedResultProps) => {
  const { t } = useTranslation();

  return (
    <div className="wrapped-result">
      <figure className="wrapped-figure">
        <img src={imageUrl} alt={t('wrapped.altText', { year: WRAPPED_YEAR, user: username })} />
      </figure>
      <ImageActions
        imageUrl={imageUrl}
        fileName={`${username}-wrapped-${WRAPPED_YEAR}.png`}
        shareText={t('share.wrappedText', { year: WRAPPED_YEAR })}
      />
    </div>
  );
};

export default memo(WrappedResult);
