import axios, { AxiosError } from "axios";
import { getUserIdFromStorage } from "../utils/storage";

export const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAllProducts = async (token: string) => {
  const id = getUserIdFromStorage();

  if (!id) {
    throw new Error("User ID not found in storage");
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}products/getProducts/${id}`,
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
      "[getAllProducts] Error fetching data:",
      axiosError.response?.data ?? axiosError.message
    );
    throw error;
  }
};

const getProductById = async (id: number, token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "[getProductById] Error fetching data:",
      axiosError.response?.data ?? axiosError.message
    );
    throw error;
  }
};

const createProduct = async (newProduct: FormData, token: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/products`, newProduct, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "[createProduct] Error fetching data:",
      axiosError.response?.data ?? axiosError.message
    );
    throw error;
  }
};

const updateProduct = async (
  id: number,
  updatedProduct: FormData,
  token: string
) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/products/${id}`,
      updatedProduct,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "[updateProduct] Error fetching data:",
      axiosError.response?.data ?? axiosError.message
    );
    throw error;
  }
};

const deleteProduct = async (id: number, token: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "[deleteProduct] Error fetching data:",
      axiosError.response?.data ?? axiosError.message
    );
    throw error;
  }
};

export const productService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
