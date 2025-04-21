import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { HomeIcon, UserGroupIcon, ClipboardDocumentListIcon, AcademicCapIcon, ChartBarIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/");
  };

  return (
    <div className="bg-gray-900 text-white w-64 h-screen fixed flex flex-col justify-between shadow-lg">
      <div>
        <div className="flex items-center gap-2 p-6 text-2xl font-bold tracking-wide border-b border-gray-700" style={{ color: "#0250ba" }}>
          <img src="/ABSENKUY.svg" alt="Logo AbsenKuy" className="h-8 w-8" />
          <span>AbsenKuy</span>
        </div>

        <ul className="px-4 py-6 space-y-2 text-sm font-medium">
          <li>
            <Link to={`/${role}/dashboard`} className="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-700 transition">
              <HomeIcon className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          </li>

          {role === "admin" && (
            <>
              <li>
                <Link to="/admin/guru" className="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-700 transition">
                  <UserGroupIcon className="h-5 w-5" />
                  <span>Kelola Guru</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/kelas" className="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-700 transition">
                  <ClipboardDocumentListIcon className="h-5 w-5" />
                  <span>Kelola Kelas</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/siswa" className="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-700 transition">
                  <AcademicCapIcon className="h-5 w-5" />
                  <span>Kelola Siswa</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/laporan" className="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-700 transition">
                  <ChartBarIcon className="h-5 w-5" />
                  <span>Laporan</span>
                </Link>
              </li>
            </>
          )}

          {role === "guru" && (
            <li>
              <Link to="/guru/absensi" className="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-700 transition">
                <AcademicCapIcon className="h-5 w-5" />
                <span>Absensi Siswa</span>
              </Link>
            </li>
          )}

          {role === "siswa" && (
            <li>
              <Link to="/siswa/laporan" className="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-700 transition">
                <ChartBarIcon className="h-5 w-5" />
                <span>Laporan Absensi</span>
              </Link>
            </li>
          )}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-700">
        <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded transition flex items-center justify-center gap-2">
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
