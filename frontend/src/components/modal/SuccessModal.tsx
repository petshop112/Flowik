import { X, CheckIcon } from 'lucide-react';
import React from 'react';

export type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  id?: number | string;
};

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, title, description, id }) => {
  if (!isOpen) return null;
  return (
    <article className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <article
        className="relative inline-flex w-full max-w-xl flex-col items-center justify-center overflow-y-auto"
        style={{
          height: 'auto',
          minHeight: '270px',
          padding: '40px',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px',
          flexShrink: 0,
          borderRadius: '8px',
          border: '1px solid var(--Additional-800, #03634B)',
          background: 'var(--White, #FFF)',
          boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.25)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 cursor-pointer text-gray-900 transition-colors hover:text-gray-500"
        >
          <X size={24} />
        </button>
        <main className="w-full text-center">
          <article className="bg-dark-emerald mx-auto mb-2 flex h-6 w-6 items-center justify-center rounded-full">
            <CheckIcon size={18} className="text-white" />
          </article>
          <h2 className="text-lg font-semibold text-gray-900" style={{ marginBottom: id ? 0 : 8 }}>
            {title}
          </h2>
          <p
            className="text-center text-gray-500"
            style={{
              fontFamily: 'var(--Font-family-Albert-Sans, "Albert Sans")',
              fontSize: 'var(--font-size-M, 16px)',
              fontWeight: 400,
              fontStyle: 'normal',
              lineHeight: '120%',
            }}
          >
            {description}
          </p>
        </main>
      </article>
    </article>
  );
};

export default SuccessModal;
