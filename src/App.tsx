import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [redditUrl, setRedditUrl] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const handleRedditUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRedditUrl(event.target.value);
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

  const handleSpotifyAuth = async () => {
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    window.localStorage.setItem("code_verifier", verifier);
    window.localStorage.setItem("reddit_url", redditUrl);

    const clientId = "26f089e3faab4b1183ff30f84b56d730";
    const redirectUri = "http://localhost:5173";
    const scope = "user-read-private user-read-email";
    const authUrl = new URL("https://accounts.spotify.com/authorize");

    const params = {
      response_type: "code",
      client_id: clientId,
      scope,
      code_challenge_method: "S256",
      code_challenge: challenge,
      redirect_uri: redirectUri,
    };

    authUrl.search = new URLSearchParams(params).toString();

    window.location.href = authUrl.toString();
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    window.history.replaceState({}, "", window.location.pathname);

    if (code) {
      setAuthenticated(true);

      axios
        .post("api/Reddit", {
          redditUrl: window.localStorage.getItem("reddit_url"),
          code,
          codeVerifier: window.localStorage.getItem("code_verifier"),
        })
        .then(() => {});
    }
  }, []);

  return (
    <>
      <h1>Reddit to Spotify Playlist Converter</h1>
      <div>
        <input
          type="text"
          value={redditUrl}
          onChange={handleRedditUrlChange}
          placeholder="Enter Reddit URL"
        />
      </div>
      <div>
        <button onClick={handleSpotifyAuth}>Authenticate with Spotify</button>
      </div>
      {authenticated && <p>Authentication successful!</p>}
    </>
  );
}

export default App;
