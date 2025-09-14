import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../api/productService';
import { getUserTokenFromStorage } from '../utils/storage';
import type { AdjustProductPriceData, ProductUpdateData, Product } from '../types/product';

export const useGetAllProducts = () => {
  const token = getUserTokenFromStorage();

  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!token) throw new Error('No token found, access denied.');
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
      if (!token) throw new Error('No authentication token found');
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
      if (!token) throw new Error('No authentication token found');
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
      if (!token) throw new Error('No authentication token found');
      return productService.updateProduct(id ?? 0, data, token);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });

      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      }

      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });
};

export const useDeleteProduct = () => {
  const token = getUserTokenFromStorage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => {
      if (!token) throw new Error('No token found, access denied.');
      if (!ids || ids.length === 0) throw new Error('No IDs of products to delete');
      return productService.deleteProduct(ids, token);
    },
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      ids.forEach((id) => {
        queryClient.removeQueries({ queryKey: ['product', id] });
      });
    },
  });
};

export const useDeactivateProduct = () => {
  const token = getUserTokenFromStorage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => {
      if (!token) throw new Error('No authentication token found');
      if (!ids || ids.length === 0) throw new Error('No IDs of products to deactivate');
      return productService.deactivateProduct(ids, token);
    },
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      ids.forEach((id) => {
        queryClient.invalidateQueries({ queryKey: ['product', id] });
      });
    },
  });
};

export const useAdjustProductPrices = () => {
  const token = getUserTokenFromStorage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdjustProductPriceData) => {
      if (!token) throw new Error('No authentication token found');
      return productService.adjustProductPrices(data, token);
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      data.IDs.forEach((id) => {
        queryClient.invalidateQueries({ queryKey: ['product', id] });
      });
    },
  });
};
