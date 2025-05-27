import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/ResearchListPage.css';

const ResearchListPage = () => {
  const navigate = useNavigate();
  const [allResearch, setAllResearch] = useState([]);
  const [filteredResearch, setFilteredResearch] = useState([]);
  const [groupedResearch, setGroupedResearch] = useState({});
  const [query, setQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    fetchResearch();
  }, []);

  const fetchResearch = async () => {
    try {
      const res = await axios.get('https://research-search-backend.onrender.com/api/research');
      setAllResearch(res.data);
      setFilteredResearch(res.data);
      setGroupedResearch(groupByYear(res.data));
    } catch (err) {
      console.error('โหลดงานวิจัยล้มเหลว:', err);
    }
  };

  const groupByYear = (data) =>
    data.reduce((acc, item) => {
      const year = item.year || 'ไม่ระบุ';
      acc[year] = acc[year] || [];
      acc[year].push(item);
      return acc;
    }, {});

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) {
      setFilteredResearch(selectedYear ? groupedResearch[selectedYear] || [] : allResearch);
      return;
    }

    try {
      const res = await axios.post('https://research-search-backend.onrender.com/api/research/search', { query });
      const results = selectedYear
        ? res.data.filter((item) => item.year === selectedYear)
        : res.data;

      setFilteredResearch(results);
      setGroupedResearch(groupByYear(results)); // อัปเดต sidebar ด้วยผลลัพธ์ใหม่
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleSelectYear = (year) => {
    setSelectedYear(year);
    if (!query.trim()) {
      setFilteredResearch(year ? groupedResearch[year] || [] : allResearch);
    } else {
      handleSearch({ preventDefault: () => {} });
    }
  };

  const handleViewDetails = (id) => {
    if (localStorage.getItem('token')) {
      navigate(`/research/${id}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div>
      {/* Search */}
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="ค้นหางานวิจัย (ชื่อเรื่อง, คำสำคัญ, ผู้พัฒนา...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="search-button">ค้นหา</button>
        </form>
      </div>

      {/* Content Layout */}
      <div className="content-layout">
        {/* Sidebar */}
        <div className="sidebar">
          <h4>เลือกปีการศึกษา</h4>
          <Link
            to="#"
            className={`year-link ${selectedYear === null ? 'active' : ''}`}
            onClick={() => handleSelectYear(null)}
          >
            ทั้งหมด
          </Link>
          {Object.keys(groupByYear(allResearch))
            .sort((a, b) => b - a)
            .map((year) => (
              <Link
                key={year}
                to="#"
                className={`year-link ${selectedYear === year ? 'active' : ''}`}
                onClick={() => handleSelectYear(year)}
              >
                ปีการศึกษา: {year}
              </Link>
            ))}
        </div>

        {/* Research List */}
        <div className="research-list-container">
          <h2>รายการโครงงาน</h2>
          {selectedYear && <h3 className="mb-3 text-lg font-medium">ปีการศึกษา: {selectedYear}</h3>}
          {filteredResearch.length > 0 ? (
            <ul className="research-list">
              {filteredResearch.map((research) => (
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
            <p>ไม่พบงานวิจัยที่ตรงกับคำค้นหา</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResearchListPage;
