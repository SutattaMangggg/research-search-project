import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/ResearchDetailPage.css';

const ResearchDetailPage = () => {
  const { id } = useParams(); 
  const [research, setResearch] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('username');

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/research/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setResearch(res.data);
      } catch (err) {
        console.error('ไม่สามารถโหลดข้อมูลวิจัย:', err);
      }
    };

    fetchResearch();
  }, [id]);

  if (research === null) {
    return <p>กำลังโหลดข้อมูล...</p>;
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const researchlist = (id) => {
    navigate('/research');
  };

  // ฟังก์ชันตรวจสอบว่าเป็น array หรือไม่
  const formatArray = (data) => {
    return Array.isArray(data) ? data.join(', ') : data || 'ไม่ระบุ';
  };

  return (
    <div>
      <div className="research-detail-container">
        <h2>รายละเอียดโครงงาน</h2>

        <p><strong>ชื่อโครงงาน:</strong></p>
        <p>{research.title || 'ไม่ระบุ'}</p>

        <p><strong>สาขา:</strong></p>
        <p>{research.course || 'ไม่ระบุ'}</p>

        <p><strong>ปีการศึกษา</strong></p>
        <p>{formatArray(research.year)}</p>

        <p><strong>ผู้พัฒนา:</strong></p>
        <p>{formatArray(research.developer)}</p>

        <p><strong>อาจารย์ที่ปรึกษา:</strong></p>
        <p>{formatArray(research.advisor)}</p>

        <p><strong>บทคัดย่อ:</strong></p>
        <p>{research.abstract || 'ไม่ระบุ'}</p>

        <p><strong>อื่น ๆ:</strong></p>
        <p>{research.others || 'ไม่มีข้อมูลเพิ่มเติม'}</p>

        {research.pdfFile && (
          <p>
            <a
              href={`http://localhost:5000/api/download/${research.pdfFile}`}
              download={`${research.title}.pdf`}
              rel="noopener noreferrer"
            >
              ดาวน์โหลดไฟล์ PDF
            </a>
          </p>
        )}


        <div className="button-container">
          <button onClick={() => navigate(-1)}>← กลับ</button>
        </div>

      </div>
    </div>
  );
};

export default ResearchDetailPage;
