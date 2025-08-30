import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../features/auth/authSlice';
import { useDebtDashboardTotals } from '../../hooks/useDebtDashboardTotals';
import { useDebtChartData } from '../../hooks/useDebtChartData';
import { useGetAllProducts } from '../../hooks/useProducts';
import { getStockStatus, getStockColor } from '../../utils/product';
import { Link } from 'react-router-dom';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const legendNames: Record<string, string> = {
  deudasNuevas: 'Deudas Nuevas',
  deudasAntiguas: 'Deudas Antiguas',
  deudasCobros: 'Deudas Cobradas',
};

const renderCustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        marginTop: 8,
      }}
    >
      {payload.map((entry: any) => (
        <span
          key={entry.value}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontFamily: "'Albert Sans', sans-serif",
            color: '#999999',
            fontWeight: 400,
            fontSize: 16,
          }}
        >
          <span
            style={{
              width: 16,
              height: 8,
              display: 'inline-block',
              background: entry.color,
              marginRight: 4,
              borderRadius: 2,
            }}
          />
          {legendNames[entry.value] || entry.value}
        </span>
      ))}
    </div>
  );
};

const Home = () => {
  // Productos desde el backend
  const { data: products = [], isLoading, error } = useGetAllProducts();

  // Top 10 productos con más stock y activos
  const topStockData = [...products]
    .filter((p) => p.isActive)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);

  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const activeProd = topStockData.find((p) => p.id === selectedProductId) || topStockData[0];

  // Productos con menos stock (stock bajo)
  const topStockBajo = [...products]
    .filter((p) => getStockStatus(p.amount) === 'critical' || getStockStatus(p.amount) === 'low')
    .sort((a, b) => a.amount - b.amount)
    .slice(0, 10);

  const formatYAxis = (value: number) => {
    return `${value / 1000}k`;
  };

  const id_user = Number(localStorage.getItem('userId'));
  const { token } = useSelector(selectAuth);
  const { data: debtTotals, isLoading: loadingDebtTotals } = useDebtDashboardTotals(id_user, token);
  const { chartData, cuatrimestres, cuatrimestreActivo, setCuatrimestreActivo } = useDebtChartData(
    debtTotals?.clientsRaw ?? []
  );

  const maxStock = Math.max(...topStockData.map((p) => p.amount), 1);

  const getCustomTicks = () => {
    // Si el máximo es pequeño (ej: 11), pon los ticks distribuidos cada 2 o 5 unidades.
    if (maxStock <= 20) {
      return [0, 5, 10, 15, 20].filter((t) => t <= maxStock + 2);
    }
    // Si el máximo es mediano, espaciado de 10 en 10:
    if (maxStock <= 60) return [0, 15, 30, 45, 60].filter((t) => t <= maxStock + 5);
    // Si es grande, pon 0 y el máximo nada más:
    return [0, maxStock];
  };

  return (
    <div className="bg-custom-mist text-foreground min-h-screen space-y-6 p-8">
      <div className="grid grid-cols-3 gap-6">
        {/* COLUMNA 1 */}
        <div className="flex flex-col gap-4">
          {/* Cartita DEUDA TOTAAL */}
          <Link to="/clients">
            <div className="dark:bg-card flex flex-col rounded-xl border border-[#9cb7fc] bg-white p-6 shadow">
              <span className="text-primary mb-1 text-xl font-semibold text-[#042D95]">
                Deuda de Clientes
              </span>
              <span className="mb-2 text-xs text-[#6b7280]">Suma de saldos pendientes</span>
              <div className="mt-4 flex">
                <CurrencyDollarIcon className="mr-2 h-9 w-9 text-[#82D8E0]" />
                <span className="text-4xl font-semibold text-[#042D95]">
                  {loadingDebtTotals
                    ? '...'
                    : debtTotals?.totalOutstanding?.toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          </Link>
          {/* Cartita detalle NUMERICO DE LA DEUDA DEL CUATRIMESTRE */}
          <Link to="/clients">
            <div className="dark:bg-card flex flex-col rounded-xl border border-[#9cb7fc] bg-white px-6 py-4 shadow">
              <ul className="space-y-3 text-[1rem] font-medium">
                <li className="flex items-center gap-2 text-[#042D95]">
                  <span className="inline-block h-3 w-3 rounded bg-[#82D8E0]" />
                  Deudas nuevas
                  <span className="ml-auto text-2xl font-semibold text-[#048995]">
                    {' '}
                    ${loadingDebtTotals ? '...' : debtTotals?.totalNew?.toLocaleString('es-AR')}
                  </span>
                </li>
                <li className="flex items-center gap-2 text-[#042D95]">
                  <span className="inline-block h-3 w-3 rounded bg-[#FE9B38]" />
                  Deudas antiguas
                  <span className="ml-auto text-2xl font-semibold text-[#048995]">
                    ${loadingDebtTotals ? '...' : debtTotals?.totalOld?.toLocaleString('es-AR')}
                  </span>
                </li>
                <li className="flex items-center gap-2 text-[#042D95]">
                  <span className="inline-block h-3 w-3 rounded bg-[#5685FA]" />
                  Deudas Cobradas
                  <span className="text-[#048995]] ml-auto text-2xl font-semibold text-[#048995]">
                    ${loadingDebtTotals ? '...' : debtTotals?.totalPaid?.toLocaleString('es-AR')}
                  </span>
                </li>
                <li className="flex items-center gap-2 text-[#042D95]">
                  Déficit
                  <span className="ml-auto text-2xl font-semibold text-[#048995]">
                    $
                    {loadingDebtTotals
                      ? '...'
                      : debtTotals
                        ? debtTotals.balance.toLocaleString('es-AR', { maximumFractionDigits: 2 })
                        : '...'}
                  </span>
                </li>
              </ul>
            </div>
          </Link>
        </div>

        <div className="dark:bg-card col-span-2 flex flex-col rounded-xl border border-[#82D8E0] bg-white p-4 shadow">
          <div className="flex items-center justify-between">
            <span className="text-primary flex justify-center text-3xl font-semibold text-[#048995]">
              <span className="mr-1 flex items-center">
                <CurrencyDollarIcon className="h-10 w-10 text-[#82D8E0]" />
              </span>
              Balance de deuda
            </span>
            <div className="relative w-44">
              <select
                className="w-full appearance-none rounded border border-[#5685FA] bg-white px-2 py-1 pr-7 text-xs"
                value={cuatrimestreActivo}
                onChange={(e) => setCuatrimestreActivo(Number(e.target.value))}
              >
                {cuatrimestres.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M6 8L10 12L14 8"
                    stroke="#048995"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
          <div className="mt-6 mb-2 h-60 px-2">
            {/* barra recharts */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={400}
                data={chartData}
                margin={{
                  top: 0,
                  right: 0,
                  left: 20,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 2" vertical={false} stroke="#00000040" />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={formatYAxis}
                  tick={{ fontWeight: 400 }}
                  axisLine={false}
                  width={40}
                />
                <Tooltip />
                <Legend content={renderCustomLegend} />
                <Bar
                  dataKey="deudasNuevas"
                  stackId="a"
                  fill="#82D8E0"
                  barSize={40}
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="deudasAntiguas"
                  stackId="a"
                  fill="#FE9B38"
                  barSize={40}
                  radius={[2, 2, 0, 0]}
                />
                <Bar dataKey="deudasCobros" fill="#5685FA" barSize={40} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <span className="mt-2 ml-2 text-xs text-[#999999]">
            Gráfico muestra unidades de productos más vendidos en los últimos 60 días
          </span>
        </div>
      </div>

      {/* Productos y stock bajo */}
      <div className="grid grid-cols-2 gap-6">
        {/* Movimiento de producto */}
        <div className="md:col-span-1">
          <div className="dark:bg-card flex flex-col gap-2 rounded-2xl border border-[#5685FA] bg-white p-6 shadow">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center text-2xl font-semibold text-[#042D95]">
                <img
                  src="/icons/sidebar/productos.svg"
                  className="mr-2 shrink-0 text-current group-hover:text-current"
                  alt=""
                />
                Productos con más stock
              </span>
            </div>
            {/* GRÁFICO con Recharts */}
            <div style={{ width: '100%', height: 329 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topStockData}
                  layout="vertical"
                  margin={{ top: 10, right: 27, left: 85, bottom: 0 }}
                  barCategoryGap={16}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} />
                  <XAxis
                    type="number"
                    domain={[0, Math.max(maxStock, 1)]}
                    ticks={getCustomTicks()}
                    axisLine={false}
                    tickLine={false}
                    tick={({ x, y, payload }) => (
                      <text
                        x={x}
                        y={y - 300}
                        fill="#94A3B8"
                        fontSize={15}
                        textAnchor="middle"
                        alignmentBaseline="middle"
                      >
                        {payload.value} uds
                      </text>
                    )}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    width={130}
                    tick={({ y, payload }) => {
                      const truncate = (text: string, max: number) =>
                        text.length > max ? text.slice(0, max - 3) + '...' : text;
                      return (
                        <text
                          x={12}
                          y={y + 6}
                          fill="#3056d3"
                          fontWeight="bold"
                          fontSize={14}
                          textAnchor="start"
                          alignmentBaseline="middle"
                        >
                          {truncate(payload.value, 28)}
                        </text>
                      );
                    }}
                  />
                  <Tooltip
                    formatter={(val: number) => [`${val} uds`, 'Stock']}
                    labelFormatter={(label: string) => `Producto: ${label}`}
                    contentStyle={{ fontSize: 16 }}
                  />
                  <Bar
                    dataKey="amount"
                    fill="#BBD7FF"
                    barSize={18}
                    radius={[5, 5, 5, 5]}
                    label={{
                      position: 'right',
                      fill: '#3056d3',
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    {topStockData.map((entry) => (
                      <Cell
                        key={`cell-${entry.id}`}
                        fill={activeProd && entry.id === activeProd.id ? '#2563eb' : '#BBD7FF'}
                        cursor="pointer"
                        onClick={() => setSelectedProductId(entry.id)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <span className="mt-2 ml-2 text-xs text-[#999999]">
              El gráfico muestra los 10 productos con mayor stock actualmente.
            </span>
          </div>

          {/* Cuadro detalle producto */}
          {activeProd && (
            <div className="mt-2 w-full overflow-hidden rounded-xl border border-[#3056d3] bg-white shadow-sm">
              <table className="w-full">
                <thead className="bg-[#f8fbff]">
                  <tr>
                    <th
                      colSpan={4}
                      className="border-b border-[#3056d3] px-6 py-2 text-left text-lg font-semibold text-[#3056d3]"
                    >
                      {activeProd.name}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr>
                    <td className="px-4 py-4 text-sm font-medium">Unidades en stock</td>
                    <td className="px-4 py-4 text-2xl font-bold">{activeProd.amount}</td>
                    <td className="px-4 py-4 text-sm">Precio de venta</td>
                    <td className="px-4 py-4 text-2xl font-bold">${activeProd.sellPrice}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stock bajo */}
        <div className="dark:bg-card flex min-h-full flex-col rounded-2xl border border-[#5685FA] bg-white p-6 shadow">
          <div className="mb-3 flex items-center gap-2 text-2xl font-semibold text-[#042D95]">
            <img
              src="/icons/sidebar/productos.svg"
              className="shrink-0 text-current group-hover:text-current"
              alt=""
            />
            Stock Bajo
          </div>
          <div className="overflow-x-auto rounded-xl border border-[#CDDBFE]">
            {isLoading ? (
              <div className="py-8 text-center text-lg font-semibold text-blue-400">
                Cargando productos de bajo stock...
              </div>
            ) : error ? (
              <div className="py-8 text-center font-semibold text-red-500">
                Error al cargar stock bajo
              </div>
            ) : (
              <table className="w-full overflow-hidden rounded-xl border border-gray-200 text-base">
                <thead className="bg-polar-mist">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-[#3056d3]">
                      Nombre producto
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-[#3056d3]">
                      Stock unitario
                    </th>
                    <th className="px-2 py-2 text-center">
                      <span
                        className="inline-flex items-center"
                        title="Producto sin stock disponible"
                      >
                        <ExclamationCircleIcon className="h-6 w-6 text-[#0F172A]" />
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white text-gray-900">
                  {topStockBajo.map((item, i) => (
                    <tr key={i} className="transition hover:bg-gray-50">
                      <td className="max-w-[220px] truncate px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">
                        {typeof item.amount === 'number' ? item.amount : '-'}
                      </td>
                      <td className="px-2 py-2 text-center">
                        <td className="px-2 py-2 text-center">
                          <span
                            className={`inline-block h-4 w-4 rounded-full ${getStockColor(getStockStatus(item.amount))}`}
                            title="Stock bajo"
                          />
                        </td>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
