import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { jwtUserPayload } from '../types/response';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  const refreshToken = req.cookies.refresh_token;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

  if (!accessTokenSecret || !refreshTokenSecret) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Helper function to create new access token from refresh token
  const createNewAccessToken = (refreshToken: string) => {
    try {
      const decoded = jwt.verify(
        refreshToken,
        refreshTokenSecret
      ) as jwtUserPayload;
      const newAccessToken = jwt.sign(
        { id: decoded.id, name: decoded.name },
        accessTokenSecret,
        { expiresIn: '2s' }
      );

      res.setHeader('Authorization', `Bearer ${newAccessToken}`);

      req.user = decoded;
      return next();
    } catch (error) {
      console.log('Refresh token invalid or expired');
      return res.status(401).json({
        error: 'Invalid refresh token. Please login again.',
      });
    }
  };

  // If no access token provided
  if (!token) {
    if (!refreshToken) {
      return res.status(401).json({ error: 'No tokens provided' });
    }
    return createNewAccessToken(refreshToken);
  }

  // Verify access token
  try {
    const decoded = jwt.verify(token, accessTokenSecret) as jwtUserPayload;
    req.user = decoded;
    return next();
  } catch (error) {
    if (!refreshToken) {
      return res.status(401).json({
        error: 'Access token expired and no refresh token provided',
      });
    }
    return createNewAccessToken(refreshToken);
  }
}
