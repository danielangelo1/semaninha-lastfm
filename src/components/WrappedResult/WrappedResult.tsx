import { memo } from 'react';
import { WRAPPED_YEAR } from '../../constants/wrapped';
import './WrappedResult.css';

interface WrappedResultProps {
  imageUrl: string;
  username: string;
  onDownload: () => void;
}

const WrappedResult = ({ imageUrl, username, onDownload }: WrappedResultProps) => {
  return (
    <div className="wrapped-result">
      <div className="wrapped-image-container">
        <img src={imageUrl} alt={`Wrapped ${WRAPPED_YEAR} - ${username}`} />
      </div>
      <button
        className="download-button"
        onClick={onDownload}
        aria-label="Baixar imagem do Wrapped"
      >
        Baixar Imagem
      </button>
    </div>
  );
};

export default memo(WrappedResult);
