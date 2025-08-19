import { X } from 'lucide-react';
import type { DeleteProductConfirmationModalProps } from '../../types/product';

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
    <article className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="mx-4 w-full max-w-md rounded-lg bg-gray-800 p-6 text-center">
        <header className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={closeDeleteModal}
            className="rounded-lg bg-gray-600 p-2 text-white transition-colors hover:bg-gray-700"
          >
            <X size={18} />
          </button>
        </header>
        <main>
          <h2 className="mb-4 text-xl font-bold text-white">Confirmar eliminación</h2>
          <p className="mb-6 text-gray-300">
            ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
          </p>
        </main>
        <footer className="mt-6 flex justify-center space-x-3">
          <button
            type="button"
            onClick={closeDeleteModal}
            className="rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={actionLoading}
            className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {actionLoading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </footer>
      </div>
    </article>
  );
}
