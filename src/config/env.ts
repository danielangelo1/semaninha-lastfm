import { z } from "zod";

const envSchema = z.object({
  VITE_API_KEY: z.string().min(1, "VITE_API_KEY is required"),
  VITE_LASTFM_URL: z.string().url("VITE_LASTFM_URL must be a valid URL"),
  VITE_SPOTIFY_URL: z.string().optional().default("https://api.spotify.com/v1"),
  VITE_SPOTIFY_CLIENT_ID: z.string().optional().default(""),
  VITE_SPOTIFY_CLIENT_SECRET: z.string().optional().default(""),
  VITE_MUSICBRAINZ_URL: z
    .string()
    .optional()
    .default("https://musicbrainz.org/ws/2"),
});

type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse(import.meta.env);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(
      `❌ Invalid environment variables:\n${errors}\n\nPlease check your .env file.`,
    );
  }

  return result.data;
}

export const env = validateEnv();
