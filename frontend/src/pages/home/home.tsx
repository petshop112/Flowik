// src/pages/home/home.tsx

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

// Mock dataaa
const deudaData = [
  { mes: 'Enero', 'Deudas nuevas': 69950, 'Deudas antiguas': 100715, 'Deudas cobros': 42715 },
  { mes: 'Febrero', 'Deudas nuevas': 89950, 'Deudas antiguas': 110715, 'Deudas cobros': 32715 },
  { mes: 'Marzo', 'Deudas nuevas': 49950, 'Deudas antiguas': 40715, 'Deudas cobros': 62715 },
  { mes: 'Abril', 'Deudas nuevas': 29950, 'Deudas antiguas': 150715, 'Deudas cobros': 22715 },
];

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
const coloresDeuda = {
  'Deudas nuevas': '#06b6d4',
  'Deudas antiguas': '#fb923c',
  'Deudas cobros': '#6366f1',
};
const productosData = [
  { producto: 'Pedigree Adulto Razas Pequeñas 3kg', ventas: 45 },
  { producto: 'Eukanuba Cachorro', ventas: 40 },
  { producto: 'Cat chow Grow...', ventas: 35 },
  { producto: 'Whiskas Gatitos', ventas: 30 },
  { producto: 'Vitalcanino Raz...', ventas: 25 },
  { producto: 'Pro Carne y Lec...', ventas: 20 },
  { producto: 'Whiskas Razas...', ventas: 15 },
];

const stockBajoData = [
  { producto: 'Pedigree Adulto Razas Pequeñas 3kg', stock: 0.0 },
  { producto: 'Eukanuba Cachorro', stock: 0.0 },
  { producto: 'Cat chow Grow...', stock: 0.0 },
  { producto: 'Otro más', stock: 0.0 },
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
            color: '#999999', // Cambia a tu color favorito si deseas
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
  const formatYAxis = (value: number) => {
    return `${value / 1000}k`;
  };

  return (
    <div className="bg-custom-mist text-foreground min-h-screen space-y-6 p-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* cuadrito de deuda de clientes */}
        <div className="dark:bg-card flex flex-col rounded-xl border border-[#9cb7fc] bg-white p-6 shadow">
          <span className="text-secondary text-sm font-semibold">Deuda de Clientes</span>
          <span className="mt-3 mb-1 text-4xl font-bold">$156.026</span>
          <ul className="mt-4 space-y-1 text-sm">
            <li className="flex items-center">
              <span className="mr-3 inline-block h-3 w-3 rounded bg-cyan-400" /> Deudas nuevas{' '}
              <span className="ml-auto font-semibold text-cyan-600">$69.950</span>
            </li>
            <li className="flex items-center">
              <span className="mr-3 inline-block h-3 w-3 rounded bg-orange-400" /> Deudas antiguas{' '}
              <span className="ml-auto font-semibold text-orange-600">$100.715</span>
            </li>
            <li className="flex items-center">
              <span className="mr-3 inline-block h-3 w-3 rounded bg-indigo-400" /> Deudas cobros{' '}
              <span className="ml-auto font-semibold text-indigo-600">$42.715</span>
            </li>
            <li className="flex items-center">
              <span className="mr-3 inline-block h-3 w-3 rounded bg-green-400" /> Superavit/Deficit{' '}
              <span className="ml-auto font-semibold text-green-600">-$27.235</span>
            </li>
          </ul>
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
              {/* Flecha SVG superpuesta */}
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
          <div className="mt-1 h-56 px-2">
            {/* barra recharts */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Movimiento de producto */}
        <div className="dark:bg-card flex flex-col gap-2 rounded-xl bg-white p-6 shadow md:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-semibold">🛒 Movimiento de producto</span>
            <select className="rounded border px-2 py-1 text-xs">
              <option>Mayor salida</option>
              <option>Menor salida</option>
            </select>
          </div>
          <div className="space-y-2">
            {productosData.map((prod) => (
              <div key={prod.producto} className="flex w-full items-center">
                <span className="w-60 truncate">{prod.producto}</span>
                <div className="relative ml-2 h-3 w-full rounded bg-blue-100">
                  <div
                    className="h-3 rounded bg-blue-500"
                    style={{ width: `${(prod.ventas / 50) * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm">{prod.ventas}</span>
              </div>
            ))}
          </div>
          <span className="text-muted-foreground mt-1 text-xs">
            El gráfico muestra los productos con más movimientos en los últimos 60 días
          </span>
          <div className="text-primary mt-4 border-t pt-2 text-xs">
            <div className="font-semibold">Pedigree Adulto Razas Pequeñas 3kg</div>
            <div className="mt-1 flex gap-4">
              <span>
                Unidades vendidas <b>45</b>
              </span>
              <span>
                Disponibles en stock (uds) <b>8</b>
              </span>
            </div>
          </div>
        </div>

        {/* Stock bajo */}
        <div className="dark:bg-card flex flex-col rounded-xl bg-white p-6 shadow">
          <span className="mb-3 block font-semibold">⚠️ Stock Bajo</span>
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left">Nombre producto</th>
                <th className="px-2 py-1 text-left">Stock unitario</th>
              </tr>
            </thead>
            <tbody>
              {stockBajoData.map((row, i) => (
                <tr key={i}>
                  <td className="truncate px-2 py-1">{row.producto}</td>
                  <td className="flex items-center gap-3 px-2 py-1">
                    {row.stock.toFixed(3)}
                    <span className="ml-auto block h-2 w-2 rounded-full bg-pink-500" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Home;
