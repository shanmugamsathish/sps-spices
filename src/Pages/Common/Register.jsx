import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import theme from "../../lib/theme";
import { LOGO } from "../../lib/constant";
import { registerUser } from "../../apiCalls/users";
import toast from "react-hot-toast";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { validateField } from "../../lib/validation";
import LoopVideo from "./LoopVideo";
const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, _setLoading] = useState(false);
  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleChange = (e) => {
    const updatedFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedFormData);
    setError({
      ...error,
      [e.target.name]: validateField(e.target.name, e.target.value, updatedFormData)
  });
  };

  const validateRegisterFields = (firstName, lastName, email, password, confirmPassword) => {
    const errors = {};
    const formDataForValidation = { password };
    const firstNameError = validateField('firstName', firstName);
    const lastNameError = validateField('lastName', lastName);
    const emailError = validateField('email', email);
    const passwordError = validateField('password', password);
    const confirmPasswordError = validateField('confirmPassword', confirmPassword, formDataForValidation);
    if (firstNameError) errors.firstName = firstNameError;
    if (lastNameError) errors.lastName = lastNameError;
    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
    return errors;
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    const errors = validateRegisterFields(formData.firstName, formData.lastName, formData.email, formData.password, formData.confirmPassword);
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }
    try {
      const response = await registerUser(formData);
      if (response) {
        navigate("/login");
        toast.success(response.message);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  ">
      <div className="w-full max-w-8xl  overflow-hidden grid grid-cols-1 md:grid-cols-[60%_40%]">
        {/* LEFT – Illustration */}
        <div className="hidden md:block relative bg-indigo-50 overflow-hidden">
          <div className="absolute inset-0 scale-[1.40]">
            <LoopVideo />
          </div>

          <img
            src={LOGO.LOGO_WHITE}
            alt="Logo"
            className="absolute top-4 right-10 w-22 h-22 object-cover z-10"
          />
        </div>

        {/* RIGHT – Register Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <h2
            className="text-3xl font-bold mb-2"
            style={{ color: theme.colors.text.primary }}
          >
            Create Account 🚀
          </h2>

          <p className="text-gray-500 mb-6">Please fill in the details below</p>

          <form className="space-y-5" onSubmit={handleRegister}>
            {/* First & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Your First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  name="firstName"
                  required
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                {error.firstName && <p className="text-red-500 text-sm mt-1">{error.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Your Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  name="lastName"
                  required
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                {error.lastName && <p className="text-red-500 text-sm mt-1">{error.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
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

            {/* Password */}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  name="confirmPassword"
                  required
                  className="w-full px-4 py-3 pr-10 border rounded-xl
                 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeOffIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {error.confirmPassword && <p className="text-red-500 text-sm mt-1">{error.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition"
              style={{ backgroundColor: theme.colors.accent.primary }}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <span
              className="cursor-pointer font-semibold hover:underline"
              style={{ color: theme.colors.accent.primary }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
