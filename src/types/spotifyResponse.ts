export interface SpotifyArtistResponse {
  artists: {
    items: {
      name: string;
      id: string;
      images: Image[];
    }[];
  };
}

export interface Image {
  url: string;
}
