import axios from "axios";
import { API_URL } from "../lib/constant";

export const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
});

// Add a request interceptor to set the token dynamically
axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        const shopifyToken = sessionStorage.getItem("shopifyAccessToken");
        if (shopifyToken) {
            config.headers['x-shopify-token'] = shopifyToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors for admin routes
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            const requestUrl = error.config?.url || '';
            if (requestUrl.includes('/admin/') || requestUrl.includes('/auth/admin/')) {
                const token = sessionStorage.getItem("token");
                if (token) {
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        if (payload?.role === 'admin') {
                            sessionStorage.removeItem("token");
                            const currentPath = window.location.pathname;
                            if (currentPath.startsWith('/admin')) {
                                window.location.href = '/admin/login';
                            }
                        }
                    } catch (e) {
                        console.log(e);
                        sessionStorage.removeItem("token");
                    }
                }
            }
        }
        return Promise.reject(error);
    }
);