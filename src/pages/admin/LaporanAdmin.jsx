import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const LaporanAdmin = () => {
  const [dataRekap, setDataRekap] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRekap();
  }, []);

  const fetchRekap = async () => {
    try {
      const res = await axios.get('/api/laporan/rekap', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDataRekap(res.data.absensi); // hasil dari backend
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex">
      <Sidebar role="admin" />
      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
        <Navbar title="Laporan Absensi" />
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            🗂️ Laporan Absensi Semua Kelas
          </h2>

          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full text-left">
              <thead className="bg-gray-200 text-gray-700 text-sm">
                <tr>
                  <th className="px-4 py-3 font-semibold">Tanggal</th>
                  <th className="px-4 py-3 font-semibold">Kelas</th>
                  <th className="px-4 py-3 font-semibold">Nama Siswa</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {dataRekap.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">
                      Tidak ada data absensi.
                    </td>
                  </tr>
                ) : (
                  dataRekap.map((item, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50 text-sm">
                      <td className="px-4 py-2">{item.tanggal}</td>
                      <td className="px-4 py-2">{item.kelas?.nama_kelas}</td>
                      <td className="px-4 py-2">{item.siswa?.nama_siswa}</td>
                      <td className={`px-4 py-2 capitalize font-medium ${statusColor(item.status)}`}>
                        {item.status}
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

// Tambahkan warna teks untuk status absensi
const statusColor = (status) => {
  switch (status) {
    case 'hadir':
      return 'text-green-600';
    case 'izin':
      return 'text-yellow-500';
    case 'sakit':
      return 'text-blue-500';
    case 'alpa':
      return 'text-red-500';
    default:
      return 'text-gray-700';
  }
};

export default LaporanAdmin;
