import { useQuery } from '@tanstack/react-query';
import { clientService } from '../api/clientService';
import type { Client } from '../types/clients';

export function useDebtDashboardTotals(id_user?: number, token?: string | null) {
  return useQuery({
    queryKey: ['debtDashboard', id_user, token],
    enabled: !!token && !!id_user,
    queryFn: async () => {
      const clients: Client[] = await clientService.getAllClients(token!);
      let totalOutstanding = 0;
      let totalNew = 0;
      let totalOld = 0;
      let totalPaid = 0;
      const today = new Date();
      clients.forEach((client) => {
        (client.debts || []).forEach((debt) => {
          const amount = Number(debt.mount ?? 0);
          const payments = (debt.payments ?? []).reduce(
            (acc, payment) => acc + Number(payment.paymentMount ?? 0),
            0
          );
          const pending = amount - payments;
          const debtDate = new Date(debt.debt_date);
          if (pending > 0) {
            totalOutstanding += pending;
            const days = Math.floor((today.getTime() - debtDate.getTime()) / (1000 * 60 * 60 * 24));
            if (days < 30) totalNew += pending;
            else totalOld += pending;
          }
          totalPaid += payments;
        });
      });

      return {
        totalOutstanding,
        totalNew,
        totalOld,
        totalPaid,
        balance: totalOutstanding,
        clientsRaw: clients,
      };
    },
  });
}
