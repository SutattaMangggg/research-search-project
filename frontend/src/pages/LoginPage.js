import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../components/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, username } = res.data;
      localStorage.setItem('username', username);
      localStorage.setItem('token', token);

      const decoded = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem('userId', decoded.id);

      navigate('/research'); // หลังจากล็อกอินสำเร็จ ไปที่หน้า Research
    } catch (err) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div>
      
      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
          <h2>เข้าสู่ระบบ</h2>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="อีเมล"
            required
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="รหัสผ่าน"
            required
          />
          <button type="submit">เข้าสู่ระบบ</button>
          {error && <p className="error-message">{error}</p>}
          <p className="register-link">
  ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิก</Link>
</p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
