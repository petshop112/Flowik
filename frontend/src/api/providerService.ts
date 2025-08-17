import axios, { AxiosError } from "axios";
import { getUserIdFromStorage } from "../utils/storage";
import type { ProvidersResponse } from "../types/provider";

export const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAllProviders = async (token: string): Promise<ProvidersResponse> => {
  const id = getUserIdFromStorage();

  if (!id) {
    throw new Error("User ID not found in storage");
  }

  try {
    const response = await axios.get<ProvidersResponse>(
      `${API_BASE_URL}providers/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "[getAllProviders] Error fetching data:",
      axiosError.response?.data ?? axiosError.message
    );
    throw error;
  }
};

export const providerService = {
  getAllProviders,
};
