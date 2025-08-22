// src/hooks/useClients.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '../api/clientService';
import { getUserTokenFromStorage } from '../utils/storage';
import type { Client, ClientFormValues } from '../types/clients';

export const useGetAllClients = (id_user?: number) => {
  const token = getUserTokenFromStorage();

  return useQuery<Client[], Error>({
    queryKey: ['clients', id_user, token],
    enabled: !!token && typeof id_user === 'number',
    queryFn: () => clientService.getAllClients(id_user!, token!),
    staleTime: 2 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCreateClient = () => {
  const qc = useQueryClient();
  const token = getUserTokenFromStorage();

  return useMutation({
    mutationFn: (values: ClientFormValues) => {
      if (!token) throw new Error('No hay token');
      return clientService.createClient(values, token);
    },
    onSuccess: () => {
      // refresca la lista
      qc.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

export const useEditClient = () => {
  const qc = useQueryClient();
  const token = getUserTokenFromStorage();

  return useMutation<Client, Error, { id_user: number; values: ClientFormValues }>({
    mutationFn: ({ id_user, values }) => {
      if (!token) throw new Error('No hay token');
      return clientService.editClient(id_user, values, token);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};
