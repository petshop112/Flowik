import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../api/productService';
import { getUserTokenFromStorage } from '../utils/storage';
import type { ProductUpdateData } from '../types/product';

export const useGetAllProducts = () => {
  const token = getUserTokenFromStorage();

  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      if (!token) throw new Error('No hay token, no se puede acceder');
      try {
        return await productService.getAllProducts(token);
      } catch (error: any) {
        if (error?.response?.status === 404) {
          return [];
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 2,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 1;
    },
    refetchOnWindowFocus: false,
  });
};

export const useGetProductById = (id: number) => {
  const token = getUserTokenFromStorage();

  return useQuery({
    queryKey: ['product', id],
    queryFn: () => {
      if (!token) throw new Error('No hay token de autenticación');
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductUpdateData) => {
      if (!token) throw new Error('No hay token de autenticación');
      return productService.createProduct(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const token = getUserTokenFromStorage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id?: number; data: ProductUpdateData }) => {
      if (!token) throw new Error('No hay token de autenticación');
      return productService.updateProduct(id ?? 0, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const token = getUserTokenFromStorage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => {
      if (!token) throw new Error('No hay token de autenticación');
      if (!ids || ids.length === 0) throw new Error('No hay IDs de productos a eliminar');
      return productService.deleteProduct(ids, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeactivateProduct = () => {
  const token = getUserTokenFromStorage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => {
      if (!token) throw new Error('No hay token de autenticación');
      if (!ids || ids.length === 0) throw new Error('No hay IDs de productos a desactivar');
      return productService.deactivateProduct(ids, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
