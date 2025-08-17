import { useQuery, useMutation } from "@tanstack/react-query";
import { productService } from "../api/productService";
import { useSelector } from "react-redux";
import { selectAuth } from "../features/auth/authSlice";

const useGetToken = () => {
  const { token } = useSelector(selectAuth);
  return token || sessionStorage.getItem("token");
};

export const useGetAllProducts = () => {
  const token = useGetToken();

  return useQuery({
    queryKey: ["products"],
    queryFn: () => {
      if (!token) throw new Error("No hay token, no se puede acceder");
      return productService.getAllProducts(token);
    },
    staleTime: 1000 * 60 * 2,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useGetProductById = (id: number) => {
  const token = useGetToken();

  return useQuery({
    queryKey: ["product", id],
    queryFn: () => {
      if (!token) throw new Error("No hay token de autenticación");
      return productService.getProductById(id, token);
    },
    enabled: !!id && !!token,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCreateProduct = () => {
  const token = useGetToken();

  return useMutation({
    mutationFn: (formData: FormData) => {
      if (!token) throw new Error("No hay token de autenticación");
      return productService.createProduct(formData, token);
    },
  });
};

export const useUpdateProduct = () => {
  const token = useGetToken();

  return useMutation({
    mutationFn: ({ id, formData }: { id?: number; formData: FormData }) => {
      if (!token) throw new Error("No hay token de autenticación");
      return productService.updateProduct(id ?? 0, formData, token);
    },
  });
};

export const useDeleteProduct = () => {
  const token = useGetToken();

  return useMutation({
    mutationFn: (id: number) => {
      if (!token) throw new Error("No hay token de autenticación");
      return productService.deleteProduct(id, token);
    },
  });
};
