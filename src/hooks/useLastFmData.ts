import { useState } from 'react';
import { toast } from 'react-toastify';
import { AlbumApiResponse, ArtistApiResponse } from '../types/apiResponse';
import { UserRequest } from '../types/userRequest';
import { getTopAlbums, getTopArtists } from '../services/LastFMService';
import { ERROR_MESSAGES } from '../constants';

interface UseLastFmDataReturn {
  albumData: AlbumApiResponse | null;
  artistData: ArtistApiResponse | null;
  loading: boolean;
  error: string | null;
  fetchData: (data: UserRequest) => Promise<void>;
  clearData: () => void;
}

export const useLastFmData = (): UseLastFmDataReturn => {
  const [albumData, setAlbumData] = useState<AlbumApiResponse | null>(null);
  const [artistData, setArtistData] = useState<ArtistApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (data: UserRequest): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      if (data.type === 'album') {
        setArtistData(null);
        const response = await getTopAlbums(data);
        setAlbumData(response);
      } else {
        setAlbumData(null);
        const response = await getTopArtists(data);
        setArtistData(response);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.USER_NOT_FOUND;
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Last.fm API error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearData = (): void => {
    setAlbumData(null);
    setArtistData(null);
    setError(null);
  };

  return {
    albumData,
    artistData,
    loading,
    error,
    fetchData,
    clearData,
  };
};
