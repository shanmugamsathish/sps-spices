import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import theme from "../../lib/theme";
import { LOGO } from "../../lib/constant";
import { loginUser } from "../../apiCalls/users";
import toast from "react-hot-toast";
import { setLoading } from "../../redux/loaderSlice";
import { useDispatch, useSelector } from "react-redux";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("testcustomers@example.com");
  const [password, setPassword] = useState("password123");
  const [error, _setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loader.loading);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const response = await loginUser({ email, password });
      if (response) {
        navigate("/");
        toast.success(response.message);
        sessionStorage.setItem("token", response.token);
        if (response.shopifyAccessToken) {
          sessionStorage.setItem("shopifyAccessToken", response.shopifyAccessToken);
        }
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
            Welcome Back 👋
          </h2>

          <p className="text-gray-500 mb-6">Please login to your account</p>

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

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-10 border rounded-xl
                 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3
                 flex items-center cursor-pointer"
                >
                  {showPassword ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeOffIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition"
              style={{ backgroundColor: theme.colors.accent.primary }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <span
              className="cursor-pointer font-semibold hover:underline"
              style={{ color: theme.colors.accent.primary }}
              onClick={() => navigate("/register")}
            >
              Sign up
            </span>
          </p>
          <div className="flex justify-center items-center">
          <p className="mt-6 text-sm text-center text-gray-600">
            <span
              className="cursor-pointer font-semibold hover:underline"
              style={{ color: theme.colors.accent.primary }}
              onClick={() => navigate("/admin/login")}
            >
              Login as Admin <span className="text-gray-500 mx-2"> | </span>
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

export default Login;
