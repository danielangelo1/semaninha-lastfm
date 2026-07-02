import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner = ({ message }: LoadingSpinnerProps) => {
  const { t } = useTranslation();
  const text = message ?? t('common.loading');

  return (
    <div className="loading-message">
      <div className="spinner" role="status" aria-label={text}></div>
      <p>{text}</p>
    </div>
  );
};

export default memo(LoadingSpinner);
