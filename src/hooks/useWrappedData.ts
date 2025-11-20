import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { WrappedData } from '../types/wrapped';
import { UserRequest } from '../types/userRequest';
import { getTopAlbums, getTopArtists, getTopTracks } from '../services/LastFMService';
import { WRAPPED_API_CONFIG, WRAPPED_MESSAGES } from '../constants/wrapped';
import { ERROR_MESSAGES } from '../constants';

interface UseWrappedDataReturn {
  wrappedData: WrappedData | null;
  loading: boolean;
  error: string | null;
  fetchWrappedData: (username: string) => Promise<void>;
  clearData: () => void;
}

export const useWrappedData = (): UseWrappedDataReturn => {
  const [wrappedData, setWrappedData] = useState<WrappedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWrappedData = useCallback(async (username: string): Promise<void> => {
    if (!username.trim()) {
      toast.error(WRAPPED_MESSAGES.ERROR_USERNAME_REQUIRED);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const userRequest: UserRequest = {
        user: username.trim(),
        period: WRAPPED_API_CONFIG.PERIOD,
        limit: WRAPPED_API_CONFIG.LIMIT,
        showAlbum: false,
        showPlays: false,
        type: 'album',
      };

      // Fetch all data in parallel
      const [artistsResponse, tracksResponse, albumsResponse] = await Promise.all([
        getTopArtists(userRequest),
        getTopTracks(userRequest),
        getTopAlbums(userRequest),
      ]);

      // Extract top 5 from each category
      const wrapped: WrappedData = {
        username: username.trim(),
        artists: artistsResponse.topartists.artist.slice(0, WRAPPED_API_CONFIG.TOP_COUNT),
        tracks: tracksResponse.toptracks.track.slice(0, WRAPPED_API_CONFIG.TOP_COUNT),
        albums: albumsResponse.topalbums.album.slice(0, WRAPPED_API_CONFIG.TOP_COUNT),
      };

      setWrappedData(wrapped);
      toast.success(WRAPPED_MESSAGES.SUCCESS);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.API_REQUEST_ERROR;
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Wrapped generation error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback((): void => {
    setWrappedData(null);
    setError(null);
  }, []);

  return {
    wrappedData,
    loading,
    error,
    fetchWrappedData,
    clearData,
  };
};
