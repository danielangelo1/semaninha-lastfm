import { env } from "../config/env";

export class ServicesHelper {

  static buildLastFmUrl(
    endpoint: string,
    user: string,
    period: string,
    limit: number,
  ): string {
    return `${endpoint}user=${encodeURIComponent(user)}&period=${period}&limit=${limit}&api_key=${env.VITE_API_KEY}&format=json`;
  }
  
}