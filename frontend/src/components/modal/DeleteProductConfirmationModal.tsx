import { X } from "lucide-react";
import type { DeleteProductConfirmationModalProps } from "../../types/product";

export function DeleteProductConfirmationModal({
  showDeleteModal,
  actionLoading,
  closeDeleteModal,
  handleDelete,
}: DeleteProductConfirmationModalProps) {
  if (!showDeleteModal) {
    return null;
  }

  return (
    <article className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 text-center">
        <header className="flex justify-end mb-4">
          <button
            type="button"
            onClick={closeDeleteModal}
            className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </header>
        <main>
          <h2 className="text-xl font-bold text-white mb-4">
            Confirmar eliminación
          </h2>
          <p className="text-gray-300 mb-6">
            ¿Estás seguro de que deseas eliminar este producto? Esta acción no
            se puede deshacer.
          </p>
        </main>
        <footer className="flex justify-center space-x-3 mt-6">
          <button
            type="button"
            onClick={closeDeleteModal}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={actionLoading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {actionLoading ? "Eliminando..." : "Eliminar"}
          </button>
        </footer>
      </div>
    </article>
  );
}
