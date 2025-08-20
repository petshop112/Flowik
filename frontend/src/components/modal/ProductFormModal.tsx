import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import type {
  ProductFormModalProps,
  ProductUpdateFormData,
  ProductWithOptionalId,
} from "../../types/product";

interface ValidationErrors {
  name?: string;
  description?: string;
  category?: string;
  sellPrice?: string;
  weigth?: string;
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
}) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
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
          providerIds = product.providerIds.map((id) => String(id));
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

        console.log("Product data received:", product);
        console.log("Provider IDs extracted:", providerIds);

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

  const validateField = (
    fieldName: ValidatableFields,
    value: string | number
  ): boolean => {
    const newErrors = { ...errors };
    const stringValue = String(value || "");

    switch (fieldName) {
      case "name":
        if (!stringValue.trim()) {
          newErrors.name = "El nombre del producto es obligatorio.";
        } else if (
          stringValue.trim().length < 2 ||
          stringValue.trim().length > 50
        ) {
          newErrors.name =
            "El nombre del producto debe tener entre 2 y 50 caracteres.";
        } else {
          delete newErrors.name;
        }
        break;

      case "description":
        if (
          stringValue.trim() &&
          (stringValue.trim().length < 10 || stringValue.trim().length > 255)
        ) {
          newErrors.description =
            "La descripción del producto debe tener entre 10 y 255 caracteres.";
        } else {
          delete newErrors.description;
        }
        break;

      case "category":
        if (!stringValue.trim()) {
          newErrors.category = "La categoría del producto es obligatoria.";
        } else if (
          stringValue.trim().length < 3 ||
          stringValue.trim().length > 50
        ) {
          newErrors.category =
            "La categoría del producto debe tener entre 3 y 50 caracteres.";
        } else {
          delete newErrors.category;
        }
        break;

      case "sellPrice":
        {
          const price = parseFloat(stringValue) || 0;
          if (price < 0.01) {
            newErrors.sellPrice = "El precio debe ser mayor o igual a 0.01.";
          } else {
            delete newErrors.sellPrice;
          }
        }
        break;

      case "weigth":
        {
          const weight = parseFloat(stringValue) || 0;
          if (weight < 0.01) {
            newErrors.weigth =
              "El peso del producto debe ser mayor o igual a 0.01.";
          } else {
            delete newErrors.weigth;
          }
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return !newErrors[fieldName];
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (
      ["name", "description", "category", "sellPrice", "weigth"].includes(field)
    ) {
      setTimeout(() => {
        validateField(field as ValidatableFields, value);
      }, 100);
    }
  };

  // Función para validar todo el formulario
  const validateForm = (): boolean => {
    const fields: ValidatableFields[] = [
      "name",
      "description",
      "category",
      "sellPrice",
      "weigth",
    ];
    let isValid = true;

    fields.forEach((field) => {
      const fieldValue = formData[field];
      const fieldValid = validateField(field, fieldValue || "");
      if (!fieldValid) isValid = false;
    });

    return isValid;
  };

  // Verificar si hay errores activos
  const hasErrors = Object.keys(errors).length > 0;

  // Verificar si los campos obligatorios están llenos
  const hasRequiredFields =
    formData.name.trim() &&
    formData.category.trim() &&
    formData.sellPrice > 0 &&
    formData.weigth > 0;

  // El botón se desactiva si hay errores O si faltan campos obligatorios
  const isFormInvalid = hasErrors || !hasRequiredFields;

  const handleSave = () => {
    if (!validateForm()) {
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
    <article className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center p-4 z-50">
      {isLoading ? (
        <article className="flex flex-col justify-center items-center bg-white rounded-lg shadow-xl w-full max-w-4xl h-[88vh] overflow-y-auto">
          <article className="relative">
            <div className="h-12 w-12 rounded-full border-4 border-gray-300"></div>
            <div className="h-12 w-12 rounded-full border-4 border-blue-600 border-t-transparent absolute top-0 left-0 animate-spin"></div>
          </article>
          <p className="w-full text-center">Cargando producto...</p>
        </article>
      ) : (
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <header className="flex items-center justify-between pt-12 px-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              {isEditMode ? `ID Producto - ${product?.id}` : "Alta de Producto"}
            </h2>
            <article className="font-semibold text-sm flex items-center gap-1">
              <p className="text-dark-blue">Última actualización:</p>
              <p className="text-gray-500">
                {new Date().toLocaleDateString("es-ES")}
              </p>
            </article>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-blue-ocean hover:text-gray-600 transition-colors"
            >
              <X size={22} />
            </button>
          </header>

          {/* Content */}
          <main className="py-4 px-8 space-y-4">
            {/* Nombre del Producto */}
            <div>
              <label className="block text-sm font-medium text-dark-blue mb-2">
                Nombre Producto*
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                onBlur={() => validateField("name", formData.name)}
                placeholder={isEditMode ? formData.name : "Nombre producto"}
                className={`${
                  isEditMode ? "text-gray-500" : ""
                } w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                maxLength={50}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-dark-blue mb-2">
                Descripción
              </label>
              <textarea
                rows={1}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                onBlur={() =>
                  validateField("description", formData.description)
                }
                placeholder={
                  isEditMode ? formData.description : "Especificaciones"
                }
                className={`${
                  isEditMode ? "text-gray-500" : ""
                } w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none`}
                maxLength={255}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Categoría y Proveedor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-blue mb-2">
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  onBlur={() => validateField("category", formData.category)}
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">
                    {isEditMode ? formData.category : "Categoría"}
                  </option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-blue mb-2">
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
                  <option value="">Selecciona proveedor</option>
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
                <label className="block text-sm font-medium text-dark-blue mb-2">
                  Uds. en stock
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.amount || ""}
                  onChange={(e) =>
                    handleInputChange("amount", parseInt(e.target.value) || 0)
                  }
                  placeholder={isEditMode ? formData.amount.toString() : "Uds."}
                  className={`${
                    isEditMode ? "text-gray-500" : ""
                  } w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-blue mb-2">
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
                  onBlur={() => validateField("weigth", formData.weigth)}
                  placeholder={isEditMode ? formData.weigth.toString() : "Kg"}
                  className={`${
                    isEditMode ? "text-gray-500" : ""
                  } w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                />
                {errors.weigth && (
                  <p className="text-red-500 text-sm mt-1">{errors.weigth}</p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-dark-blue mb-2">
                  Precio de venta
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
                  onBlur={() => validateField("sellPrice", formData.sellPrice)}
                  placeholder={
                    isEditMode ? formData.sellPrice.toString() : "000.000"
                  }
                  className={`${
                    isEditMode ? "text-gray-500" : ""
                  } w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                />
                {errors.sellPrice && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.sellPrice}
                  </p>
                )}
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="text-sm flex justify-center gap-4 pb-6 px-8 [&>button]:px-12 [&>button]:py-[6px] [&>button]:transition-colors">
            <button
              onClick={handleCancel}
              className="text-electric-blue bg-white border border-electric-blue rounded-sm hover:bg-gray-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isFormInvalid}
              className={`text-white rounded-sm ${
                isFormInvalid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-electric-blue hover:bg-blue-500 cursor-pointer"
              }`}
            >
              Guardar
            </button>
          </footer>
        </div>
      )}
    </article>
  );
};

export default ProductFormModal;
