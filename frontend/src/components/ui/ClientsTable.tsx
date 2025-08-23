import React, { useMemo, useState } from 'react';
import {
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  ToggleRight,
} from 'lucide-react';
import {
  useGetAllClients,
  useCreateClient,
  useEditClient,
  useGetClientById,
  useDeleteClient,
} from '../../hooks/useClient';
import type { Client, ClientFormValues } from '../../types/clients';
import ClientFormModal from '../modal/clientFormModal';
import { DebtLegend } from './DebtLegend';
import SuccessModal from '../modal/SuccessModal';
import DeleteClientModal from '../modal/DeleteClientModal';
import { currencyPipe, toNumber } from '../../utils/pipe/currency.pipe';
import { formatDate } from '../../utils/formatDate';
import { debtColor } from '../../utils/debtColors';

type ClientWithDebt = Client & {
  total_debt?: number | string;
  debt_modified_at?: string;
  total_debt_days?: number;
};

function hasDebt(v?: number | string) {
  return toNumber(v) > 0;
}

function getUserId() {
  const storedId = sessionStorage.getItem('userId');
  return storedId ? Number(storedId) : undefined;
}

const itemsPerPage = 10;

const ClientsTable: React.FC = () => {
  const id_user = getUserId();
  const { data: clients, isLoading, error } = useGetAllClients(id_user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newClientId, setNewClientId] = useState<number | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewClientId, setViewClientId] = useState<number | null>(null);
  const [deleteClientId, setDeleteClientId] = useState<number[] | null>(null);
  const [deleteClientName, setDeleteClientName] = useState<string>('');
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const createClientMutation = useCreateClient();
  const editClientMutation = useEditClient();
  const { data: viewClient, isLoading: isLoadingViewClient } = useGetClientById(
    viewClientId ?? undefined
  );
  const deleteClientMutation = useDeleteClient();
  const [lastActionWasEdit, setLastActionWasEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientIds, setSelectedClientIds] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  const hasSelectedClients = selectedClientIds.size > 0;

  const filteredClients = useMemo(() => {
    if (!clients) return [];
    if (!searchTerm.trim()) return clients;
    if (searchTerm.trim().length < 3) return clients;
    return clients.filter(
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
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeactivate = () => {
    // TODO: endpoint desactivar
    console.log('Desactivar IDs:', Array.from(selectedClientIds));
  };

  const handleManageDebt = () => {
    // TODO: abrir modal de deuda / navegar
    console.log('Administrar deuda');
  };

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

  if (error) {
    return (
      <section className="bg-custom-mist h-full w-full p-6">
        <article className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center py-24">
          <div className="mb-4 flex items-center justify-center">
            <span className="text-4xl text-red-500">!</span>
          </div>
          <p className="font-semibold text-red-600">
            Error al cargar clientes: {(error as Error).message}
          </p>
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
              <article
                className={`flex items-center gap-2 [&>button]:font-semibold ${
                  hasSelectedClients ? '[&>button]:cursor-pointer' : ''
                } `}
              >
                <button
                  onClick={hasSelectedClients ? handleDeactivate : undefined}
                  disabled={!hasSelectedClients}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors ${
                    hasSelectedClients ? 'text-deep-teal' : 'text-gray-400'
                  }`}
                  title="Desactivar seleccionados"
                >
                  <ToggleRight
                    size={18}
                    className={`${hasSelectedClients ? 'text-tropical-cyan' : 'text-gray-400'}`}
                  />
                  Desactivar
                </button>

                <button
                  onClick={() => {
                    if (hasSelectedClients) {
                      setDeleteClientId(Array.from(selectedClientIds));
                      setDeleteClientName(
                        Array.from(selectedClientIds).length === 1
                          ? clients?.find((c) => c.id_client === Array.from(selectedClientIds)[0])
                              ?.name_client || ''
                          : `${Array.from(selectedClientIds).length} clientes seleccionados`
                      );
                    }
                  }}
                  disabled={!hasSelectedClients}
                  className={`group flex items-center gap-2 rounded-md px-3 py-2 transition-colors ${
                    hasSelectedClients ? 'text-[#F82254] hover:text-[#B3123A]' : 'text-gray-400'
                  }`}
                  title="Eliminar seleccionados"
                >
                  <Trash2
                    size={18}
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
                    {'\r\n          Eliminar\r\n          '}
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
                    placeholder="Buscar"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="border-dark-blue text-dark-blue w-48 rounded-md border bg-white py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </article>

                <button
                  className="bg-electric-blue flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-white transition-colors hover:bg-blue-600"
                  onClick={handleNewClient}
                >
                  <Plus size={18} />
                  Nuevo cliente
                </button>

                {/* Botón Administrar deuda (estado según selección) */}
                <button
                  onClick={canManageDebt ? handleManageDebt : undefined}
                  disabled={!canManageDebt}
                  aria-disabled={!canManageDebt}
                  className={`flex items-center gap-2 rounded-md px-4 py-2 transition-colors ${
                    canManageDebt
                      ? 'bg-teal-600 text-white hover:bg-teal-700'
                      : 'cursor-not-allowed border border-teal-200 bg-teal-50 text-teal-600 opacity-60'
                  }`}
                  title="Administrar deuda"
                >
                  <img src="/icons/client/calculator.svg" alt="" />
                  Administrar deuda
                </button>
              </aside>
            </article>
          </header>

          <main className="overflow-hidden rounded-xl border border-[#9cb7fc] bg-white shadow-sm">
            <article className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-polar-mist">
                  <tr className="[&>th]:border-l-2 [&>th]:border-white [&>th]:px-4 [&>th]:py-3 [&>th]:text-left [&>th]:font-normal">
                    <th className="w-12 px-4 py-3">
                      <Check />
                    </th>
                    <th>Nombre y Apellido</th>
                    <th>Contacto</th>
                    <th>Total deuda</th>
                    <th>Modificación deuda</th>
                    <th>
                      <div className="flex items-center justify-between">
                        <span>Total días deuda</span>
                        <img className="h-6 w-6" src="/icons/alarma.svg" alt="" />
                        {/* <Bell size={16} className="opacity-70" /> */}
                      </div>
                    </th>
                    <th className="w-8">Editar</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white text-gray-900">
                  {currentClients.map((client) => {
                    const isSelected = selectedClientIds.has(client.id_client);
                    const debtExists = hasDebt(client.total_debt);
                    const days = client.total_debt_days ?? 0;
                    const dot = debtColor(days);
                    const daysDisplay = days ? String(days).padStart(3, '0') : '000';

                    const mutedCell = debtExists ? 'text-gray-900' : 'text-neutral-300';

                    return (
                      <tr
                        key={client.id_client}
                        className="border-b-2 border-gray-200 transition-colors last:border-none hover:bg-gray-50"
                      >
                        <td className="px-5 py-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleClientSelection(client.id_client)}
                            className="h-4 w-4 cursor-pointer rounded text-blue-600 focus:ring-blue-500"
                          />
                        </td>

                        <td className="border-l-2 border-gray-200 px-4 text-sm">
                          <span
                            className="cursor-pointer text-gray-900 hover:underline"
                            onClick={() => setViewClientId(client.id_client)}
                          >
                            {client.name_client}
                          </span>
                        </td>

                        <td className="border-l-2 border-gray-200 px-4 text-sm">
                          {client.telephone_client || client.email_client}
                        </td>

                        <td className={`border-l-2 border-gray-200 px-4 text-sm ${mutedCell}`}>
                          {currencyPipe(client.total_debt)}
                        </td>

                        <td className={`border-l-2 border-gray-200 px-4 text-sm ${mutedCell}`}>
                          {formatDate(client.debt_modified_at)}
                        </td>

                        <td className="border-l-2 border-gray-200 px-4 text-sm">
                          <div className="flex items-center justify-between">
                            <span className={debtExists ? 'text-gray-900' : 'text-neutral-400'}>
                              {daysDisplay}
                            </span>
                            <span
                              title={days ? `${days} días` : 'Sin deuda'}
                              className={`inline-block h-6 w-6 rounded-full ${dot}`}
                            />
                          </div>
                        </td>

                        <td className="w-fit border-l-2 border-gray-200 text-center">
                          <button
                            onClick={() => {
                              setEditingClient(client);
                              setIsModalOpen(true);
                            }}
                            className="text-glacial-blue cursor-pointer py-3 transition-colors hover:text-blue-500"
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

            {filteredClients.length === 0 && searchTerm && (
              <div className="py-8 text-center text-gray-500">
                No se encontraron clientes que coincidan con "{searchTerm}"
              </div>
            )}
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

          <DebtLegend />
        </article>

        <ClientFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingClient(null);
          }}
          onSave={handleSaveClient}
          isSaving={isSaving || createClientMutation.isPending}
          client={editingClient}
        />

        {viewClientId && (
          <ClientFormModal
            isOpen={!!viewClientId}
            onClose={() => setViewClientId(null)}
            onSave={() => {}}
            client={Array.isArray(viewClient) ? viewClient[0] : viewClient}
            readOnly={true}
            isSaving={isLoadingViewClient}
          />
        )}

        <DeleteClientModal
          isOpen={!!deleteClientId && deleteClientId.length > 0}
          clientName={deleteClientName}
          onCancel={() => setDeleteClientId(null)}
          onConfirm={() => {
            if (deleteClientId && deleteClientId.length > 0) {
              Promise.all(deleteClientId.map((id) => deleteClientMutation.mutateAsync(id))).then(
                () => {
                  setDeleteClientId(null);
                  setShowDeleteSuccess(true);
                }
              );
            }
          }}
          isDeleting={deleteClientMutation.isPending}
        />

        {showDeleteSuccess && (
          <SuccessModal
            isOpen={showDeleteSuccess}
            onClose={() => setShowDeleteSuccess(false)}
            title="¡Cliente eliminado!"
            description="Ya no aparecerá en la tabla ni en el buscador."
          />
        )}
      </section>
    </>
  );
};

export default ClientsTable;
