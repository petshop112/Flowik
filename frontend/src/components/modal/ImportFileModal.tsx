import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { FunctionComponent as FC } from 'react';

interface ImportFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File, provider: string) => void;
  providers: string[];
  isLoading?: boolean;
}

const ImportFileModal: FC<ImportFileModalProps> = ({
  isOpen,
  onClose,
  onImport,
  providers,
  isLoading = false,
}) => {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (selectedFile && selectedProvider) {
      onImport(selectedFile, selectedProvider);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div
        className="min-h-[540px] w-[594px] rounded-[10px] border border-[#5685FA] bg-white p-8 shadow-lg"
        style={{ maxWidth: '96vw' }}
      >
        <h2 className="mb-6 text-center text-2xl font-bold">Importar archivos</h2>
        <div className="mb-4">
          <label className="text-dark-blue mb-2 block font-semibold">Seleccionar proveedor</label>
          <select
            className="w-full rounded-md border px-3 py-2"
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
          >
            <option value="">Selecciona</option>
            {providers.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="text-dark-blue mb-2 block font-semibold">Seleccionar archivo</label>
          <input
            type="file"
            accept=".pdf,.csv,.xlsx,.xls"
            className="w-full rounded-md border px-3 py-2"
            onChange={handleFileChange}
          />
        </div>
        <p className="mb-4 text-center text-lg font-normal text-gray-400">
          Solo podrás subir archivos en formato pdf, excel y csv.
        </p>
        <div className="mt-14 flex items-center justify-center gap-4">
          <button
            className="rounded-md border px-4 py-2 text-[#396FF9]"
            style={{ width: 166, height: 48 }}
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            className="rounded-md bg-[#5685FA] px-4 py-2 text-white"
            style={{ width: 166, height: 48 }}
            onClick={handleImport}
            disabled={!selectedFile || !selectedProvider || isLoading}
          >
            {isLoading ? 'Importando...' : 'Importar'}
          </button>
        </div>
        <div className="mt-14 text-center">
          <a
            href="../../../Instructivo_Importacion_Productos_VALIDACION.pdf"
            className="text-blue-600 underline"
            tabIndex={-1}
            target="_blank"
          >
            Instrucciones para la importación de archivos
          </a>
        </div>
      </div>
    </div>
  );
};

export default ImportFileModal;
