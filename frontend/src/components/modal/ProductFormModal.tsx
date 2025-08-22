import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type {
  ProductFormModalProps,
  ProductUpdateFormData,
  ProductWithOptionalId,
} from '../../types/product';

interface ValidationErrors {
  name?: string;
  description?: string;
  category?: string;
  sellPrice?: string;
  expiration?: string;
}

type ValidatableFields = keyof ValidationErrors;

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  product,
  isLoading,
  providers = [],
  categories = [],
  isSaving,
}) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState<
    Omit<ProductUpdateFormData, 'id' | 'providers'> & { providerIds?: string[] }
  >({
    name: '',
    category: '',
    description: '',
    amount: 0,
    sellPrice: 0,
    buyDate: '',
    expiration: '',
    providerIds: [],
  });

  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

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
      setErrors({});
      setTouched({});
    } else {
      setFormData({
        name: '',
        category: '',
        description: '',
        amount: 0,
        sellPrice: 0,
        buyDate: getCurrentDate(),
        expiration: '',
        providerIds: [],
      });
      setErrors({});
      setTouched({});
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && product) {
      let providerIds: string[] = [];
      if (product.providerIds && Array.isArray(product.providerIds)) {
        providerIds = product.providerIds.map((id) => String(id));
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
        buyDate: formatDateForInput(product.buyDate) || getCurrentDate(),
        expiration: formatDateForInput(product.expiration) || '',
        providerIds: providerIds,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, product]);

  const validateField = (fieldName: ValidatableFields, value: string | number): boolean => {
    const newErrors = { ...errors };
    const stringValue = String(value || '');

    switch (fieldName) {
      case 'name':
        if (!stringValue.trim()) {
          newErrors.name = 'El nombre del producto es obligatorio.';
        } else if (stringValue.trim().length < 2 || stringValue.trim().length > 50) {
          newErrors.name = 'El nombre del producto debe tener entre 2 y 50 caracteres.';
        } else {
          delete newErrors.name;
        }
        break;

      case 'description':
        if (!stringValue.trim()) {
          newErrors.description = 'La descripción del producto es obligatoria.';
        } else if (stringValue.trim().length < 10 || stringValue.trim().length > 255) {
          newErrors.description =
            'La descripción del producto debe tener entre 10 y 255 caracteres.';
        } else {
          delete newErrors.description;
        }
        break;

      case 'category':
        if (!stringValue.trim()) {
          newErrors.category = 'La categoría del producto es obligatoria.';
        } else if (stringValue.trim().length < 3 || stringValue.trim().length > 50) {
          newErrors.category = 'La categoría del producto debe tener entre 3 y 50 caracteres.';
        } else {
          delete newErrors.category;
        }
        break;

      case 'sellPrice':
        {
          const price = parseFloat(stringValue) || 0;
          if (price < 0.01) {
            newErrors.sellPrice = 'El precio debe ser mayor o igual a 0.01.';
          } else {
            delete newErrors.sellPrice;
          }
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return !newErrors[fieldName];
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    if (['name', 'description', 'category', 'sellPrice'].includes(field)) {
      setTimeout(() => {
        validateField(field as ValidatableFields, value);
      }, 100);
    }
  };

  const validateForm = (): boolean => {
    const fields: ValidatableFields[] = ['name', 'description', 'category', 'sellPrice'];
    let isValid = true;

    fields.forEach((field) => {
      const fieldValue = formData[field];
      const fieldValid = validateField(field, fieldValue || '');
      if (!fieldValid) isValid = false;
    });

    return isValid;
  };

  const hasErrors = Object.keys(errors).length > 0;

  const hasRequiredFields =
    formData.name.trim() &&
    formData.description.trim() &&
    formData.category.trim() &&
    formData.sellPrice > 0;

  const isFormValid = !hasErrors && hasRequiredFields;

  const canSave = isEditMode ? isFormValid && Object.keys(touched).length > 0 : isFormValid;

  const handleSave = () => {
    if (!validateForm() || !canSave) {
      return;
    }

    const productToSave: ProductWithOptionalId = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      amount: Number(formData.amount) || 0,
      sellPrice: Number(formData.sellPrice) || 0,
      buyDate: formData.buyDate || getCurrentDate(),
      expiration: formData.expiration || '',
      providerIds:
        formData.providerIds && formData.providerIds.length > 0
          ? formData.providerIds.filter((id) => id && id.trim() !== '')
          : [],
    };

    const finalProduct = isEditMode ? { ...productToSave, id: product?.id } : productToSave;

    onSave(finalProduct);
  };

  const handleCancel = () => {
    setErrors({});
    setTouched({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <article className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      {isLoading ? (
        <article className="flex h-[88vh] w-full max-w-4xl flex-col items-center justify-center overflow-y-auto rounded-lg bg-white shadow-xl">
          <article className="relative">
            <div className="h-12 w-12 rounded-full border-4 border-gray-300"></div>
            <div className="absolute top-0 left-0 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </article>
          <p className="w-full text-center">Cargando producto...</p>
        </article>
      ) : (
        <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
          {/* Header */}
          <header className="flex items-center justify-between px-8 pt-12">
            <h2 className="text-2xl font-semibold text-gray-900">
              {isEditMode ? `ID Producto - ${product?.id}` : 'Alta de Producto'}
            </h2>
            <article className="flex items-center gap-1 text-sm font-semibold">
              <p className="text-dark-blue">Última actualización:</p>
              <p className="text-gray-500">{new Date().toLocaleDateString('es-ES')}</p>
            </article>
            <button
              onClick={handleCancel}
              className="text-blue-ocean absolute top-4 right-4 cursor-pointer transition-colors hover:text-gray-600"
            >
              <X size={22} />
            </button>
          </header>

          {/* Content */}
          <main className="space-y-4 px-8 py-4">
            {/* Nombre del Producto */}
            <div>
              <label className="text-dark-blue mb-2 block text-sm font-medium">
                Nombre Producto*
              </label>
              <input
                type="text"
                value={formData.name}
                data-test="product-name"
                onChange={(e) => handleInputChange('name', e.target.value)}
                onBlur={() => validateField('name', formData.name)}
                placeholder={isEditMode ? formData.name : 'Nombre producto'}
                className={`${
                  isEditMode ? 'text-gray-500' : ''
                } w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500`}
                maxLength={50}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Descripción */}
            <div>
              <label className="text-dark-blue mb-2 block text-sm font-medium">Descripción*</label>
              <textarea
                rows={1}
                value={formData.description}
                data-test="product-description"
                onChange={(e) => handleInputChange('description', e.target.value)}
                onBlur={() => validateField('description', formData.description)}
                placeholder={isEditMode ? formData.description : 'Especificaciones'}
                className={`${
                  isEditMode ? 'text-gray-500' : ''
                } w-full resize-none rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500`}
                maxLength={255}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Categoría y Proveedor */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-dark-blue mb-2 block text-sm font-medium">Categoría*</label>
                <select
                  value={formData.category}
                  data-test="product-category"
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  onBlur={() => validateField('category', formData.category)}
                  className="w-full rounded-sm border border-gray-300 px-3 py-2 text-gray-500 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona categoría</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
              </div>

              <div>
                <label className="text-dark-blue mb-2 block text-sm font-medium">Proveedor</label>
                <select
                  data-test="product-provider"
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

                    setTouched((prev) => ({
                      ...prev,
                      providerIds: true,
                    }));
                  }}
                  className="w-full rounded-sm border border-gray-300 px-3 py-2 text-gray-500 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona proveedor</option>
                  {providers.map((provider) => (
                    <option key={provider.id_provider} value={provider.id_provider.toString()}>
                      {provider.name_provider}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stock y Precio */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-dark-blue mb-2 block text-sm font-medium">
                  Uds. en stock
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.amount || ''}
                  data-test="product-amount"
                  onChange={(e) => handleInputChange('amount', parseInt(e.target.value) || 0)}
                  placeholder={isEditMode ? formData.amount.toString() : 'Uds.'}
                  className={`${
                    isEditMode ? 'text-gray-500' : ''
                  } w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <div className="">
                <label className="text-dark-blue mb-2 block text-sm font-medium">
                  Precio de venta*
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.sellPrice || ''}
                  data-test="product-sell-price"
                  onChange={(e) => handleInputChange('sellPrice', parseFloat(e.target.value) || 0)}
                  onBlur={() => validateField('sellPrice', formData.sellPrice)}
                  placeholder={isEditMode ? formData.sellPrice.toString() : '000.000'}
                  className={`${
                    isEditMode ? 'text-gray-500' : ''
                  } w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500`}
                />
                {errors.sellPrice && (
                  <p className="mt-1 text-sm text-red-500">{errors.sellPrice}</p>
                )}
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="flex justify-center gap-4 px-8 pb-6 text-sm [&>button]:px-12 [&>button]:py-[6px] [&>button]:transition-colors">
            <button
              onClick={handleCancel}
              className="text-electric-blue border-electric-blue cursor-pointer rounded-sm border bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave || isSaving}
              className={`rounded-sm text-white ${
                !canSave || isSaving
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-electric-blue cursor-pointer hover:bg-blue-500'
              }`}
            >
              {isSaving ? (
                <span className="animate-pulse">
                  Guardando
                  <span className="inline-block animate-pulse delay-100">.</span>
                  <span className="inline-block animate-pulse delay-200">.</span>
                  <span className="inline-block animate-pulse delay-300">.</span>
                </span>
              ) : (
                'Guardar'
              )}
            </button>
          </footer>
        </div>
      )}
    </article>
  );
};

export default ProductFormModal;
