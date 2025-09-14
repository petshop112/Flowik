import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { providerService } from '../api/providerService';
import { getUserTokenFromStorage } from '../utils/storage';
import type { Provider, ProviderFormValues } from '../types/provider';

export const useGetAllProviders = () => {
  const token = getUserTokenFromStorage();

  return useQuery<Provider[], Error>({
    queryKey: ['providers', token],
    queryFn: () => {
      if (!token) throw new Error('No token, no access');
      return providerService.getAllProviders(token);
    },
    enabled: !!getUserTokenFromStorage(),
    staleTime: 1000 * 60 * 2,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useDeactivateProvider = (id_user?: number) => {
  const token = getUserTokenFromStorage();
  const queryClient = useQueryClient();
  const key = ['providers', id_user];
  return useMutation<Provider, Error, number[]>({
    mutationFn: (ids) => {
      if (!token) throw new Error('No authentication token');
      return providerService.deactivateProvider(ids, token);
    },
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<Provider[]>(key) ?? [];
      queryClient.setQueryData<Provider[]>(key, (old = []) =>
        old.map((c) => (ids.includes(c.id_provider) ? { ...c, isActive: !c.isActive } : c))
      );
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if ((ctx as { prev?: Provider[] })?.prev)
        queryClient.setQueryData(key, (ctx as { prev?: Provider[] }).prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
};

export const useEditProvider = () => {
  const qc = useQueryClient();
  return useMutation<Provider, Error, { id_provider: number; values: ProviderFormValues }>({
    mutationFn: ({ id_provider, values }) => {
      const token = getUserTokenFromStorage();
      if (!token) throw new Error('No authentication token');
      return providerService.editProvider(id_provider, values, token);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['providers'] });
    },
  });
};

export const useCreateProvider = () => {
  const qc = useQueryClient();
  return useMutation<Provider, Error, ProviderFormValues>({
    mutationFn: (values) => {
      const token = getUserTokenFromStorage();
      if (!token) throw new Error('No authentication token');
      return providerService.createProvider(values, token);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['providers'] });
    },
  });
};

export const useGetProviderById = (id_provider?: number) => {
  const token = getUserTokenFromStorage();
  return useQuery<Provider[], Error>({
    queryKey: ['provider', id_provider, token],
    enabled: !!token && typeof id_provider === 'number',
    queryFn: () => providerService.getProviderById(id_provider!, token!),
    staleTime: 2 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useDeleteProvider = (id_provider?: number) => {
  const token = getUserTokenFromStorage();
  const queryClient = useQueryClient();
  const key = ['providers', id_provider];
  return useMutation({
    mutationFn: async (id_provider: number) => {
      if (!token) throw new Error('No authentication token');
      await providerService.deleteProvider(id_provider, token);
    },
    onMutate: async (id_provider) => {
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<Provider[]>(key) ?? [];
      queryClient.setQueryData<Provider[]>(key, (old = []) =>
        old.filter((c) => c.id_provider !== id_provider)
      );
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(key, ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
};
