import express from 'express';
import Content from '../models/Content.js';
import { requireAuth } from '../middleware/auth.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// Configure cloudinary
// Make sure to call this after dotenv.config() in index.js
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ storage: multer.memoryStorage() });

// Public route to get content
router.get('/', async (req, res) => {
  try {
    const content = await Content.findOne();
    if (!content) {
      return res.json({ 
        title: 'Building Teams Help You Scale and Lead', 
        description: 'Connecting you with world-class talent to scale, innovate and lead',
        heroImage: '' 
      });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Protected route to update content
router.put('/', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    let heroImage = req.body.heroImage;

    // Handle image upload if a new file is provided
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const uploadResponse = await cloudinary.uploader.upload(dataURI, {
        folder: 'bloomava'
      });
      heroImage = uploadResponse.secure_url;
    }

    let content = await Content.findOne();
    if (!content) {
      content = new Content({ title, description, heroImage });
    } else {
      content.title = title;
      content.description = description;
      if (heroImage) content.heroImage = heroImage;
    }

    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
