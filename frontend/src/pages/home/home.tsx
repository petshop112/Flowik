import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../features/auth/authSlice';
import { useDebtDashboardTotals } from '../../hooks/useDebtDashboardTotals';
import { useDebtChartData } from '../../hooks/useDebtChartData';
import { useGetAllProducts } from '../../hooks/useProducts';
import { getStockStatus, getStockColor } from '../../utils/product';
import { Link } from 'react-router-dom';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useGetAllClients } from '../../hooks/useClient';
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

const legendLabels: Record<string, string> = {
  newDebts: 'Deudas nuevas',
  oldDebts: 'Deudas antiguas',
  paidDebts: 'Deudas cobradas',
};

const renderCustomLegend = (props: any) => {
  const payload = props.payload ?? [];
  return (
    <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
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
          {legendLabels[entry.value as string] || entry.value}
        </span>
      ))}
    </div>
  );
};

const Home = () => {
  // Data hooks
  const userId = Number(localStorage.getItem('userId'));
  const { data: clients = [], isLoading: isLoadingClients } = useGetAllClients(userId);
  const { data: products = [], isLoading, error } = useGetAllProducts();
  const productsWithMostStock = [...products]
    .filter((product) => product.isActive)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const activeProduct =
    productsWithMostStock.find((product) => product.id === selectedProductId) ||
    productsWithMostStock[0];
  const productsWithLowestStock = [...products]
    .filter(
      (product) =>
        getStockStatus(product.amount) === 'critical' || getStockStatus(product.amount) === 'low'
    )
    .sort((a, b) => a.amount - b.amount)
    .slice(0, 10);

  const formatYAxis = (value: number) => `${value / 1000}k`;

  const { token } = useSelector(selectAuth);
  const { data: debtDashboardTotals, isLoading: isLoadingDebtTotals } = useDebtDashboardTotals(
    userId,
    token
  );
  const { chartData, terms, activeTerm, setActiveTerm } = useDebtChartData(
    debtDashboardTotals?.clientsRaw ?? []
  );
  const maxStock = Math.max(...productsWithMostStock.map((product) => product.amount), 1);
  const getCustomTicks = () => {
    if (maxStock <= 20) return [0, 5, 10, 15, 20].filter((tick) => tick <= maxStock + 2);
    if (maxStock <= 60) return [0, 15, 30, 45, 60].filter((tick) => tick <= maxStock + 5);
    return [0, maxStock];
  };

  const navigate = useNavigate();

  const shouldShowFullEmptyState =
    !isLoadingClients && !isLoadingDebtTotals && clients.length === 0;

  return (
    <div className="bg-custom-mist text-foreground min-h-screen space-y-6 p-8">
      <div className="grid grid-cols-3 gap-6">
        {/* COLUMN 1 */}
        <div className="flex flex-col gap-4">
          {/* Total debt Card */}
          <Link to="/clients">
            {isLoadingClients || isLoadingDebtTotals ? (
              <div className="dark:bg-card flex flex-col items-center justify-center rounded-xl border border-[#9cb7fc] bg-white p-6 opacity-80 shadow">
                <span className="text-primary mb-1 text-xl font-semibold text-[#042D95]">
                  Deuda de clientes
                </span>
                <span className="mb-2 text-xs text-[#6b7280]">Cargando...</span>
              </div>
            ) : shouldShowFullEmptyState ? (
              <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-[#9cb7fc] bg-white p-6 text-center opacity-80 shadow">
                <span className="text-primary mb-1 text-xl font-semibold text-[#042D95]">
                  Deuda de clientes
                </span>
                <span className="mb-2 text-xs text-[#6b7280]">
                  El total se actualizará automáticamente al cargar operaciones.
                </span>
                <div className="mt-4 flex flex-col items-center justify-center">
                  <span className="text-lg font-semibold text-gray-400">Sin datos disponibles</span>
                  <span className="mt-2 text-center text-sm text-slate-400">
                    Acá puedes ver el total pendiente y su desglose.
                  </span>
                  <button
                    className="mt-4 rounded bg-[#5685FA] px-4 py-2 font-semibold text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/clients');
                    }}
                  >
                    Agregar primer cliente
                  </button>
                </div>
              </div>
            ) : (
              <div className="dark:bg-card flex flex-col rounded-xl border border-[#9cb7fc] bg-white p-6 shadow">
                <span className="text-primary mb-1 text-xl font-semibold text-[#042D95]">
                  Deuda de clientes
                </span>
                <span className="mb-2 text-xs text-[#6b7280]">Suma de saldos pendientes</span>
                <div className="mt-4 flex items-center">
                  <CurrencyDollarIcon className="mr-2 h-9 w-9 text-[#82D8E0]" />
                  <span className="text-4xl font-semibold text-[#042D95]">
                    {debtDashboardTotals?.totalOutstanding?.toLocaleString('es-AR') ?? 0}
                  </span>
                </div>
              </div>
            )}
          </Link>
          {/* Debt detail with numbers */}
          {!shouldShowFullEmptyState && (
            <Link to="/clients">
              <div className="dark:bg-card flex flex-col rounded-xl border border-[#9cb7fc] bg-white px-6 py-4 shadow">
                <ul className="space-y-3 text-[1rem] font-medium">
                  <li className="flex items-center gap-2 text-[#042D95]">
                    <span className="inline-block h-3 w-3 rounded bg-[#82D8E0]" />
                    Deudas nuevas
                    <span className="ml-auto text-2xl font-semibold text-[#048995]">
                      $
                      {isLoadingDebtTotals
                        ? '...'
                        : debtDashboardTotals?.totalNew?.toLocaleString('es-AR')}
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-[#042D95]">
                    <span className="inline-block h-3 w-3 rounded bg-[#FE9B38]" />
                    Deudas antiguas
                    <span className="ml-auto text-2xl font-semibold text-[#048995]">
                      $
                      {isLoadingDebtTotals
                        ? '...'
                        : debtDashboardTotals?.totalOld?.toLocaleString('es-AR')}
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-[#042D95]">
                    <span className="inline-block h-3 w-3 rounded bg-[#5685FA]" />
                    Deudas cobradas
                    <span className="text-[#048995]] ml-auto text-2xl font-semibold text-[#048995]">
                      $
                      {isLoadingDebtTotals
                        ? '...'
                        : debtDashboardTotals?.totalPaid?.toLocaleString('es-AR')}
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-[#C60633]">
                    Déficit
                    <span className="ml-auto text-2xl font-semibold text-[#C60633]">
                      $
                      {isLoadingDebtTotals
                        ? '...'
                        : debtDashboardTotals
                          ? debtDashboardTotals.balance.toLocaleString('es-AR', {
                              maximumFractionDigits: 2,
                            })
                          : '...'}
                    </span>
                  </li>
                </ul>
              </div>
            </Link>
          )}
        </div>

        <div className="dark:bg-card col-span-2 flex min-h-[330px] flex-col rounded-xl border border-[#82D8E0] bg-white p-4 shadow">
          {shouldShowFullEmptyState ? (
            <div className="flex h-full flex-col items-center justify-center py-12">
              <ChartBarIcon className="mb-4 h-14 w-14 text-[#E6E6E6]" />
              <span className="text-lg font-bold text-[#BABABA]">
                Aún no hay datos para mostrar el balance.
              </span>
              <span className="mt-1 text-base text-[#C5C8D6]">
                Todavía no hay registros de deudas.
              </span>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12">
              <span className="text-primary flex justify-center text-3xl font-semibold text-[#048995]">
                <span className="mr-1 flex items-center">
                  <CurrencyDollarIcon className="h-10 w-10 text-[#82D8E0]" />
                </span>
                Balance de deuda por cuatrimestre
              </span>
              <ChartBarIcon className="mb-4 h-14 w-14 text-[#E6E6E6]" />
              <span className="text-lg font-bold text-[#BABABA]">
                Aún no hay datos para mostrar el balance.
              </span>
              <span className="mt-1 text-base text-[#C5C8D6]">
                Todavía no hay registros de deudas.
              </span>
              <button
                onClick={() => navigate('/clients')}
                className="mt-5 rounded-md bg-[#5685FA] px-5 py-2 font-semibold text-white transition-colors hover:bg-[#2563eb]"
              >
                Ir a clientes
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-primary flex justify-center text-3xl font-semibold text-[#048995]">
                  <span className="mr-1 flex items-center">
                    <CurrencyDollarIcon className="h-10 w-10 text-[#82D8E0]" />
                  </span>
                  Balance de deuda por cuatrimestre
                </span>
                <div className="relative w-44">
                  <select
                    className="w-full appearance-none rounded border border-[#5685FA] bg-white px-2 py-1 pr-7 text-xs"
                    value={activeTerm}
                    onChange={(e) => setActiveTerm(Number(e.target.value))}
                  >
                    {terms.map((term) => (
                      <option key={term.value} value={term.value}>
                        {term.label}
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
                      dataKey="newDebts"
                      stackId="a"
                      fill="#82D8E0"
                      barSize={40}
                      radius={[2, 2, 0, 0]}
                    />
                    <Bar
                      dataKey="oldDebts"
                      stackId="a"
                      fill="#FE9B38"
                      barSize={40}
                      radius={[2, 2, 0, 0]}
                    />
                    <Bar dataKey="paidDebts" fill="#5685FA" barSize={40} radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <span className="mt-2 ml-2 text-xs text-[#999999]">
                El gráfico muestra la evolución mensual de deudas agrupada por cuatrimestres.
              </span>
            </>
          )}
        </div>
      </div>

      {/* Low Stock Products */}
      <div className="grid grid-cols-2 gap-6">
        {/* Product chart: most stock */}
        <div className="md:col-span-1">
          <div className="dark:bg-card flex min-h-[360px] flex-col gap-2 rounded-2xl border border-[#5685FA] bg-white p-6 shadow">
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
            {productsWithMostStock.length === 0 ? (
              <div className="flex flex-col items-center py-14">
                <ShoppingBagIcon className="mb-4 h-14 w-14 text-[#E6E6E6]" />
                <span className="text-center text-lg font-bold text-[#BABABA]">
                  Aún no hay productos registrados
                </span>
                <span className="mt-1 text-center text-base text-[#C5C8D6]">
                  Registra productos para verlos acá.
                </span>
                <button
                  onClick={() => navigate('/products')}
                  className="mt-5 rounded-md bg-[#5685FA] px-5 py-2 font-semibold text-white transition-colors hover:bg-[#2563eb]"
                >
                  Ir a productos
                </button>
              </div>
            ) : (
              <>
                <div style={{ width: '100%', height: 329 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={productsWithMostStock}
                      layout="vertical"
                      margin={{ top: 10, right: 50, left: 85, bottom: 0 }}
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
                        {productsWithMostStock.map((entry) => (
                          <Cell
                            key={`cell-${entry.id}`}
                            fill={
                              activeProduct && entry.id === activeProduct.id ? '#2563eb' : '#BBD7FF'
                            }
                            cursor="pointer"
                            onClick={() => setSelectedProductId(entry.id)}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <span className="mt-2 ml-2 text-xs text-[#999999]">
                  El gráfico muestra los 7 productos con mayor stock actualmente.
                </span>
                {/* Table with product details for the most stock product */}
                {activeProduct && (
                  <div className="mt-2 w-full overflow-hidden rounded-xl border border-[#3056d3] bg-white shadow-sm">
                    <table className="w-full">
                      <thead className="bg-[#f8fbff]">
                        <tr>
                          <th
                            colSpan={4}
                            className="border-b border-[#3056d3] px-6 py-2 text-left text-lg font-semibold text-[#3056d3]"
                          >
                            {activeProduct.name}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        <tr>
                          <td className="px-4 py-4 text-sm font-medium">Unidades en stock</td>
                          <td className="px-4 py-4 text-2xl font-bold">{activeProduct.amount}</td>
                          <td className="px-4 py-4 text-sm">Precio de venta</td>
                          <td className="px-4 py-4 text-2xl font-bold">
                            ${activeProduct.sellPrice}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {/* Lowest Stock products */}
        <div className="dark:bg-card flex min-h-full flex-col rounded-2xl border border-[#5685FA] bg-white p-6 shadow">
          <div className="mb-3 flex items-center gap-2 text-2xl font-semibold text-[#042D95]">
            <img
              src="/icons/sidebar/productos.svg"
              className="shrink-0 text-current group-hover:text-current"
              alt=""
            />
            Stock Bajo
          </div>
          {productsWithLowestStock.length === 0 ? (
            <div className="flex flex-col items-center py-14">
              <ShoppingBagIcon className="mb-4 h-14 w-14 text-[#E6E6E6]" />
              <span className="text-center text-lg font-bold text-[#BABABA]">
                Aún no has agregado productos
              </span>
              <button
                onClick={() => navigate('/products')}
                className="mt-5 rounded-md bg-[#5685FA] px-5 py-2 text-white transition-colors hover:bg-[#2563eb]"
              >
                Agrega Productos
              </button>
            </div>
          ) : (
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
                    {productsWithLowestStock.map((item, i) => (
                      <tr key={i} className="transition hover:bg-gray-50">
                        <td className="max-w-[220px] truncate px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2">
                          {typeof item.amount === 'number' ? item.amount : '-'}
                        </td>
                        <td className="px-2 py-2 text-center">
                          <span
                            className={`inline-block h-4 w-4 rounded-full ${getStockColor(getStockStatus(item.amount))}`}
                            title="Stock bajo"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
