import React from 'react';
import { X } from 'lucide-react';
import type { ProductWithOptionalId } from '../../types/product';
import type { ProviderFormData } from '../../types/provider';

interface ProductViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: ProductWithOptionalId | null;
  providers?: ProviderFormData[];
  categories?: string[];
}

const ProductViewModal: React.FC<ProductViewModalProps> = ({
  isOpen,
  onClose,
  product,
  providers = [],
  categories = [],
}) => {
  if (!isOpen || !product) return null;

  let providerNames: string[] = [];
  if (product.providers && product.providers.length > 0) {
    providerNames = product.providers;
  } else if (product.providerIds && product.providerIds.length > 0) {
    providerNames = product.providerIds
      .map((id) => providers.find((p) => p.id_provider.toString() === id)?.name_provider || '')
      .filter((name) => name);
  }
  const providerDisplay = providerNames.length > 0 ? providerNames.join(', ') : '-';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-xl">
        <header className="flex items-center justify-between px-8 pt-8 pb-2">
          <h2 className="text-2xl font-semibold text-[#1E3A8A]">Ver Producto</h2>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 cursor-pointer text-[#3B82F6] transition-colors hover:text-[#1E3A8A]"
          >
            <X size={24} />
          </button>
        </header>
        <div className="px-8 pt-2 pb-0">
          <nav className="mb-6 border-b border-[#E5EAF2]">
            <span className="inline-block border-b-2 border-[#3B82F6] pb-2 text-sm font-semibold text-[#1E3A8A]">
              Detalles del producto
            </span>
          </nav>
          <form className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#1E3A8A]">Nombre</label>
                <input
                  type="text"
                  value={product.name}
                  disabled
                  className="w-full rounded-md border border-[#DFE7FF] bg-white px-3 py-2 text-[15px] text-[#042D95]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#1E3A8A]">Categoría</label>
                <input
                  type="text"
                  value={
                    categories.includes(product.category) ? product.category : product.category
                  }
                  disabled
                  className="w-full rounded-md border border-[#DFE7FF] bg-white px-3 py-2 text-[15px] text-[#042D95]"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#1E3A8A]">Descripción</label>
              <input
                type="text"
                value={product.description}
                disabled
                className="w-full rounded-md border border-[#DFE7FF] bg-white px-3 py-2 text-[15px] text-[#042D95]"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#1E3A8A]">Proveedor</label>
                <input
                  type="text"
                  value={providerDisplay}
                  disabled
                  className="w-full rounded-md border border-[#DFE7FF] bg-white px-3 py-2 text-[15px] text-[#042D95]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#1E3A8A]">
                  Uds. en stock
                </label>
                <input
                  type="text"
                  value={product.amount}
                  disabled
                  className="w-full rounded-md border border-[#DFE7FF] bg-white px-3 py-2 text-[15px] text-[#042D95]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#1E3A8A]">
                  Precio de venta
                </label>
                <input
                  type="text"
                  value={`$ ${product.sellPrice}`}
                  disabled
                  className="w-full rounded-md border border-[#DFE7FF] bg-white px-3 py-2 text-[15px] text-[#042D95]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#1E3A8A]">
                  Fecha de compra
                </label>
                <input
                  type="text"
                  value={product.buyDate}
                  disabled
                  className="w-full rounded-md border border-[#DFE7FF] bg-white px-3 py-2 text-[15px] text-[#042D95]"
                />
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 pt-2 pb-2">
              <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-md border border-[#D6E3FF] bg-[#F5F9FF] px-6 text-[15px] font-medium text-[#6A88D9] hover:bg-[#ECF3FF]"
              >
                Cerrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductViewModal;
