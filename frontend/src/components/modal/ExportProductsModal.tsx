import type { FC } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

interface Product {
  id: number;
  name: string;
  sellPrice: number;
}

interface ExportProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRemove: (id: number) => void;
  onExport: () => void;
  isExporting?: boolean;
}

const ExportProductsModal: FC<ExportProductsModalProps> = ({
  isOpen,
  onClose,
  products,
  onRemove,
  onExport,
  isExporting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="relative w-[540px] rounded-[10px] border border-blue-400 bg-white p-8">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 cursor-pointer text-3xl text-[#0679C6]"
          aria-label="Cerrar"
          type="button"
        >
          &times;
        </button>
        <h2 className="mb-6 text-left text-2xl font-bold">Exportar Productos</h2>
        <div className="mb-8 max-h-72 overflow-y-auto rounded-2xl border border-[#5685FA] bg-white p-0">
          <table className="w-full">
            <thead className="bg-polar-mist">
              <tr className="[&>th]:border-l [&>th]:border-[#F2F6F8] [&>th]:px-4 [&>th]:py-3 [&>th]:text-left [&>th:first-child]:border-l-0">
                <th className="py-3 font-normal">Nombre producto</th>
                <th className="py-3 font-normal">Precio</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-400">
                    No hay productos seleccionados
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr
                    key={prod.id}
                    className="border-b border-[#F2F6F8] transition-colors last:border-none hover:bg-gray-50"
                  >
                    <td className="border-l border-[#F2F6F8] px-4 py-2 text-sm">{prod.name}</td>
                    <td className="border-l border-[#F2F6F8] px-4 py-2 text-sm">
                      ${prod.sellPrice.toLocaleString('es-VE')}
                    </td>
                    <td className="border-l border-[#F2F6F8] p-0 text-center align-middle">
                      <button
                        onClick={() => onRemove(prod.id)}
                        className="m-0 flex items-center justify-center p-0 text-[#F82254] hover:text-[#B3123A]"
                        title="Eliminar"
                      >
                        <TrashIcon className="h-5 w-5 text-[#5685FA]" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            className="rounded-md border px-6 py-2 text-[#396FF9]"
            onClick={onClose}
            style={{ width: 120 }}
            disabled={isExporting}
          >
            Cancelar
          </button>
          <button
            className="rounded-md bg-[#5685FA] px-6 py-2 text-white"
            onClick={onExport}
            style={{ width: 148 }}
            disabled={products.length === 0 || isExporting}
          >
            {isExporting ? 'Generando...' : 'Generar PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportProductsModal;
