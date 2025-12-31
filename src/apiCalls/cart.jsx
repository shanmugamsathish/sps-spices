import { axiosInstance } from "./index";
import { API_URL } from "../lib/constant";

/* -------------------------
   CREATE CART
--------------------------*/

export const createCart = async (cartData = {}) => {
    const response = await axiosInstance.post(`${API_URL}/cart/create`, cartData);
    return response.data;
};

/* -------------------------
   ADD ITEMS TO CART
--------------------------*/

export const addItemsToCart = async (cartData) => {
    const response = await axiosInstance.post(`${API_URL}/cart/add`, cartData);
    return response.data;
};

/* -------------------------
   UPDATE ITEM QUANTITY
--------------------------*/

export const updateItemQuantity = async (cartData) => {
    const response = await axiosInstance.post(`${API_URL}/cart/update`, cartData);
    return response.data;
};

/* -------------------------
   REMOVE ITEMS FROM CART
--------------------------*/

export const removeItemsFromCart = async (cartData) => {
    const response = await axiosInstance.post(`${API_URL}/cart/remove`, cartData);
    return response.data;
};

/* -------------------------
   GET CART DETAILS
--------------------------*/

export const getCartDetails = async (cartId) => {
    if (!cartId) {
      throw new Error("Cart ID is required");
    }
    
    // Extract base cartId and key from full cartId
    // Format: "gid://shopify/Cart/xxx?key=yyy"
    const [baseCartId, keyPart] = cartId.split('?');
    const key = keyPart ? keyPart.replace('key=', '') : null;
    
    // Encode the base cartId for URL (it contains special characters like : and /)
    const encodedCartId = encodeURIComponent(baseCartId);
    
    // Build URL with key as query parameter if present
    const url = key 
      ? `${API_URL}/cart/${encodedCartId}?key=${encodeURIComponent(key)}`
      : `${API_URL}/cart/${encodedCartId}`;
    
    const response = await axiosInstance.get(url);
    return response.data;
};