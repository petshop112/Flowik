import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useGetDebtsByClient, useCreateDebt } from '../../hooks/useDebts';
import type { Debt, Payment } from '../../types/debt';
import { paymentService } from '../../api/paymentsService';
import { clientService } from '../../api/clientService';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../features/auth/authSlice';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import SuccessModal from '../modal/SuccessModal';
import { debtColor } from '../../utils/debtColors';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip';

interface DebtFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClientIds: number[];
}

const DebtFormModal: React.FC<DebtFormModalProps> = ({ isOpen, onClose, selectedClientIds }) => {
  const { token } = useSelector(selectAuth);
  const [clientInfo, setClientInfo] = useState<{ name_client?: string } | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successTitle, setSuccessTitle] = useState('');
  const [successDescription, setSuccessDescription] = useState('');

  const clientId = selectedClientIds[0];
  const {
    data: debtHistory = [],
    isLoading: loadingDebts,
    refetch: refetchDebts,
  } = useGetDebtsByClient(clientId);

  const createDebt = useCreateDebt();

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

  const sortedDebtHistory = [...debtHistory].sort(
    (a, b) => new Date(b.debt_date).getTime() - new Date(a.debt_date).getTime()
  );
  const totalPages = Math.ceil(debtHistory.length / rowsPerPage);
  const paginatedRows = sortedDebtHistory.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const formatDate = (date: string) => {
    const [y, m, d] = date.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('es-AR');
  };

  const getDebtDays = (debtDate: string) => {
    const from = new Date(debtDate);
    const to = new Date();
    const diffMs = to.getTime() - from.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  };

  const totalDebt = debtHistory.reduce((sum: number, d: Debt) => {
    const payments = d.payments.reduce(
      (acc: number, pay: Payment) => acc + Number(pay.paymentMount ?? 0),
      0
    );
    const remaining = d.mount - payments;
    return sum + (remaining > 0 ? remaining : 0);
  }, 0);

  if (!isOpen) return null;

  const handleAddDebt = async () => {
    setLoading(true);
    try {
      await Promise.all(
        selectedClientIds.map((id) =>
          createDebt.mutateAsync({ clientId: id, payload: { mount: Number(amount) } })
        )
      );
      setAmount('');
      setSuccessTitle('¡Deuda añadida!');
      setSuccessDescription('La deuda se ha añadido correctamente.');
      setShowSuccessModal(true);
      refetchDebts();
      queryClient.invalidateQueries({ queryKey: ['clientDebts'] });
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
              paymentMount: Number(amount),
              datePayment: today,
            },
            token!
          )
        )
      );
      setSuccessTitle('¡Deuda modificada!');
      setSuccessDescription('La deuda se ha modificado correctamente.');
      setShowSuccessModal(true);
      setAmount('');
      refetchDebts();
      queryClient.invalidateQueries({ queryKey: ['clientDebts'] });
    } catch (e: any) {
      setSuccessTitle('¡Ups, ocurrió un error!');
      setSuccessDescription(
        e?.response?.data?.message || e?.message || 'No se pudo descontar la deuda.'
      );
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
            <div className="flex flex-col gap-2 rounded-lg border-2 border-[#9CB7FC] px-3 py-2 text-lg font-semibold text-blue-800">
              <span className="mb-2 text-sm font-semibold text-[#042D95]">Deuda Acumulada</span>
              <div className="flex items-center">
                <span className="text-2xl text-blue-400">
                  <CurrencyDollarIcon className="mr-2 h-8 w-8 text-[#82D8E0]" />
                </span>
                <span className="tracking-widest" style={{ minWidth: '70px' }}>
                  {totalDebt.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <div className="flex flex-col items-start">
              <label className="mb-1 text-base font-semibold text-[#042D95]">Monto</label>
              <div className="flex items-center rounded-md border border-[#042D95]">
                <input
                  type="number"
                  min={1}
                  className="w-30 border-none bg-transparent px-3 py-2 text-right text-lg"
                  value={amount}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAmount(val === '' ? '' : String(Math.max(1, Number(val))));
                  }}
                  placeholder="000.000"
                />
                <span className="ml-2">
                  <CurrencyDollarIcon className="mr-2 h-4 w-4 text-[#5685FA]" />
                </span>
              </div>
            </div>
            <button
              onClick={handleAddDebt}
              className="text- ml-2 rounded-md bg-[#5685FA] px-3 py-2.5 text-white transition hover:bg-blue-600"
              type="button"
              disabled={Number(amount) <= 0}
            >
              Agregar deuda
            </button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleDiscountDebt}
                    className="ml-2 flex items-center rounded-md bg-[#048995] px-3 py-2.5 text-white transition hover:bg-[#02747a]"
                    disabled={!amount || Number(amount) <= 0}
                    type="button"
                  >
                    Descontar deuda
                    <InformationCircleIcon className="ml-1 h-6 w-6" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="center"
                  className="relative rounded-xl bg-[#CFEAFB] px-3 py-2 text-xs shadow-md ring-1 ring-blue-200"
                >
                  El monto ingresado se descontará comenzando por la deuda más antigua pendiente. Si
                  sobra algo, se aplicará al resto de tus deudas pendientes.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="mx-8 mb-8 flex flex-col overflow-hidden overflow-x-auto rounded-xl border border-[#9cb7fc] bg-white shadow-sm">
          <div className="flex flex-col overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-50">
                <tr className="[&>th]:border-l-2 [&>th]:border-white [&>th]:px-4 [&>th]:py-3 [&>th]:text-left [&>th]:font-normal">
                  <th className="px-2 py-2">Fecha deuda</th>
                  <th className="px-2 py-2">Deuda</th>
                  <th className="px-2 py-2">Fecha última modificación/pago</th>
                  <th className="px-2 py-2">Resto deuda</th>
                  <th className="w-[120px] px-6 py-2">
                    <span className="flex items-center">
                      Descuentos de deudas
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InformationCircleIcon className="ml-0.5 h-5 w-5" />
                          </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            align="center"
                            className="relative rounded-xl bg-[#CFEAFB] px-3 py-2 text-xs shadow-md ring-1 ring-blue-200"
                          >
                            Aquí verás los descuentos aplicados a la deuda.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>
                  </th>
                  <th className="flex items-center justify-between gap-1 px-1 py-2">
                    Total días
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InformationCircleIcon className="ml-0.5 h-7 w-7" />
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          align="center"
                          className="relative rounded-xl bg-[#CFEAFB] px-3 py-2 text-xs shadow-md ring-1 ring-blue-200"
                        >
                          Aquí verás los días que lleva la deuda en específico.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loadingDebts ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-blue-400">
                      Cargando historial...
                    </td>
                  </tr>
                ) : debtHistory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-blue-200">
                      No hay deudas registradas.
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((d: Debt, idx: number) => {
                    const payments = d.payments.reduce(
                      (acc: number, pay: Payment) => acc + Number(pay.paymentMount ?? 0),
                      0
                    );
                    const remaining = d.mount - payments;
                    return (
                      <tr
                        key={d.debt_date + idx}
                        className="border-b-2 border-gray-200 transition-colors hover:bg-gray-50"
                      >
                        <td className="border-l-2 border-gray-200 px-4 py-2">
                          {formatDate(d.debt_date)}
                        </td>
                        <td className="border-l-2 border-gray-200 px-4 py-2">
                          $
                          {Number(d.mount).toLocaleString('es-AR', {
                            maximumFractionDigits: 0,
                          })}
                        </td>
                        <td className="border-l-2 border-gray-200 px-4 py-2">
                          {d.payments.length > 0
                            ? formatDate(d.payments[d.payments.length - 1].datePayment)
                            : formatDate(d.debt_date)}
                        </td>
                        <td className="border-l-2 border-gray-200 px-4 py-2">
                          ${remaining.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                        </td>
                        <td className="border-l-2 border-gray-200 px-4 py-2">
                          {d.payments.length === 0 ? (
                            <span className="text-gray-400">-</span>
                          ) : (
                            <DropdownPayments payments={d.payments} formatDate={formatDate} />
                          )}
                        </td>
                        <td className="border-l-2 border-gray-200 px-4 py-2">
                          <span className="flex w-full items-center justify-between">
                            <span className="leading-none">{getDebtDays(d.debt_date)}</span>
                            <span
                              className="ml-1 inline-block h-6 w-6 rounded-full border border-gray-200"
                              style={{
                                background: debtColor(getDebtDays(d.debt_date)),
                              }}
                              title={`Estado de deuda: ${getDebtDays(d.debt_date)} días`}
                            />
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {debtHistory.length > rowsPerPage && (
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

function DropdownPayments({
  payments,
  formatDate,
}: {
  payments: Payment[];
  formatDate: (d: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (open && ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  const lastPayment = payments[payments.length - 1];
  const hasMultiplePayments = payments.length > 1;

  return (
    <div ref={ref} className="relative -mx-4">
      <div className="px-4">
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <tbody>
            <tr
              className={`bg-white ${hasMultiplePayments ? 'cursor-pointer' : ''}`}
              onClick={() => hasMultiplePayments && setOpen((v) => !v)}
              aria-expanded={hasMultiplePayments ? open : undefined}
            >
              <td className="whitespace-nowrap text-green-600" style={{ width: 55 }}>
                -${Number(lastPayment.paymentMount ?? 0).toLocaleString('es-AR')}
              </td>
              <td className="pl-2 text-xs whitespace-nowrap text-gray-500">
                ({formatDate(lastPayment.datePayment)})
              </td>
              <td className="pl-2 align-middle" style={{ width: 32 }}>
                {hasMultiplePayments ? (
                  <ChevronDownIcon
                    className={`h-5 w-5 text-black transition-transform ${open ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                ) : (
                  <div className="pointer-events-none h-5 w-5 opacity-0" aria-hidden="true" />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {hasMultiplePayments && open && (
        <div className="absolute top-full right-0 left-0 z-20 mt-3 border-r-2 border-b-2 border-l-2 border-gray-200 bg-white px-4 py-2 shadow-sm">
          <table className="w-full border-collapse" style={{ borderCollapse: 'collapse' }}>
            <tbody>
              {payments
                .slice(0, -1)
                .reverse()
                .map((pay, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap text-green-600" style={{ width: 55 }}>
                      -${Number(pay.paymentMount ?? 0).toLocaleString('es-AR')}
                    </td>
                    <td className="pl-2 text-xs whitespace-nowrap text-gray-500">
                      ({formatDate(pay.datePayment)})
                    </td>
                    <td style={{ width: 32 }} />
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DebtFormModal;
