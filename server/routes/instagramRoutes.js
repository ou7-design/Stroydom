import express from 'express';
import https from 'https';

const router = express.Router();

// Cache to avoid hitting Instagram API on every request
let cache = null;
let cacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Invalid JSON')); }
      });
    }).on('error', reject);
  });
}

/**
 * GET /api/instagram/posts
 *
 * Returns the latest 3 Instagram posts from @stroydom.uzbekistan.
 *
 * Requires INSTAGRAM_ACCESS_TOKEN in server/.env
 * Get one at: https://developers.facebook.com/docs/instagram-basic-display-api/getting-started
 *
 * Once you have the token, add to server/.env:
 *   INSTAGRAM_ACCESS_TOKEN=your_long_lived_token_here
 */
router.get('/posts', async (req, res) => {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    // No token configured — return empty so frontend uses its own fallback
    return res.status(503).json({
      error: 'Instagram access token not configured',
      hint: 'Add INSTAGRAM_ACCESS_TOKEN to server/.env'
    });
  }

  // Return cached result if fresh
  if (cache && Date.now() - cacheTime < CACHE_TTL_MS) {
    return res.json(cache);
  }

  try {
    // Instagram Basic Display API — fetch up to 10 recent media items
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
    const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=10&access_token=${token}`;
    
    const data = await httpsGet(url);

    if (!data.data) throw new Error(data.error?.message || 'No data from Instagram');

    // Filter to only IMAGE, VIDEO, CAROUSEL_ALBUM and take the latest 3
    const posts = data.data
      .filter(p => ['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM'].includes(p.media_type))
      .slice(0, 3);

    cache = posts;
    cacheTime = Date.now();

    res.json(posts);
  } catch (err) {
    console.error('Instagram API error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
