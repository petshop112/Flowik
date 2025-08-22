import React, { useEffect, useState } from 'react';
import {
  validateField,
  validateAll as validateAllFields,
} from '../../utils/validation/clientRules';
import type { Errors } from '../../utils/validation/clientRules';
import type { ClientFormValues } from '../../types/clients';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: ClientFormValues) => Promise<void> | void;
  isSaving?: boolean;
  client?: any | null;
};

type UIState = {
  firstName: string;
  lastName: string;
  telephone_client: string;
  direction_client?: string;
  document_type?: string;
  email_client: string;
  notes: string;
};

const EMPTY: UIState = {
  firstName: '',
  lastName: '',
  telephone_client: '',
  direction_client: '',
  document_type: '',
  email_client: '',
  notes: '',
};

export default function ClientFormModal({ isOpen, onClose, onSave, isSaving, client }: Props) {
  const [form, setForm] = useState<UIState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const isEditMode = !!client;

  useEffect(() => {
    if (!isOpen) {
      setForm(EMPTY);
      setErrors({});
    } else if (isEditMode && client) {
      const [firstName, ...lastArr] = (client.name_client || '').split(' ');
      const lastName = lastArr.join(' ');
      setForm({
        firstName: firstName || '',
        lastName: lastName || '',
        telephone_client: client.telephone_client || '',
        direction_client: client.direction_client || '',
        document_type: client.document_type || '',
        email_client: client.email_client || '',
        notes: client.notes || '',
      });
    }
  }, [isOpen, client, isEditMode]);

  if (!isOpen) return null;

  const setField = (name: keyof UIState, value: string) => {
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validateOne = (name: keyof Errors) => {
    setErrors((prev) => validateField(name, form, prev));
  };

  const validateAll = () => {
    const errs = validateAllFields(form);
    setErrors(errs);
    return (
      Object.keys(errs).length === 0 &&
      !!form.firstName.trim() &&
      !!form.lastName.trim() &&
      !!form.telephone_client.trim() &&
      !!form.email_client.trim()
    );
  };

  const requiredOk =
    !!form.firstName.trim() &&
    !!form.lastName.trim() &&
    !!form.telephone_client.trim() &&
    !!form.email_client.trim();

  const canSave = requiredOk && Object.keys(errors).length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;

    const payload: ClientFormValues = {
      name_client: `${form.firstName} ${form.lastName}`.replace(/\s+/g, ' ').trim(),
      document_type: form.document_type ?? '',
      telephone_client: form.telephone_client,
      direction_client: form.direction_client ?? '',
      email_client: form.email_client,
    };

    await onSave(payload);
  };

  return (
    <article className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-lg bg-white p-6 shadow-xl">
        <header className="flex items-start justify-between border-b border-b-gray-400 px-8 py-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">ID – Nuevo Cliente</h2>
            <div className="mt-3">
              <span className="border-b-2 border-blue-600 pb-1 text-sm font-medium text-blue-700">
                Detalles del cliente
              </span>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="px-8 py-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-blue-800">Nombre</label>
                <input
                  value={form.firstName}
                  onChange={(e) => setField('firstName', e.target.value)}
                  onBlur={() => validateOne('firstName')}
                  placeholder="Nombre"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-blue-800">Apellidos</label>
                <input
                  value={form.lastName}
                  onChange={(e) => setField('lastName', e.target.value)}
                  onBlur={() => validateOne('lastName')}
                  placeholder="Apellidos"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-blue-800">
                  DNI / CUIT <span className="font-normal text-gray-400"></span>
                </label>
                <input
                  value={form.document_type}
                  onChange={(e) => setField('document_type', e.target.value)}
                  placeholder="DNI o CUIT"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-blue-800">Notas</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setField('notes', e.target.value)}
                  placeholder="Notas u observaciones"
                  className="min-h-[88px] w-full resize-y rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-blue-800">Teléfono</label>
                <input
                  value={form.telephone_client}
                  onChange={(e) => setField('telephone_client', e.target.value)}
                  onBlur={() => validateOne('telephone_client')}
                  placeholder="Número de teléfono"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.telephone_client && (
                  <p className="mt-1 text-sm text-red-500">{errors.telephone_client}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-blue-800">
                  Dirección <span className="font-normal text-gray-400"></span>
                </label>
                <input
                  value={form.direction_client}
                  onChange={(e) => setField('direction_client', e.target.value)}
                  placeholder="Dirección"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-blue-800">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={form.email_client}
                  onChange={(e) => setField('email_client', e.target.value)}
                  onBlur={() => validateOne('email_client')}
                  placeholder="Email"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.email_client && (
                  <p className="mt-1 text-sm text-red-500">{errors.email_client}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="h-12 w-[166px] rounded-md border border-gray-300 bg-[#FFFFFF] font-medium text-blue-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={!canSave || isSaving}
              className={`h-12 w-[166px] rounded-md font-semibold ${
                !canSave || isSaving
                  ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                  : 'bg-[#F1F9FE] text-blue-700 hover:bg-[#E9F3FF]'
              }`}
            >
              {isSaving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </article>
  );
}
