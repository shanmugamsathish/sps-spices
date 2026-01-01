import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import theme from "../lib/theme";
import { loginUser } from "../apiCalls/users";
import toast from "react-hot-toast";
import { setLoading } from "../redux/loaderSlice";
import { useDispatch, useSelector } from "react-redux";

const EditLoginModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loader.loading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, _setError] = useState("");

  if (!open) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));

      const response = await loginUser({ email, password });

      if (response) {
        toast.success(response.message);
        sessionStorage.setItem("token", response.token);

        if (response.shopifyAccessToken) {
          sessionStorage.setItem(
            "shopifyAccessToken",
            response.shopifyAccessToken
          );
        }

        onClose();
        navigate("/");
      } else {
        toast.error(response?.message || "Invalid email or password");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Invalid email or password"
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <p className="text-lg font-bold mb-6">
          Please login to add items to cart
        </p>

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
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
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

        {/* Footer Links */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <span
            className="cursor-pointer font-semibold hover:underline"
            style={{ color: theme.colors.accent.primary }}
            onClick={() => {
              onClose();
              navigate("/register", window.scrollTo(0, 0));
            }}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default EditLoginModal;
