import React from 'react';
import ReactDOM from 'react-dom';

interface ImportErrorModalProps {
  title?: string;
  errorMessage: string;
  onClose: () => void;
  buttonText?: string;
}

const ImportErrorModal: React.FC<ImportErrorModalProps> = ({ errorMessage, onClose }) => {
  if (typeof document === 'undefined') return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex w-full items-center justify-center bg-black/30">
      <div className="relative h-[300px] w-[480px] rounded-lg border border-[#C60633] bg-white p-8 shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 cursor-pointer text-4xl font-[300] text-black"
          aria-label="Cerrar"
          type="button"
          style={{ lineHeight: 1 }}
        >
          &times;
        </button>
        <div className="mt-8 flex flex-col items-center">
          <img className="mb-4 h-[30px] w-[30px]" src="/icons/x-circle.svg" alt="error icon" />
          <h3 className="mb-2 text-xl font-bold text-black">Error de carga</h3>
          <p className="mb-6 text-center text-gray-600">{errorMessage}</p>
          <button
            className="h-[48px] w-[166px] cursor-pointer rounded-md bg-[#C60633] px-6 py-2 font-semibold text-white"
            onClick={onClose}
          >
            Reintentar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ImportErrorModal;
