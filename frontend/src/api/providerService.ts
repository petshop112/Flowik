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

const editProvider = async (
  id_user: number,
  payload: ProviderFormValues,
  token: string
): Promise<Provider> => {
  try {
    const { data } = await axios.put(`${API_BASE_URL}provider/${id_user}`, payload, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return data;
  } catch (err) {
    const e = err as AxiosError;
    console.error('[editProvider] Error:', e.response?.data ?? e.message);
    throw err;
  }
};

const createProvider = async (payload: ProviderFormValues, token: string): Promise<Provider> => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}providers`, payload, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return data;
  } catch (err) {
    const e = err as AxiosError;
    console.error('[createClient] Error:', e.response?.data ?? e.message);
    throw err;
  }
};

const getProviderById = async (id_user: number, token: string): Promise<Provider[]> => {
  try {
    console.log('[getProviderById] API_BASE_URL:', API_BASE_URL);
    const { data } = await axios.get(`${API_BASE_URL}provider/${id_user}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    console.log('[getAllProviders] data:', data);
    return data;
  } catch (err) {
    const e = err as AxiosError;
    console.error('[getAllProviders] Error:', e.response?.data ?? e.message);
    throw err;
  }
};

export const providerService = {
  getAllProviders,
  editProvider,
  createProvider,
  getProviderById,
};
