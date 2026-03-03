import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/products.json');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
});

// Accept up to 5 images in the 'images' field
const upload = multer({ storage: storage });

const readProducts = () => {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

const writeProducts = (products) => {
  fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
};

// Parse a field that may be a JSON array string, an array, or a plain string
const parseArrayField = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try { return JSON.parse(value); } catch { return [value]; }
};

// GET all products (public)
router.get('/', (req, res) => {
  try {
    const products = readProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new product (protected, supports up to 5 images)
router.post('/', requireAuth, upload.array('images', 5), (req, res) => {
  try {
    // Build images array: existing URLs passed from frontend + newly uploaded files
    const uploadedUrls = (req.files || []).map(f => `http://localhost:5000/uploads/${f.filename}`);
    const existingUrls = parseArrayField(req.body.existingImages);
    const images = [...existingUrls, ...uploadedUrls];
    const image = images[0] || '';          // backwards-compat single image field
    const colors = parseArrayField(req.body.colors);

    const products = readProducts();
    const newProduct = {
      _id: Date.now().toString(),
      name: req.body.name || '',
      category: req.body.category || '',
      description: req.body.description || '',
      price: Number(req.body.price) || 0,
      salePrice: req.body.salePrice ? Number(req.body.salePrice) : undefined,
      quantity: req.body.quantity !== undefined ? Number(req.body.quantity) : undefined,
      inStock: req.body.inStock === 'true' || req.body.inStock === true,
      image,
      images,
      colors,
      createdAt: new Date().toISOString()
    };

    products.unshift(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('POST /products error:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT update product (protected, supports up to 5 images)
router.put('/:id', requireAuth, upload.array('images', 5), (req, res) => {
  try {
    const products = readProducts();
    const index = products.findIndex(p => p._id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Product not found' });

    const uploadedUrls = (req.files || []).map(f => `http://localhost:5000/uploads/${f.filename}`);
    const existingUrls = parseArrayField(req.body.existingImages);
    const images = [...existingUrls, ...uploadedUrls];
    const image = images.length > 0 ? images[0] : (products[index].image || '');
    const colors = parseArrayField(req.body.colors);

    products[index] = {
      ...products[index],
      name: req.body.name || products[index].name,
      category: req.body.category || products[index].category,
      description: req.body.description !== undefined ? req.body.description : products[index].description,
      price: Number(req.body.price) || products[index].price,
      salePrice: req.body.salePrice ? Number(req.body.salePrice) : undefined,
      quantity: req.body.quantity !== undefined ? Number(req.body.quantity) : products[index].quantity,
      inStock: req.body.inStock === 'true' || req.body.inStock === true,
      image,
      images: images.length > 0 ? images : (products[index].images || [image]),
      colors: colors.length > 0 ? colors : (products[index].colors || []),
      updatedAt: new Date().toISOString()
    };

    writeProducts(products);
    res.json(products[index]);
  } catch (error) {
    console.error('PUT /products error:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE product (protected)
router.delete('/:id', requireAuth, (req, res) => {
  try {
    let products = readProducts();
    products = products.filter(p => p._id !== req.params.id);
    writeProducts(products);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
