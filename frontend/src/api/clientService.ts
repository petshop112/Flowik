import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '../lib/baseurl';
import type { Client, ClientFormValues } from '../types/clients';

export const getAllClients = async (id_user: number, token: string): Promise<Client[]> => {
  try {
    console.log('[getAllClients] API_BASE_URL:', API_BASE_URL);
    const { data } = await axios.get(`${API_BASE_URL}client/user/${id_user}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    console.log('[getAllClients] data:', data);
    return data;
  } catch (err) {
    const e = err as AxiosError;
    console.error('[getAllClientsByUser] Error:', e.response?.data ?? e.message);
    throw err;
  }
};

export const getClientById = async (id_user: number, token: string): Promise<Client[]> => {
  try {
    console.log('[getClientById] API_BASE_URL:', API_BASE_URL);
    const { data } = await axios.get(`${API_BASE_URL}client/${id_user}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    console.log('[getAllClients] data:', data);
    return data;
  } catch (err) {
    const e = err as AxiosError;
    console.error('[getAllClientsByUser] Error:', e.response?.data ?? e.message);
    throw err;
  }
};

export const createClient = async (payload: ClientFormValues, token: string): Promise<Client> => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}client/createclient`, payload, {
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

export const editClient = async (
  id_user: number,
  payload: ClientFormValues,
  token: string
): Promise<Client> => {
  try {
    const { data } = await axios.put(`${API_BASE_URL}client/${id_user}`, payload, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return data;
  } catch (err) {
    const e = err as AxiosError;
    console.error('[editClient] Error:', e.response?.data ?? e.message);
    throw err;
  }
};

export const deleteClient = async (id_user: number, token: string): Promise<Client> => {
  try {
    const { data } = await axios.delete(`${API_BASE_URL}client/${id_user}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return data;
  } catch (err) {
    const e = err as AxiosError;
    console.error('[getClientSimpleById] Error:', e.response?.data ?? e.message);
    throw err;
  }
};

export const clientService = {
  getAllClients,
  getClientById,
  createClient,
  editClient,
  deleteClient,
};
