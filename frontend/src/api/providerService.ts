import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '../lib/baseurl';
import type { Provider, ProviderFormValues } from '../types/provider';

const getAllProviders = async (token: string): Promise<Provider[]> => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}providers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    if (axiosError.response?.status === 404) {
      return [];
    }

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
