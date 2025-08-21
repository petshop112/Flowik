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
  X,
  CheckIcon,
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

interface ProductSavedModalProps {
  description: string;
  isOpen: boolean;
  onClose: () => void;
}

const ProductSavedModal = ({ description, isOpen, onClose }: ProductSavedModalProps) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <article
      className={`bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 ${
        isOpen ? '' : 'hidden'
      }`}
    >
      <article className="border-dark-emerald relative flex h-60 w-full max-w-96 items-center overflow-y-auto rounded-lg border bg-white shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 cursor-pointer text-gray-900 transition-colors hover:text-gray-500"
        >
          <X size={24} />
        </button>
        <main className="w-full text-center">
          <article className="bg-dark-emerald mx-auto mb-2 flex h-6 w-6 items-center justify-center rounded-full">
            <CheckIcon size={18} className="text-white" />
          </article>
          <h2 className="text-lg font-semibold text-gray-900">Producto Guardado</h2>
          <p className="text-gray-500">{description}</p>
        </main>
      </article>
    </article>
  );
};

const ProductsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
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
  const [isProductSavedModalOpen, setIsProductSavedModalOpen] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  const hasSelectedProducts = selectedProductIds.size > 0;

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
          weight: Number(productData.weigth), // Delete when backend deletes it
          sellPrice: Number(productData.sellPrice),
          buyDate: productData.buyDate,
          expiration: productData.expiration,
          providerIds:
            productData.providerIds && productData.providerIds.length > 0
              ? productData.providerIds.map(String)
              : [],
        };

        console.log('Datos que se van a enviar:', newProduct);
        const createdProduct = await createProductMutation.mutateAsync(
          // @ts-expect-error - The type of product receives weight or weigth. Delete when backend deletes it
          newProduct
        );

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

    return products.filter((product: Product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toString().includes(searchTerm)
    );
  }, [products, searchTerm]);

  if (isLoading) return <p>Cargando productos...</p>;

  if (error) return <p>Error al cargar productos: {error.message}</p>;

  return (
    <>
      <section className="bg-custom-mist w-full p-6">
        <article className="mx-auto">
          {/* Header */}
          <header className="mb-6">
            <h1 className="dark-blue mb-4 text-2xl font-semibold">Productos</h1>

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
                    <th>Stock unitario</th>
                    <th className="border-none">
                      <Bell size={18} className="mx-auto" />
                    </th>
                    <th>Precio venta</th>
                    <th className="w-8">Editar</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product: Product) => {
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

            {filteredProducts.length === 0 && searchTerm && (
              <div className="py-8 text-center text-gray-500">
                No se encontraron productos que coincidan con "{searchTerm}"
              </div>
            )}
          </main>

          {/* Paginación */}
          <article className="flex justify-center py-3">
            <nav className="flex items-center justify-between">
              <ul className="text-dark-blue flex items-center gap-2">
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
        categories={categories}
        isSaving={isSavingProduct}
      />
      <ProductSavedModal
        description={
          editingProductId !== null
            ? 'El producto se ha actualizado con éxito.'
            : 'El producto se ha guardado con éxito.'
        }
        isOpen={isProductSavedModalOpen}
        onClose={() => setIsProductSavedModalOpen(false)}
      />
    </>
  );
};

export default ProductsTable;
