import { useState, useEffect } from 'react';
import axios from 'axios';

const FormKelas = ({ kelas, onClose }) => {
  const [namaKelas, setNamaKelas] = useState(kelas?.nama_kelas || '');
  const [guruId, setGuruId] = useState(kelas?.guru_id || '');
  const [guruList, setGuruList] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchGuru = async () => {
      try {
        const res = await axios.get('/api/guru', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGuruList(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGuru();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { nama_kelas: namaKelas, guru_id: guruId };

    try {
      if (kelas) {
        await axios.put(`/api/kelas/${kelas.id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`/api/kelas`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      onClose();
    }catch (err) {
      const message ='ERROR ' + err.response?.data?.message;
      alert(message);
      console.error('❌ ERROR:', err); 
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded shadow w-96 relative">
        <button
          className="absolute top-2 right-2 text-red-500 font-bold text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">{kelas ? 'Edit' : 'Tambah'} Kelas</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Nama Kelas</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={namaKelas}
              onChange={(e) => setNamaKelas(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Wali Kelas</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={guruId}
              onChange={(e) => setGuruId(e.target.value)}
              required
            >
              <option value="">-- Pilih Guru --</option>
              {guruList.map((guru) => (
                <option key={guru.id} value={guru.id}>
                  {guru.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            {kelas ? 'Update' : 'Tambah'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormKelas;
