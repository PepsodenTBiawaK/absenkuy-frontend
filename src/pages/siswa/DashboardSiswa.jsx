import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const DashboardSiswa = () => {
  const [userName, setUserName] = useState('');
  const [absensi, setAbsensi] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    setUserName(localStorage.getItem('name'));
    fetchAbsensiSaya();
  }, []);

  const fetchAbsensiSaya = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/laporan/saya', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAbsensi(res.data.absensi);
    } catch (err) {
      console.error(err);
    }
  };

  const rekap = {
    hadir: absensi.filter(a => a.status === 'hadir').length,
    izin: absensi.filter(a => a.status === 'izin').length,
    sakit: absensi.filter(a => a.status === 'sakit').length,
    alpa: absensi.filter(a => a.status === 'alpa').length
  };

  const chartData = [
    { name: 'Hadir', jumlah: rekap.hadir },
    { name: 'Izin', jumlah: rekap.izin },
    { name: 'Sakit', jumlah: rekap.sakit },
    { name: 'Alpa', jumlah: rekap.alpa }
  ];

  return (
    <div className="flex">
      <Sidebar role="siswa" />
      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
        <Navbar title="Dashboard Siswa" />
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Halo, {userName} 👋</h2>
          <p className="text-gray-600 mb-10">Pantau kehadiranmu di kelas secara langsung.</p>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition mb-10 w-full md:w-3/3">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">📊 Rekap Absensi Saya</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="jumlah" fill="#3B82F6" name="Jumlah Kehadiran" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <a
              href="/siswa/laporan"
              className="inline-block bg-[#0250ba] hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow transition"
            >
              📑 Lihat Riwayat Absensi Lengkap
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSiswa;
