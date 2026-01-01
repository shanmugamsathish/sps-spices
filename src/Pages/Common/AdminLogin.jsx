import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import theme from "../../lib/theme";
import { LOGO } from "../../lib/constant";
import { loginAdmin } from "../../apiCalls/users";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/loaderSlice";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("josesamimmanuel@gmail.com");
  const [password, setPassword] = useState("jose@123");
  const [error, _setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const response = await loginAdmin({ email, password });
      if (response) {
        navigate("/admin/products");
        toast.success(response.message);
        sessionStorage.setItem("token", response.token);
      } else {
        toast.error(response.message || "Invalid email or password");
      }
    } catch (error) {
      toast.error(error.response.data.message || "Invalid email or password");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    // Make left occupy 60% of the screen
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-8xl min-h-screen overflow-hidden grid grid-cols-1 md:grid-cols-[60%_40%]">
        {/* LEFT – Illustration */}
        <div className="hidden md:block relative bg-indigo-50">
          <img
            src={LOGO.LOGIN}
            alt="Login Illustration"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <img
            src={LOGO.LOGO_WHITE}
            alt="Logo"
            className="absolute top-4 right-10 w-22 h-22 object-cover"
          />
        </div>

        {/* RIGHT – Login Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <h2
            className="text-3xl font-bold mb-2"
            style={{ color: theme.colors.text.primary }}
          >
            Welcome to Admin Login 👋
          </h2>

          <p className="text-gray-500 mb-6">Please login to your admin account</p>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="yourname@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-white transition"
              style={{ backgroundColor: theme.colors.accent.primary }}
            >
              Login
            </button>
          </form>

          <div className="flex justify-center items-center">
          <p className="mt-6 text-sm text-center text-gray-600">
            <span
              className="cursor-pointer font-semibold hover:underline"
              style={{ color: theme.colors.accent.primary }}
              onClick={() => navigate("/login")}
            >
              Login as a User <span className="text-gray-500 mx-2"> | </span>
            </span> 

          </p>

          <p className="mt-6 text-sm text-center text-gray-600">
            <span
              className="cursor-pointer font-semibold hover:underline"
              style={{ color: theme.colors.accent.primary }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </span>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
