import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { WrappedData } from '../types/wrapped';
import {
  DateRange,
  getScrobbleCount,
  getUserInfo,
  getWeeklyAlbumChart,
  getWeeklyArtistChart,
  getWeeklyTrackChart,
} from '../services/LastFMService';
import { WRAPPED_API_CONFIG, WRAPPED_YEAR } from '../constants/wrapped';
import { getErrorKey } from '../helpers/errors.helper';

interface UseWrappedDataReturn {
  wrappedData: WrappedData | null;
  loading: boolean;
  error: string | null;
  fetchWrappedData: (username: string) => Promise<void>;
  clearData: () => void;
}

// Largest profile picture, or null when the user has none or the call fails
const fetchAvatarUrl = async (username: string): Promise<string | null> => {
  try {
    const { user } = await getUserInfo(username);
    const images = user.image ?? [];
    return images[images.length - 1]?.['#text'] || null;
  } catch {
    return null;
  }
};

// Calendar year so far: Jan 1st (viewer's local time) until now
const getWrappedRange = (): DateRange => ({
  from: Math.floor(new Date(WRAPPED_YEAR, 0, 1).getTime() / 1000),
  to: Math.floor(Date.now() / 1000),
});

const fetchWrappedData = async (username: string): Promise<WrappedData> => {
  const range = getWrappedRange();
  const { CHART_LIMIT, TOP_COUNT } = WRAPPED_API_CONFIG;

  const [artistChart, trackChart, albumChart, totalScrobbles, avatarUrl] = await Promise.all([
    getWeeklyArtistChart(username, range, CHART_LIMIT),
    getWeeklyTrackChart(username, range, CHART_LIMIT),
    getWeeklyAlbumChart(username, range, CHART_LIMIT),
    getScrobbleCount(username, range),
    fetchAvatarUrl(username),
  ]);

  const daysElapsed = Math.max(1, Math.ceil((range.to - range.from) / 86400));
  const artists = artistChart.weeklyartistchart.artist;
  const tracks = trackChart.weeklytrackchart.track;
  const albums = albumChart.weeklyalbumchart.album;

  return {
    username,
    avatarUrl,
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
      dailyAverage: totalScrobbles / daysElapsed,
    },
  };
};

export const useWrappedData = (): UseWrappedDataReturn => {
  const { t } = useTranslation();
  const mutation = useMutation({
    mutationFn: fetchWrappedData,
    // Last.fm intermittently returns 500 on large year-long charts
    retry: 2,
    retryDelay: 1000,
    onSuccess: () => {
      toast.success(t('wrapped.success'));
    },
    onError: (err) => {
      toast.error(t(`errors.${getErrorKey(err)}`));
      console.error('Wrapped generation error:', err);
    },
  });

  const fetchWrappedDataCallback = useCallback(
    async (username: string): Promise<void> => {
      if (!username.trim()) {
        toast.error(t('wrapped.usernameRequired'));
        return;
      }

      await mutation.mutateAsync(username.trim()).catch(() => {});
    },
    [mutation, t],
  );

  const clearData = useCallback((): void => {
    mutation.reset();
  }, [mutation]);

  const errorMessage = mutation.error ? t(`errors.${getErrorKey(mutation.error)}`) : null;

  return {
    wrappedData: mutation.data ?? null,
    loading: mutation.isPending,
    error: errorMessage,
    fetchWrappedData: fetchWrappedDataCallback,
    clearData,
  };
};
