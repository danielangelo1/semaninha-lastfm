export class SpotifyHelper {

  static formatArtistName(artistName: string): string {
    return artistName
      .toLowerCase()
      .replace(/\$/g, "s")
      .replace(/\s+/g, " ")
      .trim();
  }

}
