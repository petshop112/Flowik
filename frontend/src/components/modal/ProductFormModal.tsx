import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type {
  ProductFormModalProps,
  ProductUpdateFormData,
  ProductWithOptionalId,
} from '../../types/product';

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  product,
  isLoading,
  providers = [],
  categories = [],
}) => {
  const [formData, setFormData] = useState<
    Omit<ProductUpdateFormData, 'id' | 'providers'> & { providerIds?: string[] }
  >({
    name: '',
    category: '',
    description: '',
    amount: 0,
    sellPrice: 0,
    weigth: 0,
    buyDate: '',
    expiration: '',
    providerIds: [],
  });

  const isEditMode = !!product;

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  useEffect(() => {
    if (isOpen) {
      if (product) {
        let providerIds: string[] = [];
        if (product.providerIds && Array.isArray(product.providerIds)) {
          providerIds = product.providerIds;
        } else if (product.providers && Array.isArray(product.providers)) {
          providerIds = product.providers
            .map((providerName) => {
              const found = providers.find((p) => p.name_provider === providerName);
              return found ? found.id_provider.toString() : '';
            })
            .filter((id) => id !== '');
        }

        setFormData({
          name: product.name || '',
          category: product.category || '',
          description: product.description || '',
          amount: product.amount || 0,
          sellPrice: product.sellPrice || 0,
          weigth: product.weigth || 0,
          buyDate: formatDateForInput(product.buyDate) || getCurrentDate(),
          expiration: formatDateForInput(product.expiration) || '',
          providerIds: providerIds,
        });
      } else {
        setFormData({
          name: '',
          category: '',
          description: '',
          amount: 0,
          sellPrice: 0,
          weigth: 0,
          buyDate: getCurrentDate(),
          expiration: '',
          providerIds: [],
        });
      }
    }
  }, [isOpen, product, providers]);

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('El nombre del producto es requerido');
      return;
    }

    if (!formData.category.trim()) {
      alert('La categoría es requerida');
      return;
    }

    if (formData.sellPrice <= 0) {
      alert('El precio de venta debe ser mayor a 0');
      return;
    }

    const productToSave: ProductWithOptionalId = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      amount: Number(formData.amount) || 0,
      sellPrice: Number(formData.sellPrice) || 0,
      weigth: Number(formData.weigth) || 0.01,
      buyDate: formData.buyDate || getCurrentDate(),
      expiration: formData.expiration || '',
      providerIds:
        formData.providerIds && formData.providerIds.length > 0
          ? formData.providerIds.filter((id) => id && id.trim() !== '')
          : [],
    };

    const finalProduct = isEditMode ? { ...productToSave, id: product?.id } : productToSave;

    onSave(finalProduct);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      {isLoading ? (
        <article className="flex h-[88vh] w-full max-w-4xl flex-col items-center justify-center overflow-y-auto rounded-lg bg-white shadow-xl">
          <article className="relative">
            <div className="h-12 w-12 rounded-full border-4 border-gray-300"></div>
            <div className="absolute top-0 left-0 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </article>
          <p className="w-full text-center">Cargando producto...</p>
        </article>
      ) : (
        <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
          {/* Header */}
          <header
            className={`${
              isEditMode ? 'flex-col-reverse items-end' : ''
            } flex items-center justify-between px-6 pt-6`}
          >
            <div className={`${isEditMode ? 'mt-1 flex w-full justify-between' : ''}`}>
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditMode ? `ID Producto - ${product?.id}` : 'Nuevo Producto'}
              </h2>
              {isEditMode && (
                <article className="flex items-center gap-2 text-sm font-semibold">
                  <p className="text-blue-600">Última actualización:</p>
                  <p className="text-gray-500">{new Date().toLocaleDateString('es-ES')}</p>
                </article>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 transition-colors hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </header>

          {/* Content */}
          <main className="space-y-4 px-6 py-4">
            {/* Nombre del Producto */}
            <div>
              <label className="mb-2 block text-sm font-medium text-blue-600">
                Nombre Producto*
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={isEditMode ? formData.name : 'Nombre producto'}
                className={`${
                  isEditMode ? 'text-gray-500' : ''
                } w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="mb-2 block text-sm font-medium text-blue-600">Descripción</label>
              <textarea
                rows={1}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder={isEditMode ? formData.description : 'Especificaciones'}
                className={`${
                  isEditMode ? 'text-gray-500' : ''
                } w-full resize-none rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Categoría y Proveedor */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-blue-600">Categoría*</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full rounded-sm border border-gray-300 px-3 py-2 text-gray-500 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    {isEditMode
                      ? formData.category || 'Selecciona categoría'
                      : 'Selecciona categoría'}
                  </option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-blue-600">Proveedor</label>
                <select
                  value={
                    formData.providerIds && formData.providerIds.length > 0
                      ? formData.providerIds[0]
                      : ''
                  }
                  onChange={(e) => {
                    const newId = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      providerIds: newId ? [newId] : [],
                    }));
                  }}
                  className="w-full rounded-sm border border-gray-300 px-3 py-2 text-gray-500 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona un proveedor</option>
                  {providers.map((provider) => (
                    <option key={provider.id_provider} value={provider.id_provider.toString()}>
                      {provider.name_provider}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stock, Peso y Precio */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-blue-600">
                  Uds. en stock
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.amount || ''}
                  onChange={(e) => handleInputChange('amount', parseInt(e.target.value) || 0)}
                  placeholder={isEditMode ? formData.amount.toString() : '0'}
                  className={`${
                    isEditMode ? 'text-gray-500' : ''
                  } w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-blue-600">Peso (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.weigth || ''}
                  onChange={(e) => handleInputChange('weigth', parseFloat(e.target.value) || 0)}
                  placeholder={isEditMode ? formData.weigth.toString() : '0.01'}
                  className={`${
                    isEditMode ? 'text-gray-500' : ''
                  } w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <div className="col-span-2">
                <label className="mb-2 block text-sm font-medium text-blue-600">
                  Precio de venta*
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.sellPrice || ''}
                  onChange={(e) => handleInputChange('sellPrice', parseFloat(e.target.value) || 0)}
                  placeholder={isEditMode ? formData.sellPrice.toString() : '0.00'}
                  className={`${
                    isEditMode ? 'text-gray-500' : ''
                  } w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="flex justify-center gap-4 px-6 pb-6 text-sm">
            <button
              onClick={handleCancel}
              className="rounded-sm border border-blue-600 bg-white px-12 py-[6px] text-blue-600 transition-colors hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="rounded-sm bg-blue-600 px-12 py-[6px] text-white transition-colors hover:bg-blue-700"
            >
              Guardar
            </button>
          </footer>
        </div>
      )}
    </div>
  );
};

export default ProductFormModal;
