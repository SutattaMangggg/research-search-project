import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/ResearchListPage.css'; // ใช้สไตล์เดียวกัน

const MyUploadsPage = () => {
  const [myResearches, setMyResearches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/research/my-uploads', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyResearches(res.data);
      } catch (err) {
        console.error('โหลดงานที่อัปโหลดไม่สำเร็จ:', err);
      }
    };

    fetchUploads();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/research/${id}`);
  };

  return (
    <div className="content-layout">
      <div className="research-list-container">
        <h2>งานวิจัยที่ฉันอัปโหลด</h2>

        {myResearches.length > 0 ? (
          <ul className="research-list">
            {myResearches.map((research) => (
              <li key={research._id}>
                <strong>{research.title}</strong>
                <br />
                <small className="research-meta">
                  ผู้พัฒนา: {research.developer?.join(', ') || 'ไม่ระบุ'}
                  <br />
                  ปีการศึกษา: {research.year || 'ไม่ระบุ'} | สาขา: {research.course || 'ไม่ระบุ'}
                  <br />
                  บทคัดย่อ: {research.abstract?.substring(0, 160) || 'ไม่มีข้อมูล'}...
                </small>
                <button className="button-link" onClick={() => handleViewDetails(research._id)}>
                  ดูรายละเอียด
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>คุณยังไม่ได้อัปโหลดงานวิจัยใด ๆ</p>
        )}
      </div>
    </div>
  );
};

export default MyUploadsPage;
