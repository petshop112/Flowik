import { X, CheckIcon } from 'lucide-react';
import type { ProductSavedModalProps } from '../../types/product';

const ProductSavedModal = ({ title, description, isOpen, onClose }: ProductSavedModalProps) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <article
      className={`bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 ${
        isOpen ? '' : 'hidden'
      }`}
    >
      <article className="border-dark-emerald relative flex h-60 w-full max-w-96 items-center overflow-y-auto rounded-lg border bg-white p-5 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 cursor-pointer text-gray-900 transition-colors hover:text-gray-500"
        >
          <X size={24} />
        </button>
        <main className="w-full text-center">
          <article className="bg-dark-emerald mx-auto mb-2 flex h-6 w-6 items-center justify-center rounded-full">
            <CheckIcon size={18} className="text-white" />
          </article>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="px-6 text-gray-500">{description}</p>
        </main>
      </article>
    </article>
  );
};

export default ProductSavedModal;
