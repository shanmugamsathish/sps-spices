import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPassword } from "../../apiCalls/users";
import theme from "../../lib/theme";
import { LOGO, ROUTES } from "../../lib/constant";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/loaderSlice";
import { Mail, ArrowLeft, CheckCircle2, Shield } from "lucide-react";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSentEmail, setLastSentEmail] = useState("");
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loader.isLoading);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.trim()) {
      toast.error("Email is required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      dispatch(setLoading(true));
      const res = await forgotPassword(email.trim());
      
      if (res.success) {
        setIsSuccess(true);
        setLastSentEmail(email.trim());
        toast.success("Password reset email sent successfully!");
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleResend = async () => {
    if (!lastSentEmail) return;
    
    try {
      dispatch(setLoading(true));
      const res = await forgotPassword(lastSentEmail);
      
      if (res.success) {
        toast.success("Password reset email sent again!");
      } else {
        toast.error(res.message || "Failed to resend email");
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Failed to resend email. Please try again.";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleBackToLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-8xl min-h-screen overflow-hidden grid grid-cols-1 md:grid-cols-[60%_40%]">
        {/* LEFT – Illustration */}
        <div className="hidden md:block relative bg-indigo-50">
          <img
            src={LOGO.LOGIN}
            alt="Forgot Password Illustration"
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
          {!isSuccess ? (
            <>
              <h2
                className="text-3xl font-bold mb-2"
                style={{ color: theme.colors.text.primary }}
              >
                Forgot Password?
              </h2>

              <p className="text-gray-500 mb-6">
                Enter your email address and we'll send you a secure password reset link.
              </p>

              {/* Security Notice */}
              <div className="mb-6 p-4 rounded-lg border flex items-start gap-3"
                style={{ 
                  backgroundColor: theme.colors.background.main,
                  borderColor: theme.colors.border.light 
                }}
              >
                <Shield className="w-5 h-5 mt-0.5 shrink-0" style={{ color: theme.colors.accent.primary }} />
                <p className="text-sm text-gray-600">
                  <strong>Secure Reset:</strong> Your password reset will be handled securely by Shopify. 
                  You'll be redirected to Shopify's authentication page to complete the process.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl font-semibold text-white transition disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ backgroundColor: theme.colors.accent.primary }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Mail className="w-5 h-5" />
                      Send Reset Link
                    </span>
                  )}
                </button>
              </form>

              <div className="mt-6">
                <button
                  onClick={handleBackToLogin}
                  disabled={isLoading}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:underline disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${theme.colors.accent.primary}20` }}
                  >
                    <CheckCircle2 className="w-10 h-10" style={{ color: theme.colors.accent.primary }} />
                  </div>
                </div>

                <h2
                  className="text-3xl font-bold mb-2"
                  style={{ color: theme.colors.text.primary }}
                >
                  Check Your Email
                </h2>

                <p className="text-gray-500 mb-6">
                  We've sent a password reset link to <strong>{lastSentEmail}</strong>
                </p>

                {/* Instructions */}
                <div className="mb-6 p-4 rounded-lg border text-left"
                  style={{ 
                    backgroundColor: theme.colors.background.main,
                    borderColor: theme.colors.border.light 
                  }}
                >
                  <p className="text-sm text-gray-700 mb-3 font-semibold">What's next?</p>
                  <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                    <li>Check your inbox (and spam folder) for a password reset email</li>
                    <li>Click the "Reset Password" button in the email</li>
                    <li>You'll be redirected to our secure password reset page</li>
                    <li>Enter your new password and confirm it</li>
                    <li>Click "Reset Password" to complete the process</li>
                    <li>You'll be automatically logged in after successful reset</li>
                  </ol>
                  
                  <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200">
                    <p className="text-xs text-green-800">
                      <strong>Secure:</strong> The reset link will expire in 1 hour for your security. 
                      If you didn't request this, you can safely ignore the email.
                    </p>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="mb-6 p-4 rounded-lg border flex items-start gap-3"
                  style={{ 
                    backgroundColor: theme.colors.background.main,
                    borderColor: theme.colors.border.light 
                  }}
                >
                  <Shield className="w-5 h-5 mt-0.5 shrink-0" style={{ color: theme.colors.accent.primary }} />
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">
                      <strong>Secure Process:</strong> Your password reset is handled securely by Shopify. 
                      We never see or store your password.
                    </p>
                    <p className="text-xs text-gray-500 italic">
                      <strong>Important:</strong> If you see an OTP (One-Time Password) page instead of password reset, 
                      complete the OTP login first. Then you can change your password in your account settings. 
                      After that, return here and login with your new password.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleResend}
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl font-semibold border transition disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      borderColor: theme.colors.accent.primary,
                      color: theme.colors.accent.primary,
                      backgroundColor: 'transparent'
                    }}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Mail className="w-5 h-5" />
                        Resend Email
                      </span>
                    )}
                  </button>

                  <button
                    onClick={handleBackToLogin}
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl font-semibold text-white transition disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{ backgroundColor: theme.colors.accent.primary }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <ArrowLeft className="w-5 h-5" />
                      Back to Login
                    </span>
                  </button>
                </div>

                <p className="mt-6 text-sm text-center text-gray-600">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    onClick={handleResend}
                    disabled={isLoading}
                    className="font-semibold hover:underline disabled:opacity-50"
                    style={{ color: theme.colors.accent.primary }}
                  >
                    resend
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
