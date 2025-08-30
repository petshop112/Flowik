import { type FormEvent } from 'react';
import { X } from 'lucide-react';
import type { ProductModalProps } from '../../types/product';

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
    <article className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="mx-4 w-full max-w-md rounded-lg bg-gray-800 p-6 py-4">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
          </h2>
          <button
            type="button"
            onClick={closeModal}
            className="rounded-lg bg-gray-600 p-2 text-white transition-colors hover:bg-gray-700"
          >
            <X size={18} />
          </button>
        </header>

        <form onSubmit={onSubmit}>
          <main className="space-y-2">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-medium text-white">
                Nombre
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full rounded-lg bg-gray-700 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="price" className="mb-2 block text-sm font-medium text-white">
                Precio
              </label>
              <input
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                className="w-full rounded-lg bg-gray-700 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="category" className="mb-2 block text-sm font-medium text-white">
                Categoría
              </label>
              <input
                id="category"
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full rounded-lg bg-gray-700 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="image" className="mb-2 block text-sm font-medium text-white">
                URL de la imagen
              </label>
              <input
                id="image"
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full rounded-lg bg-gray-700 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-white">
                Descripción
                <span className="ml-2 text-xs text-gray-400">
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
                className="w-full rounded-lg bg-gray-700 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Descripción del producto (máximo 145 caracteres)"
              />
            </div>
          </main>

          <footer className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {actionLoading ? 'Guardando...' : editingProduct ? 'Actualizar' : 'Crear'}
            </button>
          </footer>
        </form>
      </div>
    </article>
  );
}
