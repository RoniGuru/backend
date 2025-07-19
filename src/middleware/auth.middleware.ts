import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { jwtUserPayload } from '../types/response';

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  const refreshToken = req.cookies.refreshToken;

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }
  //verify access token
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  jwt.verify(token, accessTokenSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded as jwtUserPayload;
    next();
  });
}
