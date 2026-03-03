import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret_for_local_dev';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
