import React, { useState } from 'react';
import './App.css';

const PROXY_URL = 'http://localhost:3001';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const languages = [
  { code: 'en', name: 'English', available: true },
  { code: 'hi', name: 'Hindi (Coming Soon)', available: false },
  { code: 'es', name: 'Spanish (Coming Soon)', available: false },
  { code: 'fr', name: 'French (Coming Soon)', available: false },
  { code: 'de', name: 'German (Coming Soon)', available: false },
  { code: 'it', name: 'Italian (Coming Soon)', available: false },
  { code: 'pt', name: 'Portuguese (Coming Soon)', available: false },
  { code: 'ru', name: 'Russian (Coming Soon)', available: false },
  { code: 'ja', name: 'Japanese (Coming Soon)', available: false },
  { code: 'ko', name: 'Korean (Coming Soon)', available: false },
  { code: 'zh', name: 'Chinese (Coming Soon)', available: false }
];

function App() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [subtitles, setSubtitles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const fetchWithRetry = async (url, options = {}, retries = MAX_RETRIES) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (retries > 0) {
        console.log(`Retrying... ${retries} attempts left`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return fetchWithRetry(url, options, retries - 1);
      }
      throw error;
    }
  };

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const fetchSubtitles = async () => {
    setLoading(true);
    setError('');
    setSubtitles([]);
    setRetryCount(0);

    try {
      const id = extractVideoId(url);
      if (!id) {
        throw new Error('Invalid YouTube URL');
      }
      setVideoId(id);
      console.log('Video ID:', id);
      console.log('Selected language:', selectedLanguage);

      // First check if video exists and get available caption tracks
      console.log('Fetching caption tracks:', `${PROXY_URL}/api/subtitles/list?videoId=${id}`);
      const tracks = await fetchWithRetry(`${PROXY_URL}/api/subtitles/list?videoId=${id}`);
      console.log('Available tracks:', tracks);

      if (!tracks || tracks.length === 0) {
        throw new Error('No captions available for this video');
      }

      // Find the selected language track or fallback to first available
      const track = tracks.find(t => t.languageCode === selectedLanguage) || tracks[0];
      console.log('Fetching subtitles for track:', track);

      // Fetch the actual subtitles
      const response = await fetchWithRetry(
        `${PROXY_URL}/api/subtitles/fetch?videoId=${id}&trackId=${track.languageCode}`
      );
      console.log('Received subtitles data:', response);

      if (!response.subtitles || response.subtitles.length === 0) {
        throw new Error('No subtitle content found');
      }

      setSubtitles(response.subtitles);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-bold text-center mb-8">YouTube Subtitle Extractor</h1>
                
                <div className="mb-4">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter YouTube URL"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {languages.map(lang => (
                      <option 
                        key={lang.code} 
                        value={lang.code}
                        disabled={!lang.available}
                        className={!lang.available ? 'text-gray-400' : ''}
                      >
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={fetchSubtitles}
                  disabled={loading || !url}
                  className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${
                    loading || !url
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {loading ? 'Loading...' : 'Extract Subtitles'}
                </button>

                {error && (
                  <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                {subtitles.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Subtitles:</h2>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                      {subtitles.map((subtitle, index) => (
                        <p key={index} className="mb-2">
                          {subtitle.text}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;