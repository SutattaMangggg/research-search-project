import { useEffect, useState } from 'react';
import axios from 'axios';

const MyActivityPage = () => {
  const [uploads, setUploads] = useState([]);
  const [views, setViews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const uploadRes = await axios.get('/api/user/my-uploads', { headers });
      const viewsRes = await axios.get('/api/user/my-views', { headers });

      setUploads(uploadRes.data);
      setViews(viewsRes.data);
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">งานวิจัยที่เคยอัปโหลด</h2>
      <ul>
        {uploads.map(r => (
          <li key={r._id}>{r.title}</li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mt-6">งานวิจัยที่เคยเข้าชม</h2>
      <ul>
        {views.map(v => (
          <li key={v._id}>{v.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default MyActivityPage;
