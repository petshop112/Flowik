import React from 'react';

export type FieldConfig = {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'number' | 'textarea';
  placeholder?: string;
  required?: boolean;
  optionalLabel?: string;
};

export type ModalFormProps<T> = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: T) => Promise<void> | void;
  isSaving?: boolean;
  title: string;
  subtitle?: string;
  fields: FieldConfig[];
  values: T;
  errors: Partial<Record<keyof T, string>>;
  onFieldChange: (name: keyof T, value: string) => void;
  onFieldBlur?: (name: keyof T) => void;
  canSave: boolean;
};

export default function ModalForm<T extends Record<string, any>>({
  isOpen,
  onClose,
  onSave,
  isSaving,
  title,
  subtitle,
  fields,
  values,
  errors,
  onFieldChange,
  onFieldBlur,
  canSave,
}: ModalFormProps<T>) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSave) onSave(values);
  };

  return (
    <article className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-lg bg-white p-6 shadow-xl">
        <header className="flex items-start justify-between border-b border-b-gray-400 px-8 py-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
            {subtitle && (
              <div className="mt-3">
                <span className="border-b-2 border-blue-600 pb-1 text-sm font-medium text-blue-700">
                  {subtitle}
                </span>
              </div>
            )}
          </div>
        </header>
        <form onSubmit={handleSubmit} className="px-8 py-6">
          <div className="grid gap-6 md:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="mb-1 block text-sm font-semibold text-blue-800">
                  {field.label}{' '}
                  {field.optionalLabel && (
                    <span className="font-normal text-gray-400">({field.optionalLabel})</span>
                  )}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={values[field.name] || ''}
                    onChange={(e) => onFieldChange(field.name as keyof T, e.target.value)}
                    onBlur={() => onFieldBlur && onFieldBlur(field.name as keyof T)}
                    placeholder={field.placeholder}
                    className="min-h-[88px] w-full resize-y rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <input
                    type={field.type || 'text'}
                    value={values[field.name] || ''}
                    onChange={(e) => onFieldChange(field.name as keyof T, e.target.value)}
                    onBlur={() => onFieldBlur && onFieldBlur(field.name as keyof T)}
                    placeholder={field.placeholder}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    required={field.required}
                  />
                )}
                {errors[field.name as keyof T] && (
                  <p className="mt-1 text-sm text-red-500">{errors[field.name as keyof T]}</p>
                )}
              </div>
            ))}
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
