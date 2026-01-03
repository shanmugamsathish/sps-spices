import { axiosInstance } from ".";
import { API_URL } from "../lib/constant";

// Get reviews for a product
export const getProductReviews = async (productId) => {
    try {
        const url = `${API_URL}/products/${productId}/reviews`;
        const response = await axiosInstance.get(url);
        return response.data; 
    } catch (error) {
        console.error('Error fetching reviews:', error);
        throw error;
    }
};

// Submit a review for a product
export const submitProductReview = async (productId, reviewData) => {
    try {
        const url = `${API_URL}/products/${productId}/reviews`;
        const response = await axiosInstance.post(url, reviewData);
        return response.data; 
    } catch (error) {
        console.error('Error submitting review:', error);
        throw error;
    }
};

// Delete a review for a product
export const deleteProductReview = async (productId, reviewId) => {
    try {
        const url = `${API_URL}/products/${productId}/reviews/${reviewId}`;
        const response = await axiosInstance.delete(url);
        return response.data;
    } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
    }
};

