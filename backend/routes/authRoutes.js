import express from 'express';
import { register, login } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js'; // ✅ เพิ่มบรรทัดนี้

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// ✅ เพิ่มบรรทัดนี้เพื่อให้ frontend ตรวจสอบ token ได้
router.get('/check-token', verifyToken, (req, res) => {
  res.json({ valid: true });
});

export default router;
