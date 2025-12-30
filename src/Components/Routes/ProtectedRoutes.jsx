import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { getUserProfile, getAdminProfile } from '../../apiCalls/users';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';

const PUBLIC_ROUTES = [
  '/login',
  '/register',
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
      console.log("token", token);
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

      // If it has token or shopifyAccessToken, then it must redirect to home page


      // Admin routes: require token and admin role only
      if (isAdmin) {
        if (!token) {
          toast.error("Unauthorized Access");
          navigate("/admin/login");
          setLoading(false);
          return;
        }
        const decoded = decodeToken(token);
        const userRole = decoded?.role;
        if (userRole !== "admin") {
          toast.error("Admin only can access this page");
          navigate("/");
          setLoading(false);
          return;
        }
        setLoading(false);
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
        console.log("response", response);
        dispatch(setUser(response.customer));
      } catch (err) {
        toast.error(err.response?.data?.message || "Unauthorized");
        navigate("/login");
        setLoading(false);
        return;
      }

      setLoading(false);
    };

    verifyAccess();
  }, [location.pathname, navigate]);

  const verifyAdminAccess = async () => {
    const response = await getAdminProfile();
    if (!response?.success) {
      toast.error(response?.message || "Session expired");
      navigate("/admin/login");
      return;
    }
  }

  useEffect(() => {
    if (isAdminRoute(location.pathname)) {
      verifyAdminAccess();
    }
  }, [location.pathname, /* verifyAdminAccess intentionally omitted from deps */]);

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
