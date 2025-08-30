import { Plus, Package } from 'lucide-react';
import React from 'react';

const EmptyProductsState: React.FC<{ onAddProduct: () => void }> = ({ onAddProduct }) => {
  return (
    <article className="flex min-h-96 flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-6">
        <Package size={48} className="text-gray-400" />
      </div>
      <h3 className="mb-2 text-xl font-medium text-gray-900">
        Aún no tienes productos en tu inventario
      </h3>
      <p className="mb-6 max-w-md text-gray-500">
        Comienza agregando tu primer producto para llevar el control de tu inventario de manera
        eficiente.
      </p>
      <button
        onClick={onAddProduct}
        className="bg-electric-blue flex cursor-pointer items-center gap-2 rounded-md px-6 py-3 text-white transition-colors hover:bg-blue-600"
      >
        <Plus size={18} />
        Agregar primer producto
      </button>
    </article>
  );
};

export default EmptyProductsState;
