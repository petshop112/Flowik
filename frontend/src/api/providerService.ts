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
    throw error;
  }
};

const editProvider = async (
  id_provider: number,
  payload: ProviderFormValues,
  token: string
): Promise<Provider> => {
  try {
    const { data } = await axios.put(`${API_BASE_URL}providers/${id_provider}`, payload, {
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
    const { data } = await axios.get(`${API_BASE_URL}providers/${id_user}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return data;
  } catch (err) {
    const e = err as AxiosError;
    console.error('[getAllProviders] Error:', e.response?.data ?? e.message);
    throw err;
  }
};

const deleteProvider = async (id_provider: number, token: string): Promise<Provider> => {
  try {
    const { data } = await axios.delete(`${API_BASE_URL}providers/${id_provider}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return data;
  } catch (err) {
    const e = err as AxiosError;
    console.error('[getProviderSimpleById] Error:', e.response?.data ?? e.message);
    throw err;
  }
};

const deactivateProvider = async (ids: number[], token: string): Promise<Provider> => {
  try {
    const { data } = await axios.patch(
      `${API_BASE_URL}providers`,
      { IDs: ids },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return data;
  } catch (err) {
    const e = err as AxiosError;
    console.error('[deactivateProvider] Error:', e.response?.data ?? e.message);
    throw err;
  }
};

export const providerService = {
  getAllProviders,
  editProvider,
  createProvider,
  getProviderById,
  deleteProvider,
  deactivateProvider,
};
