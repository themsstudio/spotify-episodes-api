import { Buffer } from "buffer";

export default async function handler(req, res) {
  // ✅ CORS headers to allow Framer to access this API
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  // 🔐 Authenticate with Spotify
  const authResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const { access_token } = await authResponse.json();

  // 📡 Fetch episodes
  const showId = "0u41erQGzWWaE6xjmZMDNN"; // your podcast ID
  const episodesResponse = await fetch(`https://api.spotify.com/v1/shows/${showId}/episodes?market=US&limit=5`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const data = await episodesResponse.json();

  // ✅ Return only the list of episodes
  res.status(200).json(data.items);
}
