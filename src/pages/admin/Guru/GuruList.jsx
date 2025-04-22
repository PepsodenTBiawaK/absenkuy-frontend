import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import FormGuru from "./FormGuru";

const ResetPasswordModal = ({ guru, onClose, onReset }) => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleReset = () => {
    if (!password || !confirm) {
      setError("Semua field harus diisi.");
      return;
    }
    if (password !== confirm) {
      setError("Password tidak cocok.");
      return;
    }
    onReset(guru.id, password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">🔐 Reset Password Guru</h2>
        <p className="mb-2 text-gray-600">Untuk: <strong>{guru.name}</strong></p>
        <input
          type="password"
          placeholder="Password baru"
          className="w-full p-2 border rounded mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Konfirmasi password"
          className="w-full p-2 border rounded mb-3"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Batal</button>
          <button onClick={handleReset} className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white">Reset</button>
        </div>
      </div>
    </div>
  );
};

const GuruList = () => {
  const [guru, setGuru] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuru, setSelectedGuru] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [resetModal, setResetModal] = useState(null);

  const token = localStorage.getItem("token");

  const fetchGuru = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/guru", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGuru(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuru();
  }, []);

  const handleResetPassword = async (id, newPassword) => {
    try {
      await axios.post(
        `/api/guru/reset-password/${id}`,
        { newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Password berhasil direset!");
      setResetModal(null);
    } catch (err) {
      alert("Gagal reset password");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin mau hapus guru ini?")) return;
    try {
      await axios.delete(`/api/guru/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGuru();
    } catch (err) {
      const message = "ERROR " + err.response?.data?.message;
      alert(message);
      console.error("❌ ERROR:", err);
    }
  };

  const handleEdit = (guru) => {
    setSelectedGuru(guru);
    setShowForm(true);
  };

  return (
    <div className="flex">
      <Sidebar role="admin" />
      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
        <Navbar title="Kelola Guru" />
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">👨‍🏫 Daftar Guru</h2>
            <button
              onClick={() => {
                setSelectedGuru(null);
                setShowForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            >
              + Tambah Guru
            </button>
          </div>

          {loading ? (
            <p className="text-gray-600">Loading data guru...</p>
          ) : guru.length === 0 ? (
            <p className="text-gray-500">Belum ada data guru.</p>
          ) : (
            <div className="overflow-x-auto bg-white shadow rounded">
              <table className="w-full text-left">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="p-3 font-semibold">No</th>
                    <th className="p-3 font-semibold">Nama</th>
                    <th className="p-3 font-semibold">Email</th>
                    <th className="p-3 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {guru.map((item, index) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{item.name}</td>
                      <td className="p-3">{item.email}</td>
                      <td className="p-3 space-x-2">
                        <button onClick={() => handleEdit(item)} className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-white text-sm">
                          ✏️ Edit
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white text-sm">
                          🗑️ Hapus
                        </button>
                        <button onClick={() => setResetModal(item)} className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-sm">
                          🔑 Reset Password
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {showForm && (
            <FormGuru
              guru={selectedGuru}
              onClose={() => {
                setShowForm(false);
                fetchGuru();
              }}
            />
          )}

          {resetModal && (
            <ResetPasswordModal
              guru={resetModal}
              onClose={() => setResetModal(null)}
              onReset={handleResetPassword}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GuruList;
