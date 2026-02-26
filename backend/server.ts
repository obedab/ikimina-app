import express from 'express';
import type { Request, Response } from 'express';

import { connectDB } from './config/db.js';

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Test route
app.get('/', (req, res) => {
  res.send('API Irakora neza');
});
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK' });
});

// Start server AFTER DB connection
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => console.error('pole, Server failed to start', err));
