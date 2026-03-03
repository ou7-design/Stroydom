import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import instagramRoutes from './routes/instagramRoutes.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Serve uploads statically
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'));
}
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
  fs.writeFileSync(path.join(__dirname, 'data', 'products.json'), '[]');
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/instagram', instagramRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://localhost:${PORT} with local JSON storage`));
