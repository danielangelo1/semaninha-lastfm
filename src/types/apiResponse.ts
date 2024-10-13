interface Artist {
  mbid: string;
  name: string;
  url: string;
}

interface Image {
  "#text": string;
  size: string;
}

interface Album {
  artist: Artist;
  image: Image[];
  mbid: string;
  name: string;
  playcount: string;
  url: string;
}

export interface ApiResponse {
  topalbums: {
    album: Album[];
  };
}
