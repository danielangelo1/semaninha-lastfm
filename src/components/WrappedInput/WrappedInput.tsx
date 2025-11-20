import { memo } from 'react';
import './WrappedInput.css';

interface WrappedInputProps {
  username: string;
  loading: boolean;
  onUsernameChange: (username: string) => void;
  onGenerate: () => void;
}

const WrappedInput = ({ username, loading, onUsernameChange, onGenerate }: WrappedInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading && username.trim()) {
      onGenerate();
    }
  };

  return (
    <div className="wrapped-input-section">
      <div className="input-group">
        <label htmlFor="username">Usuário do Last.fm</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder="Digite seu usuário"
          disabled={loading}
          onKeyDown={handleKeyDown}
          aria-label="Nome de usuário do Last.fm"
        />
      </div>

      <button
        className="generate-button"
        onClick={onGenerate}
        disabled={loading || !username.trim()}
        aria-label="Gerar Wrapped 2025"
      >
        {loading ? 'Gerando...' : 'Gerar Wrapped 2025'}
      </button>
    </div>
  );
};

export default memo(WrappedInput);
