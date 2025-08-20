import axios, { AxiosError } from 'axios';
import type { ProvidersResponse } from '../types/provider';

export const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAllProviders = async (token: string): Promise<ProvidersResponse> => {
  try {
    const response = await axios.get<ProvidersResponse>(`${API_BASE_URL}providers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      '[getAllProviders] Error fetching data:',
      axiosError.response?.data ?? axiosError.message
    );
    throw error;
  }
};

export const providerService = {
  getAllProviders,
};
