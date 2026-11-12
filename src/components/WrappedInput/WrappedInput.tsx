import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { WRAPPED_YEAR } from '../../constants/wrapped';
import './WrappedInput.css';

interface WrappedInputProps {
  username: string;
  loading: boolean;
  onUsernameChange: (username: string) => void;
  onGenerate: () => void;
}

const WrappedInput = ({ username, loading, onUsernameChange, onGenerate }: WrappedInputProps) => {
  const { t } = useTranslation();
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading && username.trim()) {
      onGenerate();
    }
  };

  return (
    <div className="wrapped-input-section">
      <div className="input-group">
        <label htmlFor="username">{t('wrapped.usernameLabel')}</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder={t('wrapped.usernamePlaceholder')}
          disabled={loading}
          onKeyDown={handleKeyDown}
          aria-label={t('wrapped.usernameAria')}
        />
      </div>

      <button
        className="generate-button"
        onClick={onGenerate}
        disabled={loading || !username.trim()}
        aria-label={t('wrapped.generate', { year: WRAPPED_YEAR })}
      >
        {loading ? t('wrapped.generating') : t('wrapped.generate', { year: WRAPPED_YEAR })}
      </button>
    </div>
  );
};

export default memo(WrappedInput);
