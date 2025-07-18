import express from 'express';
import cors from 'cors';
import PublicRoutes from './routes/public.routes';
import dotenv from 'dotenv';

const app = express();

dotenv.config({ path: '.env.development' });

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/', PublicRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
