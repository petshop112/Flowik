import React, { useState, useEffect } from 'react';
import { debtService } from '../../api/debtService';
import { paymentService } from '../../api/paymentsService';
import { clientService } from '../../api/clientService';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../features/auth/authSlice';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import SuccessModal from '../modal/SuccessModal';
import { debtColor } from '../../utils/debtColors';
import { useQueryClient } from '@tanstack/react-query';
interface DebtFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClientIds: number[];
}

const DebtFormModal: React.FC<DebtFormModalProps> = ({ isOpen, onClose, selectedClientIds }) => {
  const { token } = useSelector(selectAuth);
  const [clientInfo, setClientInfo] = useState<{ name_client?: string } | null>(null);
  const [mount, setMount] = useState('');
  const [loading, setLoading] = useState(false);

  const [historic, setHistoric] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const totalPages = Math.ceil(historic.length / rowsPerPage);

  const paginatedRows = historic.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const [loadingDebts, setLoadingDebts] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successTitle, setSuccessTitle] = useState('');
  const [successDescription, setSuccessDescription] = useState('');

  const queryClient = useQueryClient();

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

  useEffect(() => {
    if (isOpen && selectedClientIds.length === 1 && token) {
      clientService
        .getClientById(selectedClientIds[0], token)
        .then((res) => {
          const client = Array.isArray(res) ? res[0] : res;
          setClientInfo(client);
        })
        .catch(() => setClientInfo(null));
    }
  }, [isOpen, selectedClientIds, token]);

  const formatFecha = (fecha: string) => {
    const dateObj = new Date(fecha);
    if (isNaN(dateObj.getTime())) return '';
    return dateObj.toLocaleDateString('es-AR');
  };

  const getDiasDeuda = (fechaDeuda: string, fechaModif?: string) => {
    const from = new Date(fechaDeuda);
    const to = fechaModif ? new Date(fechaModif) : new Date();
    const diffMs = to.getTime() - from.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  };

  const totalDebt = historic.reduce((sum, d) => {
    const pagos = (d.payments ?? []).reduce(
      (acc: number, pay: any) => acc + Number(pay.paymentMount ?? 0),
      0
    );
    const resto = Number(d.mount ?? 0) - pagos;
    return sum + (resto > 0 ? resto : 0);
  }, 0);

  if (!isOpen) return null;

  const handleAddDebt = async () => {
    setLoading(true);

    try {
      await Promise.all(
        selectedClientIds.map((id) => debtService.createDebt(id, { mount: Number(mount) }, token!))
      );
      await queryClient.invalidateQueries({ queryKey: ['clientDebts'] });
      setMount('');
      setSuccessTitle('¡Deuda añadida!');
      setSuccessDescription('La deuda se ha añadido correctamente.');
      setShowSuccessModal(true);
      setLoadingDebts(true);
      debtService
        .getDebtsByClient(selectedClientIds[0], token!)
        .then(setHistoric)
        .catch(() => setHistoric([]))
        .finally(() => setLoadingDebts(false));
    } catch (e: any) {
      setSuccessTitle('¡Ups, ocurrió un error!');
      setSuccessDescription(e?.message || 'No se pudo guardar la deuda.');
      setShowSuccessModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDebt = async () => {
    onClose();
  };

  const handleDiscountDebt = async () => {
    setLoading(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      await Promise.all(
        selectedClientIds.map((id) =>
          paymentService.createPayment(
            id,
            {
              paymentMount: Number(mount),
              datePayment: today,
            },
            token!
          )
        )
      );
      await queryClient.invalidateQueries({ queryKey: ['clientDebts'] });
      setSuccessTitle('¡Deuda modificada!');
      setSuccessDescription('La deuda se ha modificado correctamente.');
      setShowSuccessModal(true);
      setMount('');
      setLoadingDebts(true);
      debtService
        .getDebtsByClient(selectedClientIds[0], token!)
        .then(setHistoric)
        .catch(() => setHistoric([]))
        .finally(() => setLoadingDebts(false));
    } catch (e: any) {
      setSuccessTitle('¡Ups, ocurrió un error!');
      setSuccessDescription(e?.message || 'No se pudo descontar la deuda.');
      setShowSuccessModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={successTitle}
        description={successDescription}
      />
      <div className="w-full max-w-3xl rounded-2xl bg-white pt-9">
        <header className="flex items-center justify-between px-8 py-6">
          <h2 className="text-[22px] font-bold text-gray-900">{clientInfo?.name_client}</h2>
          <button
            onClick={onClose}
            className="absolute top-8 right-8 text-xl font-bold text-[#0679C6]"
            aria-label="Cerrar"
          >
            &times;
          </button>
        </header>

        <div className="flex gap-8 border-b border-[#E5EAF7] px-8 pt-4">
          <button
            type="button"
            className="border-b-2 border-[#5685FA] pb-2 text-base font-semibold text-[#396FF9]"
          >
            Administrar deuda
          </button>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-2 px-8 py-8">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-blue-900">Deuda Acumulada</span>
            <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-lg font-semibold text-blue-800">
              <span className="text-2xl text-blue-400">
                <CurrencyDollarIcon className="mr-2 h-9 w-9 text-[#82D8E0]" />
              </span>
              <span className="tracking-widest" style={{ minWidth: '70px' }}>
                {totalDebt.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
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
            <button
              onClick={handleDiscountDebt}
              className="ml-2 rounded-md bg-[#048995] px-3 py-1.5 font-medium text-white transition hover:bg-[#02747a]"
              disabled={!mount}
              type="button"
            >
              Descontar deuda
            </button>
          </div>
        </div>

        <div className="flex flex-col overflow-x-auto px-8 pb-8">
          <table className="w-full rounded-xl border border-blue-100 text-sm text-blue-900">
            <thead className="bg-blue-50">
              <tr>
                <td className="px-2 py-2 text-center align-middle">
                  <input type="checkbox" className="mx-auto h-4 w-4 align-middle" />
                </td>
                <th className="px-2 py-2">Fecha deuda</th>
                <th className="px-2 py-2">Deuda</th>
                <th className="px-2 py-2">Fecha modificación</th>
                <th className="px-2 py-2">Resto deuda</th>
                <th className="flex items-center justify-between gap-1 px-2 py-2">
                  Total días deuda
                  <img className="h-6 w-6" src="/icons/alarma.svg" alt="" />
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
                paginatedRows.map((d, idx) => {
                  const pagos = (d.payments ?? []).reduce(
                    (acc: number, pay: any) => acc + Number(pay.paymentMount ?? 0),
                    0
                  );
                  const resto = Number(d.mount ?? 0) - pagos;
                  return (
                    <tr key={d.debtId ?? idx} className="border-t border-blue-50">
                      <td className="px-2 py-2">
                        <div className="flex items-center justify-center">
                          <input className="h-4 w-4" type="checkbox" />
                        </div>
                      </td>
                      <td className="py-2 pl-4">{formatFecha(d.debt_date)}</td>
                      <td className="py-2 pl-4">
                        $
                        {Number(d.mount ?? 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-2 py-2">
                        {formatFecha(d.modification_date ?? d.modificacion)}
                      </td>
                      <td className="py-2 pl-5">
                        ${resto.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                      </td>

                      <td className="px-2 py-2">
                        <span className="flex w-full items-center justify-between">
                          <span className="leading-none">
                            {getDiasDeuda(d.debt_date, d.modification_date)
                              .toString()
                              .padStart(3, '0')}
                          </span>
                          <span
                            className="inline-block h-6 w-6 rounded-full border border-gray-200"
                            style={{
                              background: debtColor(getDiasDeuda(d.debt_date, d.modification_date)),
                            }}
                            title={`Estado de deuda: ${getDiasDeuda(d.debt_date, d.modification_date)} días`}
                          />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          {historic.length > rowsPerPage && (
            <div className="flex items-center justify-center gap-2 py-4">
              <button
                className="rounded border border-blue-100 px-2 py-1 text-blue-500 disabled:opacity-40"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`rounded px-3 py-1 text-base ${
                    currentPage === i + 1
                      ? 'bg-blue-600 font-semibold text-white'
                      : 'bg-blue-50 text-blue-600'
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="rounded border border-blue-100 px-2 py-1 text-blue-500 disabled:opacity-40"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
          )}
        </div>

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
