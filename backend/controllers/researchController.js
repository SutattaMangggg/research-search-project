// import Research from '../models/Research.js';
// import natural from 'natural';

// const stemmer = natural.PorterStemmer;

// export const searchResearch = async (req, res) => {
//   try {
//     const searchQuery = req.query.q;
//     if (!searchQuery) {
//       return res.status(400).json({ message: 'กรุณากรอกคำค้นหา' });
//     }

//     const queryTokens = searchQuery.split(' ').map(word => stemmer.stem(word));
//     const regexPattern = queryTokens.join('|');

//     console.log('Query Tokens:', queryTokens);

//     const results = await Research.find({
//       $or: [
//         { title: { $regex: regexPattern, $options: 'i' } },
//         { developer: { $regex: regexPattern, $options: 'i' } },
//         { abstract: { $regex: regexPattern, $options: 'i' } },
//         { course: { $regex: regexPattern, $options: 'i' } }
//       ]
//     });

//     console.log('Search Results:', results);

//     res.json(results);
//   } catch (err) {
//     console.error('Search error:', err);
//     res.status(500).json({ message: 'เกิดข้อผิดพลาดในการค้นหางานวิจัย' });
//   }
// };

import Research from '../models/Research.js';
import pkg from '@xenova/transformers';
const { pipeline } = pkg;

// cosine similarity
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, x, i) => sum + x * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, x) => sum + x * x, 0));
  const magB = Math.sqrt(b.reduce((sum, x) => sum + x * x, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

let embedder = null;

export async function searchResearch(req, res) {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ message: 'กรุณากรอกคำค้นหา' });

    // โหลดโมเดลครั้งเดียว
    if (!embedder) {
      embedder = await pipeline('embeddings', 'Xenova/all-MiniLM-L6-v2');
    }

    const output = await embedder(query, { pooling: 'mean', normalize: true });
    const queryEmbedding = output.data;

    const allResearch = await Research.find({ embedding: { $exists: true } });

    const results = allResearch
      .map((doc) => {
        const score = cosineSimilarity(queryEmbedding, doc.embedding);
        return { doc, score };
      })
      .filter(item => item.score > 0.5)
      .sort((a, b) => b.score - a.score)
      .map(item => item.doc);

    res.json(results);

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการค้นหา' });
  }
}
