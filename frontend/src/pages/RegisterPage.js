  import React, { useState } from 'react';
  import API from '../api';
  import { useNavigate } from 'react-router-dom';
  import '../components/LoginPage.css'

  const Register = () => {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = e => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
      e.preventDefault();
      try {
        await API.post('/auth/register', form);
        navigate('/login');
      } catch (err) {
        setMessage(err.response?.data?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
      }
    };

    return (
      <div>
        <div className="login-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>สมัครสมาชิก</h2>
            <input
              type="text"
              name="username"
              placeholder="ชื่อผู้ใช้"
              value={form.username}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="อีเมล"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="รหัสผ่าน"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button type="submit">สมัครสมาชิก</button>
            {message && <p className="error-message">{message}</p>}
            <p className="register-link">
              มีบัญชีอยู่แล้ว? <a href="/login">เข้าสู่ระบบ</a>
            </p>
          </form>
        </div>
      </div>
    );
  };

  export default Register;
