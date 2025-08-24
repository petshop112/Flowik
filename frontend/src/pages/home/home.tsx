import { useState } from 'react';

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
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const data = [
  {
    name: 'Enero',
    deudasNuevas: 75000,
    deudasAntiguas: 40000,
    deudasCobros: 95000,
  },
  {
    name: 'Febrero',
    deudasNuevas: 90000,
    deudasAntiguas: 85000,
    deudasCobros: 120000,
  },
  {
    name: 'Marzo',
    deudasNuevas: 130000,
    deudasAntiguas: 0,
    deudasCobros: 100000,
  },
  {
    name: 'Abril',
    deudasNuevas: 10000,
    deudasAntiguas: 35000,
    deudasCobros: 40000,
  },
];

const productosData = [
  { producto: 'Pedigree Adulto Razas Pequeñas 3kg', ventas: 45, stock: 2 },
  { producto: 'Eukanuba Cachorro', ventas: 40, stock: 500 },
  { producto: 'Cat chow Grow', ventas: 35, stock: 5 },
  { producto: 'Whiskas Gatitos', ventas: 30, stock: 5000 },
  { producto: 'Vitalcanino Raza', ventas: 25, stock: 30 },
  { producto: 'Pro Carne y Leche', ventas: 20, stock: 3 },
  { producto: 'Whiskas Razas grandes', ventas: 15, stock: 300 },
  { producto: 'ocho', ventas: 40, stock: 200 },
  { producto: 'nueve', ventas: 2, stock: 2 },
];

const stockBajoData = [
  { producto: 'Pedigree Adulto Razas Pequeñas 3kg', stock: 0.0 },
  { producto: 'Eukanuba Cachorro', stock: 1.0 },
  { producto: 'Cat chow Grow', stock: 2.0 },
  { producto: 'Otro más 4', stock: 2.0 },
  { producto: 'Otro más 5', stock: 3.0 },
  { producto: 'Otro más 6', stock: 3.0 },
  { producto: 'Otro más 7', stock: 3.0 },
  { producto: 'Otro más 8', stock: 4.0 },
  { producto: 'Otro más 9', stock: 5.0 },
  { producto: 'Otro más 10', stock: 5.0 },
  { producto: 'Otro más 11', stock: 5.0 },
  { producto: 'Otro más 12', stock: 900.0 },
  { producto: 'Otro más 13', stock: 600.0 },
];

