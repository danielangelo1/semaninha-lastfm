export class ServicesHelper {

  static buildLastFmUrl(
    endpoint: string,
    user: string,
    period: string,
    limit: number,
  ): string {
    return `${endpoint}user=${encodeURIComponent(user)}&period=${period}&limit=${limit}&format=json`;
  }

}