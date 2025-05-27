import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-green-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">CAIArchive</h2>
      <ul className="space-y-4">
        <li><Link to="/" className="hover:underline">หน้าหลัก</Link></li>
        <li><Link to="/research" className="hover:underline">รายการวิจัย</Link></li>
        <li><Link to="/upload" className="hover:underline">อัปโหลดวิจัย</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
