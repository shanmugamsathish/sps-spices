import React, { useEffect, useState, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { getUserProfile, getAdminProfile } from '../../apiCalls/users';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';

const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/',
  '/products',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/verify-email/:token',
  '/verify-email/:token',
];

// All routes starting with /admin require admin role
const isAdminRoute = (pathname) => pathname.startsWith('/admin');

function ProtectedRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  // Helper — decode JWT payload
  const decodeToken = (token) => {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const verifyAccess = async () => {
      const token = sessionStorage.getItem("token");
      const shopifyAccessToken = sessionStorage.getItem("shopifyAccessToken");
      const isAdmin = isAdminRoute(location.pathname);

      if (PUBLIC_ROUTES.includes(location.pathname)) {
        if (token || shopifyAccessToken) {
          navigate("/", { replace: true });
          return;
        }
        setLoading(false);
        return;
      }

      // Admin routes: require token and admin role only
      if (isAdmin) {
        if (!token) {
          toast.error("Unauthorized Access");
          navigate("/admin/login", { replace: true });
          setLoading(false);
          return;
        }
        const decoded = decodeToken(token);
        const userRole = decoded?.role;
        
        // Check if token is expired
        if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
          sessionStorage.removeItem("token");
          toast.error("Session expired");
          navigate("/admin/login", { replace: true });
          setLoading(false);
          return;
        }
        
        if (userRole !== "admin") {
          toast.error("Access Restricted — Admins Only");
          navigate("/", { replace: true });
          setLoading(false);
          return;
        }
        return;
      }

      // Non-admin (regular user) routes: require both tokens
      if (!token || !shopifyAccessToken) {
        toast.error("Unauthorized Access");
        navigate("/login");
        setLoading(false);
        return;
      }

      // 🔍 Final backend validation for regular users
      try {
        const response = await getUserProfile();
        if (!response?.success) {
          toast.error(response?.message || "Session expired");
          navigate("/login");
          setLoading(false);
          return;
        }
        dispatch(setUser(response));
      } catch (err) {
        toast.error(err.response?.data?.message || "Unauthorized");
        navigate("/login", { replace: true });
        setLoading(false);
        return;
      }

      setLoading(false);
    };

    verifyAccess();
  }, [location.pathname, navigate, dispatch]);

  const verifyAdminAccess = useCallback(async () => {
    try {
      const response = await getAdminProfile();
      if (!response?.success) {
        // Clear expired token
        if (response?.expired) {
          sessionStorage.removeItem("token");
        }
        toast.error(response?.message || "Session expired");
        navigate("/admin/login", { replace: true });
        return false;
      }
      // Token is valid, allow access
      return true;
    } catch (error) {
      // Handle unexpected errors
      console.error("Admin access verification error:", error);
      if (error.response?.status === 401) {
        sessionStorage.removeItem("token");
        toast.error("Session expired");
        navigate("/admin/login", { replace: true });
        return false;
      }
      // For other errors, still allow access but log the error
      return true;
    }
  }, [navigate]);

  useEffect(() => {
    if (isAdminRoute(location.pathname)) {
  // Set the current pathname in session storage
    sessionStorage.setItem("currentPath", location.pathname);
      verifyAdminAccess().then((isValid) => {
        if (isValid !== undefined) {
          setLoading(false);
        }
      });
    }
  }, [location.pathname, verifyAdminAccess]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return <Outlet />;
}

export default ProtectedRoutes;
