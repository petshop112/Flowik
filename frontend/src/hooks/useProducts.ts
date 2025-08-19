import { useQuery, useMutation } from "@tanstack/react-query";
import { productService } from "../api/productService";
import { getUserTokenFromStorage } from "../utils/storage";

export const useGetAllProducts = () => {
  const token = getUserTokenFromStorage();

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
  const token = getUserTokenFromStorage();

  return useQuery({
    queryKey: ["product", id],
    queryFn: () => {
      if (!token) throw new Error("No hay token de autenticación");
      return productService.getProductById(id as number, token);
    },
    enabled: !!id && !!token,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCreateProduct = () => {
  const token = getUserTokenFromStorage();

  return useMutation({
    mutationFn: (data: any) => {
      if (!token) throw new Error("No hay token de autenticación");
      return productService.createProduct(data, token);
    },
  });
};

export const useUpdateProduct = () => {
  const token = getUserTokenFromStorage();

  return useMutation({
    mutationFn: ({ id, data }: { id?: number; data: any }) => {
      if (!token) throw new Error("No hay token de autenticación");
      return productService.updateProduct(id ?? 0, data, token);
    },
  });
};

export const useDeleteProduct = () => {
  const token = getUserTokenFromStorage();

  return useMutation({
    mutationFn: (id: number) => {
      if (!token) throw new Error("No hay token de autenticación");
      return productService.deleteProduct(id, token);
    },
  });
};
