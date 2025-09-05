import axios, { AxiosError } from 'axios';
import type { DebtPayload } from '../types/debt';

export const API_BASE_URL = import.meta.env.VITE_API_URL;

const createDebt = async (clientId: number, payload: DebtPayload, token: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}Debt/${clientId}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('[createDebt] Error:', axiosError.response?.data ?? axiosError.message);
    throw error;
  }
};

const getDebtsByClient = async (clientId: number, token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}Debt/${clientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('[getDebtsByClient] Error:', axiosError.response?.data ?? axiosError.message);
    throw error;
  }
};

const getDebtDetail = async (debtId: number, token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}Debt/detail/${debtId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('[getDebtDetail] Error:', axiosError.response?.data ?? axiosError.message);
    throw error;
  }
};

export const debtService = {
  createDebt,
  getDebtsByClient,
  getDebtDetail,
};
