import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../components/UploadPage.css'; 

const UploadPage = () => {
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState(''); 
  const [developers, setDevelopers] = useState(['']);
  const [advisors, setAdvisors] = useState(['']);
  const [abstract, setAbstract] = useState('');
  const [others, setOthers] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [year, setYear] = useState('');
  const navigate = useNavigate();
  const userName = localStorage.getItem('username');

  const handleDeveloperChange = (index, value) => {
    const updated = [...developers];
    updated[index] = value;
    setDevelopers(updated);
  };

  const addDeveloperField = () => {
    if (developers.length < 5) {
      setDevelopers([...developers, '']);
    }
  };

  const removeDeveloperField = (index) => {
    const updated = [...developers];
    updated.splice(index, 1);
    setDevelopers(updated);
  };

  const handleAdvisorChange = (index, value) => {
    const updated = [...advisors];
    updated[index] = value;
    setAdvisors(updated);
  };

  const addAdvisorField = () => {
    if (advisors.length < 3) {
      setAdvisors([...advisors, '']);
    }
  };

  const removeAdvisorField = (index) => {
    const updated = [...advisors];
    updated.splice(index, 1);
    setAdvisors(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('course', course);
    developers.forEach((dev) => formData.append('developer', dev));
    advisors.forEach((advisor) => formData.append('advisor', advisor));
    formData.append('year', year); 
    formData.append('abstract', abstract);
    formData.append('others', others);
    formData.append('pdfFile', pdfFile);
    formData.append('uploadedBy', userName);

    try {
      await axios.post('http://localhost:5000/api/research/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      alert('อัปโหลดสำเร็จ');
      navigate('/research');
    } catch (err) {
      console.error('Upload failed:', err);
      alert('เกิดข้อผิดพลาดในการอัปโหลด');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const research = (id) => {
    navigate('/research');
  };

  return (
    <div>
      <div className="upload-container">
        <h2 className="upload-title">อัปโหลดงานวิจัย</h2>
        <form onSubmit={handleSubmit} className="upload-form">
          <label>ชื่อหัวข้อ</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label>สาขา</label>
          <input type="text" value={course} onChange={(e) => setCourse(e.target.value)} required />

          <label>ปีการศึกษา</label>
          <input type="text" value={year} onChange={(e) => setYear(e.target.value)} required />


          <label>ชื่อผู้พัฒนา</label>
          {developers.map((dev, index) => (
            <div key={index} className="developer-row">
              <input
                type="text"
                value={dev}
                onChange={(e) => handleDeveloperChange(index, e.target.value)}
                required
              />
              {developers.length > 1 && (
                <button type="button" className="remove-btn" onClick={() => removeDeveloperField(index)}>ลบ</button>
              )}
            </div>
          ))}
          {developers.length < 5 && (
            <button type="button" className="add-btn" onClick={addDeveloperField}>+ เพิ่มผู้พัฒนา</button>
          )}

          <label>ชื่ออาจารย์ที่ปรึกษา</label>
          {advisors.map((advisor, index) => (
            <div key={index} className="advisor-row">
              <input
                type="text"
                value={advisor}
                onChange={(e) => handleAdvisorChange(index, e.target.value)}
                required
              />
              {advisors.length > 1 && (
                <button type="button" className="remove-btn" onClick={() => removeAdvisorField(index)}>ลบ</button>
              )}
            </div>
          ))}
          {advisors.length < 3 && (
            <button type="button" className="add-btn" onClick={addAdvisorField}>+ เพิ่มอาจารย์ที่ปรึกษา</button>
          )}

          <label>บทคัดย่อ</label>
          <textarea value={abstract} onChange={(e) => setAbstract(e.target.value)} rows="4" required></textarea>

          <label>อื่น ๆ (เช่น หมายเหตุ)</label>
          <textarea value={others} onChange={(e) => setOthers(e.target.value)} rows="2"></textarea>

          <label>ไฟล์ PDF</label>
          <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files[0])} required/>

          <button type="submit" className="submit-btn">อัปโหลด</button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
