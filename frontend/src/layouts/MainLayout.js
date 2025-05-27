import React, { useEffect, useState } from 'react';
import PublicNavbar from '../components/Homenavbar';

const MainLayout = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      setIsLoggedIn(true);
      setUserName(username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  return (
    <div>
      <PublicNavbar isLoggedIn={isLoggedIn} userName={userName} onLogout={handleLogout} />
      <main style={{ padding: '20px' }}>{children}</main>
    </div>
  );
};

export default MainLayout;
