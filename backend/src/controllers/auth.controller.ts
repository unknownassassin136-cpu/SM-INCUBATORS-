import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@smincubators.in';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    if (email === adminEmail && password === adminPassword) {
      const token = jwt.sign({ email, role: 'admin' }, jwtSecret, { expiresIn: '7d' });
      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: { email, role: 'admin' },
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

export const verifyToken = async (req: AuthenticatedRequest, res: Response) => {
  return res.json({
    success: true,
    user: req.user,
  });
};

