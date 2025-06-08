const express = require('express');
const cors = require('cors');
const { YoutubeTranscript } = require('youtube-transcript');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for the React app
app.use(cors());
app.use(express.json());

// Enhanced cache system
const cache = {
  tracks: new Map(),
  subtitles: new Map(),
  maxAge: 24 * 60 * 60 * 1000, // 24 hours cache
  maxSize: 1000, // Maximum number of items to cache
  cleanupInterval: 60 * 60 * 1000, // Cleanup every hour

  // Add item to cache with size management
  set: function(key, value, type) {
    const cacheMap = this[type];
    const timestamp = Date.now();

    // If cache is full, remove oldest item
    if (cacheMap.size >= this.maxSize) {
      const oldestKey = Array.from(cacheMap.keys())[0];
      cacheMap.delete(oldestKey);
    }

    cacheMap.set(key, {
      data: value,
      timestamp: timestamp
    });
  },

  // Get item from cache with age check
  get: function(key, type) {
    const cacheMap = this[type];
    const item = cacheMap.get(key);

    if (!item) return null;

    // Check if item is expired
    if (Date.now() - item.timestamp > this.maxAge) {
      cacheMap.delete(key);
      return null;
    }

    return item;
  },

  // Cleanup expired items
  cleanup: function() {
    const now = Date.now();
    ['tracks', 'subtitles'].forEach(type => {
      const cacheMap = this[type];
      for (const [key, value] of cacheMap.entries()) {
        if (now - value.timestamp > this.maxAge) {
          cacheMap.delete(key);
        }
      }
    });
  }
};

// Start cache cleanup interval
setInterval(() => cache.cleanup(), cache.cleanupInterval);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get list of available caption tracks
app.get('/api/subtitles/list', async (req, res) => {
  try {
    const { videoId } = req.query;
    if (!videoId) {
      return res.status(400).json({ error: 'Please provide a valid YouTube video ID.' });
    }

    try {
      // Get all available transcripts
      const transcripts = await YoutubeTranscript.fetchTranscript(videoId);
      
      if (!transcripts || transcripts.length === 0) {
        return res.status(404).json({ error: 'No captions available for this video. Please try another video.' });
      }

      // Get the language code from the first transcript
      const languageCode = transcripts[0].lang || 'en';

      // Return the available track
      const captionTracks = [{
        languageCode: languageCode,
        name: languageCode,
        baseUrl: videoId
      }];

      res.json({ captionTracks });
    } catch (error) {
      console.error('Error fetching caption tracks:', error);
      res.status(500).json({ error: 'Unable to fetch captions. Please try again later.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Unable to fetch captions. Please try again later.' });
  }
});

// Fetch subtitles for a specific track
app.get('/api/subtitles/fetch', async (req, res) => {
  try {
    const { videoId } = req.query;
    if (!videoId) {
      return res.status(400).json({ error: 'Please provide a valid YouTube video ID.' });
    }

    try {
      const subtitles = await YoutubeTranscript.fetchTranscript(videoId);

      if (!subtitles || subtitles.length === 0) {
        return res.status(404).json({ error: 'No subtitles found for this video.' });
      }

      // Format the subtitles
      const formattedSubtitles = subtitles.map(subtitle => ({
        text: subtitle.text,
        start: subtitle.start,
        duration: subtitle.duration
      }));

      res.json({ subtitles: formattedSubtitles });
    } catch (error) {
      console.error('Error fetching subtitles:', error);
      res.status(500).json({ error: 'Unable to fetch subtitles. Please try again later.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Unable to fetch subtitles. Please try again later.' });
  }
});

// Helper function to verify transcript language
async function verifyTranscriptLanguage(transcript, requestedLang) {
  // Take a sample of the transcript to verify language
  const sampleSize = Math.min(5, transcript.length);
  const sample = transcript.slice(0, sampleSize).map(t => t.text).join(' ');
  
  // Simple language detection based on common words
  const languageIndicators = {
    en: ['the', 'and', 'is', 'in', 'to', 'of', 'a', 'that', 'have', 'I'],
    ko: ['은', '는', '이', '가', '을', '를', '에', '의', '로', '와'],
    // Add more language indicators as needed
  };

  const indicators = languageIndicators[requestedLang] || [];
  const matches = indicators.filter(word => 
    sample.toLowerCase().includes(word.toLowerCase())
  );

  // If we find enough matches, consider it the correct language
  return matches.length >= 2;
}

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error: ' + err.message });
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files
  app.use(express.static(path.join(__dirname, '../build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
  console.log('Server is ready to handle requests');
});