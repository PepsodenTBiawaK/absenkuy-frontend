import { useState, useEffect } from 'react';
import axios from 'axios';

const FormSiswa = ({ siswa, onClose }) => {
  const [namaSiswa, setNamaSiswa] = useState(siswa?.nama_siswa || '');
  const [nisn, setNisn] = useState(siswa?.nisn || '');
  const [kelasId, setKelasId] = useState(siswa?.kelas_id || '');
  const [email, setEmail] = useState(siswa?.user?.email || '');
  const [password, setPassword] = useState('');
  const [kelasList, setKelasList] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
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

    fetchKelas();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      nama_siswa: namaSiswa,
      nisn,
      kelas_id: kelasId,
      email
    };

    if (!siswa) {
      data.password = password;
    }

    try {
      if (siswa) {
        await axios.put(`/api/siswa/${siswa.id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`/api/siswa`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      onClose();
    } catch (err) {
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
        <h2 className="text-xl font-bold mb-4">{siswa ? 'Edit' : 'Tambah'} Siswa</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Nama Siswa</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={namaSiswa}
              onChange={(e) => setNamaSiswa(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">NISN</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={nisn}
              onChange={(e) => setNisn(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Kelas</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={kelasId}
              onChange={(e) => setKelasId(e.target.value)}
              required
            >
              <option value="">-- Pilih Kelas --</option>
              {kelasList.map((kelas) => (
                <option key={kelas.id} value={kelas.id}>
                  {kelas.nama_kelas}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {!siswa && (
            <div>
              <label className="block mb-1">Password</label>
              <input
                type="password"
                className="w-full border px-3 py-2 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            {siswa ? 'Update' : 'Tambah'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormSiswa;
