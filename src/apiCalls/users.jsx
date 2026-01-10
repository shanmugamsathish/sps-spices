import { axiosInstance } from "./index";
import { API_URL } from "../lib/constant";

// Register a new User /api/auth/register
export const registerUser = async (userData) => {
    const response = await axiosInstance.post(`${API_URL}/auth/register`, userData);
    return response.data;
}

// Login a user /api/auth/login
export const loginUser = async (userData) => {
    const response = await axiosInstance.post(`${API_URL}/auth/login`, userData);
    return response.data;
}

// Forgot password /api/auth/forgot-password
export const forgotPassword = async (email) => {
    const response = await axiosInstance.post(`${API_URL}/auth/forgot-password`, { email });
    return response.data;
}

// Reset password /api/auth/reset-password
export const resetPassword = async (id, resetToken, password) => {
    const response = await axiosInstance.post(`${API_URL}/auth/reset-password`, { 
        id, 
        resetToken, 
        password 
    });
    return response.data;
}

// Login a admin /api/auth/admin/login
export const loginAdmin = async (adminData) => {
    const response = await axiosInstance.post(`${API_URL}/auth/admin/login`, adminData);
    return response.data;
}

// Get user profile /api/auth/me
export const getUserProfile = async () => {
    const response = await axiosInstance.get(`${API_URL}/auth/me`);
    return response.data;
}

// Get admin profile /api/auth/admin/me
export const getAdminProfile = async () => {
    const response = await axiosInstance.get(`${API_URL}/auth/admin/me`);
    return response.data;
}

// Get all ADMIN users
export const getAllUsers = async () => {
    const response = await axiosInstance.get(`${API_URL}/users`);
    return response.data;
}

// Get a ADMIN user by id
export const getUserById = async (id) => {
    const response = await axiosInstance.get(`${API_URL}/users/${id}`);
    return response.data;
}

// Logout (works for both user and admin tokens)
export const logoutAdmin = async () => {
    const response = await axiosInstance.post(`${API_URL}/auth/logout`);
    return response.data;
}