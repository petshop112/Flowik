import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  Plus,
  Edit,
  Bell,
  Trash2,
  Calculator,
  ToggleRight,
} from "lucide-react";

// Tipos TypeScript
interface Product {
  id: number;
  name: string;
  category: "Gato" | "Perro";
  stock: number;
  price: number;
  selected?: boolean;
}

// Datos de ejemplo
const initialProducts: Product[] = [
  {
    id: 125,
    name: "Whiskas Gatitos Pollo 1,5kg",
    category: "Gato",
    stock: 3,
    price: 0,
  },
  {
    id: 126,
    name: "Pedigree Adulto Razas Pequeñas 3kg",
    category: "Perro",
    stock: 27,
    price: 0,
  },
  {
    id: 127,
    name: "Cat Chow Esterilizados Pescado 8kg",
    category: "Gato",
    stock: 16,
    price: 0,
  },
  {
    id: 128,
    name: "Eukanuba Cachorros Razas Grandes 15kg",
    category: "Perro",
    stock: 10,
    price: 0,
  },
  {
    id: 129,
    name: "Vitalcan Complete Gatos Adultos 7,5kg",
    category: "Gato",
    stock: 12,
    price: 0,
  },
  {
    id: 130,
    name: "Pro Plan Perro Cordero y Arroz 15kg",
    category: "Perro",
    stock: 11,
    price: 0,
  },
  {
    id: 131,
    name: "Whiskas Gatitos Pollo 1,5kg",
    category: "Gato",
    stock: 19,
    price: 0,
  },
  {
    id: 132,
    name: "Pedigree Adulto Razas Pequeñas 3kg",
    category: "Perro",
    stock: 2,
    price: 0,
  },
  {
    id: 133,
    name: "Cat Chow Esterilizados Pescado 8kg",
    category: "Gato",
    stock: 4,
    price: 0,
  },
  {
    id: 134,
    name: "Eukanuba Cachorros Razas Grandes 15kg",
    category: "Perro",
    stock: 20,
    price: 0,
  },
  {
    id: 135,
    name: "Vitalcan Complete Gatos Adultos 7,5kg",
    category: "Gato",
    stock: 16,
    price: 0,
  },
  {
    id: 136,
    name: "Pro Plan Perro Cordero y Arroz 15kg",
    category: "Perro",
    stock: 28,
    price: 0,
  },
];

const ProductsTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPriceChange, setShowPriceChange] = useState(false);
  const itemsPerPage = 12;

  // Obtener el estado del stock basado en el valor
  const getStockStatus = (stock: number | "Bajo") => {
    if (stock === "Bajo") return "critical";
    if (typeof stock === "number" && stock <= 5) return "critical";
    if (typeof stock === "number" && stock <= 15) return "low";
    if (typeof stock === "number" && stock <= 20) return "medium";
    return "good";
  };

  // Obtener el color del indicador de stock
  const getStockColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-500";
      case "low":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "good":
        return "bg-green-500";
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
      const matchesCategory =
        !filterCategory || product.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, filterCategory]);

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Verificar si hay productos seleccionados
  const hasSelectedProducts = products.some((p) => p.selected);
  const selectedCount = products.filter((p) => p.selected).length;

  // Seleccionar/deseleccionar producto
  const toggleProductSelection = (index: number) => {
    const actualIndex = startIndex + index;
    const productId = filteredProducts[actualIndex].id;
    const productName = filteredProducts[actualIndex].name;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId && p.name === productName
          ? { ...p, selected: !p.selected }
          : p
      )
    );
  };

  // Seleccionar/deseleccionar todos
  const toggleAllSelection = () => {
    const allSelected = currentProducts.every((p) => p.selected);
    setProducts((prev) =>
      prev.map((p) => {
        const isInCurrentPage = currentProducts.some(
          (cp) => cp.id === p.id && cp.name === p.name
        );
        if (isInCurrentPage) {
          return { ...p, selected: !allSelected };
        }
        return p;
      })
    );
  };

  // Desactivar productos seleccionados
  const deactivateSelected = () => {
    console.log("Desactivando productos seleccionados");
    setProducts((prev) =>
      prev.map((p) => (p.selected ? { ...p, selected: false } : p))
    );
  };

  // Eliminar productos seleccionados
  const deleteSelected = () => {
    setProducts((prev) => prev.filter((p) => !p.selected));
  };

  return (
    <section className="p-6 bg-[#f2f6f8] min-h-screen">
      <article className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-[#042d95] mb-4">
            Productos
          </h1>

          {/* Barra de acciones */}
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div
              className={`flex gap-2 [&>button]:bg-transparent ${
                hasSelectedProducts ? "[&>button]:cursor-pointer" : ""
              } `}
            >
              <button
                onClick={deactivateSelected}
                disabled={!hasSelectedProducts}
                className={`${
                  hasSelectedProducts
                    ? "text-cyan-600 hover:bg-cyan-50"
                    : "text-gray-400"
                } flex items-center gap-2 px-3 py-2 text-sm  rounded-md transition-colors`}
              >
                <ToggleRight size={18} />
                Desactivar
              </button>
              <button
                onClick={deleteSelected}
                className={`${
                  hasSelectedProducts
                    ? "text-cyan-600 hover:bg-cyan-50"
                    : "text-gray-400"
                } flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors`}
              >
                <Trash2 size={18} />
                Eliminar
              </button>
            </div>

            <div className="flex gap-3 items-center">
              {/* Búsqueda */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Buscar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>

              {/* Filtrar */}
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="appearance-none pl-10 pr-8 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Filtrar</option>
                  <option value="Gato">Gato</option>
                  <option value="Perro">Perro</option>
                </select>
                <SlidersHorizontal
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>

              {/* Nuevo producto */}
              <button className="flex items-center gap-2 px-4 py-2 bg-[#5685fa] text-white rounded-md hover:bg-blue-700 transition-colors">
                <Plus size={18} />
                Nuevo producto
              </button>

              {/* Cambiar Precio */}
              <button
                onClick={() => setShowPriceChange(!showPriceChange)}
                className={`flex items-center gap-2 px-4 py-2 border border-cyan-600 rounded-md transition-colors ${
                  showPriceChange
                    ? "bg-cyan-600 text-white"
                    : "bg-cyan-100 text-cyan-600 hover:bg-cyan-200"
                }`}
              >
                <Calculator size={18} />
                Cambiar Precio
              </button>
            </div>
          </div>
        </header>

        {/* Tabla */}
        <main className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#9cb7fc]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f1f5ff]">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={
                        currentProducts.length > 0 &&
                        currentProducts.every((p) => p.selected)
                      }
                      onChange={toggleAllSelection}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre producto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Bell size={18} className="mx-auto" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio venta
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Editar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentProducts.map((product, index) => {
                  const stockStatus = getStockStatus(product.stock);
                  const stockColor = getStockColor(stockStatus);

                  return (
                    <tr
                      key={`${product.id}-${index}`}
                      className={`hover:bg-gray-50 transition-colors ${
                        product.selected ? "bg-purple-50" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={product.selected || false}
                          onChange={() => toggleProductSelection(index)}
                          className={`w-4 h-4 rounded focus:ring-blue-500 ${
                            product.selected
                              ? "text-purple-600 bg-purple-100 border-purple-300"
                              : "text-blue-600"
                          }`}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {product.id}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm ${
                          product.selected ? "text-gray-400" : "text-gray-900"
                        }`}
                      >
                        {product.name}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm ${
                          product.selected ? "text-gray-400" : "text-gray-900"
                        }`}
                      >
                        {product.category}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm ${
                          product.selected ? "text-gray-400" : "text-gray-900"
                        }`}
                      >
                        {product.stock}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div
                          className={`w-3 h-3 rounded-full mx-auto ${
                            product.selected ? "bg-gray-300" : stockColor
                          }`}
                        ></div>
                      </td>
                      <td
                        className={`px-4 py-3 text-sm ${
                          product.selected ? "text-gray-400" : "text-gray-900"
                        }`}
                      >
                        {product.price.toFixed(2)} €
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          <Edit size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ‹
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Leyenda de stock */}
        <footer className="text-[#042d95]  mt-4 flex flex-wrap gap-4 text-sm">
          <article className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#f82254] rounded-full"></div>
            <aside className="leading-none">
              <p className="font-semibold">Crítico</p>
              <p>0 - 5</p>
            </aside>
          </article>
          <article className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#fe9b38] rounded-full"></div>
            <aside className="leading-none">
              <p className="font-semibold">Bajo</p>
              <p>6 - 15</p>
            </aside>
          </article>
          <article className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#f2f47d] rounded-full"></div>
            <aside className="leading-none">
              <p className="font-semibold">Medio</p>
              <p>16 - 20</p>
            </aside>
          </article>
          <article className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#06c696] rounded-full"></div>
            <aside className="leading-none">
              <p className="font-semibold">Abastecido</p>
              <p>+ 20</p>
            </aside>
          </article>
        </footer>

        {/* Contador de seleccionados */}
        {hasSelectedProducts && (
          <div className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg">
            {selectedCount} producto{selectedCount !== 1 ? "s" : ""}{" "}
            seleccionado{selectedCount !== 1 ? "s" : ""}
          </div>
        )}
      </article>
    </section>
  );
};

export default ProductsTable;
