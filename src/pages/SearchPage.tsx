import { useState } from "react";
import { authenticateToSpotify } from "../api/spotify";

function SearchPage() {
  const [redditUrl, setRedditUrl] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [valid, setValid] = useState(false);

  const handleRedditUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRedditUrl(event.target.value);

    if (validateRedditUrl(event.target.value)) {
      setValid(true);
    } else {
      setValid(false);
    }
  };

  const handleSpotifyAuth = () => {
    setSubmitAttempted(true);

    if (valid) {
      window.localStorage.setItem("reddit_url", redditUrl);
      authenticateToSpotify();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl mb-4">
        Generate a Spotify playlist from a Reddit thread
      </h1>
      <input
        className="block p-2 w-96"
        type="text"
        value={redditUrl}
        onChange={handleRedditUrlChange}
        placeholder="Enter Reddit post URL"
      />
      {submitAttempted && !valid && (
        <p className="my-1 text-red-500">The url does not seem to be correct</p>
      )}
      <button
        className="block mt-4"
        onClick={handleSpotifyAuth}
        disabled={submitAttempted && !valid}
      >
        Authenticate with Spotify
      </button>
    </div>
  );
}

const validateRedditUrl = (url: string) => {
  return /(https:\/\/)*(www\.)*reddit\.com\/r\/[a-zA-Z0-9_-]+\/comments\/[a-zA-Z0-9]+\/*/.test(
    url
  );
};

export default SearchPage;
