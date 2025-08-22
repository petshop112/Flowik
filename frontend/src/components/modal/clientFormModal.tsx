import React, { useEffect, useState } from 'react';
import type { ClientFormValues } from '../../types/clients';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: ClientFormValues) => Promise<void> | void;
  isSaving?: boolean;
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

type Errors = {
  firstName?: string;
  lastName?: string;
  telephone_client?: string;
  email_client?: string;
  direction_client?: string;
  document_type?: string;
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

export default function ClientFormModal({ isOpen, onClose, onSave, isSaving }: Props) {
  const [form, setForm] = useState<UIState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isOpen) {
      setForm(EMPTY);
      setErrors({});
      setTouched({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const setField = (name: keyof UIState, value: string) => {
    setForm((f) => ({ ...f, [name]: value }));
    setTouched((t) => ({ ...t, [name]: true }));
  };

  // tuve que validar para rerenderizar (NO se llama en el render)
  const validateOne = (name: keyof Errors) => {
    const next: Errors = { ...errors };
    const req = (ok: boolean, msg: string) => (ok ? delete next[name] : (next[name] = msg));

    if (name === 'firstName') req(!!form.firstName.trim(), 'El nombre es obligatorio.');
    if (name === 'lastName') req(!!form.lastName.trim(), 'Los apellidos son obligatorios.');
    if (name === 'telephone_client')
      req(form.telephone_client.trim().length >= 6, 'El teléfono es inválido.');
    if (name === 'email_client')
      req(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email_client.trim()), 'El correo es inválido.');

    if (name === 'document_type') {
      req(!!(form.document_type ?? '').trim(), 'El tipo de documento es obligatorio.');
    }
    if (name === 'direction_client') {
      const dir = (form.direction_client ?? '').trim();
      const okLen = dir.length >= 10 && dir.length <= 100;
      const okChars = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 ]+$/.test(dir);
      req(
        okLen && okChars,
        'La dirección debe tener 10–100 caracteres y solo letras/números/espacios.'
      );
    }

    setErrors(next);
  };

  const validateAll = () => {
    (
      [
        'firstName',
        'lastName',
        'telephone_client',
        'email_client',
        'document_type',
        'direction_client',
      ] as (keyof Errors)[]
    ).forEach(validateOne);

    return (
      Object.keys(errors).length === 0 &&
      !!form.firstName.trim() &&
      !!form.lastName.trim() &&
      !!form.telephone_client.trim() &&
      !!form.email_client.trim() &&
      !!(form.document_type ?? '').trim() &&
      !!(form.direction_client ?? '').trim()
    );
  };

  const requiredOk =
    !!form.firstName.trim() &&
    !!form.lastName.trim() &&
    !!form.telephone_client.trim() &&
    !!form.email_client.trim() &&
    !!(form.document_type ?? '').trim() &&
    !!(form.direction_client ?? '').trim();

  const canSave = requiredOk && Object.keys(errors).length == 0;

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
      <div className="w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
        <header className="flex items-start justify-between border-b px-8 py-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">ID – Nuevo Cliente</h2>
            <div className="mt-3">
              <span className="border-b-2 border-blue-600 pb-1 text-sm font-medium text-blue-700">
                Detalles del cliente
              </span>
            </div>
          </div>
          <button
            type="button"
            disabled
            title="Próximamente"
            className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-[#86DDE0] bg-[#E9FCFC] px-3 py-1.5 text-[#52B7BA] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center border-[#86DDE0]">
              <img src="/icons/client/deudamodal.svg" alt="" className="h-6 w-6" />
            </span>
            <span className="text-[18px] leading-none">Agregar deuda</span>
          </button>
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
                  DNI / CUIT <span className="font-normal text-gray-400">(Opcional)</span>
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
                  Dirección <span className="font-normal text-gray-400">(Opcional)</span>
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
