export interface WrappedData {
  username: string;
  // Last.fm profile picture, used when the top artist photo is unavailable
  avatarUrl: string | null;
  totalScrobbles: number;
  artists: Array<{ name: string; playcount: string }>;
  tracks: Array<{ name: string; artist: { name: string }; playcount: string }>;
  albums: Array<{ name: string; artist: { name: string }; playcount: string }>;
  stats: {
    totalArtists: number;
    totalAlbums: number;
    totalTracks: number;
  };
}

export interface WrappedRequest {
  username: string;
}

// Translated strings drawn on the Wrapped image
export interface WrappedCanvasLabels {
  subtitle: string;
  scrobbles: string;
  artists: string;
  albums: string;
  tracks: string;
  topArtist: string;
  plays: string;
  topTracks: string;
  topAlbums: string;
}
