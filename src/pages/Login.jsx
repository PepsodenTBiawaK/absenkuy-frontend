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
      const res = await axios.post("/api/auth/login", { email, password });
      const token = res.data.token;
      const user = res.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);

      if (user.role === "admin") window.location.href = "/admin/dashboard";
      if (user.role === "guru") window.location.href = "/guru/dashboard";
      if (user.role === "siswa") window.location.href = "/siswa/dashboard";
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal login, silakan coba lagi.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-body flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
      <div className="flex flex-col lg:flex-row gap-8 bg-white bg-opacity-80 backdrop-filter backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative">
        {/* Decorative Shapes */}
        <div className="hidden lg:flex w-1/2 relative justify-center items-center bg-gray-100 overflow-hidden p-8">
          <svg className="absolute -top-10 -left-10 w-80 h-80 text-blue-200 opacity-40" viewBox="0 0 80 80" fill="currentColor">
            <circle cx="40" cy="40" r="40" />
          </svg>
          <svg className="absolute bottom-0 right-0 w-96 h-96 text-indigo-200 opacity-40" viewBox="0 0 96 96" fill="currentColor">
            <circle cx="48" cy="48" r="48" />
          </svg>
          <img
            src="/LoginIlus.svg"
            alt="Login Illustration"
            className="relative rounded-full h-80 w-80 object-cover"
          />
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-1/2 p-12 z-10">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src="/ABSENKUY.svg" alt="Logo" className="h-16 w-16" />
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-gray-800 mb-2">Login Absensi</h1>
            <p className="text-base text-gray-600">Silakan login untuk melanjutkan</p>
          </div>

          {errorMsg && (
            <div className="bg-red-100 text-red-700 px-6 py-3 rounded mb-6 text-base text-center border border-red-300">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Floating Label Email */}
            <div className="relative z-0 mb-8 w-full group">
              <input
                type="email"
                name="email"
                id="email"
                className="block py-3 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label
                htmlFor="email"
                className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Email
              </label>
            </div>

            {/* Floating Label Password */}
            <div className="relative z-0 mb-8 w-full group">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                id="password"
                className="block py-3 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer pr-10"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label
                htmlFor="password"
                className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Password
              </label>
              <div
                className="absolute right-0 top-3 text-gray-600 cursor-pointer"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex justify-center items-center bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              {loading ? (
                <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                "🔐 Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
