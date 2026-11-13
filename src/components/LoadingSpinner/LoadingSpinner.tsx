import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner = ({ message }: LoadingSpinnerProps) => {
  const { t } = useTranslation();

  return (
    <div className="loading-message">
      <div className="spinner" role="status" aria-label={t('common.loading')}></div>
      <p>{message ?? t('common.loading')}</p>
    </div>
  );
};

export default memo(LoadingSpinner);
