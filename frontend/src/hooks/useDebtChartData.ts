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
  { label: '1º Cuatrimestre', value: 0, meses: [0, 1, 2, 3] }, // Ene-Abr
  { label: '2º Cuatrimestre', value: 1, meses: [4, 5, 6, 7] }, // May-Ago
  { label: '3º Cuatrimestre', value: 2, meses: [8, 9, 10, 11] }, // Sep-Dic
];

export type ChartDataItem = {
  name: string;
  deudasNuevas: number;
  deudasAntiguas: number;
  deudasCobros: number;
};

export function useDebtChartData(clients: Client[], year = new Date().getFullYear()) {
  // Calcula el cuatrimestre actual según el mes del sistema
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

        // Deuda nueva del mes en que se contrajo
        base[debtDate.getMonth()].deudasNuevas += debt.mount ?? 0;

        // Payments (cobros) en el mes correspondiente del pago
        (debt.payments ?? []).forEach((pay) => {
          const payDate = new Date(pay.datePayment); // ← AQUÍ estaba el error!
          if (payDate.getFullYear() === year)
            base[payDate.getMonth()].deudasCobros += pay.paymentMount ?? 0;
        });
      });
    });

    // Calcular deudas antiguas para cada mes
    base.forEach((row, idx) => {
      let antiguas = 0;
      clients.forEach((cli) => {
        (cli.debts ?? []).forEach((debt) => {
          const debtDate = new Date(debt.debt_date);
          if (debtDate.getFullYear() !== year) return;
          if (debtDate.getMonth() < idx) {
            // Pagos hechos antes de este mes
            const pagos = (debt.payments ?? [])
              .filter((p) => {
                const pd = new Date(p.datePayment); // ← AQUÍ estaba el error!
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

  // Filtra los meses según el cuatrimestre seleccionado
  const cuatri = cuatrimestresArray[cuatrimestreActivo];
  const filteredData = cuatri ? cuatri.meses.map((i) => chartData[i]) : chartData.slice(0, 4);

  return {
    chartData: filteredData,
    cuatrimestres: cuatrimestresArray,
    cuatrimestreActivo,
    setCuatrimestreActivo,
  };
}
