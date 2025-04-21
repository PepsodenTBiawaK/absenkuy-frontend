import { useState } from 'react';
import axios from 'axios';

const FormGuru = ({ guru, onClose }) => {
  const [name, setName] = useState(guru?.name || '');
  const [email, setEmail] = useState(guru?.email || '');
  const [password, setPassword] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { name, email };
    if (!guru) {
      data.password = password;
    }

    try {
      if (guru) {
        await axios.put(`/api/guru/${guru.id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`/api/guru`, data, {
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
        <h2 className="text-xl font-bold mb-4">{guru ? 'Edit' : 'Tambah'} Guru</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Nama</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
          {!guru && (
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
            {guru ? 'Update' : 'Tambah'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormGuru;
