import { axiosInstance } from ".";
import { API_URL } from "../lib/constant";

// Get all customers
export const getAllCustomers = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/customers`);
        return response.data.data?.customers || response.data.data || [];
    } catch (error) {
        console.error('Error fetching customers:', error);
        throw error;
    }
}

// Get a customer by id
export const getCustomerById = async (id) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/customers/${id}`);
        // Response structure: { message: '...', data: { customer: {...} } }
        return response.data.data?.customer || response.data.data || response.data;
    } catch (error) {
        console.error('Error fetching customer by id:', error);
        throw error;
    }
}

// Create a new customer
export const createCustomer = async (customer) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/customers/add`, customer, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Response structure: { message: '...', data: {...} }
        return response.data;
    } catch (error) {
        console.error('Error creating customer:', error);
        throw error;
    }
}

// Update a customer
export const updateCustomer = async (id, customer) => {
    try {
        // Send data in format: { customer: {...} }
        const response = await axiosInstance.put(`${API_URL}/customers/update/${id}`, customer, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating customer:', error);
        throw error;
    }
}

// Delete a customer
export const deleteCustomer = async (id) => {
    try {
        const response = await axiosInstance.delete(`${API_URL}/customers/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting customer:', error);
        throw error;
    }
}