import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/ResearchListPage.css';

const HomePage = () => {
  const [allResearch, setAllResearch] = useState([]);
  const [filteredResearch, setFilteredResearch] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      setIsLoggedIn(true);
      setUserName(username);
    }

    fetchAllResearch();
  }, []);

  const fetchAllResearch = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/research');
      setAllResearch(res.data);
      setFilteredResearch(res.data);
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
    e.preventDefault();

    if (!query.trim()) {
      const data = selectedYear
        ? allResearch.filter((item) => item.year === selectedYear)
        : allResearch;
      setFilteredResearch(data);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/research/search', { query });
      const results = selectedYear
        ? res.data.filter((item) => item.year === selectedYear)
        : res.data;
      setFilteredResearch(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleSelectYear = (year) => {
    setSelectedYear(year);

    if (!query.trim()) {
      const data = year
        ? allResearch.filter((item) => item.year === year)
        : allResearch;
      setFilteredResearch(data);
    } else {
      handleSearch({ preventDefault: () => {} });
    }
  };

  const handleViewDetails = (id) => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate(`/research/${id}`);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/login');
  };

  const yearOptions = Object.keys(groupByYear(allResearch)).sort((a, b) => b - a);

  return (
    <div>

      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="ค้นหา (ชื่อเรื่อง / คำสำคัญ / สาขา / ผู้พัฒนา)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="search-button">ค้นหา</button>
        </form>
      </div>

      <div className="content-layout">
        <div className="sidebar">
          <h4>เลือกปีการศึกษา</h4>
          <Link
            to="#"
            className={`year-link ${selectedYear === null ? 'active' : ''}`}
            onClick={() => handleSelectYear(null)}
          >
            ทั้งหมด
          </Link>
          {yearOptions.map((year) => (
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

        <div className="research-list-container">
          <h2>รายการโครงงาน</h2>
          {selectedYear && <h3>ปีการศึกษา: {selectedYear}</h3>}
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

export default HomePage;
