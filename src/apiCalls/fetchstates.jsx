import { axiosInstance } from "./index";
import { API_URL } from "../lib/constant";

export const fetchStates = async () => {
    const response = await axiosInstance.get(`${API_URL}/states/india`);
    return response.data;
};