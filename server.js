// server.js
const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;
const API_KEY = 'prem-babu'; // <- Yahan aapka khud ka API key hai

app.use(cors());

app.get('/youtube', async (req, res) => {
  const { id, type, apikey } = req.query;

  if (apikey !== API_KEY) {
    return res.status(403).json({ error: '🚫 Invalid API key' });
  }

  if (!id || !type) {
    return res.status(400).json({ error: '⚠️ Missing video id or type' });
  }

  try {
    const videoUrl = `https://www.youtube.com/watch?v=${id}`;
    const info = await ytdl.getInfo(videoUrl);

    let format;

    if (type === 'audio') {
      format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
    } else {
      format = ytdl.chooseFormat(info.formats, { quality: '18' }); // 360p mp4
    }

    return res.json({ downloadUrl: format.url });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: '❌ Failed to fetch video link' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
