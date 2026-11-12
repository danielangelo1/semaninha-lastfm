import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from '@phosphor-icons/react';
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
    <div className="wrapped-form">
      <label htmlFor="wrapped-username" className="wrapped-label">
        {t('wrapped.usernameLabel')}
      </label>
      <div className="wrapped-field">
        <span className="wrapped-field-prefix" aria-hidden="true">
          last.fm/user/
        </span>
        <input
          id="wrapped-username"
          type="text"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder={t('wrapped.usernamePlaceholder')}
          disabled={loading}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <button
          type="button"
          className="wrapped-generate"
          onClick={onGenerate}
          disabled={loading || !username.trim()}
          aria-label={t('wrapped.generateAria', { year: WRAPPED_YEAR })}
        >
          {loading ? t('wrapped.generating') : t('wrapped.generate')}
          {!loading && <ArrowRight size={16} weight="bold" aria-hidden="true" />}
        </button>
      </div>
      <p className="wrapped-hint">{t('wrapped.hint')}</p>
    </div>
  );
};

export default memo(WrappedInput);
