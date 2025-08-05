import { type FormEvent } from "react";
import { X } from "lucide-react";
import type { ProductModalProps } from "../../types/product";

export function ProductModal({
  showModal,
  editingProduct,
  formData,
  actionLoading,
  closeModal,
  handleSubmit,
  handleInputChange,
}: ProductModalProps) {
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await handleSubmit();
  };

  if (!showModal) {
    return null;
  }

  return (
    <article className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg py-4 p-6 w-full max-w-md mx-4">
        <header className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {editingProduct ? "Editar Producto" : "Agregar Producto"}
          </h2>
          <button
            type="button"
            onClick={closeModal}
            className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </header>

        <form onSubmit={onSubmit}>
          <main className="space-y-2">
            <div>
              <label
                htmlFor="title"
                className="block text-white text-sm font-medium mb-2"
              >
                Nombre
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-white text-sm font-medium mb-2"
              >
                Precio
              </label>
              <input
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-white text-sm font-medium mb-2"
              >
                Categoría
              </label>
              <input
                id="category"
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-white text-sm font-medium mb-2"
              >
                URL de la imagen
              </label>
              <input
                id="image"
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-white text-sm font-medium mb-2"
              >
                Descripción
                <span className="text-gray-400 text-xs ml-2">
                  ({formData.description.length}/145)
                </span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
                maxLength={145}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción del producto (máximo 145 caracteres)"
              />
            </div>
          </main>

          <footer className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {actionLoading
                ? "Guardando..."
                : editingProduct
                ? "Actualizar"
                : "Crear"}
            </button>
          </footer>
        </form>
      </div>
    </article>
  );
}
