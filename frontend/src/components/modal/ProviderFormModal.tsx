import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Provider, ProviderFormValues } from '../../types/provider';
import type { Form, Errors } from '../../utils/validation/providerRules';
import { validateField, validateAll } from '../../utils/validation/providerRules';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: ProviderFormValues) => void;
  isSaving?: boolean;
  provider?: Provider | null;
  readOnly?: boolean;
  proveedoresLista?: Provider[];
  formError: string;
};

const emptyForm: Form = {
  name_provider: '',
  cuit_provider: '',
  direction_provider: '',
  telephone_provider: '',
  email_provider: '',
  category_provider: '',
};

const ProviderFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  isSaving = false,
  provider,
  readOnly = false,
  proveedoresLista,
  formError,
}) => {
  const initialForm: Form = useMemo(() => {
    if (!provider) return emptyForm;
    return {
      name_provider: provider.name_provider ?? '',
      cuit_provider: provider.cuit_provider ?? '',
      direction_provider: provider.direction_provider ?? '',
      telephone_provider: provider.telephone_provider ?? '',
      email_provider: provider.email_provider ?? '',
      category_provider: provider.category_provider ?? '',
    };
  }, [provider]);

  const [form, setForm] = useState<Form>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<keyof Form, boolean>>({
    name_provider: false,
    cuit_provider: false,
    direction_provider: false,
    telephone_provider: false,
    email_provider: false,
    category_provider: false,
  });
  const [duplicateError, setDuplicateError] = useState('');
  const fieldRefs = useRef<Partial<Record<keyof Form, HTMLInputElement | null>>>({});
  const cachedInitialRef = useRef<Form | null>(null);

  useEffect(() => {
    if (!isOpen) {
      cachedInitialRef.current = null;
      return;
    }

    if (!cachedInitialRef.current) {
      const p = provider ?? null;
      cachedInitialRef.current = {
        name_provider: p?.name_provider ?? '',
        cuit_provider: p?.cuit_provider ?? '',
        direction_provider: p?.direction_provider ?? '',
        telephone_provider: p?.telephone_provider ?? '',
        email_provider: p?.email_provider ?? '',
        category_provider: p?.category_provider ?? '',
      };
    }

    setForm(cachedInitialRef.current!);
    setErrors({});
    setTouched({
      name_provider: false,
      cuit_provider: false,
      direction_provider: false,
      telephone_provider: false,
      email_provider: false,
      category_provider: false,
    });
  }, [isOpen, provider]);

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
    console.log('Proveedor creado exitosamente');

    if (Object.keys(allErrors).length > 0) {
      setTouched({
        name_provider: true,
        cuit_provider: true,
        direction_provider: true,
        telephone_provider: true,
        email_provider: true,
        category_provider: true,
      });
      focusFirstError(allErrors);
      return;
    }

    // Validación mejorada de duplicados (excluye el propio proveedor si está editando)
    if (!readOnly && proveedoresLista) {
      const email = form.email_provider.trim().toLowerCase();
      const cuit = form.cuit_provider?.trim().toLowerCase() || '';
      const existe = proveedoresLista.some(
        (c) =>
          c.id_provider !== provider?.id_provider &&
          (c.email_provider?.trim().toLowerCase() === email ||
            c.cuit_provider?.trim().toLowerCase() === cuit)
      );
      if (existe) {
        setDuplicateError('Ya existe un proveedor con ese email o CUIT.');
        return;
      }
    }

    // payload para el backend
    const payload: ProviderFormValues = {
      name_provider: form.name_provider.trim(),
      cuit_provider: form.cuit_provider.trim(),
      direction_provider: form.direction_provider.trim(),
      telephone_provider: form.telephone_provider.trim(),
      email_provider: form.email_provider.trim(),
      category_provider: form.category_provider.trim() || '',
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl">
        <header className="flex items-center justify-between px-8 py-6">
          <h2 className="text-[20px] font-semibold text-gray-900">
            {readOnly ? 'Ver Proveedor' : provider ? 'Editar Proveedor' : 'Nuevo Proveedor'}
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
            Detalles del proveedor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-8 py-8">
          {/* Nombre + Teléfono */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#1E3A8A]">Empresa*</label>
              <input
                ref={(el) => {
                  fieldRefs.current.name_provider = el;
                }}
                type="text"
                value={form.name_provider}
                onChange={handleChange('name_provider')}
                onBlur={() => handleBlur('name_provider')}
                disabled={readOnly || isSaving}
                placeholder="Nombre de la empresa"
                className={`w-full rounded-md border border-[#DFE7FF] bg-white px-3 py-2 text-[15px] outline-none ${
                  errors.name_provider && touched.name_provider
                    ? 'border-red-300 ring-red-200 focus:border-red-300 focus:ring-red-200'
                    : ''
                }`}
              />
              {errors.name_provider && touched.name_provider && (
                <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                  <InformationCircleIcon className="h-4.5 w-4.5 flex-shrink-0" strokeWidth={2} />
                  <span>{errors.name_provider}</span>
                </div>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#1E3A8A]">Teléfono*</label>
              <input
                ref={(el) => {
                  fieldRefs.current.telephone_provider = el;
                }}
                type="tel"
                value={form.telephone_provider}
                onChange={handleChange('telephone_provider')}
                onBlur={() => handleBlur('telephone_provider')}
                disabled={readOnly || isSaving}
                placeholder="+57 6059284358"
                className={`w-full rounded-md border border-[#DFE7FF] bg-white px-3 py-2 text-[15px] outline-none focus:border-[#AFC6FF] focus:ring-2 focus:ring-[#BFD3FF] ${
                  errors.telephone_provider && touched.telephone_provider
                    ? 'border-red-300 ring-red-200 focus:border-red-300 focus:ring-red-200'
                    : ''
                }`}
              />
              {errors.telephone_provider && touched.telephone_provider && (
                <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                  <InformationCircleIcon className="h-4.5 w-4.5 flex-shrink-0" strokeWidth={2} />
                  <span>{errors.telephone_provider}</span>
                </div>
              )}
            </div>
          </div>

          {/* Categoría + Dirección */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#1E3A8A]">Categoría*</label>
              <input
                ref={(el) => {
                  fieldRefs.current.category_provider = el;
                }}
                type="text"
                value={form.category_provider}
                onChange={handleChange('category_provider')}
                onBlur={() => handleBlur('category_provider')}
                disabled={readOnly || isSaving}
                placeholder="Categoría"
                className={`w-full rounded-md border border-[#DFE7FF] bg-white px-3 py-2 text-[15px] outline-none focus:border-[#AFC6FF] focus:ring-2 focus:ring-[#BFD3FF] ${
                  errors.category_provider && touched.category_provider
                    ? 'border-red-300 ring-red-200 focus:border-red-300 focus:ring-red-200'
                    : ''
                }`}
              />
              {errors.category_provider && touched.category_provider && (
                <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                  <InformationCircleIcon className="h-4.5 w-4.5 flex-shrink-0" strokeWidth={2} />
                  <span>{errors.category_provider}</span>
                </div>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#1E3A8A]">
                Dirección <span className="font-normal text-[#8CA5E6]"></span>
              </label>
              <input
                ref={(el) => {
                  fieldRefs.current.direction_provider = el;
                }}
                type="text"
                value={form.direction_provider ?? ''}
                onChange={handleChange('direction_provider')}
                onBlur={() => handleBlur('direction_provider')}
                disabled={readOnly || isSaving}
                placeholder="Avda. Habaneras, 57, Mendoza"
                className={`w-full rounded-md border border-[#DFE7FF] bg-white px-3 py-2 text-[15px] outline-none focus:border-[#AFC6FF] focus:ring-2 focus:ring-[#BFD3FF] ${
                  errors.direction_provider && touched.direction_provider
                    ? 'border-red-300 ring-red-200 focus:border-red-300 focus:ring-red-200'
                    : ''
                }`}
              />
              {errors.direction_provider && touched.direction_provider && (
                <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                  <InformationCircleIcon className="h-4.5 w-4.5 flex-shrink-0" strokeWidth={2} />
                  <span>{errors.direction_provider}</span>
                </div>
              )}
            </div>
          </div>

          {/* CUIT + Correo */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#1E3A8A]">
                CUIT* <span className="font-normal text-[#8CA5E6]"></span>
              </label>
              <input
                ref={(el) => {
                  fieldRefs.current.cuit_provider = el;
                }}
                type="text"
                value={form.cuit_provider ?? ''}
                onChange={handleChange('cuit_provider')}
                onBlur={() => handleBlur('cuit_provider')}
                disabled={readOnly || isSaving}
                placeholder="00-00000000-0"
                className={`w-full rounded-md border border-[#DFE7FF] bg-white px-3 py-2 text-[15px] outline-none focus:border-[#AFC6FF] focus:ring-2 focus:ring-[#BFD3FF] ${
                  errors.cuit_provider && touched.cuit_provider
                    ? 'border-red-300 ring-red-200 focus:border-red-300 focus:ring-red-200'
                    : ''
                }`}
              />
              {errors.cuit_provider && touched.cuit_provider && (
                <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                  <InformationCircleIcon className="h-4.5 w-4.5 flex-shrink-0" strokeWidth={2} />
                  <span>{errors.cuit_provider}</span>
                </div>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#1E3A8A]">
                Correo Electrónico*
              </label>
              <input
                ref={(el) => {
                  fieldRefs.current.email_provider = el;
                }}
                type="email"
                value={form.email_provider}
                onChange={handleChange('email_provider')}
                onBlur={() => handleBlur('email_provider')}
                disabled={readOnly || isSaving}
                placeholder="empresa@correo.com"
                className={`w-full rounded-md border border-[#DFE7FF] bg-white px-3 py-2 text-[15px] outline-none focus:border-[#AFC6FF] focus:ring-2 focus:ring-[#BFD3FF] ${
                  errors.email_provider && touched.email_provider
                    ? 'border-red-300 ring-red-200 focus:border-red-300 focus:ring-red-200'
                    : ''
                }`}
              />
              {errors.email_provider && touched.email_provider && (
                <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                  <InformationCircleIcon className="h-4.5 w-4.5 flex-shrink-0" strokeWidth={2} />
                  <span>{errors.email_provider}</span>
                </div>
              )}
            </div>
          </div>

          {/* Mostrar error de duplicado en el formulario */}
          {duplicateError && (
            <div className="mb-4 text-center font-semibold text-red-600">{duplicateError}</div>
          )}
          {formError && (
            <div className="mb-4 text-center font-semibold text-red-600">{formError}</div>
          )}

          {/* Botones */}
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

export default ProviderFormModal;
