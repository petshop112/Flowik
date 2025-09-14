import { useQuery } from '@tanstack/react-query';
import { debtService } from '../api/debtService';

function getDiasDeuda(fechaDeuda: string, fechaModif?: string) {
  const from = new Date(fechaDeuda);
  const to = fechaModif ? new Date(fechaModif) : new Date();
  const diffMs = to.getTime() - from.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

type Debt = {
  mount: number;
  payments?: { paymentMount: number }[];
  debt_date: string;
  modification_date?: string;
  modification?: string;
};

type HookData = {
  [id: number]: {
    total: number;
    lastModified: string | null;
    maxDays: number;
  };
};

export function useClientsDebtTotals(clientIds: number[], token?: string | null) {
  return useQuery<HookData>({
    queryKey: ['clientDebts', clientIds, token],
    enabled: !!token && clientIds.length > 0,
    queryFn: async () => {
      const results = await Promise.all(
        clientIds.map(async (id) => {
          try {
            const debts: Debt[] = await debtService.getDebtsByClient(id, token!);
            let totalDebt = 0;
            let lastDate: string | null = null;
            let maxDays = 0;

            for (const d of debts) {
              const payments = (d.payments ?? []).reduce(
                (acc, p) => acc + Number(p.paymentMount ?? 0),
                0
              );
              const remaining = Number(d.mount ?? 0) - payments;
              if (remaining > 0) {
                totalDebt += remaining;

                const modif = d.modification_date || d.modification || d.debt_date;
                if (!lastDate || new Date(modif) > new Date(lastDate)) lastDate = modif;

                const days = getDiasDeuda(d.debt_date, modif);
                if (days > maxDays) maxDays = days;
              }
            }
            return [
              id,
              {
                total: totalDebt,
                lastModified: lastDate,
                maxDays,
              },
            ] as const;
          } catch {
            return [id, { total: 0, lastModified: null, maxDays: 0 }] as const;
          }
        })
      );
      return Object.fromEntries(results);
    },
  });
}
