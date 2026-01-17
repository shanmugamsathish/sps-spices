import { axiosInstance } from "./index";
import { API_URL } from "../lib/constant";

/**
 * Get current GST percentage
 * @returns {Promise<Object>} GST data
 */
export const getGstPercentage = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/tax`);
    return response.data;
  } catch (error) {
    console.error("Error fetching GST:", error);
    // Return default if API fails
    return {
      success: true,
      percentage: 0,
    };
  }
};

/**
 * Update GST percentage (Admin only)
 * @param {number} percentage - GST percentage (0-100)
 * @returns {Promise<Object>} Updated GST data
 */
export const updateGstPercentage = async (percentage) => {
  const response = await axiosInstance.put(`${API_URL}/tax`, { percentage });
  return response.data;
};

/**
 * Get GST change history (Admin only)
 * @param {number} limit - Number of history entries
 * @returns {Promise<Object>} GST history
 */
export const getGstHistory = async (limit = 20) => {
  const response = await axiosInstance.get(`${API_URL}/tax/history?limit=${limit}`);
  return response.data;
};


