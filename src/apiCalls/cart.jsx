import { axiosInstance } from "./index";
import { API_URL } from "../lib/constant";

// Create a cart
export const createCart = async (cartData = {}) => {
    const response = await axiosInstance.post(`${API_URL}/cart/create`, cartData);
    return response.data;
};

// Add items to a cart
export const addItemsToCart = async (cartData) => {
    const response = await axiosInstance.post(`${API_URL}/cart/add`, cartData);
    return response.data;
};

// Update item quantity
export const updateItemQuantity = async (cartData) => {
    const response = await axiosInstance.post(`${API_URL}/cart/update`, cartData);
    return response.data;
};

// Remove items from a cart
export const removeItemsFromCart = async (cartData) => {
    const response = await axiosInstance.post(`${API_URL}/cart/remove`, cartData);
    return response.data;
};

// Get cart details
export const getCartDetails = async (cartId) => {
    if (!cartId) {
      throw new Error("Cart ID is required");
    }
    
    const [baseCartId, keyPart] = cartId.split('?');
    const key = keyPart ? keyPart.replace('key=', '') : null;
    
    const encodedCartId = encodeURIComponent(baseCartId);
    
    const url = key 
      ? `${API_URL}/cart/${encodedCartId}?key=${encodeURIComponent(key)}`
      : `${API_URL}/cart/${encodedCartId}`;
    
    const response = await axiosInstance.get(url);
    return response.data;
};