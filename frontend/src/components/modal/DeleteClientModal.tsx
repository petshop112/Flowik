import React from 'react';

interface DeleteClientModalProps {
  isOpen: boolean;
  clientName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

const DeleteClientModal: React.FC<DeleteClientModalProps> = ({
  isOpen,
  clientName,
  onConfirm,
  onCancel,
  isDeleting,
}) => {
  if (!isOpen) return null;
  return (
    <article className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-lg border border-red-300 bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <span className="text-red-600">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2a1 1 0 0 1 1 1v1h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6V3a1 1 0 0 1 1-1zm7 6v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8h14zm-2 2H7v10h10V10z"
                />
              </svg>
            </span>
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">
            ¿Quieres eliminar a {clientName}?
          </h2>
          <p className="mb-6 text-gray-700">
            Vas a eliminar a <span className="font-semibold">{clientName}</span>. Esta acción es
            permanente y no podrás deshacerla.
          </p>
          <div className="flex w-full justify-center gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="h-12 w-32 rounded-md border border-gray-300 bg-white font-medium text-red-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isDeleting}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="h-12 w-32 rounded-md bg-red-600 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando…' : 'Eliminar'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default DeleteClientModal;
