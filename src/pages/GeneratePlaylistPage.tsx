import axios from "axios";
import { useEffect, useState } from "react";
import { authenticateToSpotify, getAccessToken } from "../api/spotify";

const GeneratePlaylistPage = () => {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [generatePlaylistError, setGeneratePlaylistError] = useState(false);
  const [playlistLink, setPlaylistLink] = useState("");

  useEffect(() => {
    async function fetchAccessTokenAndGeneratePlaylist() {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const codeVerifier = window.localStorage.getItem("code_verifier");

      window.history.replaceState({}, "", window.location.pathname);

      if (code && codeVerifier) {
        setLoading(true);

        try {
          const accessToken = await getAccessToken(code, codeVerifier);
          const res = await axios.post("api/Reddit", {
            redditUrl: window.localStorage.getItem("reddit_url"),
            accessToken,
          });
          setLoading(false);
          setPlaylistLink(res.data);
        } catch {
          setGeneratePlaylistError(true);
        }
      } else {
        setAuthError(true);
      }
    }

    fetchAccessTokenAndGeneratePlaylist();
  }, []);

  if (authError) {
    return (
      <div className="flex flex-col items-center">
        <p className="text-red-500">Authentication error</p>
        <button className="mt-4" onClick={authenticateToSpotify}>
          Try again
        </button>
      </div>
    );
  }

  if (generatePlaylistError) {
    return (
      <div className="flex flex-col items-center">
        <p className="text-red-500">Error generating playlist</p>
        <button className="mt-4" onClick={authenticateToSpotify}>
          Try again
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center">
        <p>Generating playlist...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <p>Your playlist was successfully generated!</p>
      <p>
        Click{" "}
        <a href={playlistLink} target="_blank" rel="noopener noreferrer">
          here
        </a>{" "}
        to access it
      </p>
    </div>
  );
};

export default GeneratePlaylistPage;
