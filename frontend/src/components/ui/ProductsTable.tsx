import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import {
  useCreateProduct,
  useGetAllProducts,
  useGetProductById,
  useUpdateProduct,
} from "../../hooks/useProducts";
import ProductFormModal from "../modal/ProductFormModal";
import { InventoryLegend } from "./InventoryLegend";
import { getStockStatus, getStockColor } from "../../utils/product";
import { useGetAllProviders } from "../../hooks/useProviders";
import type { Product, ProductWithOptionalId } from "../../types/product";

const ProductsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<Set<number>>(
    new Set()
  );
  const { data: products, isLoading, error } = useGetAllProducts();
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const { data: productToEdit, isLoading: isLoadingProductToEdit } =
    useGetProductById(editingProductId || 0);
  const { data: providers } = useGetAllProviders();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<ProductWithOptionalId | null>(null);

  const queryClient = useQueryClient();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const hasSelectedProducts = selectedProductIds.size > 0;

  useEffect(() => {
    if (productToEdit) {
      setEditingProduct(productToEdit);
    }
  }, [productToEdit]);

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

  const handleNewProduct = () => {
    setEditingProduct(null);
    setEditingProductId(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProductId(null);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (productData: ProductWithOptionalId) => {
    try {
      if (editingProductId !== null) {
        const updatedProduct = {
          ...productData,
          providerIds: productData.providerIds
            ? productData.providerIds.map(String)
            : [],
        };

        await updateProductMutation.mutateAsync({
          id: editingProductId,
          data: updatedProduct,
        });
      } else {
        const formData = new FormData();
        formData.append("name", productData.name);
        formData.append("description", productData.description);
        formData.append("category", productData.category);
        formData.append("amount", String(productData.amount));
        formData.append("weight", String(productData.weigth));
        formData.append("sellPrice", String(productData.sellPrice));
        formData.append("expiration", productData.expiration);

        if (productData.providerIds && productData.providerIds.length > 0) {
          formData.append(
            "providerIds",
            JSON.stringify(productData.providerIds.map(String))
          );
        }

        await createProductMutation.mutateAsync(formData);

        console.log("Nuevo producto creado:", productData);
      }

      queryClient.invalidateQueries({ queryKey: ["products"] });
      handleCloseModal();
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };

  if (isLoading) return <p>Cargando productos...</p>;

  if (error) return <p>Error al cargar productos: {error.message}</p>;

  return (
    <>
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
                      hasSelectedProducts
                        ? "text-tropical-cyan"
                        : "text-gray-400"
                    }`}
                  />
                  Desactivar
                </button>
                <button
                  className={`${
                    hasSelectedProducts
                      ? "text-deep-teal hover:bg-cyan-50"
                      : "text-gray-400"
                  } flex items-center gap-2 px-3 py-2 rounded-md transition-colors`}
                >
                  <Trash2
                    size={18}
                    className={`${
                      hasSelectedProducts
                        ? "text-tropical-cyan"
                        : "text-gray-400"
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
                <button
                  onClick={handleNewProduct}
                  className="flex items-center gap-2 px-4 py-2 bg-electric-blue text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
                >
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
                  {products.map((product: Product) => {
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
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="py-3 text-glacial-blue hover:text-blue-500 transition-colors cursor-pointer"
                          >
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

          <InventoryLegend />
        </article>
      </section>
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        product={editingProduct}
        isLoading={isLoadingProductToEdit}
        providers={providers}
        categories={["Gato", "Perro", "Alimento"]}
      />
    </>
  );
};

export default ProductsTable;
