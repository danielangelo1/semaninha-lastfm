export interface UserRequest {
  user: string;
  period: string;
  /** Grid size: "5" for 5x5, or "columnsxrows" such as "2x6" */
  limit: string;
  showAlbum?: boolean;
  showPlays?: boolean;
  type?: string;
}
