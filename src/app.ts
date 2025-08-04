import express from 'express';
import cors from 'cors';
import PublicRoutes from './routes/public.routes';
import UserRoutes from './routes/user.routes';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
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
  console.log('url', process.env.DATABASE_URL);
  console.log('url', process.env.FRONTEND_URL);
  console.log('prisma client', process.env.PRISMA_CLIENT_OUTPUT);
  console.log(`Server running on port ${PORT}`);
});
