import express from 'express';
import cors from 'cors';
import PublicRoutes from './routes/public.routes';
import UserRoutes from './routes/user.routes';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

const app = express();

const nodeEnv = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${nodeEnv}` });

app.use(
  cors({
    origin: 'http://localhost:5173', // Your frontend URL (not 3000!)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(cookieParser());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/', PublicRoutes);
app.use('/user', UserRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('current mode ', nodeEnv);
  console.log(`Server running on port ${PORT}`);
});
