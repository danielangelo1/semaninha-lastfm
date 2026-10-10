import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { WrappedData } from '../types/wrapped';
import { UserRequest } from '../types/userRequest';
import { getTopAlbums, getTopArtists, getTopTracks, getTotalScrobblesForPeriod } from '../services/LastFMService';
import { WRAPPED_API_CONFIG, WRAPPED_MESSAGES } from '../constants/wrapped';
import { ERROR_MESSAGES } from '../constants';

interface UseWrappedDataReturn {
  wrappedData: WrappedData | null;
  loading: boolean;
  error: string | null;
  fetchWrappedData: (username: string) => Promise<void>;
  clearData: () => void;
}

const fetchWrappedData = async (username: string): Promise<WrappedData> => {
  const userRequest: UserRequest = {
    user: username,
    period: WRAPPED_API_CONFIG.PERIOD,
    limit: WRAPPED_API_CONFIG.LIMIT,
    showAlbum: false,
  };

  const [artistsResponse, tracksResponse, albumsResponse, totalScrobbles] = await Promise.all([
    getTopArtists(userRequest),
    getTopTracks(userRequest),
    getTopAlbums(userRequest),
    getTotalScrobblesForPeriod(username, WRAPPED_API_CONFIG.PERIOD),
  ]);

  return {
    username,
    totalScrobbles,
    artists: artistsResponse.topartists.artist.slice(0, WRAPPED_API_CONFIG.TOP_COUNT),
    tracks: tracksResponse.toptracks.track.slice(0, WRAPPED_API_CONFIG.TOP_COUNT),
    albums: albumsResponse.topalbums.album.slice(0, WRAPPED_API_CONFIG.TOP_COUNT),
    stats: {
      totalArtists: artistsResponse.topartists['@attr']?.total ? parseInt(artistsResponse.topartists['@attr'].total) : artistsResponse.topartists.artist.length,
      totalAlbums: albumsResponse.topalbums['@attr']?.total ? parseInt(albumsResponse.topalbums['@attr'].total) : albumsResponse.topalbums.album.length,
      totalTracks: tracksResponse.toptracks['@attr']?.total ? parseInt(tracksResponse.toptracks['@attr'].total) : tracksResponse.toptracks.track.length,
    },
  };
};

export const useWrappedData = (): UseWrappedDataReturn => {
  const mutation = useMutation({
    mutationFn: fetchWrappedData,
    onSuccess: () => {
      toast.success(WRAPPED_MESSAGES.SUCCESS);
    },
    onError: (err) => {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.API_REQUEST_ERROR;
      toast.error(errorMessage);
      console.error('Wrapped generation error:', err);
    },
  });

  const fetchWrappedDataCallback = useCallback(
    async (username: string): Promise<void> => {
      if (!username.trim()) {
        toast.error(WRAPPED_MESSAGES.ERROR_USERNAME_REQUIRED);
        return;
      }

      await mutation.mutateAsync(username.trim()).catch(() => {});
    },
    [mutation],
  );

  const clearData = useCallback((): void => {
    mutation.reset();
  }, [mutation]);

  const errorMessage = mutation.error
    ? mutation.error instanceof Error
      ? mutation.error.message
      : ERROR_MESSAGES.API_REQUEST_ERROR
    : null;

  return {
    wrappedData: mutation.data ?? null,
    loading: mutation.isPending,
    error: errorMessage,
    fetchWrappedData: fetchWrappedDataCallback,
    clearData,
  };
};
