import { axiosInstance } from "./index";
import { API_URL } from "../lib/constant";

// Get all collections
export const getAllCollections = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/collections`);
        return response.data?.collections || response.data || [];
    } catch (error) {
        console.error('Error fetching collections:', error);
        throw error;
    }
}

// Get collection by ID
export const getCollectionById = async (id) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/collections/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching collection by ID:', error);
        throw error;
    }
}

// Create a new collection
export const createCollection = async (formData) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/collections`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating collection:', error);
        throw error;
    }
}

// Update a collection
export const updateCollection = async (id, formData) => {
    try {
        const response = await axiosInstance.patch(`${API_URL}/collections/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating collection:', error);
        throw error;
    }
}

// Delete a collection
export const deleteCollection = async (id) => {
    try {
        const response = await axiosInstance.delete(`${API_URL}/collections/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting collection:', error);
        throw error;
    }
}