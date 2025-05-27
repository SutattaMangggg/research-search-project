import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ResearchListPage from './pages/ResearchListPage';
import ResearchDetailPage from './pages/ResearchDetailPage';
import UploadPage from './pages/UploadPage';
import MyUploadsPage from './pages/MyUploadsPage'; // ✅ เพิ่มบรรทัดนี้
import RequireAuth from './components/RequireAuth';
import MainLayout from './layouts/MainLayout';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* หน้าสาธารณะ ไม่ใช้ Layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Layout กลาง มี Navbar อยู่แล้ว */}
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />
        <Route
          path="/research"
          element={
            <MainLayout>
              <ResearchListPage />
            </MainLayout>
          }
        />
        <Route
          path="/research/:id"
          element={
            <RequireAuth>
              <MainLayout>
                <ResearchDetailPage />
              </MainLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/upload"
          element={
            <RequireAuth>
              <MainLayout>
                <UploadPage />
              </MainLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/my-uploads" // ✅ เส้นทางที่ขาดไป
          element={
            <RequireAuth>
              <MainLayout>
                <MyUploadsPage />
              </MainLayout>
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
