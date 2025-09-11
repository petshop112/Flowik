import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { FunctionComponent as FC } from 'react';
interface ImportFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File, provider: string) => Promise<number>;
  providers: string[];
  isLoading?: boolean;
  onError: (message: string) => void;
}

const allowedTypes = [
  'application/pdf',
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const ImportFileModal: FC<ImportFileModalProps> = ({
  isOpen,
  onClose,
  onImport,
  providers,
  isLoading = false,
  onError,
}) => {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [providerError, setProviderError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const type = file.type || '';
      const ext = file.name.toLowerCase().split('.').pop();

      const isAllowedByMime = allowedTypes.includes(type);
      const isAllowedByExt = ['pdf', 'csv', 'xlsx', 'xls'].includes(ext ?? '');

      if (!isAllowedByMime && !isAllowedByExt) {
        setSelectedFile(null);
        setFileError('Formato del archivo no soportado.');
      } else {
        setSelectedFile(file);
        setFileError(null);
      }
    }
  };

  const handleImport = async () => {
    if (!selectedProvider) {
      setProviderError('Selecciona un proveedor');
      return;
    }
    if (!selectedFile) {
      setFileError('Selecciona un archivo.');
      return;
    }

    try {
      const processed = await onImport(selectedFile, selectedProvider);

      if (!processed || processed === 0) {
        onError('No se pudo leer el archivo. Verifique el origen o quite la protección.');
        onClose();
        return;
      }

      onClose();
    } catch (err: any) {
      const msg =
        err?.message === 'EMPTY_IMPORT'
          ? 'No se pudo leer el archivo. Verifique el origen o quite la protección.'
          : err?.message || 'No se pudo leer el archivo. Intente nuevamente.';
      onError(msg);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div
        className="relative min-h-[540px] w-[594px] rounded-[10px] border border-[#5685FA] bg-white p-8 shadow-lg"
        style={{ maxWidth: '96vw' }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 cursor-pointer text-3xl text-[#0679C6]"
          aria-label="Cerrar"
          type="button"
          style={{ lineHeight: 1 }}
        >
          &times;
        </button>

        <h2 className="mb-6 text-center text-2xl font-bold">Importar archivos</h2>

        <div className="mb-4">
          <label className="text-dark-blue mb-2 block border-[#042D95] font-semibold">
            Seleccionar proveedor
          </label>
          <select
            className={`w-full cursor-pointer rounded-md border px-3 py-2 transition-colors ${
              providerError
                ? 'border-red-400 bg-red-50 focus:border-red-400'
                : 'border-[#042D95] focus:border-[#396FF9]'
            }`}
            value={selectedProvider}
            onChange={(e) => {
              setSelectedProvider(e.target.value);
              setProviderError(null);
            }}
          >
            <option value="">Seleccionar proveedor</option>
            {providers.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
          {providerError && (
            <div className="mt-2 flex items-center gap-2 text-base font-medium text-red-600">
              <img src="/icons/alert_import.svg" alt="icono alerta" />
              {providerError}
            </div>
          )}
        </div>

        <div className="mt-8 mb-4">
          <label className="text-dark-blue mb-2 block font-semibold">Seleccionar archivo</label>
          <div className="relative w-full">
            <input
              type="file"
              accept=".pdf,.csv,.xlsx,.xls"
              id="file-upload"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="block w-full cursor-pointer rounded-md border border-[#5685FA] bg-white px-3 py-2 text-center text-[#063CC6]"
            >
              {selectedFile ? selectedFile.name : 'Seleccionar archivo'}
            </label>
          </div>
          {fileError && (
            <div className="mt-2 flex items-center gap-2 text-base font-medium text-red-600">
              <img src="/icons/alert_import.svg" alt="icono alerta" />
              {fileError}
            </div>
          )}
        </div>

        <p className="mb-4 text-center text-lg font-normal text-gray-400">
          Solo podrás subir archivos en formato pdf, excel y csv.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            className="cursor-pointer rounded-md border px-4 py-2 text-[#396FF9]"
            style={{ width: 166, height: 48 }}
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            className="cursor-pointer rounded-md bg-[#5685FA] px-4 py-2 text-white"
            style={{ width: 166, height: 48 }}
            onClick={handleImport}
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? 'Importando...' : 'Importar'}
          </button>
        </div>

        <div className="mt-20 text-center">
          <a
            href="/Instructivo_Importacion_Productos_VALIDACION.pdf"
            className="text-blue-600 underline"
            tabIndex={-1}
            download
          >
            Instrucciones para la importación de archivos
          </a>
        </div>
      </div>
    </div>
  );
};

export default ImportFileModal;
