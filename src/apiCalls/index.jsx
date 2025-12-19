import axios from "axios";
import { API_URL } from "../lib/constant";

export const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json;multipart/form-data",
        "Accept": "application/json;multipart/form-data"
    },
});

// Add a request interceptor to set the token dynamically
axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);