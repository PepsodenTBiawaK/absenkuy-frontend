import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import GuruList from "../pages/admin/Guru/GuruList";
import KelasList from "../pages/admin/Kelas/KelasList";
import DashboardGuru from "../pages/guru/DashboardGuru";
import AbsensiSiswa from "../pages/guru/AbsensiSiswa";
import SiswaList from "../pages/admin/Siswa/SiswaList";
import DashboardSiswa from "../pages/siswa/DashboardSiswa";
import LaporanAdmin from "../pages/admin/LaporanAdmin";
import LaporanSiswa from "../pages/siswa/LaporanSiswa";


const AppRoutes = () => { 
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin/dashboard" element={<DashboardAdmin />} />
      <Route path="/guru/dashboard" element={<DashboardGuru />} />
      <Route path="/siswa/dashboard" element={<DashboardSiswa/>} />
      <Route path="/admin/guru" element={<GuruList />} />
      <Route path="/admin/kelas" element={<KelasList />} />
      <Route path="/admin/siswa" element={<SiswaList />} />
      <Route path="/guru/absensi" element={<AbsensiSiswa />} />
      <Route path="/admin/laporan" element={<LaporanAdmin />} />
      <Route path="/siswa/laporan" element={<LaporanSiswa/>}/>

    </Routes>
  );
};

export default AppRoutes;
