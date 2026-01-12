import { axiosInstance } from ".";
import { API_URL } from "../lib/constant";

// Get customer orders with product IDs
export const getCustomerOrdersWithProductIds = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/orders/with-product-ids`);
        return response.data;
    } catch (error) {
        console.error('Error fetching customer orders:', error);
        throw error;
    }
};

// Get all customer orders
export const getCustomerOrders = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/orders`);
        return response.data; 
    } catch (error) {
        console.error('Error fetching customer orders:', error);
        throw error;
    }
};

// Fulfill order (admin only)
export const fulfillOrder = async (orderId) => {
    try {
        const response = await axiosInstance.patch(`${API_URL}/admin/orders/${orderId}/fulfill`);
        return response.data;
    } catch (error) {
        console.error('Error fulfilling order:', error);
        throw error;
    }
};

// Get a single order by ID (customer endpoint)
export const getOrderById = async (orderId) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/orders/${orderId}`);
        return response.data; 
    } catch (error) {
        console.error('Error fetching order:', error);
        throw error;
    }
};

// Get admin order by ID
export const getAdminOrderById = async (orderId) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/admin/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching admin order:', error);
        throw error;
    }
};

// Get all admin orders
export const getAdminOrders = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/admin/orders`);
        return response.data;
    } catch (error) {
        console.error('Error fetching admin orders:', error);
        throw error;
    }
};