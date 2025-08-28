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
    payments?: { paymentMount: number; }[];
    debt_date: string;
    modification_date?: string;
    modificacion?: string;
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
            const results = await Promise.all(clientIds.map(async id => {
                try {
                    const debts: Debt[] = await debtService.getDebtsByClient(id, token!);
                    let deudaTotal = 0;
                    let lastDate: string | null = null;
                    let maxDays = 0;

                    for (const d of debts) {
                        const pagos = (d.payments ?? []).reduce((acc, p) => acc + Number(p.paymentMount ?? 0), 0);
                        const resto = Number(d.mount ?? 0) - pagos;
                        if (resto > 0) {
                            deudaTotal += resto;

                            const modif = d.modification_date || d.modificacion || d.debt_date;
                            if (!lastDate || new Date(modif) > new Date(lastDate)) lastDate = modif;

                            const dias = getDiasDeuda(d.debt_date, modif);
                            if (dias > maxDays) maxDays = dias;
                        }
                    }
                    return [id, {
                        total: deudaTotal,
                        lastModified: lastDate,
                        maxDays,
                    }] as const;
                } catch {
                    return [id, { total: 0, lastModified: null, maxDays: 0 }] as const;
                }
            }));
            return Object.fromEntries(results);
        },
    });
}
