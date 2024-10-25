import axios from "axios";

const REDIRECT_URI = "http://localhost:5173/generateplaylist";

export const authenticateToSpotify = async () => {
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  window.localStorage.setItem("code_verifier", verifier);

  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const scope = "playlist-modify-public user-read-private";
  const authUrl = new URL("https://accounts.spotify.com/authorize");

  const params = {
    response_type: "code",
    client_id: clientId,
    scope,
    code_challenge_method: "S256",
    code_challenge: challenge,
    redirect_uri: REDIRECT_URI,
  };

  authUrl.search = new URLSearchParams(params).toString();

  window.location.href = authUrl.toString();
};

type SpotifyAccessToken = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
};

export const getAccessToken = async (
  code: string,
  codeVerifier: string
): Promise<string> => {
  const clientId = "26f089e3faab4b1183ff30f84b56d730";

  const params = new URLSearchParams({
    client_id: clientId,
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  });

  const res = await axios.post<SpotifyAccessToken>(
    "https://accounts.spotify.com/api/token",
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return res.data.access_token;
};

const generateCodeVerifier = () => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(64));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

const generateCodeChallenge = async (verifier: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};
