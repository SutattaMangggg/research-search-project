import express from 'express';
import multer from 'multer';
import path from 'path';
import axios from 'axios';
import Research from '../models/Research.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files allowed'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Get all research (public)
router.get('/', async (req, res) => {
  try {
    const data = await Research.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch' });
  }
});

router.get('/my-uploads', verifyToken, async (req, res) => {
  try {
    console.log('🧪 ตรวจ req.user:', req.user);

    const uploadedBy = req.user.username;
    console.log('📌 uploadedBy:', uploadedBy);

    const results = await Research.find({ uploadedBy });
    console.log('📦 จำนวนงานวิจัยที่เจอ:', results.length);

    res.json(results);
  } catch (err) {
    console.error('❌ ERROR จริง ๆ:', err); // ← สำคัญที่สุด
    res.status(500).json({ message: err.message }); // ← ต้องเปลี่ยนเป็นแบบนี้!
  }
});


// Get research by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const item = await Research.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
});




// Get researches by array of ids (used for viewed researches)
router.post('/my-views', verifyToken, async (req, res) => {
  try {
    const { viewedResearchIds } = req.body;
    if (!Array.isArray(viewedResearchIds) || viewedResearchIds.length === 0) {
      return res.json([]);
    }
    const researches = await Research.find({ _id: { $in: viewedResearchIds } }).sort({ createdAt: -1 });
    res.json(researches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch viewed researches' });
  }
});

// Upload research (only logged-in users)
router.post('/upload', verifyToken, upload.single('pdfFile'), async (req, res) => {
  try {
    const { title, course, year, advisor, abstract, others, developer } = req.body;
    const username = req.user.username;

    if (!title || !abstract || !advisor || !req.file) {
      return res.status(400).json({ message: 'Missing fields or PDF' });
    }

    const devList = typeof developer === 'string'
      ? [developer.trim()]
      : Array.isArray(developer)
      ? developer.map(d => d.trim()).filter(Boolean)
      : [];

    const advList = typeof advisor === 'string'
      ? [advisor.trim()]
      : Array.isArray(advisor)
      ? advisor.map(d => d.trim()).filter(Boolean)
      : [];

    const aiRes = await axios.post('http://localhost:5001/embed', {
      text: `${title} ${abstract}`
    });

    const newResearch = new Research({
      title,
      course,
      year,
      developer: devList,
      advisor: advList,
      abstract,
      others,
      pdfFile: req.file.filename,
      embedding: aiRes.data.embedding,
      uploadedBy: username,
    });

    await newResearch.save();
    res.status(201).json({ message: 'Uploaded successfully' });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Semantic Search
router.post('/search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ message: 'No query' });

    const aiRes = await axios.post('http://localhost:5001/embed', { text: query });
    const queryEmbedding = aiRes.data.embedding;

    const allResearch = await Research.find();
    const cosineSim = (a, b) => {
      const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
      const normA = Math.sqrt(a.reduce((sum, val) => sum + val ** 2, 0));
      const normB = Math.sqrt(b.reduce((sum, val) => sum + val ** 2, 0));
      return dot / (normA * normB);
    };

    const results = allResearch
      .map(r => ({ ...r.toObject(), score: cosineSim(r.embedding, queryEmbedding) }))
      .filter(r => r.score > 0.4)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Search failed' });
  }
});

export default router;
