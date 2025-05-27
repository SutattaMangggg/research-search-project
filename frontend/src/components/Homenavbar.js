// import React from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import './navbar.css';

// const PublicNavbar = ({ isLoggedIn, userName, onLogout }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   return (
//     <nav className="navbar">
//       <div className="navbar-left">
//         <Link to="/" style={{ textDecoration: 'none' }}>
//           <h1>CAIArchive</h1>
//         </Link>
//       </div>
//       <div className="navbar-right">
//         {isLoggedIn ? (
//           <>
//             <span>ยินดีต้อนรับ, {userName}</span>
//             <button onClick={onLogout}>ออกจากระบบ</button>
//           </>
//         ) : (
//           <>
//             {location.pathname === '/login' ? (
//               <>
//                 <button onClick={() => navigate('/')}>หน้าแรก</button>
//                 <button onClick={() => navigate('/register')}>สมัครสมาชิก</button>
//               </>
//             ) : location.pathname === '/register' ? (
//               <>
//                 <button onClick={() => navigate('/')}>หน้าแรก</button>
//                 <button onClick={() => navigate('/login')}>เข้าสู่ระบบ</button>
//               </>
//             ) : (
//               <>
//                 <button onClick={() => navigate('/login')}>เข้าสู่ระบบ</button>
//                 <button onClick={() => navigate('/register')}>สมัครสมาชิก</button>
//               </>
//             )}
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default PublicNavbar;
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './navbar.css';

const PublicNavbar = ({ isLoggedIn, userName, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const GuestMenu = () => {
    const path = location.pathname;
    return (
      <>
        {(path === '/login' || path === '/register') ? (
          <>
            <button onClick={() => navigate('/')}>หน้าแรก</button>
            {path === '/login' ? (
              <button onClick={() => navigate('/register')}>สมัครสมาชิก</button>
            ) : (
              <button onClick={() => navigate('/login')}>เข้าสู่ระบบ</button>
            )}
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')}>เข้าสู่ระบบ</button>
            <button onClick={() => navigate('/register')}>สมัครสมาชิก</button>
          </>
        )}
      </>
    );
  };

  const UserMenu = () => (
    <>
      <button
        onClick={() => {
          navigate('/upload');
          setDropdownOpen(false);
        }}
        className="upload-button"
        style={{ marginRight: '10px' }}
      >
        อัปโหลดงานวิจัย
      </button>

      <div className="user-dropdown-container" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="user-button"
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
        >
          สวัสดี, {userName} ▼
        </button>

        {dropdownOpen && (
          <div className="user-dropdown-menu" role="menu">
            <Link to="/my-uploads" onClick={() => setDropdownOpen(false)}>
              งานวิจัยของฉัน
            </Link>
            <button
              onClick={() => {
                onLogout();
                setDropdownOpen(false);
              }}
            >
              ออกจากระบบ
            </button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <h1>CAIArchive</h1>
        </Link>
      </div>

      <div className="navbar-right">
        {isLoggedIn ? <UserMenu /> : <GuestMenu />}
      </div>
    </nav>
  );
};

export default PublicNavbar;
