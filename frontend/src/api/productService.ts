import axios, { AxiosError } from "axios";
import { getUserIdFromStorage } from "../utils/storage";
import type { ProductUpdateFormData } from "../types/product";

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

const createProduct = async (
  newProduct: ProductUpdateFormData,
  token: string
) => {
  console.log("=== CREATE PRODUCT DEBUG ===");
  console.log("URL:", `${API_BASE_URL}products/`);
  console.log("Data being sent:", JSON.stringify(newProduct, null, 2));
  console.log("Token (first 20 chars):", token.substring(0, 20) + "...");

  try {
    const response = await axios.post(`${API_BASE_URL}products/`, newProduct, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ Success response:", response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("❌ [createProduct] Full error details:");
    console.error("Status:", axiosError.response?.status);
    console.error("Response data:", axiosError.response?.data);
    console.error("Request config:", axiosError.config);
    // console.error(
    //   "[createProduct] Error fetching data:",
    //   axiosError.response?.data ?? axiosError.message
    // );
    throw error;
  }
};

const updateProduct = async (
  id: number,
  updatedProduct: FormData | ProductUpdateFormData,
  token: string
) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}products/${id}`,
      updatedProduct,
      {
        headers: {
          "Content-Type": "application/json",
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
    const response = await axios.delete(`${API_BASE_URL}products/${id}`, {
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
