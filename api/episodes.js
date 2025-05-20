import { Buffer } from 'buffer';

export default async function handler(req, res) {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  const authResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const { access_token } = await authResponse.json();

  const showId = "0u41erQGzWWaE6xjmZMDNN";
  const episodesResponse = await fetch(`https://api.spotify.com/v1/shows/${showId}/episodes?market=US&limit=5`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const data = await episodesResponse.json();
  res.status(200).json(data.items);
}
