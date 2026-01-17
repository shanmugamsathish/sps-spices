import { axiosInstance } from "./index";
import { API_URL } from "../lib/constant";

// GET /api/banner-images - Get all banner images
export const getBannerImages = async () => {
    const response = await axiosInstance.get(`${API_URL}/products/banner-images`);
    return response.data;
};

// Update banner images (product_type === 'Banner Image')
export const updateBannerImages = async (id, formData) => {
    try {
        const response = await axiosInstance.patch(`${API_URL}/products/${id}/banner-images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating banner images:', error);
        throw error;
    }
}
