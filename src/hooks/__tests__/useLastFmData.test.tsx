import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLastFmData } from '../useLastFmData';
import { UserRequest } from '../../types/userRequest';
import { TrackApiResponse } from '../../types/apiResponse';

// Mock the LastFM service
vi.mock('../../services/LastFMService', () => ({
  getTopAlbums: vi.fn(),
  getTopArtists: vi.fn(),
  getTopTracks: vi.fn(),
}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

const renderUseLastFmData = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return renderHook(() => useLastFmData(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

describe('useLastFmData Hook', () => {
  const mockUserRequest: UserRequest = {
    user: 'testuser',
    period: '7day',
    limit: 3,
    type: 'album',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderUseLastFmData();

    expect(result.current.albumData).toBeNull();
    expect(result.current.artistData).toBeNull();
    expect(result.current.trackData).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.fetchData).toBe('function');
    expect(typeof result.current.clearData).toBe('function');
  });

  it('should fetch album data when type is album', async () => {
    const { getTopAlbums } = await import('../../services/LastFMService');
    const mockAlbumData = { topalbums: { album: [] } };
    
    vi.mocked(getTopAlbums).mockResolvedValueOnce(mockAlbumData);

    const { result } = renderUseLastFmData();

    await act(async () => {
      await result.current.fetchData(mockUserRequest);
    });

    expect(getTopAlbums).toHaveBeenCalledWith(mockUserRequest);
    await waitFor(() => {
      expect(result.current.albumData).toEqual(mockAlbumData);
    });
    expect(result.current.artistData).toBeNull();
    expect(result.current.trackData).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should fetch artist data when type is artist', async () => {
    const { getTopArtists } = await import('../../services/LastFMService');
    const mockArtistData = { topartists: { artist: [] } };
    
    vi.mocked(getTopArtists).mockResolvedValueOnce(mockArtistData);

    const { result } = renderUseLastFmData();

    const artistRequest = { ...mockUserRequest, type: 'artist' as const };

    await act(async () => {
      await result.current.fetchData(artistRequest);
    });

    expect(getTopArtists).toHaveBeenCalledWith(artistRequest);
    await waitFor(() => {
      expect(result.current.artistData).toEqual(mockArtistData);
    });
    expect(result.current.albumData).toBeNull();
    expect(result.current.trackData).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should fetch track data when type is track', async () => {
    const { getTopTracks } = await import('../../services/LastFMService');
    const mockTrackData = { toptracks: { track: [] } };
    
    vi.mocked(getTopTracks).mockResolvedValueOnce(mockTrackData);

    const { result } = renderUseLastFmData();

    const trackRequest = { ...mockUserRequest, type: 'track' as const };

    await act(async () => {
      await result.current.fetchData(trackRequest);
    });

    expect(getTopTracks).toHaveBeenCalledWith(trackRequest);
    await waitFor(() => {
      expect(result.current.trackData).toEqual(mockTrackData);
    });
    expect(result.current.albumData).toBeNull();
    expect(result.current.artistData).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should handle errors and show toast notification', async () => {
    const { getTopTracks } = await import('../../services/LastFMService');
    const { toast } = await import('react-toastify');
    
    const errorMessage = 'User not found';
    vi.mocked(getTopTracks).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderUseLastFmData();

    const trackRequest = { ...mockUserRequest, type: 'track' as const };

    await act(async () => {
      await result.current.fetchData(trackRequest);
    });

    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage);
    });
    expect(result.current.loading).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });

  it('should set loading state correctly during fetch', async () => {
    const { getTopTracks } = await import('../../services/LastFMService');
    
    // Create a promise that we can control
    let resolvePromise: (value: TrackApiResponse) => void;
    const controlledPromise = new Promise<TrackApiResponse>((resolve) => {
      resolvePromise = resolve;
    });
    
    vi.mocked(getTopTracks).mockReturnValueOnce(controlledPromise);

    const { result } = renderUseLastFmData();

    const trackRequest = { ...mockUserRequest, type: 'track' as const };

    // Start the fetch
    act(() => {
      result.current.fetchData(trackRequest);
    });

    // Should be loading
    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    // Resolve the promise
    await act(async () => {
      resolvePromise!({ toptracks: { track: [] } });
    });

    // Should not be loading anymore
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should clear all data when clearData is called', () => {
    const { result } = renderUseLastFmData();

    // Set some initial state
    act(() => {
      result.current.clearData();
    });

    expect(result.current.albumData).toBeNull();
    expect(result.current.artistData).toBeNull();
    expect(result.current.trackData).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should clear other data types when fetching tracks', async () => {
    const { getTopAlbums, getTopTracks } = await import('../../services/LastFMService');
    
    const mockAlbumData = { topalbums: { album: [] } };
    const mockTrackData = { toptracks: { track: [] } };
    
    vi.mocked(getTopAlbums).mockResolvedValueOnce(mockAlbumData);
    vi.mocked(getTopTracks).mockResolvedValueOnce(mockTrackData);

    const { result } = renderUseLastFmData();

    // First fetch albums
    await act(async () => {
      await result.current.fetchData(mockUserRequest);
    });

    await waitFor(() => {
      expect(result.current.albumData).toEqual(mockAlbumData);
    });

    // Then fetch tracks - should clear album data
    const trackRequest = { ...mockUserRequest, type: 'track' as const };
    await act(async () => {
      await result.current.fetchData(trackRequest);
    });

    await waitFor(() => {
      expect(result.current.trackData).toEqual(mockTrackData);
    });
    expect(result.current.albumData).toBeNull();
    expect(result.current.artistData).toBeNull();
  });
});
