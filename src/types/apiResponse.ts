export interface Artist {
  mbid: string;
  name: string;
  url: string;
  playcount: string;
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

export interface AlbumApiResponse {
  topalbums: {
    album: Album[];
  };
}

export interface ArtistApiResponse {
  topartists: {
    artist: Artist[];
  };
}

interface Track {
  artist: Artist;
  image: Image[];
  mbid: string;
  name: string;
  playcount: string;
  url: string;
}

export interface TrackApiResponse {
  toptracks: {
    track: Track[];
  };
}
