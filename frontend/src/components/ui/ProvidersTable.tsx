import React, { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useGetAllProviders,
  useDeactivateProvider,
  useEditProvider,
  useCreateProvider,
  useGetProviderById,
  useDeleteProvider,
} from '../../hooks/useProviders';
import {
  ToggleRight,
  Trash2,
  Search,
  Plus,
  Check,
  Edit,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { Provider, ProviderFormValues } from '../../types/provider';
import EmptyProvidersState from './EmptyProvidersState';
import ProviderFormModal from '../modal/ProviderFormModal';
import SuccessModal from '../modal/SuccessModal';
import DeleteProviderModal from '../modal/DeleteProviderModal';

const itemsPerPage = 10;

const ProductsTable: React.FC = () => {
  const queryProvider = useQueryClient();
  const [selectedProviderIds, setSelectedProviderIds] = useState<Set<number>>(new Set());
  const [deleteProviderId, setDeleteProviderId] = useState<number[] | null>(null);
  const [deleteProviderName, setDeleteProviderName] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewProviderId, setViewProviderId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastActionWasEdit, setLastActionWasEdit] = useState(false);
  const [newProviderId, setNewProviderId] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDeletingUI, setIsDeletingUI] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const { data: viewProvider, isLoading: isLoadingViewProvider } = useGetProviderById(
    viewProviderId ?? undefined
  );

  function getUserId() {
    const storedId = sessionStorage.getItem('userId');
    return storedId ? Number(storedId) : undefined;
  }
  const id_user = getUserId();

  const editProviderMutation = useEditProvider();
  const createProviderMutation = useCreateProvider();
  const deleteProviderMutation = useDeleteProvider(id_user);
  const { data: providers, isLoading } = useGetAllProviders();
  const hasProviders = providers && providers.length > 0;
  const hasSelectedProviders = selectedProviderIds.size > 0;
  const deactivateProviderMutation = useDeactivateProvider();

  const selected = Array.from(selectedProviderIds);
  const selectedClients = (providers ?? []).filter((c) => selected.includes(c.id_provider));
  const allInactive =
    selectedClients.length > 0 && selectedClients.every((c) => c.isActive === false);
  const allActive =
    selectedClients.length > 0 && selectedClients.every((c) => c.isActive !== false);
  const actionLabel = allInactive ? 'Activar' : allActive ? 'Desactivar' : 'Activar/Desactivar';

  const filteredProviders = useMemo(() => {
    if (!providers) return [];
    if (!searchTerm.trim()) return providers;
    if (searchTerm.trim().length < 2) return providers;
    return providers.filter(
      (provider: Provider) =>
        provider.name_provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.cuit_provider.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [providers, searchTerm]);

  const sortedProviders = [...(filteredProviders ?? [])].sort((a, b) => {
    if (a.isActive === b.isActive) return 0;
    return a.isActive ? -1 : 1;
  });

  const totalProviders = filteredProviders.length;
  const totalPages = Math.ceil(totalProviders / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProviders = sortedProviders.slice(startIndex, endIndex);

  const isDeactivating = deactivateProviderMutation.isPending;

  React.useEffect(() => {
    const total = filteredProviders.length;
    const pages = Math.max(1, Math.ceil(total / itemsPerPage));
    if (currentPage > pages) setCurrentPage(pages);
  }, [filteredProviders.length, currentPage]);

  const handleDeactivate = async () => {
    if (!hasSelectedProviders) return;
    try {
      const ids = Array.from(selectedProviderIds);
      await deactivateProviderMutation.mutateAsync(ids);
      setSelectedProviderIds(new Set());
      await queryProvider.invalidateQueries({ queryKey: ['providers', id_user] });
    } catch (err) {
      console.error('Error al cambiar estado de proveedores:', err);
    }
  };

  const handleNewProvider = () => {
    setEditingProvider(null);
    setIsModalOpen(true);
  };

  const getPageNumbers = () => Array.from({ length: totalPages }, (_, i) => i + 1);
  const handlePageChange = (page: number) =>
    page >= 1 && page <= totalPages && setCurrentPage(page);

  const toggleProviderSelection = (id: number) => {
    setSelectedProviderIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSaveProvider = async (values: ProviderFormValues) => {
    try {
      setIsSaving(true);
      let result;
      if (editingProvider) {
        if (typeof editingProvider.id_provider !== 'number') throw new Error('No hay id_provider');
        result = await editProviderMutation.mutateAsync({
          id_provider: editingProvider.id_provider,
          values,
        });
        setLastActionWasEdit(true);
        setNewProviderId(null);
      } else {
        result = await createProviderMutation.mutateAsync(values);
        setLastActionWasEdit(false);
        setNewProviderId(result?.id_provider ?? null);
      }
      setShowSuccessModal(true);
      setIsModalOpen(false);
      setEditingProvider(null);
    } catch (error: any) {
      const backendMsg = error?.response?.data?.message;
      setFormError(backendMsg || 'Error inesperado al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProviders = async () => {
    if (!deleteProviderId?.length || isDeletingUI) return;

    const ids = [...deleteProviderId];
    setIsDeletingUI(true);
    setDeleteProviderId(null);
    setSelectedProviderIds(new Set());

    setShowDeleteSuccess(true);

    try {
      const results = await Promise.allSettled(
        ids.map((id) => deleteProviderMutation.mutateAsync(id))
      );

      await queryProvider.invalidateQueries({ queryKey: ['providers', id_user] });

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

  if (isLoading) {
    return (
      <section className="bg-custom-mist h-full w-full p-6">
        <article className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center py-24">
          <div className="relative mb-4 h-12 w-12">
            <div className="h-12 w-12 rounded-full border-4 border-gray-300"></div>
            <div className="absolute top-0 left-0 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
          <p className="text-gray-600">Cargando proveedores...</p>
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
            setNewProviderId(null);
          }}
          title={lastActionWasEdit ? '¡Cambios guardados!' : '¡Nuevo proveedor agregado!'}
          description={
            lastActionWasEdit
              ? 'La ficha del proveedor se ha modificado exitosamente.'
              : 'La ficha del proveedor se ha dado de alta correctamente y ya está disponible en la lista de proveedores.'
          }
          {...(!lastActionWasEdit && newProviderId ? { id: newProviderId } : {})}
        />
      )}
      <section className="bg-custom-mist w-full p-6">
        <article className="mx-auto">
          <header className="mb-6">
            <h1 className="text-dark-blue mb-4 text-2xl font-semibold">Proveedores</h1>
            <article className="flex flex-wrap items-center justify-between gap-3">
              {hasProviders ? (
                <>
                  <article
                    className={`flex items-center gap-2 [&>button]:font-semibold ${hasSelectedProviders ? '[&>button]:cursor-pointer' : ''}`}
                  >
                    <button
                      onClick={hasSelectedProviders ? handleDeactivate : undefined}
                      disabled={!hasSelectedProviders || isDeactivating}
                      className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors ${hasSelectedProviders ? 'text-deep-teal' : 'text-gray-400'}`}
                      title={actionLabel}
                    >
                      <ToggleRight
                        size={18}
                        className={hasSelectedProviders ? 'text-tropical-cyan' : 'text-gray-400'}
                      />
                      <span className={hasSelectedProviders ? 'text-deep-teal' : 'text-gray-400'}>
                        {isDeactivating
                          ? allInactive
                            ? 'Activando...'
                            : allActive
                              ? 'Desactivando...'
                              : 'Cambiando estado...'
                          : actionLabel}
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        if (hasSelectedProviders) {
                          setDeleteProviderId(Array.from(selectedProviderIds));
                          setDeleteProviderName(
                            Array.from(selectedProviderIds).length === 1
                              ? providers?.find(
                                  (c) => c.id_provider === Array.from(selectedProviderIds)[0]
                                )?.name_provider || ''
                              : `${Array.from(selectedProviderIds).length} proveedores seleccionados`
                          );
                        }
                      }}
                      disabled={!hasSelectedProviders}
                      className={`group flex items-center gap-2 rounded-md px-3 py-2 transition-colors ${hasSelectedProviders ? 'text-[#F82254] hover:text-[#B3123A]' : 'text-gray-400'}`}
                      title="Eliminar seleccionados"
                    >
                      <Trash2
                        size={18}
                        className={
                          hasSelectedProviders
                            ? 'text-[#F82254] group-hover:text-[#B3123A]'
                            : 'text-gray-400'
                        }
                      />
                      <span
                        className={
                          hasSelectedProviders
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
                      onClick={handleNewProvider}
                    >
                      <Plus size={18} />
                      Nuevo provedor
                    </button>
                  </aside>
                </>
              ) : null}
            </article>
          </header>

          {/* Tabla o página de vacío */}
          {!Array.isArray(providers) || providers.length === 0 ? (
            <main className="overflow-hidden rounded-xl border border-[#9cb7fc] bg-white shadow-sm">
              <EmptyProvidersState onAddClient={handleNewProvider} />
            </main>
          ) : currentProviders.length === 0 ? (
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
                        <th className="w-12 px-4 py-3">
                          <Check />
                        </th>
                        <th>Nombre Empresa</th>
                        <th>CUIT</th>
                        <th>Dirección</th>
                        <th>Teléfono</th>
                        <th>E-mail</th>
                        <th>Categoría</th>
                        <th className="w-8">Editar</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white text-gray-900">
                      {currentProviders.map((provider) => {
                        const isSelected = selectedProviderIds.has(provider.id_provider);
                        const isInactive = provider.isActive === false;

                        return (
                          <tr
                            key={provider.id_provider}
                            className={`border-b-2 border-gray-200 transition-colors hover:bg-gray-50`}
                          >
                            <td className="px-5 py-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleProviderSelection(provider.id_provider)}
                                className="h-4 w-4 cursor-pointer rounded text-blue-600 focus:ring-blue-500"
                              />
                            </td>

                            <td
                              className={`border-l-2 border-gray-200 px-4 text-sm ${isInactive ? 'opacity-50' : ''}`}
                            >
                              <span
                                className={`cursor-pointer ${isInactive ? 'pointer-events-none opacity-50' : 'text-gray-900 hover:underline'}`}
                                onClick={() =>
                                  !isInactive && setViewProviderId(provider.id_provider)
                                }
                              >
                                {provider.name_provider}
                              </span>
                            </td>

                            <td
                              className={`border-l-2 border-gray-200 px-4 text-sm ${isInactive ? 'opacity-50' : ''}`}
                            >
                              {provider.cuit_provider}
                            </td>

                            <td
                              className={`border-l-2 border-gray-200 px-4 text-sm ${isInactive ? 'opacity-50' : ''}`}
                            >
                              {provider.direction_provider}
                            </td>

                            <td
                              className={`border-l-2 border-gray-200 px-4 text-sm ${isInactive ? 'opacity-50' : ''}`}
                            >
                              {provider.telephone_provider}
                            </td>

                            <td
                              className={`border-l-2 border-gray-200 px-4 text-sm ${isInactive ? 'opacity-50' : ''}`}
                            >
                              {provider.email_provider}
                            </td>

                            <td
                              className={`border-l-2 border-gray-200 px-4 text-sm ${isInactive ? 'opacity-50' : ''}`}
                            >
                              {provider.category_provider}
                            </td>

                            <td
                              className={`w-fit border-l-2 border-gray-200 text-center ${isInactive ? 'pointer-events-none opacity-50' : ''}`}
                            >
                              <button
                                onClick={() => {
                                  if (!isInactive) {
                                    setEditingProvider(provider);
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
            </>
          )}

          <ProviderFormModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingProvider(null);
              setFormError('');
            }}
            onSave={handleSaveProvider}
            isSaving={isSaving || createProviderMutation.isPending}
            provider={editingProvider}
            formError={formError || ''}
          />

          {viewProviderId &&
            (isLoadingViewProvider ? (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
                <div className="flex w-full max-w-md flex-col items-center rounded-lg bg-white p-8 shadow-xl">
                  <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                  <p className="text-gray-600">Cargando proveedor...</p>
                </div>
              </div>
            ) : (
              <ProviderFormModal
                isOpen={!!viewProviderId}
                onClose={() => setViewProviderId(null)}
                onSave={() => {}}
                provider={Array.isArray(viewProvider) ? viewProvider[0] : viewProvider}
                readOnly={true}
                isSaving={false}
                formError={''}
              />
            ))}

          <DeleteProviderModal
            isOpen={!!deleteProviderId && deleteProviderId.length > 0}
            providerName={deleteProviderName}
            onCancel={() => setDeleteProviderId(null)}
            onConfirm={handleDeleteProviders}
          />

          {showDeleteSuccess && (
            <SuccessModal
              isOpen={showDeleteSuccess}
              onClose={() => setShowDeleteSuccess(false)}
              title="¡Proveedor eliminado!"
              description="Ya no aparecerá en la tabla ni en el buscador."
            />
          )}
        </article>
      </section>
    </>
  );
};

export default ProductsTable;
