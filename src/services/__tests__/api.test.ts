import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTopAlbums, getTopArtists, getTopTracks } from '../LastFMService';
import { UserRequest } from '../../types/userRequest';

// Mock the api module completely
vi.mock('../api', () => ({
  api: {
    get: vi.fn(),
  },
}));

// Mock environment variables
vi.stubEnv('VITE_API_KEY', 'test-api-key');

describe('LastFM API Service Tests', () => {
  const mockUserRequest: UserRequest = {
    user: 'testuser',
    period: '7day',
    limit: 3,
    type: 'album',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('API Request Structure', () => {
    it('should call API with correct parameters for albums', async () => {
      const { api } = await import('../api');
      const mockResponse = {
        status: 200,
        data: { topalbums: { album: [] } },
      };

      vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

      await getTopAlbums(mockUserRequest);

      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('method=user.gettopalbums')
      );
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('user=testuser')
      );
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('period=7day')
      );
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('api_key=test-api-key')
      );
    });

    it('should call API with correct parameters for artists', async () => {
      const { api } = await import('../api');
      const mockResponse = {
        status: 200,
        data: { topartists: { artist: [] } },
      };

      vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

      const artistRequest = { ...mockUserRequest, type: 'artist' };
      await getTopArtists(artistRequest);

      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('method=user.gettopartists')
      );
    });

    it('should call API with correct parameters for tracks', async () => {
      const { api } = await import('../api');
      const mockResponse = {
        status: 200,
        data: { toptracks: { track: [] } },
      };

      vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

      const trackRequest = { ...mockUserRequest, type: 'track' };
      await getTopTracks(trackRequest);

      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('method=user.gettoptracks')
      );
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('user=testuser')
      );
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('period=7day')
      );
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('api_key=test-api-key')
      );
    });

    it('should handle API errors gracefully', async () => {
      const { api } = await import('../api');
      
      vi.mocked(api.get).mockRejectedValueOnce(new Error('Network Error'));

      await expect(getTopAlbums(mockUserRequest)).rejects.toThrow();
    });

    it('should handle API errors gracefully for tracks', async () => {
      const { api } = await import('../api');
      
      vi.mocked(api.get).mockRejectedValueOnce(new Error('Network Error'));

      const trackRequest = { ...mockUserRequest, type: 'track' };
      await expect(getTopTracks(trackRequest)).rejects.toThrow();
    });

    it('should handle non-200 status codes', async () => {
      const { api } = await import('../api');
      const mockErrorResponse = {
        status: 500,
        data: {},
      };

      vi.mocked(api.get).mockResolvedValueOnce(mockErrorResponse);

      await expect(getTopAlbums(mockUserRequest)).rejects.toThrow();
    });

    it('should encode special characters in username', async () => {
      const { api } = await import('../api');
      const mockResponse = {
        status: 200,
        data: { topalbums: { album: [] } },
      };

      vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

      const specialUserRequest = {
        ...mockUserRequest,
        user: 'test user@domain.com',
      };

      await getTopAlbums(specialUserRequest);

      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('user=test%20user%40domain.com')
      );
    });
  });

  describe('Grid Size Calculation', () => {
    it('should calculate correct limit for different grid sizes', async () => {
      const { api } = await import('../api');
      const mockResponse = {
        status: 200,
        data: { topalbums: { album: [] } },
      };

      vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

      const gridRequest = { ...mockUserRequest, limit: 4 };
      await getTopAlbums(gridRequest);

      // 4x4 grid = 16 items
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('limit=16')
      );
    });

    it('should calculate correct limit for 2x2 grid with tracks', async () => {
      const { api } = await import('../api');
      const mockResponse = {
        status: 200,
        data: { toptracks: { track: [] } },
      };

      vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

      const grid2x2Request = { ...mockUserRequest, type: 'track', limit: 2 };
      await getTopTracks(grid2x2Request);

      // 2x2 grid = 4 items
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('limit=4')
      );
    });

    it('should handle Last.fm API error responses for tracks', async () => {
      const { api } = await import('../api');
      const mockErrorResponse = {
        status: 200,
        data: { 
          error: 6,
          message: 'User not found'
        },
      };

      vi.mocked(api.get).mockResolvedValueOnce(mockErrorResponse);

      const trackRequest = { ...mockUserRequest, type: 'track' };
      await expect(getTopTracks(trackRequest)).rejects.toThrow('User not found');
    });
  });
});
