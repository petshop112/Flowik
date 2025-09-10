import React, { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Edit, Trash2, Search, ChevronLeft, ChevronRight, Plus, ToggleRight } from 'lucide-react';
import {
  useGetAllClients,
  useCreateClient,
  useEditClient,
  useGetClientById,
  useDeleteClient,
  useDeactivateClient,
} from '../../hooks/useClient';
import type { Client, ClientFormValues } from '../../types/clients';
import ClientFormModal from '../modal/clientFormModal';
import { DebtLegend } from './DebtLegend';
import SuccessModal from '../modal/SuccessModal';
import DeleteClientModal from '../modal/DeleteClientModal';
import { currencyPipe } from '../../utils/pipe/currency.pipe';
import { formatDate } from '../../utils/formatDate';
import { debtColor } from '../../utils/debtColors';
import EmptyClientsState from './EmptyClientsState';
import DebtFormModal from '../modal/DebtFormModal';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../features/auth/authSlice';
import { useClientsDebtTotals } from '../../hooks/useClientsDebtTotals';

type ClientWithDebt = Client & {
  total_debt?: number | string;
  debt_modified_at?: string;
  total_debt_days?: number;
  is_active?: boolean;
};

// function hasDebt(v?: number | string) {
//   return toNumber(v) > 0;
// }

function getUserId() {
  const storedId = localStorage.getItem('userId');
  return storedId ? Number(storedId) : undefined;
}

const itemsPerPage = 10;

