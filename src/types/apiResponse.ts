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
    '@attr'?: {
      total: string;
    };
  };
}

export interface ArtistApiResponse {
  topartists: {
    artist: Artist[];
    '@attr'?: {
      total: string;
    };
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
    '@attr'?: {
      total: string;
    };
  };
}

interface Tag {
  name: string;
  count: string;
  url: string;  
}
export interface TagApiResponse {
  toptags: {
    tag: Tag[];
  };
}

export interface UserInfoApiResponse {
  user: {
    name: string;
    playcount: string;
    registered: {
      unixtime: string;
    };
  };
}