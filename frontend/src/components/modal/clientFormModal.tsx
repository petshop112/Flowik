import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Client, ClientFormValues } from '../../types/clients';
import { handleBackdropClick } from '../../constants/clickOut';
import { emptyForm } from '../../constants/emptyForm';
import {
  validateField,
  validateAll,
  type Errors,
  type Form,
} from '../../utils/validation/clientRules';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: ClientFormValues) => void;
  isSaving?: boolean;
  client?: Client | null;
  readOnly?: boolean;
  clientesLista?: Client[];
  formError: string;
};

const ClientFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  isSaving = false,
  client,
  readOnly = false,
  formError,
}) => {
  const initialForm: Form = useMemo(() => {
    if (!client) return emptyForm;
    const s = (client.name_client ?? '').trim();
    if (!s) return { ...emptyForm };
    const parts = s.split(/\s+/);
    return {
      firstName: parts[0] || '',
      lastName: parts.length > 1 ? parts.slice(1).join(' ') : '',
      telephone_client: client.telephone_client ?? '',
      email_client: client.email_client ?? '',
      document_type: client.document_type ?? '',
      direction_client: client.direction_client ?? '',
    };
  }, [client]);

  const [form, setForm] = useState<Form>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<keyof Form, boolean>>({
    firstName: false,
    lastName: false,
    telephone_client: false,
    email_client: false,
    document_type: false,
    direction_client: false,
    notes: false,
  });
  const [duplicateError, setDuplicateError] = useState('');

  const fieldRefs = useRef<
    Partial<Record<keyof Form, HTMLInputElement | HTMLTextAreaElement | null>>
  >({});

  const cachedInitialRef = useRef<Form | null>(null);

  useEffect(() => {
    if (!isOpen) {
      cachedInitialRef.current = null;
      return;
    }

    if (!cachedInitialRef.current) {
      const c = client ?? null;
      const s = (c?.name_client ?? '').trim();
      const parts = s.split(/\s+/);
      cachedInitialRef.current = {
        firstName: parts[0] || '',
        lastName: parts.length > 1 ? parts.slice(1).join(' ') : '',
        telephone_client: c?.telephone_client ?? '',
        email_client: c?.email_client ?? '',
        document_type: c?.document_type ?? '',
        direction_client: c?.direction_client ?? '',
        notes: c?.notes ?? '',
      };
    }

    setForm(cachedInitialRef.current!);
    setErrors({});
    setTouched({
      firstName: false,
      lastName: false,
      telephone_client: false,
      email_client: false,
      document_type: false,
      direction_client: false,
      notes: false,
    });
  }, [isOpen, client]);

  if (!isOpen) return null;

  const handleChange =
    (name: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      const nextForm = { ...form, [name]: value };
      setForm(nextForm);

      if (touched[name]) {
        const nextErrors = validateField(name, nextForm, { ...errors });
        setErrors(nextErrors);
      }
    };

  const handleBlur = (name: keyof Form) => {
    setTouched((t) => ({ ...t, [name]: true }));
    const nextErrors = validateField(name, form, { ...errors });
    setErrors(nextErrors);
  };

  const focusFirstError = (errs: Errors) => {
    const firstKey = Object.keys(errs)[0] as keyof Form | undefined;
    if (!firstKey) return;
    const el = fieldRefs.current[firstKey];
    if (el && typeof el.focus === 'function') el.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allErrors = validateAll(form);
    setErrors(allErrors);
    setDuplicateError('');

    if (Object.keys(allErrors).length > 0) {
      setTouched({
        firstName: true,
        lastName: true,
        telephone_client: true,
        email_client: true,
        document_type: true,
        direction_client: true,
        notes: true,
      });
      focusFirstError(allErrors);
      return;
    }

    // payload para el backend
    const payload: ClientFormValues = {
      name_client: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
      telephone_client: form.telephone_client.trim(),
      email_client: form.email_client.trim(),
      document_type: form.document_type?.trim() || '',
      direction_client: form.direction_client?.trim() || '',
      notes: form.notes?.trim() || '',
    };

    onSave(payload);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={(e) => handleBackdropClick(e, onClose)}
    >
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl">
        <header className="flex items-center justify-between px-8 py-6">
          <h2 className="text-[20px] font-semibold text-gray-900">
            {readOnly ? 'Ver Cliente' : client ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </header>

        <div className="border-b border-[#E5EAF7] px-8 pt-4">
          <button
            type="button"
            className="border-b-2 border-[#3B82F6] px-1 pb-3 text-sm font-medium text-[#1E3A8A]"
          >
            Detalles del cliente
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-8 py-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#1E3A8A]">Nombre</label>
              <input
                ref={(el) => {
                  fieldRefs.current.firstName = el;
                }}
                type="text"
                value={form.firstName}
                onChange={handleChange('firstName')}
                onBlur={() => handleBlur('firstName')}
                disabled={readOnly || isSaving}
                placeholder="Nombre"
                className={`w-full rounded-md border border-[#DFE7FF] bg-white px-3 py-2 text-[15px] outline-none ${
                  errors.firstName && touched.firstName
                    ? 'border-red-300 ring-red-200 focus:border-red-300 focus:ring-red-200'
                    : ''
                }`}
              />
              {errors.firstName && touched.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#1E3A8A]">Teléfono</label>
              <input
                ref={(el) => {
                  fieldRefs.current.telephone_client = el;
                }}
                type="tel"
                value={form.telephone_client}
                onChange={handleChange('telephone_client')}
                onBlur={() => handleBlur('telephone_client')}
                disabled={readOnly || isSaving}
                placeholder="Número de teléfono"
                className={`w-full rounded-md border border-[#DFE7FF] bg-white px-3 py-2 text-[15px] outline-none focus:border-[#AFC6FF] focus:ring-2 focus:ring-[#BFD3FF] ${
                  errors.telephone_client && touched.telephone_client
                    ? 'border-red-300 ring-red-200 focus:border-red-300 focus:ring-red-200'
                    : ''
                }`}
              />
              {errors.telephone_client && touched.telephone_client && (
                <p className="mt-1 text-sm text-red-600">{errors.telephone_client}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#1E3A8A]">Apellidos</label>
              <input
                ref={(el) => {
                  fieldRefs.current.lastName = el;
                }}
                type="text"
                value={form.lastName}
                onChange={handleChange('lastName')}
                onBlur={() => handleBlur('lastName')}
                disabled={readOnly || isSaving}
                placeholder="Apellidos"
                className={`w-full rounded-md border border-[#DFE7FF] bg-white px-3 py-2 text-[15px] outline-none focus:border-[#AFC6FF] focus:ring-2 focus:ring-[#BFD3FF] ${
                  errors.lastName && touched.lastName
                    ? 'border-red-300 ring-red-200 focus:border-red-300 focus:ring-red-200'
                    : ''
                }`}
              />
              {errors.lastName && touched.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#042D95]">
                Dirección <span className="font-bold text-[#042D95]"> (Opcional)</span>
              </label>
              <input
                ref={(el) => {
                  fieldRefs.current.direction_client = el;
                }}
                type="text"
                value={form.direction_client ?? ''}
                onChange={handleChange('direction_client')}
                onBlur={() => handleBlur('direction_client')}
                disabled={readOnly || isSaving}
                placeholder="Dirección"
                className={`w-full rounded-md border border-[#DFE7FF] bg-white px-3 py-2 text-[15px] outline-none focus:border-[#AFC6FF] focus:ring-2 focus:ring-[#BFD3FF] ${
                  errors.direction_client && touched.direction_client
                    ? 'border-red-300 ring-red-200 focus:border-red-300 focus:ring-red-200'
                    : ''
                }`}
              />
              {errors.direction_client && touched.direction_client && (
                <p className="mt-1 text-sm text-red-600">{errors.direction_client}</p>
              )}
            </div>
          </div>

          {/* DNI + Correo */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#1E3A8A]">
                DNI <span className="font-normal text-[#8CA5E6]"></span>
              </label>
              <input
                ref={(el) => {
                  fieldRefs.current.document_type = el;
                }}
                type="text"
                value={form.document_type ?? ''}
                onChange={handleChange('document_type')}
                onBlur={() => handleBlur('document_type')}
                disabled={readOnly || isSaving}
                placeholder="DNI o CUIT"
                className={`w-full rounded-md border border-[#DFE7FF] bg-white px-3 py-2 text-[15px] outline-none focus:border-[#AFC6FF] focus:ring-2 focus:ring-[#BFD3FF] ${
                  errors.document_type && touched.document_type
                    ? 'border-red-300 ring-red-200 focus:border-red-300 focus:ring-red-200'
                    : ''
                }`}
              />
              {errors.document_type && touched.document_type && (
                <p className="mt-1 text-sm text-red-600">{errors.document_type}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#1E3A8A]">
                Correo Electrónico
              </label>
              <input
                ref={(el) => {
                  fieldRefs.current.email_client = el;
                }}
                type="email"
                value={form.email_client}
                onChange={handleChange('email_client')}
                onBlur={() => handleBlur('email_client')}
                disabled={readOnly || isSaving}
                placeholder="Email"
                className={`w-full rounded-md border border-[#DFE7FF] bg-white px-3 py-2 text-[15px] outline-none focus:border-[#AFC6FF] focus:ring-2 focus:ring-[#BFD3FF] ${
                  errors.email_client && touched.email_client
                    ? 'border-red-300 ring-red-200 focus:border-red-300 focus:ring-red-200'
                    : ''
                }`}
              />
              {errors.email_client && touched.email_client && (
                <p className="mt-1 text-sm text-red-600">{errors.email_client}</p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[#1E3A8A]">
              Notas <span className="font-bold text-[#042D95]"> (Opcional)</span>
            </label>
            <textarea
              ref={(el) => {
                fieldRefs.current.notes = el;
              }}
              value={form.notes ?? ''}
              onChange={handleChange('notes')}
              onBlur={() => handleBlur('notes')}
              disabled={readOnly || isSaving}
              placeholder="Notas adicionales sobre el cliente"
              className={`w-full rounded-md border border-[#DFE7FF] bg-white px-3 py-2 text-[15px] outline-none focus:border-[#AFC6FF] focus:ring-2 focus:ring-[#BFD3FF] ${
                errors.notes && touched.notes
                  ? 'border-red-300 ring-red-200 focus:border-red-300 focus:ring-red-200'
                  : ''
              }`}
              rows={3}
            />
            {errors.notes && touched.notes && (
              <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
            )}
          </div>

          {duplicateError && (
            <div className="mb-4 text-center font-semibold text-red-600">{duplicateError}</div>
          )}
          {formError && (
            <div className="mb-4 text-center font-semibold text-red-600">{formError}</div>
          )}

          <div className="flex items-center justify-center gap-4 pt-2 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-md border border-[#D6E3FF] bg-[#F5F9FF] px-6 text-[15px] font-medium text-[#6A88D9] hover:bg-[#ECF3FF] disabled:opacity-60"
            >
              {readOnly ? 'Cerrar' : 'Cancelar'}
            </button>

            {!readOnly && (
              <button
                type="submit"
                disabled={isSaving}
                className="h-10 rounded-md bg-[#3B82F6] px-6 text-[15px] font-semibold text-white shadow-sm hover:bg-[#2F6FE0] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? 'Guardando…' : 'Guardar'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientFormModal;
