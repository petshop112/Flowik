import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Product {
  id?: number;
  name: string;
  category: string;
  amount: number;
  sellPrice: number;
  weight: number;
  buyDate: string;
  expiration: string;
  supplierNames: string[];
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product?: Product | null; // Si es null/undefined = modo crear, si tiene datos = modo editar
  suppliers: string[]; // Lista de proveedores disponibles
  categories: string[]; // Lista de categorías disponibles
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  product,
  suppliers = [],
  categories = [],
}) => {
  const [formData, setFormData] = useState<Product>({
    name: "",
    category: "",
    amount: 0,
    sellPrice: 0,
    weight: 0,
    buyDate: "",
    expiration: "",
    supplierNames: [],
  });

  const [selectedSupplier, setSelectedSupplier] = useState("");

  const isEditMode = !!product;

  // Resetear formulario cuando se abre/cierra el modal o cambia el producto
  useEffect(() => {
    if (isOpen) {
      if (product) {
        // Modo edición - cargar datos del producto
        setFormData({
          ...product,
          buyDate: product.buyDate || "",
          expiration: product.expiration || "",
        });
        setSelectedSupplier(product.supplierNames[0] || "");
      } else {
        // Modo creación - limpiar formulario
        setFormData({
          name: "",
          category: "",
          amount: 0,
          sellPrice: 0,
          weight: 0,
          buyDate: "",
          expiration: "",
          supplierNames: [],
        });
        setSelectedSupplier("");
      }
    }
  }, [isOpen, product]);

  const handleInputChange = (field: keyof Product, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSupplierChange = (supplier: string) => {
    setSelectedSupplier(supplier);
    setFormData((prev) => ({
      ...prev,
      supplierNames: supplier ? [supplier] : [],
    }));
  };

  const handleSave = () => {
    // Validaciones básicas
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

    const productToSave = {
      ...formData,
      supplierNames: selectedSupplier ? [selectedSupplier] : [],
    };

    onSave(productToSave);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between pt-6 px-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditMode ? `ID Producto - ${product?.id}` : "Nuevo Producto"}
            </h2>
            {isEditMode && (
              <p className="text-sm text-gray-500 mt-1">
                Última actualización: {new Date().toLocaleDateString("es-ES")}
              </p>
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
            <label className="block text-sm font-medium text-dark-blue mb-2">
              Nombre Producto*
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder={isEditMode ? formData.name : "Nombre producto"}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-dark-blue mb-2">
              Descripción
            </label>
            <textarea
              rows={1}
              placeholder={
                isEditMode ? "Descripción del producto" : "Especificaciones"
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Categoría y Proveedor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-blue mb-2">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">
                  {isEditMode
                    ? formData.category || "Selecciona categoría"
                    : "Categoría"}
                </option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-blue mb-2">
                Proveedor
              </label>
              <select
                value={selectedSupplier}
                onChange={(e) => handleSupplierChange(e.target.value)}
                className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">
                  {isEditMode ? selectedSupplier : "Proveedor"}
                </option>
                {suppliers.map((supplier) => (
                  <option key={supplier} value={supplier}>
                    {supplier}
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
                value={formData.amount || ""}
                onChange={(e) =>
                  handleInputChange("amount", parseInt(e.target.value) || 0)
                }
                // placeholder={isEditMode ? formData.amount.toString() : "Uds."}
                placeholder="Hola Amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-blue mb-2">
                Peso (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.weight || ""}
                onChange={(e) =>
                  handleInputChange("weight", parseFloat(e.target.value) || 0)
                }
                // placeholder={isEditMode ? formData.weight.toString() : "Kg"}
                placeholder="Hola Kg"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-dark-blue mb-2">
                Precio de venta
              </label>
              <input
                type="number"
                value={formData.sellPrice || ""}
                onChange={(e) =>
                  handleInputChange(
                    "sellPrice",
                    parseFloat(e.target.value) || 0
                  )
                }
                // placeholder={
                //   isEditMode ? formData.sellPrice.toString() : "000,00"
                // }
                placeholder="Hola SellPrice"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-sm flex justify-center gap-4 pb-6 px-6">
          <button
            onClick={handleCancel}
            className="px-12 py-[6px] text-electric-blue bg-white border border-electric-blue rounded-sm hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-12 py-[6px] text-white bg-electric-blue rounded-sm hover:bg-blue-700 transition-colors"
          >
            Guardar
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ProductFormModal;
