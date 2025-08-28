import React, { useState, useEffect } from 'react';
import { debtService } from '../../api/debtService';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../features/auth/authSlice';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface DebtFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClientIds: number[];
}

const DebtFormModal: React.FC<DebtFormModalProps> = ({ isOpen, onClose, selectedClientIds }) => {
  const { token } = useSelector(selectAuth);
  const [mount, setMount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [historic, setHistoric] = useState<any[]>([]);
  const [loadingDebts, setLoadingDebts] = useState(false);

  useEffect(() => {
    if (isOpen && selectedClientIds.length === 1) {
      setLoadingDebts(true);
      debtService
        .getDebtsByClient(selectedClientIds[0], token!)
        .then(setHistoric)
        .catch(() => setHistoric([]))
        .finally(() => setLoadingDebts(false));
    }
  }, [isOpen, selectedClientIds, token]);

  const [debt, setDebt] = useState<
    Array<{
      fecha: string;
      mount: string;
      modificacion: string;
      resto: string;
      dias: string;
    }>
  >([]);

  if (!isOpen) return null;

  const handleAddDebt = () => {
    setDebt((prev) => [
      ...prev,
      {
        fecha: new Date().toLocaleDateString(),
        mount,
        modificacion: new Date().toLocaleDateString(),
        resto: mount,
        dias: '000',
      },
    ]);
    setMount('');
  };

  const handleSaveDebt = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all(
        selectedClientIds.map((id) => debtService.createDebt(id, { mount: Number(mount) }, token!))
      );
      setSuccess(true);
      setMount('');
      setDebt([]);
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Error al guardar deuda');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white pt-9">
        {/* HEADER */}
        <header className="flex items-center justify-between px-8 py-6">
          <h2 className="text-[22px] font-semibold text-gray-900">
            ID – {selectedClientIds[0] ?? 'N/A'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md px-2 text-2xl text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </header>

        {/* TABS */}
        <div className="flex gap-8 border-b border-[#E5EAF7] px-8 pt-4">
          <button
            type="button"
            className="border-b-2 border-transparent pb-2 text-base font-medium text-gray-400"
            // las tabs ponlo aquiii
          >
            Detalles del cliente
          </button>
          <button
            type="button"
            className="border-b-2 border-blue-500 pb-2 text-base font-semibold text-blue-900"
          >
            Administrar deuda
          </button>
        </div>

        {/* INFORMACION ARRIBA */}
        <div className="flex flex-wrap items-end justify-between gap-2 px-8 py-8">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-blue-900">Deuda Acumulada</span>
            <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-lg font-semibold text-blue-800">
              <span className="text-2xl text-blue-400">
                <CurrencyDollarIcon className="mr-2 h-9 w-9 text-[#82D8E0]" />
              </span>
              <span className="tracking-widest" style={{ minWidth: '70px' }}>
                000.000
              </span>
            </div>
          </div>
          {/* INPUT mount + AGREGAR */}
          <div className="flex items-end gap-2">
            <div className="flex flex-col items-start">
              <label className="mb-1 text-xs font-semibold text-blue-900">Monto</label>
              <div className="flex items-center rounded-md border border-[#042D95]">
                <input
                  type="number"
                  className="w-30 border-none bg-transparent px-3 py-1.5 text-right text-lg"
                  value={mount}
                  onChange={(e) => setMount(e.target.value)}
                  placeholder="000.000"
                />
                <span className="ml-2">
                  <CurrencyDollarIcon className="mr-2 h-4 w-4 text-[#5685FA]" />
                </span>
              </div>
            </div>
            <button
              onClick={handleAddDebt}
              className="ml-2 rounded-md bg-[#5685FA] px-3 py-1.5 font-medium text-white transition hover:bg-blue-600"
              type="button"
            >
              Agregar deuda
            </button>
            
          </div>
        </div>

        <div className="flex gap-2 px-8 pb-2">
          <button className="flex items-center gap-1 text-sm">
            <svg width={18} height={18} fill="none">
              <circle cx={9} cy={9} r={7} stroke="#d2d2d2" strokeWidth={2} />
            </svg>
            Desactivar
          </button>
          <button className="flex items-center gap-1 text-sm">
            <svg width={18} height={18} fill="none">
              <rect x={4} y={7} width={10} height={4} fill="#d2d2d2" />
            </svg>
            Eliminar
          </button>
        </div>

        {/* TABLA DEUDA */}
        <div className="flex flex-col overflow-x-auto px-8 pb-8">
          <table className="w-full rounded-xl border border-blue-100 text-sm text-blue-900">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-2 py-2">
                  <input type="checkbox" />
                </th>
                <th className="px-2 py-2">Fecha deuda</th>
                <th className="px-2 py-2">Deuda</th>
                <th className="px-2 py-2">Fecha modificación</th>
                <th className="px-2 py-2">Resto deuda</th>
                <th className="flex items-center justify-center gap-1 px-2 py-2">
                  Total días deuda
                  <svg className="ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#9CB7FC">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </th>
              </tr>
            </thead>
            <tbody>
              {loadingDebts ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-blue-400">
                    Cargando historial...
                  </td>
                </tr>
              ) : historic.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-blue-200">
                    No hay deudas registradas.
                  </td>
                </tr>
              ) : (
                historic.map((d, idx) => (
                  <tr key={d.debtId ?? idx} className="border-t border-blue-50">
                    <td className="px-2 py-2">
                      <input type="checkbox" />
                    </td>
                    <td className="px-2 py-2">{d.debt_date}</td>
                    <td className="px-2 py-2">${d.mount}</td>
                    <td className="px-2 py-2">{d.modification_date || d.modificacion}</td>
                    <td className="px-2 py-2">${d.rest_amount ?? d.resto}</td>
                    <td className="px-2 py-2">dd{d.status ?? '---'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER BOTONES */}
        <div className="flex justify-center gap-4 px-8 pb-8">
          <button
            className="h-11 rounded-md border border-blue-100 bg-blue-50 px-8 text-base font-medium text-blue-500 transition hover:bg-blue-100"
            type="button"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="h-11 rounded-md bg-blue-600 px-8 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
            type="button"
            onClick={handleSaveDebt}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebtFormModal;
