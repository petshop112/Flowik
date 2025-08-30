import { NavLink } from 'react-router-dom';
type SidebarProps = { className?: string };

const baseItem =
  'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors';
const inactive = 'text-gray-700 hover:bg-gray-100 hover:text-gray-900';
const active = 'bg-[#CDDBFE] text-blue-700 ring-1 ring-inset ring-blue-200';

export default function Sidebar({ className = '' }: SidebarProps) {
  return (
    <aside
      className={`h-full w-full border-r border-gray-200 bg-white px-[40px] py-5 font-[var(--Font-family-Albert-Sans)] ${className}`}
    >
      <nav className="flex flex-col gap-4">
        <div>
          <img className="mt-3 mb-20" src="/icons/Logo (1).svg" alt="" />
        </div>
        <NavLink to="/" className={({ isActive }) => `${baseItem} ${isActive ? active : inactive}`}>
          <img
            src="/icons/sidebar/Home.svg"
            className="shrink-0 text-current group-hover:text-current"
            alt=""
          />

          <span className="truncate text-[#063CC6]">Panel Principal</span>
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) => `${baseItem} ${isActive ? active : inactive}`}
        >
          <img
            src="/icons/sidebar/productos.svg"
            className="shrink-0 text-current group-hover:text-current"
            alt=""
          />
          <span className="truncate text-[#063CC6]">Productos</span>
        </NavLink>

        <NavLink
          to="/clients"
          className={({ isActive }) => `${baseItem} ${isActive ? active : inactive}`}
        >
          <img
            src="/icons/sidebar/clientes.svg"
            className="shrink-0 text-current group-hover:text-current"
            alt=""
          />

          <span className="truncate text-[#063CC6]">Clientes</span>
        </NavLink>

        <NavLink
          to="/providers"
          className={({ isActive }) => `${baseItem} ${isActive ? active : inactive}`}
        >
          <img
            src="/icons/sidebar/provedores.svg"
            className="shrink-0 text-current group-hover:text-current"
            alt=""
          />

          <span className="truncate text-[#063CC6]">Proveedores</span>
        </NavLink>
      </nav>
    </aside>
  );
}
