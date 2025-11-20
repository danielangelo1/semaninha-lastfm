import { memo } from 'react';
import './WrappedResult.css';
import React from 'react';

interface WrappedResultProps {
  imageUrl: string;
  username: string;
  onDownload: () => void;
}

const WrappedResult = ({ imageUrl, username, onDownload }: WrappedResultProps) => {
  return (
    <div className="wrapped-result">
      <div className="wrapped-image-container">
        <img src={imageUrl} alt={`Wrapped 2025 - ${username}`} />
      </div>
      <button 
        className="download-button" 
        onClick={onDownload}
        aria-label="Baixar imagem do Wrapped"
      >
        📥 Baixar Imagem
      </button>
    </div>
  );
};

export default memo(WrappedResult);
