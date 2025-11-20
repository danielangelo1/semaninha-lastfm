export interface WrappedData {
  username: string;
  totalScrobbles: number;
  artists: Array<{ name: string; playcount: string }>;
  tracks: Array<{ name: string; artist: { name: string }; playcount: string }>;
  albums: Array<{ 
    name: string; 
    artist: { name: string }; 
    playcount: string; 
    image: Array<{ "#text": string }> 
  }>;
  stats: {
    totalArtists: number;
    totalAlbums: number;
    totalTracks: number;
  };
}

export interface WrappedRequest {
  username: string;
}