const legendNames: Record<string, string> = {
  deudasNuevas: 'Deudas Nuevas',
  deudasAntiguas: 'Deudas Antiguas',
  deudasCobros: 'Deudas Cobros',
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
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [sellingFilter, setSellingFilter] = useState<'mayor' | 'menor'>('mayor');

  //ordering the products to render
  const orderedProducts = [...productosData].sort((a, b) =>
    sellingFilter === 'mayor' ? b.ventas - a.ventas : a.ventas - b.ventas
  );

  // filtering data from the db to get the top 7 and top 10 for producto movement and stock
  const topStockBajo = [...stockBajoData].sort((a, b) => a.stock - b.stock).slice(0, 10);

  const topProductosData = orderedProducts.slice(0, 7);

  //selecting products to display under the product rotaion graphic
  const activeProd =
    topProductosData.find((p) => p.producto === selectedProduct) || topProductosData[0];

  const stockActiveProd = stockBajoData.find((s) => s.producto === activeProd.producto);

  const formatYAxis = (value: number) => {
    return `${value / 1000}k`;
  };
  return (
    <div className="bg-custom-mist text-foreground min-h-screen space-y-6 p-8">
      <div className="grid grid-cols-3 gap-6">
        {/* COLUMNA 1 */}
        <div className="flex flex-col gap-4">
          {/* Cartita DEUDA TOTAAL */}
          <div className="dark:bg-card flex flex-col rounded-xl border border-[#9cb7fc] bg-white p-6 shadow">
            <span className="text-primary mb-1 text-xl font-semibold text-[#042D95]">
              Deuda de Clientes
            </span>
            <span className="mb-2 text-xs text-[#6b7280]">Suma de saldos pendientes</span>
            <div className="mt-4 flex">
              <CurrencyDollarIcon className="mr-2 h-9 w-9 text-[#82D8E0]" />
              <span className="text-4xl font-semibold text-[#042D95]">156.026</span>
            </div>
          </div>
          {/* Cartita detalle NUMERICO DE LA DEUDA DEL CUATRIMESTRE */}
          <div className="dark:bg-card flex flex-col rounded-xl border border-[#9cb7fc] bg-white px-6 py-4 shadow">
            <ul className="space-y-3 text-[1rem] font-medium">
              <li className="flex items-center gap-2 text-[#042D95]">
                <span className="inline-block h-3 w-3 rounded bg-[#82D8E0]" />
                Deudas nuevas
                <span className="ml-auto text-2xl font-semibold text-[#048995]">$69.950</span>
              </li>
              <li className="flex items-center gap-2 text-[#042D95]">
                <span className="inline-block h-3 w-3 rounded bg-[#FE9B38]" />
                Deudas antiguas
                <span className="ml-auto text-2xl font-semibold text-[#048995]">$100.715</span>
              </li>
              <li className="flex items-center gap-2 text-[#042D95]">
                <span className="inline-block h-3 w-3 rounded bg-[#5685FA]" />
                Deudas cobros
                <span className="text-[#048995]] ml-auto text-2xl font-semibold text-[#048995]">
                  $42.715
                </span>
              </li>
              <li className="flex items-center gap-2 text-[#042D95]">
                Superavit/Deficit
                <span className="ml-auto text-2xl font-semibold text-[#048995]">-$27.235</span>
              </li>
            </ul>
          </div>
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
              <select className="w-full appearance-none rounded border border-[#5685FA] bg-white px-2 py-1 pr-7 text-xs">
                <option className="font-bold">1º Cuatrimestre</option>
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
                data={data}
                margin={{
                  top: 0,
                  right: 0,
                  left: 0,
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
                <ShoppingCartIcon className="mr-2 h-7 text-[#5685FA]" />
                Movimiento de producto
              </span>
              <div className="relative w-44">
                <select
                  className="w-full appearance-none rounded border border-[#5685FA] bg-white px-2 py-1 pr-7 text-xs"
                  value={sellingFilter}
                  onChange={(e) => setSellingFilter(e.target.value as 'mayor' | 'menor')}
                >
                  <option value="mayor" className="font-bold">
                    Mayor salida
                  </option>
                  <option value="menor" className="font-bold">
                    Menor salida
                  </option>
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
            {/* GRÁFICO con Recharts */}
            <div style={{ width: '100%', height: 329 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProductosData}
                  layout="vertical"
                  margin={{ top: 8, right: 0, left: 100, bottom: 10 }}
                  barCategoryGap={16}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} />
                  <XAxis
                    type="number"
                    domain={[0, 50]}
                    ticks={[10, 20, 30, 40, 50]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 15, fill: '#94A3B8' }}
                    tickFormatter={(v) => `${v}uds`}
                  />
                  <YAxis
                    dataKey="producto"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    width={130}
                    tick={({ y, payload }) => (
                      <text
                        x={12}
                        y={y + 6}
                        fill="#3056d3"
                        fontWeight="bold"
                        fontSize={12}
                        textAnchor="start"
                        alignmentBaseline="middle"
                      >
                        {payload.value}
                      </text>
                    )}
                  />
                  <Tooltip
                    formatter={(val: number) => [`${val} uds`, 'Ventas']}
                    labelFormatter={(label: string) => `Producto: ${label}`}
                    contentStyle={{ fontSize: 14 }}
                  />
                  <Bar
                    dataKey="ventas"
                    fill={sellingFilter === 'menor' ? '#FDCED9' : '#BBD7FF'}
                    barSize={18}
                    radius={[5, 5, 5, 5]}
                    label={{
                      position: 'right',
                      fill: '#3056d3',
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    {' '}
                    {topProductosData.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={
                          sellingFilter === 'menor'
                            ? entry.producto === activeProd.producto
                              ? '#F87171'
                              : '#FDCED9'
                            : entry.producto === activeProd.producto
                              ? '#2563eb'
                              : '#BBD7FF'
                        }
                        cursor="pointer"
                        onClick={() => setSelectedProduct(entry.producto)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 w-full overflow-hidden rounded-xl border border-[#3056d3] bg-white shadow-sm">
            <table className="w-full">
              <thead className="bg-[#f8fbff]">
                <tr>
                  <th
                    colSpan={4}
                    className="border-b border-[#3056d3] px-6 py-2 text-left text-lg font-semibold text-[#3056d3]"
                  >
                    {activeProd.producto}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr>
                  <td className="px-4 py-4 text-sm font-medium">Unidades vendidas</td>
                  <td className="px-4 py-4 text-2xl font-bold">{activeProd.ventas}</td>
                  <td className="font-mediu px-4 py-4 text-sm">Disponibles en stock (uds)</td>
                  <td className="px-4 py-4 text-2xl font-bold">
                    {stockActiveProd ? stockActiveProd.stock.toFixed(0) : '—'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock bajo */}
        <div className="dark:bg-card flex min-h-full flex-col rounded-2xl border border-[#5685FA] bg-white p-6 shadow">
          <div className="mb-3 flex items-center gap-2 text-2xl font-semibold text-[#042D95]">
            <ShoppingCartIcon className="mr-2 h-7 w-7 text-[#5685FA]" />
            Stock Bajo
          </div>
          <div className="overflow-x-auto">
            <table className="w-full overflow-hidden rounded-xl border border-gray-200 text-base">
              <thead className="bg-polar-mist">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-[#3056d3]">
                    Nombre producto
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-[#3056d3]">Stock unitario</th>
                  <th className="px-2 py-2 text-center">
                    <span
                      className="inline-flex items-center"
                      title="Producto sin stock disponible"
                    >
                      <svg
                        height="20"
                        width="20"
                        className="ml-1 text-[#f82f69]"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <circle cx="12" cy="12" r="8" />
                      </svg>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white text-gray-900">
                {topStockBajo.map((item, i) => (
                  <tr key={i} className="transition hover:bg-gray-50">
                    <td className="max-w-[220px] truncate px-4 py-2">{item.producto}</td>
                    <td className="px-4 py-2">{item.stock.toFixed(3)}</td>
                    <td className="px-2 py-2 text-center">
                      <span
                        className="inline-block h-4 w-4 rounded-full bg-[#f82f69]"
                        title="Stock bajo"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
