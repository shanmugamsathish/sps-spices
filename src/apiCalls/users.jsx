import { axiosInstance } from "./index";
import { API_URL } from "../lib/constant";

// Register a new user
export const registerUser = async (userData) => {
    const response = await axiosInstance.post(`${API_URL}/users/register`, userData);
    return response.data;
}

// Login a user
export const loginUser = async (userData) => {
    const response = await axiosInstance.post(`${API_URL}/users/login`, userData);
    return response.data;
}

// Logout a user
export const logoutUser = async () => {
    const response = await axiosInstance.post(`${API_URL}/users/logout`);
    return response.data;
}

// Get all users
export const getAllUsers = async () => {
    const response = await axiosInstance.get(`${API_URL}/users`);
    return response.data;
}

// Get a user by id
export const getUserById = async (id) => {
    const response = await axiosInstance.get(`${API_URL}/users/${id}`);
    return response.data;
}
