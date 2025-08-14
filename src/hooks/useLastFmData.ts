import { useState } from 'react';
import { toast } from 'react-toastify';
import { AlbumApiResponse, ArtistApiResponse, TrackApiResponse } from '../types/apiResponse';
import { UserRequest } from '../types/userRequest';
import { getTopAlbums, getTopArtists, getTopTracks } from '../services/LastFMService';
import { ERROR_MESSAGES } from '../constants';

interface UseLastFmDataReturn {
  albumData: AlbumApiResponse | null;
  artistData: ArtistApiResponse | null;
  trackData: TrackApiResponse | null;
  loading: boolean;
  error: string | null;
  fetchData: (data: UserRequest) => Promise<void>;
  clearData: () => void;
}

export const useLastFmData = (): UseLastFmDataReturn => {
  const [albumData, setAlbumData] = useState<AlbumApiResponse | null>(null);
  const [artistData, setArtistData] = useState<ArtistApiResponse | null>(null);
  const [trackData, setTrackData] = useState<TrackApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (data: UserRequest): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      if (data.type === 'album') {
        setArtistData(null);
        setTrackData(null);
        const response = await getTopAlbums(data);
        setAlbumData(response);
      } else if (data.type === 'artist') {
        setAlbumData(null);
        setTrackData(null);
        const response = await getTopArtists(data);
        setArtistData(response);
      } else if (data.type === 'track') {
        setAlbumData(null);
        setArtistData(null);
        const response = await getTopTracks(data);
        setTrackData(response);
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
    setTrackData(null);
    setError(null);
  };

  return {
    albumData,
    artistData,
    trackData,
    loading,
    error,
    fetchData,
    clearData,
  };
};
