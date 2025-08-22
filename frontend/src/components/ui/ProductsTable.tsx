import React, { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
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
} from 'lucide-react';
import {
  useCreateProduct,
  useGetAllProducts,
  useGetProductById,
  useUpdateProduct,
} from '../../hooks/useProducts';
import ProductFormModal from '../modal/ProductFormModal';
import { InventoryLegend } from './InventoryLegend';
import { getStockStatus, getStockColor } from '../../utils/product';
import { useGetAllProviders } from '../../hooks/useProviders';
import type { Product, ProductWithOptionalId } from '../../types/product';
import ProductSavedModal from '../modal/ProductSavedModal';

const DeleteProductModal = () => {
  // const handleClose = () => {
  //   onClose();
  // };

  return (
    <article
      className={`bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4`}
    >
      <article className="border-warning-crimson relative flex w-full max-w-md flex-col items-center overflow-y-auto rounded-lg border bg-white pt-14 pb-4 shadow-2xl">
        <main className="w-full text-center">
          <article className="mx-auto mb-2 flex h-6 w-6 items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-warning-crimson size-6"
            >
              <path
                fillRule="evenodd"
                d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                clipRule="evenodd"
              />
            </svg>
          </article>
          <h2 className="text-lg font-semibold text-gray-900">¿Quieres eliminar el producto X?</h2>
          <p className="px-6 text-gray-500">
            Vas a eliminar el "Producto X". Esta acción es permanente y no podrás deshacerla.
          </p>
        </main>
        <footer className="mt-6 flex justify-center space-x-3 [&>button]:cursor-pointer [&>button]:px-12 [&>button]:py-[6px] [&>button]:transition-colors">
          <button
            type="button"
            className="text-warning-crimson border-warning-crimson hover:bg-warning-crimson rounded-sm border transition-colors hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            className="bg-warning-crimson rounded-sm text-white transition-colors hover:bg-red-700"
          >
            Eliminar
          </button>
        </footer>
      </article>
    </article>
  );
};

const ProductsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<Set<number>>(new Set());
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: products, isLoading, error } = useGetAllProducts();
  const { data: productToEdit, isLoading: isLoadingProductToEdit } = useGetProductById(
    editingProductId || 0
  );
  const { data: providers } = useGetAllProviders();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithOptionalId | null>(null);

  const queryClient = useQueryClient();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const [isProductSavedModalOpen, setIsProductSavedModalOpen] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  const hasSelectedProducts = selectedProductIds.size > 0;
  const itemsPerPage = 10;

  const categories = useMemo((): string[] => {
    if (!products?.length) {
      return ['Gato', 'Perro', 'Alimento'];
    }

    const categorySet = new Set<string>();

    products.forEach((product: Product) => {
      if (product.category) {
        categorySet.add(product.category);
      }
    });

    if (categorySet.size === 0) {
      return ['Gato', 'Perro', 'Alimento'];
    }

    return Array.from(categorySet).sort();
  }, [products]);

  useEffect(() => {
    if (productToEdit) {
      setEditingProduct(productToEdit);
    }
  }, [productToEdit]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
    setIsSavingProduct(true);
    try {
      if (editingProductId !== null) {
        const updatedProduct = {
          ...productData,
          providerIds: productData.providerIds ? productData.providerIds.map(String) : [],
        };
        console.log('Datos que se van a enviar:', updatedProduct);

        await updateProductMutation.mutateAsync({
          id: editingProductId,
          data: updatedProduct,
        });

        queryClient.setQueryData(['product', editingProductId], updatedProduct);
        setIsSavingProduct(false);
        handleCloseModal();
        setIsProductSavedModalOpen(true);
        console.log('Producto actualizado en el cache:', updatedProduct);
      } else {
        const newProduct = {
          name: productData.name,
          description: productData.description,
          category: productData.category,
          amount: Number(productData.amount),
          sellPrice: Number(productData.sellPrice),
          buyDate: productData.buyDate,
          expiration: productData.expiration,
          providerIds:
            productData.providerIds && productData.providerIds.length > 0
              ? productData.providerIds.map(String)
              : [],
        };

        console.log('Datos que se van a enviar:', newProduct);
        const createdProduct = await createProductMutation.mutateAsync(newProduct);

        if (productData.providerIds && productData.providerIds.length > 0 && providers) {
          const selectedProvider = providers.find(
            (p) => p.id_provider.toString() === productData.providerIds?.[0]
          );

          if (selectedProvider) {
            const updatedCreatedProduct = {
              ...createdProduct,
              providerIds: productData.providerIds,
              providers: [selectedProvider.name_provider],
            };

            queryClient.setQueryData(['product', createdProduct.id], updatedCreatedProduct);
          }
        }
        setIsSavingProduct(false);
        handleCloseModal();
        setIsProductSavedModalOpen(true);
        console.log('Nuevo producto creado:', productData);
      }

      queryClient.invalidateQueries({ queryKey: ['products'] });
      handleCloseModal();
    } catch (error) {
      setIsSavingProduct(false);
      console.error('Error al guardar producto:', error);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    if (!searchTerm.trim()) return products;

    if (searchTerm.trim().length < 3) return products;

    return products.filter(
      (product: Product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.providers.some((provider) =>
          provider.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [products, searchTerm]);

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) return <p>Cargando productos...</p>;

  if (error) return <p>Error al cargar productos: {error.message}</p>;

  return (
    <>
      <section className="bg-custom-mist w-full p-6">
        <article className="mx-auto">
          {/* Header */}
          <header className="mb-6">
            <h1 className="text-dark-blue mb-4 text-2xl font-semibold">Productos</h1>

            {/* Barra de acciones */}
            <article className="flex flex-wrap items-center justify-between gap-3">
              <article
                className={`flex items-center gap-2 [&>button]:font-semibold ${
                  hasSelectedProducts ? '[&>button]:cursor-pointer' : ''
                } `}
              >
                <button
                  disabled={!hasSelectedProducts}
                  className={`${
                    hasSelectedProducts ? 'text-deep-teal hover:bg-cyan-50' : 'text-gray-400'
                  } flex items-center gap-2 rounded-md px-3 py-2 transition-colors`}
                >
                  <ToggleRight
                    size={18}
                    className={`${hasSelectedProducts ? 'text-tropical-cyan' : 'text-gray-400'}`}
                  />
                  Desactivar
                </button>
                <button
                  className={`${
                    hasSelectedProducts ? 'text-deep-teal hover:bg-cyan-50' : 'text-gray-400'
                  } flex items-center gap-2 rounded-md px-3 py-2 transition-colors`}
                >
                  <Trash2
                    size={18}
                    className={`${hasSelectedProducts ? 'text-tropical-cyan' : 'text-gray-400'}`}
                  />
                  Eliminar
                </button>
              </article>

              <aside className="flex items-center gap-3">
                {/* Búsqueda */}
                <article className="relative">
                  <Search
                    className="text-electric-blue absolute top-1/2 left-3 -translate-y-1/2 transform"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o categoría"
                    value={searchTerm}
                    data-test="search-input"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-dark-blue w-48 rounded-md border bg-white py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </article>

                {/* Nuevo producto */}
                <button
                  onClick={handleNewProduct}
                  className="bg-electric-blue flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-white transition-colors hover:bg-blue-600"
                >
                  <Plus size={18} />
                  Nuevo producto
                </button>

                {/* Cambiar Precio */}
                <button className="bg-deep-teal flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-white transition-colors hover:bg-teal-700">
                  <Calculator size={18} />
                  Cambiar Precio
                </button>
              </aside>
            </article>
          </header>

          {/* Tabla */}
          <main className="overflow-hidden rounded-xl border border-[#9cb7fc] bg-white shadow-sm">
            <article className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-polar-mist">
                  <tr className="[&>th]:border-l-2 [&>th]:border-white [&>th]:px-4 [&>th]:py-3 [&>th]:text-left [&>th]:font-normal">
                    <th className="w-12 px-4 py-3">
                      <Check />
                    </th>
                    <th>ID</th>
                    <th>Nombre producto</th>
                    <th>Categoría</th>
                    <th>Stock unitario</th>
                    <th className="border-none">
                      <Bell size={18} className="mx-auto" />
                    </th>
                    <th>Precio venta</th>
                    <th className="w-8">Editar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {currentProducts.map((product: Product) => {
                    const stockStatus = getStockStatus(product.amount);
                    const stockColor = getStockColor(stockStatus);
                    const isSelected = selectedProductIds.has(product.id);

                    return (
                      <tr
                        key={product.id}
                        className="border-b-2 border-gray-200 transition-colors last:border-none hover:bg-gray-50"
                      >
                        <td className="px-5 py-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleProductSelection(product.id)}
                            className="h-4 w-4 cursor-pointer rounded text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="border-l-2 border-gray-200 px-4 text-sm text-gray-900">
                          {product.id}
                        </td>
                        <td className="border-l-2 border-gray-200 px-4 text-sm">{product.name}</td>
                        <td className="border-l-2 border-gray-200 px-4 text-sm">
                          {product.category}
                        </td>
                        <td className="border-l-2 border-gray-200 px-4 text-sm">
                          {product.amount}
                        </td>
                        <td>
                          <div className={`mx-auto h-4 w-4 rounded-full ${stockColor}`}></div>
                        </td>
                        <td className="border-l-2 border-gray-200 px-4 text-sm">
                          $ {product.sellPrice}
                        </td>
                        <td className="w-fit border-l-2 border-gray-200 text-center">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-glacial-blue cursor-pointer py-3 transition-colors hover:text-blue-500"
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

            {filteredProducts.length === 0 && searchTerm && (
              <div className="py-8 text-center text-gray-500">
                No se encontraron productos que coincidan con "{searchTerm}"
              </div>
            )}
          </main>

          {/* Paginación */}
          {totalPages > 1 && (
            <article className="flex justify-center py-3">
              <nav className="flex items-center justify-between">
                <ul className="text-dark-blue flex items-center gap-2">
                  <li>
                    <button
                      className={`py-2 ${currentPage === 1 ? 'cursor-not-allowed text-neutral-400/70' : 'cursor-pointer hover:text-blue-600'}`}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={32} />
                    </button>
                  </li>

                  {getPageNumbers().map((pageNumber) => (
                    <li key={pageNumber}>
                      <button
                        className={`rounded-md px-3 py-2 text-lg transition-colors ${
                          currentPage === pageNumber
                            ? 'font-semibold'
                            : 'hover:text-dark-blue cursor-pointer text-neutral-400/70'
                        }`}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  ))}

                  <li>
                    <button
                      className={`py-2 ${currentPage === totalPages ? 'cursor-not-allowed text-neutral-400/70' : 'cursor-pointer hover:text-blue-600'}`}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight size={32} />
                    </button>
                  </li>
                </ul>
              </nav>
            </article>
          )}

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
        categories={categories}
        isSaving={isSavingProduct}
      />
      <ProductSavedModal
        title={editingProductId !== null ? '¡Nuevo producto agregado!' : '¡Cambios guardados!'}
        description={
          editingProductId !== null
            ? 'El producto se ha dado de alta correctamente y ya está disponible en el inventario.'
            : 'Los datos se han guardado correctamente.'
        }
        isOpen={isProductSavedModalOpen}
        onClose={() => setIsProductSavedModalOpen(false)}
      />
      <DeleteProductModal />
    </>
  );
};

export default ProductsTable;
