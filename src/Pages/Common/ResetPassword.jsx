import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPassword } from "../../apiCalls/users";
import theme from "../../lib/theme";
import { LOGO, ROUTES } from "../../lib/constant";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/loaderSlice";
import { EyeIcon, EyeOffIcon, Lock, ArrowLeft } from "lucide-react";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loader.isLoading);

  // Extract token and id from URL parameters
  const resetToken = searchParams.get("token");
  const customerId = searchParams.get("id");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Check if required parameters are present
    if (!resetToken || !customerId) {
      toast.error("Invalid or missing reset link. Please request a new password reset.");
      navigate(ROUTES.FORGOT_PASSWORD);
    }
  }, [resetToken, customerId, navigate]);

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = 
      !formData.confirmPassword 
        ? "Please confirm your password"
        : formData.password !== formData.confirmPassword
        ? "Passwords do not match"
        : "";

    if (passwordError || confirmPasswordError) {
      setErrors({
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    try {
      dispatch(setLoading(true));
      const response = await resetPassword(customerId, resetToken, formData.password);
      
      if (response.success) {
        toast.success("Password reset successfully! Redirecting...");
        
        // If token is provided, save it and redirect to home
        if (response.token) {
          sessionStorage.setItem("token", response.token);
          if (response.shopifyAccessToken) {
            sessionStorage.setItem("shopifyAccessToken", response.shopifyAccessToken);
          }
          // Redirect to home after 1 second
          setTimeout(() => {
            navigate(ROUTES.HOME);
            window.location.reload(); // Refresh to update auth state
          }, 1000);
        } else {
          // Redirect to login after 2 seconds
          setTimeout(() => {
            navigate(ROUTES.LOGIN);
          }, 2000);
        }
      } else {
        toast.error(response.message || "Failed to reset password");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to reset password";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (!resetToken || !customerId) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-8xl min-h-screen overflow-hidden grid grid-cols-1 md:grid-cols-[60%_40%]">
        {/* LEFT – Illustration */}
        <div className="hidden md:block relative bg-indigo-50">
          <img
            src={LOGO.LOGIN}
            alt="Reset Password Illustration"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <img
            src={LOGO.LOGO_WHITE}
            alt="Logo"
            className="absolute top-4 right-10 w-22 h-22 object-cover"
          />
        </div>

        {/* RIGHT – Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <h2
            className="text-3xl font-bold mb-2"
            style={{ color: theme.colors.text.primary }}
          >
            Reset Your Password
          </h2>

          <p className="text-gray-500 mb-6">
            Enter your new password below
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleChange}
                  name="password"
                  required
                  className="w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                >
                  {showPassword ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeOffIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  name="confirmPassword"
                  required
                  className="w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeOffIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-semibold text-white transition disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ backgroundColor: theme.colors.accent.primary }}
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>

          <div className="mt-6">
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;

