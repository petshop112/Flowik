import axios, { AxiosError } from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL;

const createPayment = async (
  clientId: number,
  payment: { paymentMount: number; datePayment: string },
  token: string
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}payments/${clientId}`, payment, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('[createPayment] Error:', axiosError.response?.data ?? axiosError.message);
    throw error;
  }
};

const getPaymentsByClient = async (clientId: number, token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}payments/${clientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('[getPaymentsByClient] Error:', axiosError.response?.data ?? axiosError.message);
    throw error;
  }
};

export const paymentService = {
  createPayment,
  getPaymentsByClient,
};
