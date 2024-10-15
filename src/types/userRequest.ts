export interface UserRequest {
  user: string;
  period: string;
  limit: number;
  showAlbum?: boolean;
  showPlays?: boolean;
}
