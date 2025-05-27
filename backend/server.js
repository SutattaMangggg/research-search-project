import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import researchRoutes from './routes/researchRoutes.js';
import authRoutes from './routes/authRoutes.js';


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/api/auth', authRoutes);

// API routes
app.use('/api/research', researchRoutes);

// Serve PDF files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// PDF Download
app.get('/api/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  res.download(filePath);
});

// ✅ เพิ่มตรงนี้ เพื่อไม่ให้แสดง "Cannot GET /"
app.get('/', (req, res) => {
  res.send('Research Search Backend is running!');
});

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB Error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
