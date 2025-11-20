export interface WrappedData {
  username: string;
  artists: Array<{ name: string; playcount: string }>;
  tracks: Array<{ name: string; artist: { name: string }; playcount: string }>;
  albums: Array<{ 
    name: string; 
    artist: { name: string }; 
    playcount: string; 
    image: Array<{ "#text": string }> 
  }>;
}

export interface WrappedRequest {
  username: string;
}
