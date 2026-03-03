import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Product from '../models/Product.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'stroydom_products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});

const upload = multer({ storage: storage });

const parseArrayField = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try { return JSON.parse(value); } catch { return [value]; }
};

// GET all products (public)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new product (protected, supports up to 5 images)
router.post('/', requireAuth, upload.array('images', 5), async (req, res) => {
  try {
    const uploadedUrls = (req.files || []).map(f => f.path); // Cloudinary URL is in req.file.path
    const existingUrls = parseArrayField(req.body.existingImages);
    const images = [...existingUrls, ...uploadedUrls];
    const image = images[0] || '';
    const colors = parseArrayField(req.body.colors);

    const newProduct = new Product({
      name: req.body.name || '',
      category: req.body.category || 'Boshqa',
      description: req.body.description || '',
      price: Number(req.body.price) || 0,
      salePrice: req.body.salePrice ? Number(req.body.salePrice) : undefined,
      quantity: req.body.quantity !== undefined ? Number(req.body.quantity) : undefined,
      inStock: req.body.inStock === 'true' || req.body.inStock === true,
      image,
      images,
      colors
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('POST /products error:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT update product
router.put('/:id', requireAuth, upload.array('images', 5), async (req, res) => {
  try {
    const uploadedUrls = (req.files || []).map(f => f.path);
    const existingUrls = parseArrayField(req.body.existingImages);
    const images = [...existingUrls, ...uploadedUrls];
    const colors = parseArrayField(req.body.colors);

    const updateData = {
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      price: Number(req.body.price) || 0,
      inStock: req.body.inStock === 'true' || req.body.inStock === true,
      colors
    };

    if (req.body.salePrice) updateData.salePrice = Number(req.body.salePrice);
    if (req.body.quantity !== undefined) updateData.quantity = Number(req.body.quantity);
    if (images.length > 0) {
      updateData.images = images;
      updateData.image = images[0];
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json(updatedProduct);
  } catch (error) {
    console.error('PUT /products error:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE product
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
