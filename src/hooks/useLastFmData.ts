import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { AlbumApiResponse, ArtistApiResponse, TrackApiResponse } from '../types/apiResponse';
import { UserRequest } from '../types/userRequest';
import { getTopAlbums, getTopArtists, getTopTracks } from '../services/LastFMService';
import { useTranslation } from 'react-i18next';
import { AppError, getErrorKey } from '../helpers/errors.helper';

interface UseLastFmDataReturn {
  albumData: AlbumApiResponse | null;
  artistData: ArtistApiResponse | null;
  trackData: TrackApiResponse | null;
  loading: boolean;
  error: string | null;
  fetchData: (data: UserRequest) => Promise<void>;
  clearData: () => void;
}

type LastFmMutationResult =
  | { type: 'album'; response: AlbumApiResponse }
  | { type: 'artist'; response: ArtistApiResponse }
  | { type: 'track'; response: TrackApiResponse };

const fetchLastFmData = async (data: UserRequest): Promise<LastFmMutationResult> => {
  if (data.type === 'album') {
    return { type: 'album', response: await getTopAlbums(data) };
  }
  if (data.type === 'artist') {
    return { type: 'artist', response: await getTopArtists(data) };
  }
  if (data.type === 'track') {
    return { type: 'track', response: await getTopTracks(data) };
  }
  throw new AppError('apiError', `Unknown content type: ${data.type}`);
};

export const useLastFmData = (): UseLastFmDataReturn => {
  const { t } = useTranslation();
  const mutation = useMutation({
    mutationFn: fetchLastFmData,
    onError: (error) => {
      toast.error(t(`errors.${getErrorKey(error)}`));
      console.error('Last.fm API error:', error);
    },
  });

  const fetchData = async (data: UserRequest): Promise<void> => {
    await mutation.mutateAsync(data).catch(() => {});
  };

  const clearData = (): void => {
    mutation.reset();
  };

  const errorMessage = mutation.error ? t(`errors.${getErrorKey(mutation.error)}`) : null;

  return {
    albumData: mutation.data?.type === 'album' ? mutation.data.response : null,
    artistData: mutation.data?.type === 'artist' ? mutation.data.response : null,
    trackData: mutation.data?.type === 'track' ? mutation.data.response : null,
    loading: mutation.isPending,
    error: errorMessage,
    fetchData,
    clearData,
  };
};
