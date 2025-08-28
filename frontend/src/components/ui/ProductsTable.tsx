import React, { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Search,
  Plus,
  Edit,
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
  useDeleteProduct,
  useDeactivateProduct,
  useAdjustProductPrices,
} from '../../hooks/useProducts';
import ProductFormModal from '../modal/ProductFormModal';
import { InventoryLegend } from './InventoryLegend';
import { getStockStatus, getStockColor } from '../../utils/product';
import { useGetAllProviders } from '../../hooks/useProviders';
import type { AdjustProductPriceData, Product, ProductWithOptionalId } from '../../types/product';
import EmptyProductsState from './EmptyProductsState';
import DeleteProductModal from '../modal/DeleteProductModal';
import SuccessModal from '../modal/SuccessModal';
import AdjustPricesModal from '../modal/AdjustPricesModal';

const ProductsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<Set<number>>(new Set());
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithOptionalId | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', description: '' });
  const [isAdjustPricesModalOpen, setIsAdjustPricesModalOpen] = useState(false);

  const { data: products = [], isLoading, error } = useGetAllProducts();
  const { data: productToEdit, isLoading: isLoadingProductToEdit } = useGetProductById(
    editingProductId || 0
  );
  const { data: providers } = useGetAllProviders();
  const deleteProductMutation = useDeleteProduct();
  const deactivateProductMutation = useDeactivateProduct();
  const queryClient = useQueryClient();
  const { mutateAsync: createProductMutation, isPending: isCreating } = useCreateProduct();
  const { mutateAsync: updateProductMutation, isPending: isUpdating } = useUpdateProduct();
  const isSavingProduct = isCreating || isUpdating;
  const adjustPricesMutation = useAdjustProductPrices();

  const hasSelectedProducts = selectedProductIds.size > 0;
  const itemsPerPage = 10;
  const hasProducts = products && products.length > 0;

  const categories = useMemo((): string[] => {
    const categorySet = new Set<string>(['Gato', 'Perro', 'Alimento']);

    if (products?.length) {
      products.forEach((product: Product) => {
        if (product.category) {
          categorySet.add(product.category);
        }
      });
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
    try {
      let messageTitle = '';
      let messageDescription = '';

      if (editingProductId !== null) {
        const updatedProduct = {
          ...productData,
          providerIds: productData.providerIds ? productData.providerIds.map(String) : [],
        };

        await updateProductMutation({
          id: editingProductId,
          data: updatedProduct,
        });

        messageTitle = '¡Cambios guardados!';
        messageDescription = 'Los datos se han guardado correctamente.';
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

        const createdProduct = await createProductMutation(newProduct);

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

        messageTitle = '¡Nuevo producto agregado!';
        messageDescription =
          'El producto se ha dado de alta correctamente y ya está disponible en el inventario.';
      }

      setSuccessMessage({
        title: messageTitle,
        description: messageDescription,
      });
    } catch (error) {
      setSuccessMessage({
        title: '¡Error al guardar producto!',
        description: 'El producto no se ha guardado correctamente.',
      });
      console.error('Error al guardar producto:', error);
    } finally {
      handleCloseModal();
      setIsSuccessModalOpen(true);
    }
  };

  const handleDeleteProducts = async () => {
    if (selectedProductIds.size === 0) return;

    try {
      const idsArray = Array.from(selectedProductIds);
      await deleteProductMutation.mutateAsync(idsArray);

      setSelectedProductIds(new Set());
      setIsDeleteModalOpen(false);

      setSuccessMessage({
        title: '¡Eliminación completada!',
        description: `Los elementos seleccionados ya no estarán disponibles en la tabla ni en el buscador.`,
      });

      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error('Error al eliminar productos:', error);
    }
  };

  const handleOpenDeleteModal = () => {
    if (selectedProductIds.size > 0) {
      setIsDeleteModalOpen(true);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products;
    if (searchTerm.trim().length >= 2) {
      filtered = products.filter(
        (product: Product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.providers.some((provider) =>
            provider.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    return filtered.sort((a: Product, b: Product) => {
      if (a.isActive && !b.isActive) {
        return -1;
      }
      if (!a.isActive && b.isActive) {
        return 1;
      }
      return 0;
    });
  }, [products, searchTerm]);

  const allSelectedAreActive = useMemo(() => {
    if (selectedProductIds.size === 0) return false;

    return Array.from(selectedProductIds).every((id) => {
      const product = products.find((p: Product) => p.id === id);
      return product ? product.isActive : false;
    });
  }, [selectedProductIds, products]);

  const allSelectedAreInactive = useMemo(() => {
    if (selectedProductIds.size === 0) return false;

    return Array.from(selectedProductIds).every((id) => {
      const product = products.find((p: Product) => p.id === id);
      return product ? !product.isActive : false;
    });
  }, [selectedProductIds, products]);

  const handleToggleProductStatus = async () => {
    if (selectedProductIds.size === 0) return;

    const idsArray = Array.from(selectedProductIds);

    try {
      if (allSelectedAreActive) {
        await deactivateProductMutation.mutateAsync(idsArray);
        setSuccessMessage({
          title: '¡Desactivación completada!',
          description:
            'Los elementos seleccionados se mostrarán al final de la tabla. Para encontrarlos, usa el buscador y reactívalos.',
        });
      } else if (allSelectedAreInactive) {
        await deactivateProductMutation.mutateAsync(idsArray);
        setSuccessMessage({
          title: '¡Activación completada!',
          description: 'Los productos seleccionados han sido reactivados.',
        });
      }

      setSelectedProductIds(new Set());
    } catch (error) {
      console.error('Error al cambiar el estado de los productos:', error);
    } finally {
      setIsSuccessModalOpen(true);
    }
  };

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

  const selectedProducts = useMemo(() => {
    return products.filter((product: Product) => selectedProductIds.has(product.id));
  }, [products, selectedProductIds]);

  const handleOpenAdjustPricesModal = () => {
    if (selectedProductIds.size > 0) {
      setIsAdjustPricesModalOpen(true);
    }
  };

  const handleAdjustPrices = async (data: AdjustProductPriceData) => {
    try {
      await adjustPricesMutation.mutateAsync(data);

      setSelectedProductIds(new Set());
      setIsAdjustPricesModalOpen(false);

      setSuccessMessage({
        title: '¡Hecho!',
        description: `Los precios se han actualizado con éxito.`,
      });

      setIsSuccessModalOpen(true);
    } catch (error) {
      setSuccessMessage({
        title: '¡Error al actualizar precios!',
        description: 'No se pudieron actualizar los precios. Intenta nuevamente.',
      });
      setIsSuccessModalOpen(true);
      console.error('Error al ajustar precios:', error);
    }
  };

  if (isLoading) {
    return (
      <section className="bg-custom-mist h-full w-full p-6">
        <article className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center py-24">
          <div className="relative mb-4 h-12 w-12">
            <div className="h-12 w-12 rounded-full border-4 border-gray-300"></div>
            <div className="absolute top-0 left-0 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
          <p className="text-gray-600">Cargando productos...</p>
        </article>
      </section>
    );
  }

  if (error && !error.message.includes('404')) {
    return (
      <section className="bg-custom-mist w-full p-6">
        <article className="flex items-center justify-center py-12">
          <div className="text-center text-red-600">
            <p>Error al cargar productos: {error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        </article>
      </section>
    );
  }

  return (
    <>
      <section className="bg-custom-mist min-h-[calc(100vh-6.5rem)] w-full p-6">
        <article className="mx-auto">
          {/* Header */}
          <header className="mb-6">
            <h1 className="text-dark-blue mb-4 text-2xl font-semibold">Productos</h1>

            {/* Barra de acciones */}
            <article className="flex flex-wrap items-center justify-between gap-3">
              {hasProducts ? (
                <article
                  className={`flex items-center gap-2 [&>button]:font-semibold ${
                    hasSelectedProducts ? '[&>button]:cursor-pointer' : ''
                  } `}
                >
                  <button
                    onClick={handleToggleProductStatus}
                    disabled={!hasSelectedProducts || deactivateProductMutation.isPending}
                    className={`${
                      hasSelectedProducts ? 'text-deep-teal hover:bg-cyan-50' : 'text-gray-400'
                    } flex items-center gap-2 rounded-md px-3 py-2 transition-colors`}
                  >
                    <ToggleRight
                      size={18}
                      className={`${hasSelectedProducts ? 'text-tropical-cyan' : 'text-gray-400'}`}
                    />
                    {allSelectedAreActive
                      ? deactivateProductMutation.isPending
                        ? 'Desactivando...'
                        : 'Desactivar'
                      : allSelectedAreInactive
                        ? deactivateProductMutation.isPending
                          ? 'Activando...'
                          : 'Activar'
                        : 'Activar/Desactivar'}
                  </button>
                  <button
                    onClick={handleOpenDeleteModal}
                    disabled={!hasSelectedProducts || deleteProductMutation.isPending}
                    className={`${
                      hasSelectedProducts ? 'text-deep-teal hover:bg-cyan-50' : 'text-gray-400'
                    } flex items-center gap-2 rounded-md px-3 py-2 transition-colors`}
                  >
                    <Trash2
                      size={18}
                      className={`${hasSelectedProducts && !deleteProductMutation.isPending ? 'text-tropical-cyan' : 'text-gray-400'}`}
                    />
                    {deleteProductMutation.isPending ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </article>
              ) : (
                <article></article>
              )}

              <aside className="flex items-center gap-3">
                {/* Búsqueda */}
                {hasProducts && (
                  <article className="relative">
                    <Search
                      className="text-electric-blue absolute top-1/2 left-3 -translate-y-1/2 transform"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Buscar"
                      value={searchTerm}
                      data-test="search-input"
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-dark-blue w-48 rounded-md border bg-white py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </article>
                )}

                {/* Nuevo producto */}
                <button
                  onClick={handleNewProduct}
                  className="bg-electric-blue flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-white transition-colors hover:bg-blue-600"
                >
                  <Plus size={18} />
                  Nuevo producto
                </button>

                {/* Cambiar Precio */}
                {hasProducts && (
                  <button
                    onClick={handleOpenAdjustPricesModal}
                    disabled={!hasSelectedProducts || adjustPricesMutation.isPending}
                    className={`flex items-center gap-2 rounded-md px-4 py-2 text-white transition-colors ${
                      hasSelectedProducts
                        ? 'bg-deep-teal cursor-pointer hover:bg-teal-700'
                        : 'cursor-not-allowed bg-gray-400'
                    }`}
                  >
                    <Calculator size={18} />
                    Cambiar Precio
                  </button>
                )}
              </aside>
            </article>
          </header>

          {/* Tabla */}
          {!hasProducts ? (
            <main className="border-sky-glimmer overflow-hidden rounded-xl border bg-white shadow-sm">
              <EmptyProductsState onAddProduct={handleNewProduct} />
            </main>
          ) : (
            <>
              <main className="border-sky-glimmer overflow-hidden rounded-xl border bg-white shadow-sm">
                <article className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-polar-mist">
                      <tr className="[&>th]:border-l-2 [&>th]:border-white [&>th]:px-4 [&>th]:py-3 [&>th]:text-left [&>th]:font-normal [&>th:first-child]:border-l-0">
                        <th className="w-12 px-4 py-3">
                          <Check />
                        </th>
                        <th>Nombre producto</th>
                        <th>Categoría</th>
                        <th>Stock unitario</th>
                        <th className="border-none">
                          <img className="h-6 w-6 max-w-6" src="/icons/alarma.svg" alt="" />
                        </th>
                        <th>Precio venta</th>
                        <th className="w-8">Editar</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {currentProducts.map((product: Product) => {
                        const stockStatus = getStockStatus(product.amount);
                        const stockColor = getStockColor(stockStatus);
                        const isSelected = selectedProductIds.has(product.id);

                        return (
                          <tr
                            key={product.id}
                            className={`${product.isActive ? 'hover:bg-gray-50' : 'bg-custom-mist text-neutral-400/80'} border-pastel-blue border-b-2 transition-colors last:border-none`}
                          >
                            <td className="px-5 py-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleProductSelection(product.id)}
                                className="h-4 w-4 cursor-pointer rounded text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                            <td className="border-pastel-blue border-l-2 px-4 text-sm">
                              {product.name}
                            </td>
                            <td className="border-pastel-blue border-l-2 px-4 text-sm">
                              {product.category}
                            </td>
                            <td className="border-pastel-blue border-l-2 px-4 text-sm">
                              {product.amount}
                            </td>
                            <td>
                              <div
                                className={`mx-auto h-4 w-4 rounded-full ${product.isActive ? stockColor : 'bg-neutral-400/80'}`}
                              ></div>
                            </td>
                            <td className="border-pastel-blue border-l-2 px-4 text-sm">
                              $ {product.sellPrice}
                            </td>
                            <td className="border-pastel-blue w-fit border-l-2 text-center">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className={`${product.isActive ? 'text-glacial-blue hover:text-blue-500' : 'text-neutral-400/80 hover:text-neutral-500'} cursor-pointer py-3 transition-colors`}
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
                    No se encontraron productos que coincidan con "{searchTerm.trim()}"
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
            </>
          )}
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
      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProducts}
        isLoading={deleteProductMutation.isPending}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={successMessage.title}
        description={successMessage.description}
      />
      <AdjustPricesModal
        isOpen={isAdjustPricesModalOpen}
        onClose={() => setIsAdjustPricesModalOpen(false)}
        onConfirm={handleAdjustPrices}
        selectedProducts={selectedProducts}
        isLoading={adjustPricesMutation.isPending}
      />
    </>
  );
};

export default ProductsTable;
