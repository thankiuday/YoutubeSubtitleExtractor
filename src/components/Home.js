import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const PROXY_URL = process.env.NODE_ENV === 'production' 
  ? window.location.origin 
  : 'http://localhost:3001';
const MAX_RETRIES = 3;
const RETRY_DELAY = 500;

const languages = [
  { code: 'en', name: 'English', available: true },
  { code: 'hi', name: 'Hindi', available: true },
  { code: 'es', name: 'Spanish', available: true },
  { code: 'fr', name: 'French', available: true },
  { code: 'de', name: 'German', available: true },
  { code: 'it', name: 'Italian', available: true },
  { code: 'pt', name: 'Portuguese', available: true },
  { code: 'ru', name: 'Russian', available: true },
  { code: 'ja', name: 'Japanese', available: true },
  { code: 'ko', name: 'Korean', available: true },
  { code: 'zh', name: 'Chinese', available: true }
];

function Home() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [subtitles, setSubtitles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [error, setError] = useState('');

  const handleUrlChange = useCallback((e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    
    if (newUrl !== url) {
      setSubtitles([]);
      setError('');
    }
  }, [url]);

  const fetchWithRetry = async (url, options = {}, retries = MAX_RETRIES) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || getErrorMessage(response.status));
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

  const getErrorMessage = (status) => {
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 404:
        return 'No captions found for this video. Please try another video.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return 'Something went wrong. Please try again.';
    }
  };

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getLanguageName = (code) => {
    const language = languages.find(lang => lang.code === code);
    return language ? language.name : code;
  };

  const fetchSubtitles = async () => {
    try {
      setLoading(true);
      setError(null);
      setSubtitles(null);

      const videoId = extractVideoId(url);
      if (!videoId) {
        throw new Error('Please enter a valid YouTube URL');
      }

      // Fetch available caption tracks
      const tracksData = await fetchWithRetry(`${PROXY_URL}/api/subtitles/list?videoId=${videoId}`);

      if (!tracksData.captionTracks || tracksData.captionTracks.length === 0) {
        throw new Error('No captions available for this video. Please try another video.');
      }

      // Get the first available track
      const track = tracksData.captionTracks[0];
      
      // If the track language is different from selected language, show a message
      if (track.languageCode !== selectedLanguage) {
        const selectedLangName = getLanguageName(selectedLanguage);
        const availableLangName = getLanguageName(track.languageCode);
        setError(`Subtitles in ${selectedLangName} are not available. Showing available subtitles in ${availableLangName} instead.`);
      }

      // Fetch the subtitles
      const subtitlesData = await fetchWithRetry(
        `${PROXY_URL}/api/subtitles/fetch?videoId=${videoId}`
      );

      if (!subtitlesData.subtitles || subtitlesData.subtitles.length === 0) {
        throw new Error('No subtitles found for this video.');
      }

      setSubtitles(subtitlesData.subtitles);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadSubtitles = () => {
    if (subtitles.length === 0) return;

    const textContent = subtitles.map(subtitle => subtitle.text).join('\n\n');
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const filename = `subtitles_${videoId}_${selectedLanguage}.txt`;
    link.setAttribute('download', filename);
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="py-6 flex flex-col justify-center sm:py-12"
    >
      <div className="relative py-3 w-11/12 max-w-5xl mx-auto">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20"
        >
          <div className="w-full max-w-5xl mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl font-extrabold text-center mb-8 text-blue-600"
                >
                  Extract Subtitles
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mb-4"
                >
                  <input
                    type="text"
                    value={url}
                    onChange={handleUrlChange}
                    placeholder="Enter YouTube URL"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-4"
                >
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
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
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={fetchSubtitles}
                  disabled={loading || !url}
                  className={`w-full py-2 px-4 rounded-lg text-white font-extrabold ${
                    loading || !url
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {loading ? 'Loading...' : 'Extract Subtitles'}
                </motion.button>

                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-4 bg-blue-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      <span className="text-blue-700 font-bold">{loadingStatus}</span>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-100 text-green-700 rounded-lg font-bold"
                  >
                    {error}
                  </motion.div>
                )}

                {subtitles && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-8"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-extrabold">Subtitles:</h2>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={downloadSubtitles}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center space-x-2 font-bold"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>Download</span>
                      </motion.button>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto"
                    >
                      {subtitles.map((subtitle, index) => (
                        <motion.p
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="mb-2 font-bold"
                        >
                          {subtitle.text}
                        </motion.p>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Home; 