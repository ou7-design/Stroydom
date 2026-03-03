import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ message: 'Password required' });
  }

  console.log('Login attempt with password:', password);
  let isMatch = false;
  
  if (process.env.ADMIN_PASSWORD_HASH) {
    console.log('Using ADMIN_PASSWORD_HASH from env:', process.env.ADMIN_PASSWORD_HASH);
    isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    console.log('Is match result:', isMatch);
  } else {
    // Fallback for local development without .env
    console.log('No ADMIN_PASSWORD_HASH found, using fallback');
    isMatch = password === 'admin123';
  }
  
  if (!isMatch) {
    console.error('Login failed for password:', password);
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const secret = process.env.JWT_SECRET || 'fallback_secret_for_local_dev';
  const token = jwt.sign({ role: 'admin' }, secret, { expiresIn: '1d' });
  
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });

  res.json({ message: 'Logged in successfully' });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

export default router;
