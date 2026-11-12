import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { WrappedData } from '../types/wrapped';
import {
  DateRange,
  getScrobbleCount,
  getWeeklyAlbumChart,
  getWeeklyArtistChart,
  getWeeklyTrackChart,
} from '../services/LastFMService';
import { WRAPPED_API_CONFIG, WRAPPED_MESSAGES, WRAPPED_YEAR } from '../constants/wrapped';
import { ERROR_MESSAGES } from '../constants';

interface UseWrappedDataReturn {
  wrappedData: WrappedData | null;
  loading: boolean;
  error: string | null;
  fetchWrappedData: (username: string) => Promise<void>;
  clearData: () => void;
}

// Calendar year so far: Jan 1st (viewer's local time) until now
const getWrappedRange = (): DateRange => ({
  from: Math.floor(new Date(WRAPPED_YEAR, 0, 1).getTime() / 1000),
  to: Math.floor(Date.now() / 1000),
});

const fetchWrappedData = async (username: string): Promise<WrappedData> => {
  const range = getWrappedRange();
  const { CHART_LIMIT, TOP_COUNT } = WRAPPED_API_CONFIG;

  const [artistChart, trackChart, albumChart, totalScrobbles] = await Promise.all([
    getWeeklyArtistChart(username, range, CHART_LIMIT),
    getWeeklyTrackChart(username, range, CHART_LIMIT),
    getWeeklyAlbumChart(username, range, CHART_LIMIT),
    getScrobbleCount(username, range),
  ]);

  const artists = artistChart.weeklyartistchart.artist;
  const tracks = trackChart.weeklytrackchart.track;
  const albums = albumChart.weeklyalbumchart.album;

  return {
    username,
    totalScrobbles,
    artists: artists.slice(0, TOP_COUNT),
    tracks: tracks
      .slice(0, TOP_COUNT)
      .map(({ name, playcount, artist }) => ({ name, playcount, artist: { name: artist['#text'] } })),
    albums: albums
      .slice(0, TOP_COUNT)
      .map(({ name, playcount, artist }) => ({ name, playcount, artist: { name: artist['#text'] } })),
    stats: {
      totalArtists: artists.length,
      totalAlbums: albums.length,
      totalTracks: tracks.length,
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
