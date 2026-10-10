import type { VercelRequest, VercelResponse } from "@vercel/node";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

// Cache em memória do runtime: sobrevive entre invocações "warm" da function
let cached: { token: string; expiresAt: number } | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res
      .status(500)
      .json({ error: "Spotify credentials are not configured" });
  }

  res.setHeader("Cache-Control", "no-store");

  const now = Date.now();
  if (cached && now < cached.expiresAt) {
    return res.status(200).json({
      access_token: cached.token,
      expires_in: Math.floor((cached.expiresAt - now) / 1000),
    });
  }

  try {
    const response = await fetch(SPOTIFY_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`,
        ).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      return res.status(502).json({ error: "Failed to obtain Spotify token" });
    }

    const data = (await response.json()) as {
      access_token: string;
      expires_in: number;
    };

    cached = {
      token: data.access_token,
      expiresAt: now + data.expires_in * 1000,
    };

    return res.status(200).json({
      access_token: data.access_token,
      expires_in: data.expires_in,
    });
  } catch {
    return res.status(502).json({ error: "Failed to reach Spotify" });
  }
}
