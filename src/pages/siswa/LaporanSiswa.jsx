import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const LaporanSiswa = () => {
  const [absensi, setAbsensi] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterTanggal, setFilterTanggal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchLaporanSaya();
  }, []);

  const fetchLaporanSaya = async () => {
    try {
      const res = await axios.get("/api/laporan/saya", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAbsensi(res.data.absensi);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDateTime = (iso) => {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(-2);
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${dd}-${mm}-${yy}, ${hh}.${min}`;
  };
  

  const statusBadge = (status) => {
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

  const filtered = absensi.filter(item => {
    const itemDate = new Date(item.tanggal);
    const afterStart = !startDate || new Date(startDate) <= itemDate;
    const beforeEnd = !endDate || new Date(endDate) >= itemDate;
  
    return (
      afterStart &&
      beforeEnd &&
      (!filterStatus || item.status === filterStatus)
    );
  });
  

  return (
    <div className="flex">
      <Sidebar role="siswa" />
      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
        <Navbar title="Laporan Absensi Saya" />
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📑 Laporan Absensi Saya</h2>

          {/* FILTER */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Filter Status</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-300">
                <option value="">Semua Status</option>
                {["hadir", "izin", "sakit", "alpa"].map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Dari Tanggal</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-300" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Sampai Tanggal</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-300" />
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full text-left">
              <thead className="bg-gray-200 text-gray-700 text-sm">
                <tr>
                  <th className="px-4 py-3 font-semibold">Waktu Dibuat</th>
                  <th className="px-4 py-3 font-semibold">Kelas</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-6 text-gray-500">
                      Tidak ada data absensi.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50 text-sm text-gray-800">
                      <td className="px-4 py-2">{formatDateTime(item.createdAt)}</td>
                      <td className="px-4 py-2">{item.kelas?.nama_kelas}</td>
                      <td className="px-4 py-2">
                        <span className={statusBadge(item.status)}>{item.status}</span>
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
