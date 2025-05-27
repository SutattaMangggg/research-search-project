import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "อีเมล์มีอยู่แล้ว" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });

    // ✅ สร้าง JWT Token
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ ส่ง token กลับไปหลังสมัครสำเร็จ
    res.status(201).json({
      message: "ลงทะเบียนผู้ใช้งานสำเร็จแล้ว",
      token,
      username: newUser.username
    });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "กรุณาระบุทั้งอีเมล์และรหัสผ่าน" });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token, username: user.username });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
