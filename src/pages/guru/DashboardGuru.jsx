import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const DashboardGuru = () => {
  const [kelasSaya, setKelasSaya] = useState([]);
  const [rekapGabungan, setRekapGabungan] = useState([]);
  const [userName, setUserName] = useState('');
  const token = localStorage.getItem('token');

  const COLORS = {
    hadir: '#34D399',
    izin: '#FBBF24',
    sakit: '#60A5FA',
    alpa: '#F87171'
  };

  useEffect(() => {
    setUserName(localStorage.getItem('name'));
    fetchKelas();
    fetchRekap();
  }, []);

  const fetchKelas = async () => {
    try {
      const res = await axios.get('/api/kelas/guru', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKelasSaya(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRekap = async () => {
    try {
      const res = await axios.get('/api/laporan/rekap/guru', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = res.data.map(kelas => ({
        kelas: kelas.kelas,
        hadir: kelas.hadir,
        izin: kelas.izin,
        sakit: kelas.sakit,
        alpa: kelas.alpa
      }));

      setRekapGabungan(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex">
      <Sidebar role="guru" />
      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
        <Navbar title="Dashboard Guru" />

        <div className="p-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Selamat Datang, {userName} 👋</h2>
          <p className="text-gray-600 mb-10">Pantau rekap absensi dan daftar kelas yang Anda ampu.</p>

          {/* Chart */}
          <div className="bg-white shadow rounded-xl p-6 mb-12">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">📊 Rekap Absensi Per Kelas</h3>

            {rekapGabungan.length === 0 ? (
              <p className="text-gray-500">Belum ada data absensi.</p>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={rekapGabungan}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="kelas" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="hadir" fill={COLORS.hadir} name="Hadir" />
                  <Bar dataKey="izin" fill={COLORS.izin} name="Izin" />
                  <Bar dataKey="sakit" fill={COLORS.sakit} name="Sakit" />
                  <Bar dataKey="alpa" fill={COLORS.alpa} name="Alpa" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* List Kelas */}
          <h3 className="text-lg font-semibold mb-4 text-gray-700">📚 Kelas yang Anda Ampu</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kelasSaya.length === 0 ? (
              <p className="text-gray-500">Belum ada kelas yang Anda ampu.</p>
            ) : (
              kelasSaya.map((kelas) => (
                <div key={kelas.id} className="bg-white shadow rounded-xl p-5 border border-gray-100 hover:shadow-md transition">
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">{kelas.nama_kelas}</h4>
                  <p className="text-sm text-gray-600">ID Kelas: {kelas.id}</p>
                  <a
                    href="/guru/absensi"
                    className="inline-block mt-3 bg-[#0250ba] hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition"
                  >
                    📋 Mulai Absensi
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGuru;
