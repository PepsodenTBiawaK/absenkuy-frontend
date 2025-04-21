import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const getTodayDateLocal = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset() * 60000;
  return new Date(today - offset).toISOString().split("T")[0];
};

const AbsensiSiswa = () => {
  const [kelasList, setKelasList] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [tanggal] = useState(getTodayDateLocal());
  const [siswaList, setSiswaList] = useState([]);
  const [absensiData, setAbsensiData] = useState([]);
  const [riwayatAbsensi, setRiwayatAbsensi] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchKelasGuru();
  }, []);

  const fetchKelasGuru = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/kelas/guru", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKelasList(res.data);
    } catch (err) {
      console.error("Gagal fetch kelas:", err);
    }
  };

  const fetchSiswaByKelas = async (kelasId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/siswa/kelas?kelas_id=${kelasId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSiswaList(res.data);
      const initialAbsensi = res.data.map((siswa) => ({
        siswa_id: siswa.id,
        status: "alpa",
      }));
      setAbsensiData(initialAbsensi);
    } catch (err) {
      console.error("Gagal fetch siswa:", err);
    }
  };

  const fetchRiwayatByKelas = async (kelasId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/laporan/guru/kelas/${kelasId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRiwayatAbsensi(res.data.absensi || []);
    } catch (err) {
      console.error("Gagal mengambil riwayat:", err);
    }
  };

  const handleKelasChange = async (e) => {
    const kelasId = e.target.value;
    setSelectedKelas(kelasId);
    if (kelasId) {
      await fetchSiswaByKelas(kelasId);
      await fetchRiwayatByKelas(kelasId);
    } else {
      setSiswaList([]);
      setAbsensiData([]);
      setRiwayatAbsensi([]);
    }
  };

  const handleStatusChange = (index, status) => {
    const updated = [...absensiData];
    updated[index].status = status;
    setAbsensiData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedKelas || absensiData.length === 0) {
      alert("Pilih kelas dan pastikan ada siswa!");
      return;
    }

    try {
      const payload = {
        kelas_id: selectedKelas,
        tanggal,
        absensi: absensiData,
      };

      await axios.post("http://localhost:5000/api/absensi", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Absensi berhasil disimpan!");
      await fetchRiwayatByKelas(selectedKelas);
      setSiswaList([]);
      setAbsensiData([]);
    } catch (err) {
      console.error("Gagal submit absensi:", err);
      alert("❌ Gagal submit absensi!");
    }
  };

  return (
    <div className="flex">
      <Sidebar role="guru" />
      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
        <Navbar title="Absensi Siswa" />
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Form Absensi Siswa</h2>
          <p className="text-gray-600 mb-8">Isi data kehadiran siswa berdasarkan kelas yang Anda ampu hari ini.</p>

          <div className="mb-6 bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold text-gray-700 mb-2">📅 Tanggal Absensi:</h3>
            <p className="text-xl font-medium text-gray-800">
              {new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(tanggal))}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow">
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">Pilih Kelas</label>
              <select value={selectedKelas} onChange={handleKelasChange} className="w-full p-3 border rounded focus:outline-blue-400" required>
                <option value="">-- Pilih Kelas --</option>
                {kelasList.map((kelas) => (
                  <option key={kelas.id} value={kelas.id}>{kelas.nama_kelas}</option>
                ))}
              </select>
            </div>

            {siswaList.length > 0 && (
              <div className="overflow-x-auto mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">📋 Daftar Siswa</h3>
                <table className="min-w-full bg-white border rounded-lg text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 border">No</th>
                      <th className="p-3 border">Nama Siswa</th>
                      <th className="p-3 border">Status Kehadiran</th>
                    </tr>
                  </thead>
                  <tbody>
                    {siswaList.map((siswa, index) => (
                      <tr key={siswa.id}>
                        <td className="border p-3 text-center">{index + 1}</td>
                        <td className="border p-3">{siswa.nama_siswa}</td>
                        <td className="border p-3">
                          <div className="flex gap-2 flex-wrap">
                            {["hadir", "izin", "sakit", "alpa"].map((status) => {
                              const isActive = absensiData[index]?.status === status;
                              const style = {
                                hadir: isActive ? "bg-green-500 text-white border-green-500" : "bg-white text-gray-700 border-gray-300 hover:bg-green-100",
                                izin: isActive ? "bg-yellow-400 text-white border-yellow-400" : "bg-white text-gray-700 border-gray-300 hover:bg-yellow-100",
                                sakit: isActive ? "bg-blue-400 text-white border-blue-400" : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100",
                                alpa: isActive ? "bg-red-500 text-white border-red-500" : "bg-white text-gray-700 border-gray-300 hover:bg-red-100",
                              }[status];

                              return (
                                <button key={status} type="button" onClick={() => handleStatusChange(index, status)} className={`px-3 py-1 rounded text-sm capitalize font-medium border transition ${style}`}>
                                  {status}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedKelas && siswaList.length > 0 && (
              <button type="submit" className="bg-[#0250ba] hover:bg-blue-700 text-white px-6 py-3 rounded-md shadow text-sm font-semibold transition">
                ✅ Simpan Absensi
              </button>
            )}
          </form>

          {riwayatAbsensi.length > 0 && (
            <div className="mt-10 bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-bold mb-4 text-gray-800">📋 Riwayat Absensi Kelas Ini</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2">Tanggal</th>
                      <th className="border px-4 py-2">Nama Siswa</th>
                      <th className="border px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riwayatAbsensi.map((item, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="px-4 py-2">{new Intl.DateTimeFormat("id-ID", {
                          day: "numeric", month: "long", year: "numeric"
                        }).format(new Date(item.tanggal))}</td>
                        <td className="px-4 py-2">{item.siswa?.nama_siswa}</td>
                        <td className="px-4 py-2 capitalize">{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AbsensiSiswa;
