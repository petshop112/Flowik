import { useState, useMemo } from 'react';
import type { Client } from '../types/clients';

const monthsArray = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const termsArray = [
  { label: '1º Cuatrimestre', value: 0, months: [0, 1, 2, 3] },
  { label: '2º Cuatrimestre', value: 1, months: [4, 5, 6, 7] },
  { label: '3º Cuatrimestre', value: 2, months: [8, 9, 10, 11] },
];

export type DebtChartDataItem = {
  name: string;
  newDebts: number;
  oldDebts: number;
  paidDebts: number;
};

export function useDebtChartData(clients: Client[], year = new Date().getFullYear()) {
  const currentMonth = new Date().getMonth();
  const initialTerm = Math.floor(currentMonth / 4);
  const [activeTerm, setActiveTerm] = useState(initialTerm);

  const chartData: DebtChartDataItem[] = useMemo(() => {
    const base: DebtChartDataItem[] = monthsArray.map((name) => ({
      name,
      newDebts: 0,
      oldDebts: 0,
      paidDebts: 0,
    }));

    clients.forEach((cli) => {
      (cli.debts ?? []).forEach((debt) => {
        const debtDate = new Date(debt.debt_date);
        if (debtDate.getFullYear() !== year) return;

        base[debtDate.getMonth()].newDebts += debt.mount ?? 0;

        (debt.payments ?? []).forEach((pay) => {
          const payDate = new Date(pay.datePayment);
          if (payDate.getFullYear() === year)
            base[payDate.getMonth()].paidDebts += pay.paymentMount ?? 0;
        });
      });
    });

    base.forEach((row, idx) => {
      let oldDebtsSum = 0;
      clients.forEach((cli) => {
        (cli.debts ?? []).forEach((debt) => {
          const debtDate = new Date(debt.debt_date);
          if (debtDate.getFullYear() !== year) return;
          if (debtDate.getMonth() < idx) {
            const payments = (debt.payments ?? [])
              .filter((p) => {
                const pd = new Date(p.datePayment);
                return pd.getFullYear() === year && pd.getMonth() < idx;
              })
              .reduce((acc, p) => acc + (p.paymentMount ?? 0), 0);
            const pending = (debt.mount ?? 0) - payments;
            if (pending > 0) oldDebtsSum += pending;
          }
        });
      });
      row.oldDebts = oldDebtsSum;
    });

    return base;
  }, [clients, year]);

  const selectedTerm = termsArray[activeTerm];
  const filteredData = selectedTerm
    ? selectedTerm.months.map((i) => chartData[i])
    : chartData.slice(0, 4);

  return {
    chartData: filteredData,
    terms: termsArray,
    activeTerm,
    setActiveTerm,
  };
}
