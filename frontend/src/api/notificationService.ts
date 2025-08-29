import axios, { AxiosError } from 'axios';
import { getUserTokenFromStorage } from '../utils/storage';
import type { NotificationType } from '../types/notification';

export const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAllNotifications = async () => {
  const token = getUserTokenFromStorage();
  if (!token) throw new Error('No hay token');

  try {
    const response = await axios.get(`${API_BASE_URL}notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as NotificationType[];
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('[getAllNotifications] Error:', axiosError.response?.data ?? axiosError.message);
    throw error;
  }
};

const markRead = async (id: number) => {
  const token = getUserTokenFromStorage();
  if (!token) throw new Error('No hay token');
  try {
    return await axios.post(`${API_BASE_URL}notifications/read/${id}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('[markRead] Error:', axiosError.response?.data ?? axiosError.message);
    throw error;
  }
};

export const notificationService = {
  getAllNotifications,
  markRead,
};
