import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const DashboardAdmin = () => {
  const [jumlahGuru, setJumlahGuru] = useState(0);
  const [jumlahKelas, setJumlahKelas] = useState(0);
  const [jumlahSiswa, setJumlahSiswa] = useState(0);
  const [chartData, setChartData] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
    fetchChartData();
  }, []);

  const fetchData = async () => {
    try {
      const guruRes = await axios.get('/api/guru', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJumlahGuru(guruRes.data.length);

      const kelasRes = await axios.get('/api/kelas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJumlahKelas(kelasRes.data.length);

      const siswaRes = await axios.get('/api/siswa', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJumlahSiswa(siswaRes.data.length);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChartData = async () => {
    try {
      const res = await axios.get('/api/laporan/rekap/kelas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChartData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex">
      <Sidebar role="admin" />
      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
        <Navbar title="Dashboard Admin" />

        <div className="p-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Selamat Datang, Admin 👋</h2>
          <p className="text-gray-600 mb-10">Kelola data guru, siswa, kelas, dan absensi secara efisien.</p>

          {/* Ringkasan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition duration-300">
              <h3 className="text-sm text-gray-500 mb-1">Jumlah Guru</h3>
              <p className="text-4xl font-bold text-blue-600">{jumlahGuru}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition duration-300">
              <h3 className="text-sm text-gray-500 mb-1">Jumlah Kelas</h3>
              <p className="text-4xl font-bold text-green-600">{jumlahKelas}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition duration-300">
              <h3 className="text-sm text-gray-500 mb-1">Jumlah Siswa</h3>
              <p className="text-4xl font-bold text-purple-600">{jumlahSiswa}</p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">📊 Rekap Absensi Per Kelas</h3>

            {chartData.length === 0 ? (
              <p className="text-gray-500">Belum ada data absensi yang tersedia.</p>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <XAxis dataKey="kelas" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="hadir" fill="#4ade80" name="Hadir" />
                  <Bar dataKey="izin" fill="#facc15" name="Izin" />
                  <Bar dataKey="sakit" fill="#60a5fa" name="Sakit" />
                  <Bar dataKey="alpa" fill="#f87171" name="Alpa" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
