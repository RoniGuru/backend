import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { jwtUserPayload } from '../types/response';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const refreshToken = req.cookies.refresh_token;
  const currentDate = new Date();
  const datetime =
    'Last Sync: ' +
    currentDate.getDate() +
    '/' +
    (currentDate.getMonth() + 1) +
    '/' +
    currentDate.getFullYear() +
    ' @ ' +
    currentDate.getHours() +
    ':' +
    currentDate.getMinutes() +
    ':' +
    currentDate.getSeconds();

  console.log('🔐 AUTH MIDDLEWARE START', datetime);
  console.log('📨 Request URL:', req.method, req.path);
  console.log('🎫 Access Token Present:', !!token);
  console.log('🔄 Refresh Token Present:', !!refreshToken);

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

  if (!accessTokenSecret || !refreshTokenSecret) {
    console.log('❌ Missing token secrets');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const createNewAccessToken = (refreshToken: string) => {
    console.log('🔄 Attempting to refresh access token...');
    try {
      const decoded = jwt.verify(
        refreshToken,
        refreshTokenSecret
      ) as jwtUserPayload;

      console.log('✅ Refresh token valid for user:', decoded.name);

      const newAccessToken = jwt.sign(
        { id: decoded.id, name: decoded.name },
        accessTokenSecret,
        { expiresIn: '2hr' }
      );

      console.log('🆕 New access token generated');
      res.setHeader('Authorization', `Bearer ${newAccessToken}`);

      req.user = decoded;
      console.log('✅ AUTH SUCCESS - Token refreshed');
      return next();
    } catch (error) {
      console.log(
        '❌ Refresh token invalid or expired:',
        getErrorMessage(error)
      );
      return res.status(401).json({
        error: 'Invalid refresh token. Please login again.',
      });
    }
  };

  // If no access token provided
  if (!token) {
    console.log('⚠️ No access token provided');
    if (!refreshToken) {
      console.log('❌ No refresh token either - authentication failed');
      return res.status(401).json({ error: 'No tokens provided' });
    }
    console.log('🔄 Trying refresh token...');
    return createNewAccessToken(refreshToken);
  }

  // Verify access token
  console.log('🔍 Verifying access token...');
  try {
    const decoded = jwt.verify(token, accessTokenSecret) as jwtUserPayload;
    console.log('✅ ACCESS TOKEN VALID for user:', decoded.name);
    req.user = decoded;
    return next();
  } catch (error) {
    console.log('⚠️ Access token verification failed:', getErrorMessage(error));
    if (!refreshToken) {
      console.log('❌ No refresh token available');
      return res.status(401).json({
        error: 'Access token expired and no refresh token provided',
      });
    }
    console.log('🔄 Access token expired, trying refresh...');
    return createNewAccessToken(refreshToken);
  }
}
