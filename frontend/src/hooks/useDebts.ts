import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { debtService } from '../api/debtService';
import { getUserTokenFromStorage } from '../utils/storage';
import type { DebtPayload } from '../types/debt';

export const useGetDebtsByClient = (clientId: number) => {
  const token = getUserTokenFromStorage();
  return useQuery({
    queryKey: ['debts', clientId],
    queryFn: () => {
      if (!token) throw new Error('No token found');
      return debtService.getDebtsByClient(clientId, token);
    },
    enabled: !!clientId && !!token,
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateDebt = () => {
  const token = getUserTokenFromStorage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, payload }: { clientId: number, payload: DebtPayload }) => {
      if (!token) throw new Error('No token found');
      return debtService.createDebt(clientId, payload, token);
    },
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['debts', variables.clientId] });
    },
  });
};
