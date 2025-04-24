import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const LaporanAdmin = () => {
  const [dataRekap, setDataRekap] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [filterKelas, setFilterKelas] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterNama, setFilterNama] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRekap();
    fetchKelas();
  }, []);

  const fetchRekap = async () => {
    try {
      const res = await axios.get('/api/laporan/rekap', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDataRekap(res.data.absensi || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchKelas = async () => {
    try {
      const res = await axios.get('/api/kelas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKelasList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDateTime = (iso) => {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth()+1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}-${mm}-${yy}, ${hh}.${min}`;
  };

  const filtered = dataRekap.filter(item => {
    const kelasId = filterKelas ? Number(filterKelas) : null;
    const nama  = item.siswa?.nama_siswa?.toLowerCase() || '';

    return (
      (!filterKelas || item.kelas?.id === kelasId) &&
      (!filterStatus || item.status === filterStatus) &&
      (!filterNama   || nama.includes(filterNama.toLowerCase()))
    );
  });

  return (
    <div className="flex">
      <Sidebar role="admin" />
      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
        <Navbar title="Laporan Absensi" />
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            🗂️ Laporan Absensi Semua Kelas
          </h2>

          {/* FILTER */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 ">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Filter Kelas</label>
              <select
                value={filterKelas}
                onChange={e => setFilterKelas(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-300"
              >
                <option value="">Semua Kelas</option>
                {kelasList.map(k => (
                  <option key={k.id} value={k.id}>{k.nama_kelas}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Filter Status</label>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-300"
              >
                <option value="">Semua Status</option>
                {['hadir','izin','sakit','alpa'].map(s => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cari Nama Siswa</label>
              <input
                type="text"
                value={filterNama}
                onChange={e => setFilterNama(e.target.value)}
                placeholder="Ketik nama..."
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-300"
              />
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full text-left">
              <thead className="bg-gray-200 text-gray-700 text-sm">
                <tr>
                  <th className="px-4 py-3 font-semibold">Waktu Dibuat</th>
                  <th className="px-4 py-3 font-semibold">Waktu Diupdate</th>
                  <th className="px-4 py-3 font-semibold">Kelas</th>
                  <th className="px-4 py-3 font-semibold">Nama Siswa</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      Tidak ada data absensi.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50 text-sm">
                      <td className="px-4 py-2">{formatDateTime(item.createdAt)}</td>
                      <td className="px-4 py-2">{formatDateTime(item.updatedAt)}</td>
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

const statusColor = (status) => {
  switch (status) {
    case 'hadir': return 'text-green-600';
    case 'izin':  return 'text-yellow-500';
    case 'sakit': return 'text-blue-500';
    case 'alpa':  return 'text-red-500';
    default:      return 'text-gray-700';
  }
};

export default LaporanAdmin;
