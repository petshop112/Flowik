import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit,
  Bell,
  Trash2,
  Calculator,
  ToggleRight,
  ChevronRight,
  ChevronLeft,
  Check,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  amount: number;
  sellPrice: number;
  weigth: number; // weight está mal escrito, viene así de la base de datos
  buyDate: string;
  expiration: string;
  supplierNames: string[];
}

const initialProducts: Product[] = [
  {
    id: 125,
    name: "Whiskas Gatitos Pollo",
    category: "Gato",
    amount: 3,
    sellPrice: 670,
    weigth: 1.5,
    buyDate: "2023-01-15",
    expiration: "2024-01-15",
    supplierNames: ["Proveedor A"],
  },
  {
    id: 126,
    name: "Pedigree Adulto Razas Pequeñas",
    category: "Perro",
    amount: 27,
    sellPrice: 370,
    weigth: 3,
    buyDate: "2023-02-10",
    expiration: "2024-02-10",
    supplierNames: ["Proveedor B"],
  },
  {
    id: 127,
    name: "Cat Chow Esterilizados Pescado",
    category: "Gato",
    amount: 16,
    sellPrice: 490,
    weigth: 8,
    buyDate: "2023-03-05",
    expiration: "2024-03-05",
    supplierNames: ["Proveedor C"],
  },
  {
    id: 128,
    name: "Eukanuba Cachorros Razas Grandes",
    category: "Perro",
    amount: 10,
    sellPrice: 420,
    weigth: 15,
    buyDate: "2023-04-20",
    expiration: "2024-04-20",
    supplierNames: ["Proveedor D"],
  },
  {
    id: 129,
    name: "Vitalcan Complete Gatos Adultos",
    category: "Gato",
    amount: 12,
    sellPrice: 210,
    weigth: 7.5,
    buyDate: "2023-05-15",
    expiration: "2024-05-15",
    supplierNames: ["Proveedor E"],
  },
  {
    id: 130,
    name: "Pro Plan Perro Cordero y Arroz",
    category: "Perro",
    amount: 11,
    sellPrice: 760,
    weigth: 15,
    buyDate: "2023-06-10",
    expiration: "2024-06-10",
    supplierNames: ["Proveedor F"],
  },
  {
    id: 131,
    name: "Whiskas Gatitos Pollo",
    category: "Gato",
    amount: 19,
    sellPrice: 870,
    weigth: 1.5,
    buyDate: "2023-07-05",
    expiration: "2024-07-05",
    supplierNames: ["Proveedor A"],
  },
  {
    id: 132,
    name: "Pedigree Adulto Razas Pequeñas",
    category: "Perro",
    amount: 2,
    sellPrice: 650,
    weigth: 3,
    buyDate: "2023-08-20",
    expiration: "2024-08-20",
    supplierNames: ["Proveedor B"],
  },
  {
    id: 133,
    name: "Cat Chow Esterilizados Pescado",
    category: "Gato",
    amount: 4,
    sellPrice: 980,
    weigth: 8,
    buyDate: "2023-09-15",
    expiration: "2024-09-15",
    supplierNames: ["Proveedor C"],
  },
  {
    id: 134,
    name: "Eukanuba Cachorros Razas Grandes",
    category: "Perro",
    amount: 20,
    sellPrice: 420,
    weigth: 15,
    buyDate: "2023-10-10",
    expiration: "2024-10-10",
    supplierNames: ["Proveedor D"],
  },
  {
    id: 135,
    name: "Vitalcan Complete Gatos Adultos",
    category: "Gato",
    amount: 16,
    sellPrice: 120,
    weigth: 7.5,
    buyDate: "2023-11-05",
    expiration: "2024-11-05",
    supplierNames: ["Proveedor E"],
  },
  {
    id: 136,
    name: "Pro Plan Perro Cordero y Arroz",
    category: "Perro",
    amount: 28,
    sellPrice: 250,
    weigth: 15,
    buyDate: "2023-12-20",
    expiration: "2024-12-20",
    supplierNames: ["Proveedor F"],
  },
];

function InventoryLegend() {
  const STATUS_ITEMS = [
    { bg: "bg-amount-critical", label: "Crítico", range: "0 - 5" },
    { bg: "bg-amount-low", label: "Bajo", range: "6 - 15" },
    { bg: "bg-amount-medium", label: "Medio", range: "16 - 20" },
    { bg: "bg-amount-supplied", label: "Abastecido", range: "+ 20" },
  ];

  return (
    <footer className="text-dark-blue mt-4 flex flex-wrap gap-4 text-sm">
      {STATUS_ITEMS.map(({ bg, label, range }) => (
        <article key={label} className="flex items-center gap-2">
          <div className={`w-5 h-5 ${bg} rounded-full`}></div>
          <aside className="leading-none">
            <p className="font-semibold">{label}</p>
            <p>{range}</p>
          </aside>
        </article>
      ))}
    </footer>
  );
}

const ProductsTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<Set<number>>(
    new Set()
  );

  // Obtener el estado del stock basado en el valor
  const getStockStatus = (amount: number) => {
    if (amount <= 5) return "critical";
    if (amount <= 15) return "low";
    if (amount <= 20) return "medium";
    return "supplied";
  };

  // Obtener el color del indicador de stock
  const getStockColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-amount-critical";
      case "low":
        return "bg-amount-low";
      case "medium":
        return "bg-amount-medium";
      case "supplied":
        return "bg-amount-supplied";
      default:
        return "bg-gray-500";
    }
  };

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [products, searchTerm]);

  // Verificar si hay productos seleccionados
  const hasSelectedProducts = selectedProductIds.size > 0;

  // Seleccionar/deseleccionar producto
  const toggleProductSelection = (id: number) => {
    setSelectedProductIds((prevIds) => {
      const newIds = new Set(prevIds);
      if (newIds.has(id)) {
        newIds.delete(id);
      } else {
        newIds.add(id);
      }
      return newIds;
    });
  };

  // Desactivar productos seleccionados
  const deactivateSelected = () => {
    setSelectedProductIds(new Set());
  };

  // Eliminar productos seleccionados
  const deleteSelected = () => {
    setProducts((prev) => prev.filter((p) => !selectedProductIds.has(p.id)));
    setSelectedProductIds(new Set());
  };

  return (
    <section className="w-full p-6 bg-custom-mist">
      <article className="mx-auto">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-dark-blue mb-4">
            Productos
          </h1>

          {/* Barra de acciones */}
          <article className="flex flex-wrap gap-3 items-center justify-between">
            <article
              className={`flex items-center gap-2 [&>button]:font-semibold ${
                hasSelectedProducts ? "[&>button]:cursor-pointer" : ""
              } `}
            >
              <button
                onClick={deactivateSelected}
                disabled={!hasSelectedProducts}
                className={`${
                  hasSelectedProducts
                    ? "text-deep-teal hover:bg-cyan-50"
                    : "text-gray-400"
                } flex items-center gap-2 px-3 py-2 rounded-md transition-colors`}
              >
                <ToggleRight
                  size={18}
                  className={`${
                    hasSelectedProducts ? "text-tropical-cyan" : "text-gray-400"
                  }`}
                />
                Desactivar
              </button>
              <button
                onClick={deleteSelected}
                className={`${
                  hasSelectedProducts
                    ? "text-deep-teal hover:bg-cyan-50"
                    : "text-gray-400"
                } flex items-center gap-2 px-3 py-2 rounded-md transition-colors`}
              >
                <Trash2
                  size={18}
                  className={`${
                    hasSelectedProducts ? "text-tropical-cyan" : "text-gray-400"
                  }`}
                />
                Eliminar
              </button>
            </article>

            <aside className="flex gap-3 items-center">
              {/* Búsqueda */}
              <article className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-electric-blue"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Buscar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-dark-blue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                />
              </article>

              {/* Nuevo producto */}
              <button className="flex items-center gap-2 px-4 py-2 bg-electric-blue text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer">
                <Plus size={18} />
                Nuevo producto
              </button>

              {/* Cambiar Precio */}
              <button className="flex items-center gap-2 px-4 py-2 text-white bg-deep-teal hover:bg-teal-700 rounded-md transition-colors cursor-pointer ">
                <Calculator size={18} />
                Cambiar Precio
              </button>
            </aside>
          </article>
        </header>

        {/* Tabla */}
        <main className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#9cb7fc]">
          <article className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-polar-mist">
                <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:text-left [&>th]:font-normal [&>th]:border-l-2 [&>th]:border-white">
                  <th className="w-12 px-4 py-3">
                    <Check />
                  </th>
                  <th>ID</th>
                  <th>Nombre producto</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                  <th className="border-none">
                    <Bell size={18} className="mx-auto" />
                  </th>
                  <th>Precio venta</th>
                  <th className="w-8">Editar</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.amount);
                  const stockColor = getStockColor(stockStatus);
                  const isSelected = selectedProductIds.has(product.id);

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors border-b-2 border-gray-200 last:border-none"
                    >
                      <td className="px-5 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleProductSelection(product.id)}
                          className="w-4 h-4 cursor-pointer rounded focus:ring-blue-500 text-blue-600"
                        />
                      </td>
                      <td className="px-4 text-sm text-gray-900 border-l-2 border-gray-200">
                        {product.id}
                      </td>
                      <td className="px-4 text-sm border-l-2 border-gray-200">
                        {product.name}
                      </td>
                      <td className="px-4 text-sm border-l-2 border-gray-200">
                        {product.category}
                      </td>
                      <td className="px-4 text-sm border-l-2 border-gray-200">
                        {product.amount}
                      </td>
                      <td>
                        <div
                          className={`w-4 h-4 rounded-full mx-auto ${stockColor}`}
                        ></div>
                      </td>
                      <td className="px-4 text-sm border-l-2 border-gray-200">
                        $ {product.sellPrice}
                      </td>
                      <td className="text-center border-l-2 border-gray-200 w-fit">
                        <button className="py-3 text-glacial-blue hover:text-blue-500 transition-colors cursor-pointer">
                          <Edit size={24} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </article>
        </main>

        {/* Paginación */}
        <article className="flex justify-center py-3">
          <nav className="flex items-center justify-between">
            <ul className="flex items-center gap-2 text-dark-blue">
              <li>
                <button className="py-2">
                  <ChevronLeft size={32} />
                </button>
              </li>
              <li>
                <button className="text-xl">1</button>
              </li>
              <li>
                <button className="py-2">
                  <ChevronRight size={32} />
                </button>
              </li>
            </ul>
          </nav>
        </article>

        {/* Leyenda de stock */}
        <InventoryLegend />
      </article>
    </section>
  );
};

export default ProductsTable;
