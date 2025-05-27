// import jwt from 'jsonwebtoken';

// export const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) return res.status(401).json({ message: 'No token provided' });

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  console.log('🛡️ กำลังตรวจ token'); // ✅ ดูว่า middleware ทำงานมั้ย

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ ไม่มี token หรือ token format ผิด');
    return res.status(401).json({ message: 'Missing token' });
  }

  const token = authHeader.split(' ')[1];
  console.log('📦 token ที่รับมา:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ token decode ได้:', decoded); // ✅ สำคัญ!
    req.user = decoded;
    next();
  } catch (err) {
    console.error('❌ Token verify error:', err);
    res.status(403).json({ message: 'Invalid token' });
  }
};

