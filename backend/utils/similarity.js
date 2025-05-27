// // src/utils/similarity.js
// // แก้จาก require เป็น import
// import natural from 'natural';

// const { TfIdf, cosineSimilarity } = natural;

// // ฟังก์ชันคำนวณความคล้ายคลึงระหว่างบทคัดย่อ
// export const getSimilarity = (text1, text2) => {
//   const tfidf = new TfIdf();
//   tfidf.addDocument(text1);
//   tfidf.addDocument(text2);

//   // คำนวณ cosine similarity ระหว่างบทคัดย่อ
//   const similarity = cosineSimilarity(tfidf.listTerms(0), tfidf.listTerms(1));
//   return similarity;
// };
export function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0;

  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));

  if (magA === 0 || magB === 0) return 0;

  return dot / (magA * magB);
}