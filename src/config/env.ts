import { z } from "zod";

const envSchema = z.object({
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
  // Read each VITE_* var through its own static `import.meta.env.KEY`
  // access instead of passing the whole `import.meta.env` object to Zod.
  // Vite inlines every VITE_-prefixed var it finds in .env files into
  // whatever references the bare `import.meta.env` object as a whole,
  // regardless of whether the app actually reads it — that's how an old,
  // unused VITE_API_KEY sitting in a local .env ended up in the bundle
  // even after this schema stopped declaring it. Explicit per-key access
  // means only vars this file actually names can ever be inlined.
  const rawEnv = {
    VITE_SPOTIFY_URL: import.meta.env.VITE_SPOTIFY_URL,
    VITE_SPOTIFY_CLIENT_ID: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    VITE_SPOTIFY_CLIENT_SECRET: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
    VITE_MUSICBRAINZ_URL: import.meta.env.VITE_MUSICBRAINZ_URL,
  };

  const result = envSchema.safeParse(rawEnv);

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
