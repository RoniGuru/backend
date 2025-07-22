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

  // If no access token, check refresh token
  if (!token) {
    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token provided' });
    }

    // create new access token
    return jwt.verify(
      refreshToken,
      refreshTokenSecret,
      (
        err: jwt.VerifyErrors | null,
        decoded: string | jwt.JwtPayload | undefined
      ) => {
        if (err) {
          return res
            .status(401)
            .json({ error: 'Invalid refresh token. Please login again.' });
        }

        const payload = decoded as jwtUserPayload;
        const newAccessToken = jwt.sign(
          { id: payload.id, name: payload.name },
          accessTokenSecret,
          { expiresIn: '1hr' }
        );

        res.setHeader('Authorization', `Bearer ${newAccessToken}`);
        req.user = payload;
        next();
      }
    );
  }

  // Try access token first
  jwt.verify(token, accessTokenSecret, (err, decoded) => {
    if (err) {
      if (!refreshToken) {
        return res.status(401).json({
          error: 'Access token expired and no refresh token provided',
        });
      }
      // Access token invalid, try refresh token
      return jwt.verify(
        refreshToken,
        refreshTokenSecret,
        (
          refreshErr: jwt.VerifyErrors | null,
          refreshDecoded: string | jwt.JwtPayload | undefined
        ) => {
          if (refreshErr) {
            return res
              .status(401)
              .json({ error: 'Invalid refresh token. Please login again.' });
          }

          const payload = refreshDecoded as jwtUserPayload;
          const newAccessToken = jwt.sign(
            { id: payload.id, name: payload.name },
            accessTokenSecret,
            { expiresIn: '1hr' }
          );

          res.setHeader('Authorization', `Bearer ${newAccessToken}`);
          req.user = payload;
          next();
        }
      );
    } else {
      // Access token is valid
      req.user = decoded as jwtUserPayload;
      next();
    }
  });
}
