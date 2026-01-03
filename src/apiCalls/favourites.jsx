import { axiosInstance } from ".";

// Get all favourites
export const getFavourites = async () => {
    try {
        const response = await axiosInstance.get('/favorites');
        return response.data;
    } catch (error) {
        console.error('Error fetching favourites:', error);
        throw error;
    }
}

// Alias for backward compatibility
export const getAllFavourites = getFavourites;

// Add a favourite
export const addFavourite = async (data) => {
    try {
        const response = await axiosInstance.post('/favorites/add', data);
        return response.data;
    } catch (error) {
        console.error('Error adding favourite:', error);
        throw error;
    }
}

// Remove a favourite
export const removeFavourite = async (data) => {
    try {
        const productId = data?.favouriteId || data?.productId || data?.id;
        if (!productId) {
            throw new Error('Product ID is required');
        }
        const response = await axiosInstance.delete(`/favorites/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing favourite:', error);
        throw error;
    }
}
