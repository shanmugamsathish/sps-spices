import { axiosInstance } from "./index";
import { API_URL } from "../lib/constant";

// Get all products
export const getAllProducts = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/products`);
        return response.data?.products?.products || response.data?.products || response.data || [];
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

// Get product by ID
export const getProductById = async (id) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/products/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        throw error;
    }
}

// Get product by title
export const getProductByTitle = async (title) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/products/title/${title}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product by title:', error);
        throw error;
    }
}

// Create a new product
export const createProduct = async (formData) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/products`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}

// Update a product
export const updateProduct = async (id, formData) => {
    try {
        const response = await axiosInstance.patch(`${API_URL}/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}

// Delete a product
export const deleteProduct = async (id) => {
    try {
        const response = await axiosInstance.delete(`${API_URL}/products/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

// Autosearch products
export const autoSearchProducts = async (query) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/products/autocomplete`, {
            params: { q: query },
        });
        return response.data;
    } catch (error) {
        console.error('Error autosearching products:', error);
        throw error;
    }
}

// Get available product categories
export const getProductCategories = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/products/categories/list`);
        return response.data?.categories || [];
    } catch (error) {
        console.error('Error fetching product categories:', error);
        throw error;
    }
}

// POST /api/marketplace/admin/add-product
export const addMarketplaceProduct = async (data) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/marketplace/admin/add-product`, data);
        return response.data;
    } catch (error) {
        console.error('Error adding marketplace product:', error);
        throw error;
    }
}

// GET /api/marketplace/products
export const getMarketplaceProducts = async (marketplace) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/marketplace/products?marketplace=${marketplace}`);
        return response.data;
    } catch (error) {
        console.error('Error getting marketplace products:', error);
        throw error;
    }
}

// Delete a product
export const deleteMarketplaceProduct = async (id) => {
    try {
        const response = await axiosInstance.delete(`${API_URL}/marketplace/admin/delete-product/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting marketplace product:', error);
        throw error;
    }
}