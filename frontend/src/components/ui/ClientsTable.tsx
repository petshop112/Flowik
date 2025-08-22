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
  Bell,
} from 'lucide-react';
import { useGetAllClients, useCreateClient } from '../../hooks/useClient';
import ProductSavedModal from '../modal/ProductSavedModal';
import type { Client, ClientFormValues } from '../../types/clients';
import ClientFormModal from '../modal/clientFormModal';
import { DebtLegend } from './DebtLegend';
import SuccessModal from '../modal/SuccessModal';

type ClientWithDebt = Client & {
  total_debt?: number | string;
  debt_modified_at?: string;
  total_debt_days?: number;
};

function getUserId() {
  const storedId = sessionStorage.getItem('userId');
  return storedId ? Number(storedId) : undefined;
}

const itemsPerPage = 10;

function formatCurrency(v?: number | string) {
  const n = typeof v === 'string' ? Number(v) : (v ?? 0);
  if (!Number.isFinite(n)) return '$0,00';
  return n.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  });
}
function formatDate(d?: string) {
  if (!d) return '00/00/0000';
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? '00/00/0000' : dt.toLocaleDateString('es-AR');
}
function debtDotClass(days?: number) {
  const n = Number(days ?? 0);
  if (!Number.isFinite(n) || n <= 0) return 'bg-gray-300';
  if (n > 60) return 'bg-rose-500';
  if (n >= 30) return 'bg-orange-400';
  return 'bg-teal-300';
}

const ClientsTable: React.FC = () => {
  const id_user = getUserId();
  const { data: clients, isLoading, error } = useGetAllClients(id_user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newClientId, setNewClientId] = useState<number | null>(null);
  const createClientMutation = useCreateClient();

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

  const handleNewClient = () => setIsModalOpen(true);
  const handleSaveClient = async (values: ClientFormValues) => {
    try {
      setIsSaving(true);
      const newClient = await createClientMutation.mutateAsync(values);
      setNewClientId(newClient.id_client);
      setShowSuccessModal(true);
      setIsModalOpen(false);
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

  if (isLoading) return <p>Cargando clientes...</p>;
  if (error) return <p>Error al cargar clientes: {(error as Error).message}</p>;

  return (
    <>
      {showSuccessModal && newClientId && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          id={newClientId}
          title="¡Nuevo cliente agregado!"
          description="La ficha del cliente se ha dado de alta correctamente y ya está disponible en la lista de clientes."
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
                    hasSelectedClients ? 'text-deep-teal hover:bg-cyan-50' : 'text-gray-400'
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
                  disabled={!hasSelectedClients}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors ${
                    hasSelectedClients ? 'text-deep-teal hover:bg-cyan-50' : 'text-gray-400'
                  }`}
                  title="Eliminar seleccionados"
                >
                  <Trash2
                    size={18}
                    className={`${hasSelectedClients ? 'text-tropical-cyan' : 'text-gray-400'}`}
                  />
                  Eliminar
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

                <button
                  onClick={handleManageDebt}
                  className="flex items-center gap-2 rounded-md border border-teal-200 bg-teal-50 px-4 py-2 text-teal-600 transition-colors hover:bg-teal-100"
                  title="Administrar deuda"
                >
                  <img src="/icons/client/calculator.svg" alt="" />
                  Administrar deuda
                </button>
              </aside>
            </article>
          </header>

          {/* Tabla */}
          <main className="overflow-hidden rounded-xl border border-[#9cb7fc] bg-white shadow-sm">
            <article className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-polar-mist">
                  <tr className="[&>th]:border-l-2 [&>th]:border-white [&>th]:px-4 [&>th]:py-3 [&>th]:text-left [&>th]:font-normal">
                    <th className="w-12 px-4 py-3">
                      <Check />
                    </th>
                    <th>ID cliente</th>
                    <th>Nombre Apellidos</th>
                    <th>Contacto</th>
                    <th>Total deuda</th>
                    <th>Modificación deuda</th>

                    <th>
                      <div className="flex items-center justify-between">
                        <span>Total días deuda</span>
                        <Bell size={16} className="opacity-70" />
                      </div>
                    </th>

                    <th className="w-8">Editar</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {currentClients.map((client) => {
                    const isSelected = selectedClientIds.has(client.id_client);
                    const days = client.total_debt_days ?? 0;
                    const dot = debtDotClass(days);
                    const daysDisplay = days ? String(days).padStart(3, '0') : '000';

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
                          {client.id_client}
                        </td>
                        <td className="border-l-2 border-gray-200 px-4 text-sm">
                          {client.name_client}
                        </td>
                        <td className="border-l-2 border-gray-200 px-4 text-sm">
                          {client.telephone_client || client.email_client}
                        </td>

                        <td className="border-l-2 border-gray-200 px-4 text-sm">
                          {formatCurrency(client.total_debt)}
                        </td>
                        <td className="border-l-2 border-gray-200 px-4 text-sm">
                          {formatDate(client.debt_modified_at)}
                        </td>

                        <td className="border-l-2 border-gray-200 px-4 text-sm">
                          <div className="flex items-center justify-between">
                            <span className={days ? 'text-gray-900' : 'text-gray-300'}>
                              {daysDisplay}
                            </span>
                            <span
                              title={days ? `${days} días` : 'Sin deuda'}
                              className={`inline-block h-3.5 w-3.5 rounded-full ${dot}`}
                            />
                          </div>
                        </td>

                        <td className="w-fit border-l-2 border-gray-200 text-center">
                          <button className="text-glacial-blue cursor-pointer py-3 transition-colors hover:text-blue-500">
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
                      className={`py-2 ${currentPage === 1 ? 'cursor-not-allowed text-neutral-400/70' : 'cursor-pointer hover:text-blue-600'}`}
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
                      className={`py-2 ${currentPage === totalPages ? 'cursor-not-allowed text-neutral-400/70' : 'cursor-pointer hover:text-blue-600'}`}
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
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveClient}
          isSaving={isSaving || createClientMutation.isPending}
        />
      </section>
    </>
  );
};

export default ClientsTable;