const ClientsTable: React.FC = () => {
  const { token } = useSelector(selectAuth);
  const queryClient = useQueryClient();
  const id_user = getUserId();
  const { data: clients, isLoading } = useGetAllClients(id_user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newClientId, setNewClientId] = useState<number | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewClientId, setViewClientId] = useState<number | null>(null);
  const [deleteClientId, setDeleteClientId] = useState<number[] | null>(null);
  const [deleteClientName, setDeleteClientName] = useState<string>('');
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [isDeletingUI, setIsDeletingUI] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);

  const createClientMutation = useCreateClient();
  const editClientMutation = useEditClient();
  const { data: viewClient, isLoading: isLoadingViewClient } = useGetClientById(
    viewClientId ?? undefined
  );
  const deleteClientMutation = useDeleteClient(id_user);
  const deactivateClientMutation = useDeactivateClient(id_user);
  const [lastActionWasEdit, setLastActionWasEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientIds, setSelectedClientIds] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  const hasSelectedClients = selectedClientIds.size > 0;

  const filteredClients = useMemo(() => {
    if (!clients) return [];
    let arr = [...clients].sort((a, b) => {
      if (a.isActive === b.isActive) return 0;
      return a.isActive ? -1 : 1;
    });
    if (!searchTerm.trim()) return arr;
    if (searchTerm.trim().length < 2) return arr;
    return arr.filter(
      (client: Client) =>
        client.name_client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email_client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.telephone_client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.document_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  const totalClients = filteredClients.length;
  const totalPages = Math.ceil(totalClients / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClients = filteredClients.slice(startIndex, endIndex) as ClientWithDebt[];
  const currentClientIds = currentClients.map((c) => c.id_client);
  const { data: clientDebtTotals, isLoading: loadingDebtTotals } = useClientsDebtTotals(
    currentClientIds,
    token
  );

  React.useEffect(() => {
    const total = filteredClients.length;
    const pages = Math.max(1, Math.ceil(total / itemsPerPage));
    if (currentPage > pages) setCurrentPage(pages);
  }, [filteredClients.length, currentPage]);

  const canManageDebt = hasSelectedClients;

  const getPageNumbers = () => Array.from({ length: totalPages }, (_, i) => i + 1);
  const handlePageChange = (page: number) =>
    page >= 1 && page <= totalPages && setCurrentPage(page);

  const toggleClientSelection = (id: number) => {
    setSelectedClientIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleNewClient = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleSaveClient = async (values: ClientFormValues) => {
    if (!editingClient) {
      const alreadyExists = clients?.some(
        (c) => c.document_type.trim().toLowerCase() === values.document_type.trim().toLowerCase()
      );
      if (alreadyExists) {
        setFormError('Ya existe un cliente asociado a ese DNI.');
        setIsSaving(false);
        setTimeout(() => setFormError(''), 2500);
        return;
      }
    }
    try {
      setIsSaving(true);
      let result;
      if (editingClient) {
        if (typeof editingClient.id_client !== 'number') throw new Error('No hay id_client');
        result = await editClientMutation.mutateAsync({
          id_client: editingClient.id_client,
          values,
        });
        setLastActionWasEdit(true);
        setNewClientId(null);
      } else {
        result = await createClientMutation.mutateAsync(values);
        setLastActionWasEdit(false);
        setNewClientId(result?.id_client ?? null);
      }
      setShowSuccessModal(true);
      setIsModalOpen(false);
      setEditingClient(null);
    } catch (error: any) {
      setFormError(error?.message || 'Error inesperado al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  const isDeactivating = deactivateClientMutation.isPending;

  const handleDeactivate = async () => {
    if (!hasSelectedClients) return;
    try {
      const ids = Array.from(selectedClientIds);
      for (const id of ids) {
        await deactivateClientMutation.mutateAsync(id);
      }
      setSelectedClientIds(new Set());
      await queryClient.invalidateQueries({ queryKey: ['clients', id_user] });
    } catch (err) {
      console.error('Error al cambiar estado de clientes:', err);
    }
  };

  const handleManageDebt = () => {
    setIsDebtModalOpen(true);
  };

  const handleDeleteClients = async () => {
    if (!deleteClientId?.length || isDeletingUI) return;

    const ids = [...deleteClientId];
    setIsDeletingUI(true);
    setDeleteClientId(null);
    setSelectedClientIds(new Set());

    setShowDeleteSuccess(true);

    try {
      const results = await Promise.allSettled(
        ids.map((id) => deleteClientMutation.mutateAsync(id))
      );

      await queryClient.invalidateQueries({ queryKey: ['clients', id_user] });

      const hasError = results.some((r) => r.status === 'rejected');
      if (hasError) {
        setShowDeleteSuccess(false);
        alert('No se pudo eliminar uno o más clientes. Intenta nuevamente.');
      } else {
        setShowDeleteSuccess(false);
      }
    } catch (e) {
      setShowDeleteSuccess(false);
      alert('Error al eliminar cliente. Intenta nuevamente.');
      console.error('Error al eliminar cliente:', e);
    } finally {
      setIsDeletingUI(false);
    }
  };

  const handleCloseDebtModal = () => {
    setIsDebtModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ['clientsDebtTotals', 'clients'] });
  };

  const hasClients = clients && clients.length > 0;

  const selected = Array.from(selectedClientIds);
  const selectedClients = (clients ?? []).filter((c) => selected.includes(c.id_client));
  const allInactive =
    selectedClients.length > 0 && selectedClients.every((c) => c.isActive === false);
  const allActive =
    selectedClients.length > 0 && selectedClients.every((c) => c.isActive !== false);
  const actionLabel = allInactive ? 'Activar' : allActive ? 'Desactivar' : 'Desactivar';

  if (isLoading) {
    return (
      <section className="bg-custom-mist h-full w-full p-6">
        <article className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center py-24">
          <div className="relative mb-4 h-12 w-12">
            <div className="h-12 w-12 rounded-full border-4 border-gray-300"></div>
            <div className="absolute top-0 left-0 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
          <p className="text-gray-600">Cargando clientes...</p>
        </article>
      </section>
    );
  }

  return (
    <>
      {showSuccessModal && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            setNewClientId(null);
          }}
          title={lastActionWasEdit ? '¡Cambios guardados!' : '¡Nuevo cliente agregado!'}
          description={
            lastActionWasEdit
              ? 'Los datos se han guardado correctamente.'
              : 'La ficha del cliente se ha dado de alta correctamente y ya está disponible en la lista de clientes.'
          }
          {...(!lastActionWasEdit && newClientId ? { id: newClientId } : {})}
        />
      )}
      <section className="bg-custom-mist w-full p-6">
        <article className="mx-auto">
          <header className="mb-6">
            <h1 className="text-dark-blue mb-4 text-2xl font-semibold">Clientes</h1>
            <article className="flex flex-wrap items-center justify-between gap-3">
              {hasClients ? (
                <>
                  <article
                    className={`flex items-center gap-2 [&>button]:font-semibold ${hasSelectedClients ? '[&>button]:cursor-pointer' : ''}`}
                  >
                    <button
                      onClick={hasSelectedClients ? handleDeactivate : undefined}
                      disabled={!hasSelectedClients || isDeactivating}
                      className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors ${hasSelectedClients ? 'text-deep-teal' : 'text-gray-400'}`}
                      title={actionLabel}
                    >
                      <ToggleRight
                        size={24}
                        className={hasSelectedClients ? 'text-tropical-cyan' : 'text-gray-400'}
                      />
                      <span className={hasSelectedClients ? 'text-deep-teal' : 'text-gray-400'}>
                        {isDeactivating
                          ? allInactive
                            ? 'Desactivando...'
                            : allActive
                              ? 'Activando...'
                              : 'Cambiando estado...'
                          : actionLabel}
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        if (hasSelectedClients) {
                          setDeleteClientId(Array.from(selectedClientIds));
                          setDeleteClientName(
                            Array.from(selectedClientIds).length === 1
                              ? clients?.find(
                                  (c) => c.id_client === Array.from(selectedClientIds)[0]
                                )?.name_client || ''
                              : `${Array.from(selectedClientIds).length} clientes seleccionados`
                          );
                        }
                      }}
                      disabled={!hasSelectedClients}
                      className={`group flex items-center gap-2 rounded-md px-3 py-2 transition-colors ${hasSelectedClients ? 'text-[#F82254] hover:text-[#B3123A]' : 'text-gray-400'}`}
                      title="Eliminar seleccionados"
                    >
                      <Trash2
                        size={24}
                        className={
                          hasSelectedClients
                            ? 'text-[#F82254] group-hover:text-[#B3123A]'
                            : 'text-gray-400'
                        }
                      />
                      <span
                        className={
                          hasSelectedClients
                            ? 'text-[#F82254] group-hover:text-[#B3123A]'
                            : 'text-gray-400'
                        }
                      >
                        Eliminar
                      </span>
                    </button>
                  </article>
                  <aside className="flex items-center gap-3">
                    <article className="relative">
                      <Search
                        className="text-electric-blue absolute top-1/2 left-3 -translate-y-1/2 transform"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Nombre, Apellido, DNI, Contacto"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="border-dark-blue text-dark-blue w-[300px] rounded-md border bg-white py-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </article>
                    <button
                      className="bg-electric-blue flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-white transition-colors hover:bg-blue-600"
                      onClick={handleNewClient}
                    >
                      <Plus size={18} />
                      Nuevo cliente
                    </button>
                    <button
                      onClick={canManageDebt ? handleManageDebt : undefined}
                      disabled={!canManageDebt}
                      aria-disabled={!canManageDebt}
                      className={`flex items-center gap-2 rounded-md px-4 py-2 transition-colors ${canManageDebt ? 'bg-teal-600 text-white hover:bg-teal-700' : 'cursor-not-allowed border border-teal-200 bg-teal-50 text-teal-600 opacity-60'}`}
                      title="Administrar deuda"
                    >
                      <img src="/icons/client/calculator.svg" alt="" />
                      Administrar deuda
                    </button>
                  </aside>
                </>
              ) : null}
            </article>
          </header>
          {!Array.isArray(clients) || clients.length === 0 ? (
            <main className="overflow-hidden rounded-xl border border-[#9cb7fc] bg-white shadow-sm">
              <EmptyClientsState onAddClient={handleNewClient} />
            </main>
          ) : currentClients.length === 0 ? (
            <main className="overflow-hidden rounded-xl border border-[#9cb7fc] bg-white shadow-sm">
              <div className="flex w-full flex-col items-center justify-center py-12">
                <p className="mb-2 text-lg text-gray-500">
                  No se encontraron resultados para tu búsqueda.
                </p>
                <p className="text-sm text-gray-400">
                  Intenta con otro término o limpia el filtro.
                </p>
              </div>
            </main>
          ) : (
            <>
              <main className="overflow-hidden rounded-xl border border-[#9cb7fc] bg-white shadow-sm">
                <article className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-polar-mist">
                      <tr className="[&>th]:border-l-2 [&>th]:border-white [&>th]:px-4 [&>th]:py-3 [&>th]:text-left [&>th]:font-normal">
                        <th className="bg-polar-mist flex w-14 items-center rounded-tl-xl px-5 py-3">
                          <input
                            type="checkbox"
                            checked={
                              currentClients.length > 0 &&
                              currentClients.every((c) => selectedClientIds.has(c.id_client))
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                const ids = filteredClients.map((c) => c.id_client);
                                setSelectedClientIds(new Set(ids));
                              } else {
                                setSelectedClientIds(new Set());
                              }
                            }}
                            className="h-5 w-5 cursor-pointer rounded border-2 border-blue-400 text-blue-600 focus:ring-blue-500"
                            style={{ minWidth: 20, minHeight: 20, width: 20, height: 20 }}
                          />
                        </th>
                        <th>Nombre y Apellido</th>
                        <th>Contacto</th>
                        <th>Total deuda</th>
                        <th>Modificación deuda</th>
                        <th>
                          <div className="flex items-center justify-between">
                            <span>Total días deuda</span>
                            <img className="h-6 w-6" src="/icons/alarma.svg" alt="" />
                          </div>
                        </th>
                        <th className="w-8">Editar</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white text-gray-900">
                      {currentClients.map((client) => {
                        const isSelected = selectedClientIds.has(client.id_client);
                        const isInactive = client.isActive === false;
                        return (
                          <tr
                            key={client.id_client}
                            className={`border-b-2 border-gray-200 transition-colors hover:bg-gray-50`}
                          >
                            <td className="flex w-14 items-center justify-center px-5 py-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleClientSelection(client.id_client)}
                                className="h-5 w-5 cursor-pointer rounded text-blue-600 focus:ring-blue-500"
                                style={{ minWidth: 20, minHeight: 20, width: 20, height: 20 }}
                              />
                            </td>

                            <td
                              className={`border-l-2 border-gray-200 px-4 text-sm ${isInactive ? 'opacity-50' : ''}`}
                            >
                              <span
                                className={`cursor-pointer ${isInactive ? 'pointer-events-none opacity-50' : 'text-gray-900 hover:underline'}`}
                                onClick={() => !isInactive && setViewClientId(client.id_client)}
                              >
                                {client.name_client}
                              </span>
                            </td>

                            <td
                              className={`border-l-2 border-gray-200 px-4 text-sm ${isInactive ? 'opacity-50' : ''}`}
                            >
                              {client.telephone_client || client.email_client}
                            </td>

                            <td
                              className={`border-l-2 border-gray-200 px-4 text-sm ${isInactive ? 'opacity-50' : ''}`}
                            >
                              {loadingDebtTotals
                                ? 'Cargando...'
                                : currencyPipe(clientDebtTotals?.[client.id_client]?.total ?? 0)}
                            </td>
                            <td
                              className={`border-l-2 border-gray-200 px-4 text-sm ${isInactive ? 'opacity-50' : ''}`}
                            >
                              {loadingDebtTotals
                                ? '...'
                                : (() => {
                                    const fecha = formatDate(
                                      clientDebtTotals?.[client.id_client]?.lastModified ??
                                        undefined
                                    );
                                    return fecha === '00/00/0000' || fecha === '' || !fecha
                                      ? '-'
                                      : fecha;
                                  })()}
                            </td>

                            <td
                              className={`border-l-2 border-gray-200 px-4 text-sm ${isInactive ? 'opacity-50' : ''}`}
                            >
                              {loadingDebtTotals ? (
                                '...'
                              ) : (
                                <span className="flex w-full items-center justify-between">
                                  <span className="leading-none">
                                    {(clientDebtTotals?.[client.id_client]?.maxDays ?? 0)
                                      .toString()
                                      .padStart(3, '0')}
                                  </span>
                                  <span
                                    className={`inline-block h-6 w-6 rounded-full border border-gray-200 ${debtColor(clientDebtTotals?.[client.id_client]?.maxDays ?? 0)}`}
                                    title={`Estado de deuda: ${clientDebtTotals?.[client.id_client]?.maxDays ?? 0} días`}
                                  />
                                </span>
                              )}
                            </td>

                            <td
                              className={`w-fit border-l-2 border-gray-200 text-center ${isInactive ? 'pointer-events-none opacity-50' : ''}`}
                            >
                              <button
                                onClick={() => {
                                  if (!isInactive) {
                                    setEditingClient(client);
                                    setIsModalOpen(true);
                                  }
                                }}
                                className={`text-glacial-blue py-3 transition-colors hover:text-blue-500 ${isInactive ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                                disabled={isInactive}
                              >
                                <Edit size={24} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </article>
              </main>
              {totalPages > 1 && (
                <article className="flex justify-center py-3">
                  <nav className="flex items-center justify-between">
                    <ul className="text-dark-blue flex items-center gap-2">
                      <li>
                        <button
                          className={`py-2 ${
                            currentPage === 1
                              ? 'cursor-not-allowed text-neutral-400/70'
                              : 'cursor-pointer hover:text-blue-600'
                          }`}
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft size={32} />
                        </button>
                      </li>
                      {getPageNumbers().map((n) => (
                        <li key={n}>
                          <button
                            className={`rounded-md px-3 py-2 text-lg transition-colors ${
                              currentPage === n
                                ? 'font-semibold'
                                : 'hover:text-dark-blue cursor-pointer text-neutral-400/70'
                            }`}
                            onClick={() => handlePageChange(n)}
                          >
                            {n}
                          </button>
                        </li>
                      ))}
                      <li>
                        <button
                          className={`py-2 ${
                            currentPage === totalPages
                              ? 'cursor-not-allowed text-neutral-400/70'
                              : 'cursor-pointer hover:text-blue-600'
                          }`}
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight size={32} />
                        </button>
                      </li>
                    </ul>
                  </nav>
                </article>
              )}
              <div className="fixed-bottom flex items-center pt-4 pb-2 pl-2">
                <DebtLegend />
              </div>
            </>
          )}

          <ClientFormModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingClient(null);
              setFormError('');
            }}
            onSave={handleSaveClient}
            isSaving={isSaving || createClientMutation.isPending}
            client={editingClient}
            formError={formError || ''}
          />

          {viewClientId &&
            (isLoadingViewClient ? (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
                <div className="flex w-full max-w-md flex-col items-center rounded-lg bg-white p-8 shadow-xl">
                  <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                  <p className="text-gray-600">Cargando cliente...</p>
                </div>
              </div>
            ) : (
              <ClientFormModal
                isOpen={!!viewClientId}
                onClose={() => setViewClientId(null)}
                onSave={() => {}}
                client={Array.isArray(viewClient) ? viewClient[0] : viewClient}
                readOnly={true}
                isSaving={false}
                formError={''}
              />
            ))}

          <DeleteClientModal
            isOpen={!!deleteClientId && deleteClientId.length > 0}
            clientName={deleteClientName}
            onCancel={() => setDeleteClientId(null)}
            onConfirm={handleDeleteClients}
          />

          {showDeleteSuccess && (
            <SuccessModal
              isOpen={showDeleteSuccess}
              onClose={() => setShowDeleteSuccess(false)}
              title="¡Cliente eliminado!"
              description="Ya no aparecerá en la tabla ni en el buscador."
            />
          )}
        </article>
        <DebtFormModal
          isOpen={isDebtModalOpen}
          onClose={handleCloseDebtModal}
          selectedClientIds={Array.from(selectedClientIds)}
        />
      </section>
    </>
  );
};

export default ClientsTable;
