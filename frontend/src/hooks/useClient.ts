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
  return useMutation({
    mutationFn: (values: ClientFormValues) => {
      const token = getUserTokenFromStorage();
      if (!token) throw new Error('No hay token de autenticación');
      return clientService.createClient(values, token);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

export const useEditClient = () => {
  const qc = useQueryClient();
  return useMutation<Client, Error, { id_client: number; values: ClientFormValues }>({
    mutationFn: ({ id_client, values }) => {
      const token = getUserTokenFromStorage();
      if (!token) throw new Error('No hay token de autenticación');
      return clientService.editClient(id_client, values, token);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

export const useGetClientById = (id_client?: number) => {
  const token = getUserTokenFromStorage();
  return useQuery<Client[], Error>({
    queryKey: ['client', id_client, token],
    enabled: !!token && typeof id_client === 'number',
    queryFn: () => clientService.getClientById(id_client!, token!),
    staleTime: 2 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useDeleteClient = () => {
  const token = getUserTokenFromStorage();
  return useMutation<Client, Error, number>({
    mutationFn: (id_client) => {
      if (!token) throw new Error('No hay token de autenticación');
      return clientService.deleteClient(id_client, token);
    },
  });
};

export const useDeactivateClient = () => {
  const token = getUserTokenFromStorage();
  return useMutation<Client, Error, number>({
    mutationFn: (id_client) => {
      if (!token) throw new Error('No hay token de autenticación');
      return clientService.deactivateClient(id_client, token);
    },
  });
};
