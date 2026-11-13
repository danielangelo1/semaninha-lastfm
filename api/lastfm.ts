import type { IncomingMessage, ServerResponse } from "node:http";

// The parts of Vercel's Node helpers this function uses. Declared here instead
// of installing @vercel/node, which was only needed for these types and pulled
// in a long chain of vulnerable build-time dependencies.
type VercelRequest = IncomingMessage & {
  query: Record<string, string | string[] | undefined>;
};
type VercelResponse = ServerResponse & {
  status: (statusCode: number) => VercelResponse;
  json: (body: unknown) => VercelResponse;
};

const LASTFM_API_URL = "https://ws.audioscrobbler.com/2.0/";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.LASTFM_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "Last.fm API key is not configured" });
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query)) {
    // Never let a client-supplied api_key override the server-side one.
    if (key === "api_key" || typeof value !== "string") continue;
    params.set(key, value);
  }
  params.set("api_key", apiKey);
  if (!params.has("format")) params.set("format", "json");

  res.setHeader("Cache-Control", "no-store");

  try {
    const response = await fetch(`${LASTFM_API_URL}?${params.toString()}`);
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch {
    return res.status(502).json({ error: "Failed to reach Last.fm" });
  }
}
