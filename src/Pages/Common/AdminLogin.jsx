import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import theme from "../../lib/theme";
import { LOGO } from "../../lib/constant";
import { loginAdmin } from "../../apiCalls/users";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/loaderSlice";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { validateField } from "../../lib/validation";
import LoopVideo from "./LoopVideo";
const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "josesamimmanuel@gmail.com",
    password: "jose@123",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
  });

  // Get the current pathname from session storage
  const currentPath = sessionStorage.getItem("currentPath");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError({
      ...error,
      [e.target.name]: validateField(e.target.name, e.target.value)
  });
  };

        // Validation functions
        const validateLoginFields = (email, password) => {
          const errors = {};
          const emailError = validateField('email', email);
          const passwordError = validateField('password', password);
          
          if (emailError) errors.email = emailError;
          if (passwordError) errors.password = passwordError;
          
          return errors;
      };
  const handleLogin = async (e) => {
    e.preventDefault();
    const errors = validateLoginFields(formData.email, formData.password);
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }
    try {
      dispatch(setLoading(true));
      const response = await loginAdmin(formData);
      if (response) {
        navigate(currentPath || "/admin/products");
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
          <LoopVideo />
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

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="yourname@gmail.com"
                value={formData.email}
                onChange={handleChange}
                name="email"
                required
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your Password"
                  value={formData.password}
                  onChange={handleChange}
                  name="password"
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
              {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
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
              Login as a User 
              {/* <span className="text-gray-500 mx-2"> | </span> */}
            </span> 

          </p>

          {/* <p className="mt-6 text-sm text-center text-gray-600">
            <span
              className="cursor-pointer font-semibold hover:underline"
              style={{ color: theme.colors.accent.primary }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </span>
          </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
