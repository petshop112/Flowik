import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import type {
  ProductFormModalProps,
  ProductUpdateFormData,
  ProductWithOptionalId,
} from "../../types/product";

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
    Omit<ProductUpdateFormData, "id" | "providers"> & { providerIds?: string[] }
  >({
    name: "",
    category: "",
    description: "",
    amount: 0,
    sellPrice: 0,
    weigth: 0,
    buyDate: "",
    expiration: "",
    providerIds: [],
  });

  const isEditMode = !!product;

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
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
              const found = providers.find(
                (p) => p.name_provider === providerName
              );
              return found ? found.id_provider.toString() : "";
            })
            .filter((id) => id !== "");
        }

        setFormData({
          name: product.name || "",
          category: product.category || "",
          description: product.description || "",
          amount: product.amount || 0,
          sellPrice: product.sellPrice || 0,
          weigth: product.weigth || 0,
          buyDate: formatDateForInput(product.buyDate) || getCurrentDate(),
          expiration: formatDateForInput(product.expiration) || "",
          providerIds: providerIds,
        });
      } else {
        setFormData({
          name: "",
          category: "",
          description: "",
          amount: 0,
          sellPrice: 0,
          weigth: 0,
          buyDate: getCurrentDate(),
          expiration: "",
          providerIds: [],
        });
      }
    }
  }, [isOpen, product, providers]);

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("El nombre del producto es requerido");
      return;
    }

    if (!formData.category.trim()) {
      alert("La categoría es requerida");
      return;
    }

    if (formData.sellPrice <= 0) {
      alert("El precio de venta debe ser mayor a 0");
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
      expiration: formData.expiration || "",
      providerIds:
        formData.providerIds && formData.providerIds.length > 0
          ? formData.providerIds.filter((id) => id && id.trim() !== "")
          : [],
    };

    const finalProduct = isEditMode
      ? { ...productToSave, id: product?.id }
      : productToSave;

    onSave(finalProduct);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center p-4 z-50">
      {isLoading ? (
        <article className="flex flex-col justify-center items-center bg-white rounded-lg shadow-xl w-full max-w-4xl h-[88vh] overflow-y-auto">
          <article className="relative">
            <div className="h-12 w-12 rounded-full border-4 border-gray-300"></div>
            <div className="h-12 w-12 rounded-full border-4 border-blue-600 border-t-transparent absolute top-0 left-0 animate-spin"></div>
          </article>
          <p className="w-full text-center">Cargando producto...</p>
        </article>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <header
            className={`${
              isEditMode ? "flex-col-reverse items-end" : ""
            } flex items-center justify-between pt-6 px-6`}
          >
            <div
              className={`${
                isEditMode ? "flex justify-between w-full mt-1" : ""
              }`}
            >
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditMode ? `ID Producto - ${product?.id}` : "Nuevo Producto"}
              </h2>
              {isEditMode && (
                <article className="font-semibold text-sm flex items-center gap-2">
                  <p className="text-blue-600">Última actualización:</p>
                  <p className="text-gray-500">
                    {new Date().toLocaleDateString("es-ES")}
                  </p>
                </article>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </header>

          {/* Content */}
          <main className="py-4 px-6 space-y-4">
            {/* Nombre del Producto */}
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-2">
                Nombre Producto*
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={isEditMode ? formData.name : "Nombre producto"}
                className={`${
                  isEditMode ? "text-gray-500" : ""
                } w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-2">
                Descripción
              </label>
              <textarea
                rows={1}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder={
                  isEditMode ? formData.description : "Especificaciones"
                }
                className={`${
                  isEditMode ? "text-gray-500" : ""
                } w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none`}
              />
            </div>

            {/* Categoría y Proveedor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-600 mb-2">
                  Categoría*
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">
                    {isEditMode
                      ? formData.category || "Selecciona categoría"
                      : "Selecciona categoría"}
                  </option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-600 mb-2">
                  Proveedor
                </label>
                <select
                  value={
                    formData.providerIds && formData.providerIds.length > 0
                      ? formData.providerIds[0]
                      : ""
                  }
                  onChange={(e) => {
                    const newId = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      providerIds: newId ? [newId] : [],
                    }));
                  }}
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Selecciona un proveedor</option>
                  {providers.map((provider) => (
                    <option
                      key={provider.id_provider}
                      value={provider.id_provider.toString()}
                    >
                      {provider.name_provider}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stock, Peso y Precio */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-600 mb-2">
                  Uds. en stock
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.amount || ""}
                  onChange={(e) =>
                    handleInputChange("amount", parseInt(e.target.value) || 0)
                  }
                  placeholder={isEditMode ? formData.amount.toString() : "0"}
                  className={`${
                    isEditMode ? "text-gray-500" : ""
                  } w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-600 mb-2">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.weigth || ""}
                  onChange={(e) =>
                    handleInputChange("weigth", parseFloat(e.target.value) || 0)
                  }
                  placeholder={isEditMode ? formData.weigth.toString() : "0.01"}
                  className={`${
                    isEditMode ? "text-gray-500" : ""
                  } w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-blue-600 mb-2">
                  Precio de venta*
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.sellPrice || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "sellPrice",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder={
                    isEditMode ? formData.sellPrice.toString() : "0.00"
                  }
                  className={`${
                    isEditMode ? "text-gray-500" : ""
                  } w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                />
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="text-sm flex justify-center gap-4 pb-6 px-6">
            <button
              onClick={handleCancel}
              className="px-12 py-[6px] text-blue-600 bg-white border border-blue-600 rounded-sm hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-12 py-[6px] text-white bg-blue-600 rounded-sm hover:bg-blue-700 transition-colors"
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
