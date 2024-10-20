export interface SpotifyArtistResponse {
  artists: {
    items: {
      images: {
        url: string;
      }[];
    }[];
  };
}
