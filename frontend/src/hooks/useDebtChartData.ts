import { useState, useMemo } from 'react';
import type { Client } from '../types/clients';

const mesesArray = [
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

const cuatrimestresArray = [
  { label: '1º Cuatrimestre', value: 0, meses: [0, 1, 2, 3] },
  { label: '2º Cuatrimestre', value: 1, meses: [4, 5, 6, 7] },
  { label: '3º Cuatrimestre', value: 2, meses: [8, 9, 10, 11] },
];

export type ChartDataItem = {
  name: string;
  deudasNuevas: number;
  deudasAntiguas: number;
  deudasCobros: number;
};

export function useDebtChartData(clients: Client[], year = new Date().getFullYear()) {
  const mesActual = new Date().getMonth();
  const cuatrimestreInicial = Math.floor(mesActual / 4);
  const [cuatrimestreActivo, setCuatrimestreActivo] = useState(cuatrimestreInicial);

  const chartData: ChartDataItem[] = useMemo(() => {
    const base: ChartDataItem[] = mesesArray.map((name) => ({
      name,
      deudasNuevas: 0,
      deudasAntiguas: 0,
      deudasCobros: 0,
    }));

    clients.forEach((cli) => {
      (cli.debts ?? []).forEach((debt) => {
        const debtDate = new Date(debt.debt_date);
        if (debtDate.getFullYear() !== year) return;

        base[debtDate.getMonth()].deudasNuevas += debt.mount ?? 0;

        (debt.payments ?? []).forEach((pay) => {
          const payDate = new Date(pay.datePayment);
          if (payDate.getFullYear() === year)
            base[payDate.getMonth()].deudasCobros += pay.paymentMount ?? 0;
        });
      });
    });

    base.forEach((row, idx) => {
      let antiguas = 0;
      clients.forEach((cli) => {
        (cli.debts ?? []).forEach((debt) => {
          const debtDate = new Date(debt.debt_date);
          if (debtDate.getFullYear() !== year) return;
          if (debtDate.getMonth() < idx) {
            const pagos = (debt.payments ?? [])
              .filter((p) => {
                const pd = new Date(p.datePayment);
                return pd.getFullYear() === year && pd.getMonth() < idx;
              })
              .reduce((acc, p) => acc + (p.paymentMount ?? 0), 0);
            const pendiente = (debt.mount ?? 0) - pagos;
            if (pendiente > 0) antiguas += pendiente;
          }
        });
      });
      row.deudasAntiguas = antiguas;
    });

    return base;
  }, [clients, year]);

  const cuatri = cuatrimestresArray[cuatrimestreActivo];
  const filteredData = cuatri ? cuatri.meses.map((i) => chartData[i]) : chartData.slice(0, 4);

  return {
    chartData: filteredData,
    cuatrimestres: cuatrimestresArray,
    cuatrimestreActivo,
    setCuatrimestreActivo,
  };
}
