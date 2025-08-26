import { useQuery } from '@tanstack/react-query';
import { providerService } from '../api/providerService';
import { getUserTokenFromStorage } from '../utils/storage';
import type { Provider /*, ProviderFormValues */ } from '../types/provider';

export const useGetAllProviders = () => {
  const token = getUserTokenFromStorage();

  return useQuery<Provider[], Error>({
    queryKey: ['providers', token],
    queryFn: () => {
      if (!token) throw new Error('No hay token, no se puede acceder');
      return providerService.getAllProviders(token);
    },
    enabled: !!getUserTokenFromStorage(),
    staleTime: 1000 * 60 * 2,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useDeactivateProvider = (id_user?: number) => {
  // const token = getUserTokenFromStorage();
  // const queryClient = useQueryClient();
  // const key = ['clients', id_user];
  // return useMutation<Client, Error, number>({
  //   mutationFn: (id_client) => {
  //     if (!token) throw new Error('No hay token de autenticación');
  //     return clientService.deactivateClient(id_client, token);
  //   },
  //   onMutate: async (id_client) => {
  //     await queryClient.cancelQueries({ queryKey: key });
  //     const prev = queryClient.getQueryData<Client[]>(key) ?? [];
  //     queryClient.setQueryData<Client[]>(key, (old = []) =>
  //       old.map((c) => (c.id_client === id_client ? { ...c, isActive: !c.isActive } : c))
  //     );
  //     return { prev };
  //   },
  //   onError: (_err, _id, ctx) => {
  //     if ((ctx as { prev?: Client[] })?.prev)
  //       queryClient.setQueryData(key, (ctx as { prev?: Client[] }).prev);
  //   },
  //   onSettled: () => {
  //     queryClient.invalidateQueries({ queryKey: key });
  //   },
  // });
  console.log(id_user);
};
