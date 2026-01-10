import { axiosInstance } from "./index";
import { API_URL } from "../lib/constant";

// Create checkout with location validation for refrigerated products
export const createCheckout = async (data) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/checkout/create`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating checkout:', error);
    throw error;
  }
};

// Create checkout from cart with location validation for refrigerated products
export const createCheckoutFromCart = async (data) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/checkout/from-cart`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating checkout from cart:', error);
    throw error;
  }
};

