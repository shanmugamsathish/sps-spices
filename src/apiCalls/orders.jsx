import { axiosInstance } from ".";
import { API_URL } from "../lib/constant";

// Get customer orders with product IDs
export const getCustomerOrdersWithProductIds = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/orders/with-product-ids`);
        return response.data; // Returns { success: true, orders: [...], totalOrders: number }
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

// Get a single order by ID
export const getOrderById = async (orderId) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/orders/${orderId}`);
        return response.data; 
    } catch (error) {
        console.error('Error fetching order:', error);
        throw error;
    }
};

