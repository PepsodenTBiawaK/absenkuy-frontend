import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      const user = res.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);

      if (user.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else if (user.role === "guru") {
        window.location.href = "/guru/dashboard";
      } else if (user.role === "siswa") {
        window.location.href = "/siswa/dashboard";
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal login, silakan coba lagi.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-96 border-t-4"
        style={{ borderTopColor: "#0250ba" }}
      >
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <img src="/ABSENKUY.svg" alt="Logo" className="h-14 w-14" />
          </div>

          <h1 className="text-2xl font-extrabold text-gray-800">Login Absensi</h1>
          <p className="text-sm text-gray-500 mt-1">Silakan login untuk melanjutkan</p>
        </div>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center border border-red-300">
            {errorMsg}
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: "#0250ba", outlineColor: "#0250ba", boxShadow: "0 0 0 2px #0250ba33" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6 relative">
          <label className="block mb-2 font-semibold text-gray-700">Password</label>
          <input
            type={showPass ? "text" : "password"}
            className="w-full px-4 py-2 border rounded-lg pr-10 focus:outline-none focus:ring-2"
            style={{ borderColor: "#0250ba", outlineColor: "#0250ba", boxShadow: "0 0 0 2px #0250ba33" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div
            className="absolute right-3 top-11 text-gray-600 cursor-pointer"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex justify-center items-center"
          style={{
            backgroundColor: "#0250ba",
            opacity: loading ? 0.8 : 1,
          }}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            "🔐 Login"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
