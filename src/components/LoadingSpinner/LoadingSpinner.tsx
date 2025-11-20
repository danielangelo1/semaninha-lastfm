import { memo } from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner = ({ message = 'Carregando...' }: LoadingSpinnerProps) => {
  return (
    <div className="loading-message">
      <div className="spinner" role="status" aria-label="Carregando"></div>
      <p>{message}</p>
    </div>
  );
};

export default memo(LoadingSpinner);
