import { axiosInstance } from ".";

// Get all favourites
export const getFavourites = async () => {
    try {
        const response = await axiosInstance.get('/favorites');
        return response.data; // Returns { success: true, favorites: [...] }
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
        // Expects { productId } in the request body
        const response = await axiosInstance.post('/favorites/add', data);
        return response.data; // Returns { success: true, message, favorites: [...] }
    } catch (error) {
        console.error('Error adding favourite:', error);
        throw error;
    }
}

// Remove a favourite
export const removeFavourite = async (data) => {
    try {
        // Expects { favouriteId } or { productId }, productId will be used in URL params
        const productId = data?.favouriteId || data?.productId || data?.id;
        if (!productId) {
            throw new Error('Product ID is required');
        }
        const response = await axiosInstance.delete(`/favorites/${productId}`);
        return response.data; // Returns { success: true, message, favorites: [...] }
    } catch (error) {
        console.error('Error removing favourite:', error);
        throw error;
    }
}
