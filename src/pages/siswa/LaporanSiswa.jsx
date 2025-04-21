import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

const LaporanSiswa = () => {
  const [absensi, setAbsensi] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchLaporanSaya();
  }, []);

  const fetchLaporanSaya = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/laporan/saya', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAbsensi(res.data.absensi);
    } catch (err) {
      console.error(err);
    }
  };

  const formatTanggal = (tanggal) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date(tanggal));
  };

  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded text-xs font-medium capitalize";
    switch (status) {
      case "hadir":
        return `${base} bg-green-100 text-green-700`;
      case "izin":
        return `${base} bg-yellow-100 text-yellow-700`;
      case "sakit":
        return `${base} bg-blue-100 text-blue-700`;
      case "alpa":
        return `${base} bg-red-100 text-red-700`;
      default:
        return base;
    }
  };

  return (
    <div className="flex">
      <Sidebar role="siswa" />
      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
        <Navbar title="Laporan Absensi Saya" />
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">📑 Riwayat Absensi</h2>

          <div className="overflow-x-auto bg-white p-6 rounded-xl shadow">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-2">Tanggal</th>
                  <th className="text-left px-4 py-2">Kelas</th>
                  <th className="text-left px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {absensi.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                      Tidak ada data absensi.
                    </td>
                  </tr>
                ) : (
                  absensi.map((item, index) => (
                    <tr key={index} className="border-b text-gray-700">
                      <td className="px-4 py-2">{formatTanggal(item.tanggal)}</td>
                      <td className="px-4 py-2">{item.kelas?.nama_kelas}</td>
                      <td className="px-4 py-2">
                        <span className={getStatusBadge(item.status)}>{item.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaporanSiswa;
