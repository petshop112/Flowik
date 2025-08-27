import React, { useState, useMemo, useEffect } from 'react';
import { X, Calculator } from 'lucide-react';
import type { AdjustProductPriceData, Product } from '../../types/product';

interface ProductPriceToAdjust extends Product {
  isValid?: boolean;
  newPrice?: number | null;
}

interface AdjustPricesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: AdjustProductPriceData) => Promise<void>;
  selectedProducts: Product[];
  isLoading: boolean;
}

const AdjustPricesModal: React.FC<AdjustPricesModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedProducts,
  isLoading,
}) => {
  const [adjustValue, setAdjustValue] = useState<null | string>('');
  const [adjustType, setAdjustType] = useState<string>('');
  const [adjustValueType, setAdjustValueType] = useState<'Percent' | 'Money'>('Percent');
  const [calculatedPrices, setCalculatedPrices] = useState<ProductPriceToAdjust[] | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setAdjustValue('');
      setAdjustType('');
      setAdjustValueType('Percent');
      setCalculatedPrices(null);
      setErrors([]);
    }
  }, [isOpen, selectedProducts]);

  const isFormValid = useMemo(() => {
    const value = adjustValue?.length ? parseFloat(adjustValue) : null;
    return value !== null && !isNaN(value) && value >= 0 && adjustType !== '';
  }, [adjustValue, adjustType]);

  const handleCalculate = () => {
    if (!isFormValid) {
      setErrors(['Por favor, ingresa un valor de ajuste y selecciona un tipo de ajuste.']);
      setCalculatedPrices(null);
      return;
    }

    setErrors([]);

    const previews = selectedProducts.map((product) => {
      const currentPrice = Number(product.sellPrice);
      let newPrice: number;

      if (adjustValueType === 'Percent') {
        const percentage = Number(adjustValue) / 100;
        if (adjustType === 'Aumentar') {
          newPrice = currentPrice * (1 + percentage);
        } else {
          newPrice = currentPrice * (1 - percentage);
        }
      } else {
        if (adjustType === 'Aumentar') {
          newPrice = currentPrice + Number(adjustValue);
        } else {
          newPrice = currentPrice - Number(adjustValue);
        }
      }

      newPrice = Math.round(newPrice * 100) / 100;

      return {
        ...product,
        currentPrice,
        newPrice,
        isValid: newPrice >= 0.01,
      };
    });

    const invalidProducts = previews.filter((p) => !p.isValid);
    const newErrors: string[] = [];

    if (invalidProducts.length > 0) {
      newErrors.push(
        `${invalidProducts.length} producto(s) tendría(n) precios inválidos (< $0.01)`
      );
    }

    setCalculatedPrices(previews);
    setErrors(newErrors);
  };

  const handleConfirm = async () => {
    if (!calculatedPrices || errors.length > 0) {
      return;
    }

    const data: AdjustProductPriceData = {
      value: Number(adjustValue),
      adjustType,
      adjustValue: adjustValueType,
      IDs: selectedProducts.map((p) => p.id),
    };

    try {
      await onConfirm(data);
    } catch (error) {
      console.error('Error adjusting prices:', error);
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (parseFloat(value) >= 0 && !isNaN(parseFloat(value)))) {
      setAdjustValue(value);
      setCalculatedPrices(null);
      setErrors([]);
    }
  };

  const handleAdjustTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAdjustType(e.target.value);
    setCalculatedPrices(null);
    setErrors([]);
  };

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Header */}
        <header className="flex items-center justify-between px-8 pt-12">
          <h2 className="text-2xl font-semibold text-gray-900">Cambiar Precio</h2>
          <article className="flex items-center gap-1 text-sm font-semibold">
            <p className="text-dark-blue">Última actualización:</p>
            <p className="text-gray-500">{new Date().toLocaleDateString('es-ES')}</p>
          </article>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-blue-ocean absolute top-4 right-4 cursor-pointer transition-colors hover:text-gray-600"
          >
            <X size={22} />
          </button>
        </header>

        {/* Form */}
        <main className="p-6">
          <div className="mb-6 grid max-w-xl grid-cols-1 items-stretch gap-4 md:grid-cols-3">
            {/* Valor de ajuste */}
            <div className="flex h-full flex-col">
              <label className="text-dark-blue mb-2 block text-sm font-semibold">
                Valor de ajuste
              </label>
              <div className="focus-within:no-ring-offset flex overflow-hidden rounded-md border border-gray-300 focus:ring-0 focus:ring-offset-0 focus:outline-none">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="00.00"
                  value={adjustValue || ''}
                  onChange={handleValueChange}
                  className="w-full px-3 py-2 focus:ring-0 focus:outline-none"
                />
                <select
                  name="adjustValueType"
                  value={adjustValueType}
                  onChange={(e) => {
                    setAdjustValueType(e.target.value as 'Money' | 'Percent');
                    setCalculatedPrices(null);
                    setErrors([]);
                  }}
                  className="rounded-r-md border-l border-gray-300 bg-gray-100 px-3 py-2 text-gray-500 focus:ring-0 focus:outline-none"
                >
                  <option value="Money">$</option>
                  <option value="Percent">%</option>
                </select>
              </div>
            </div>

            {/* Tipo de ajuste */}
            <div className="flex h-full flex-col">
              <label className="text-dark-blue mb-2 block text-sm font-semibold">
                Tipo de ajuste
              </label>
              <select
                value={adjustType}
                onChange={handleAdjustTypeChange}
                className="w-full flex-1 rounded-md border border-gray-300 px-3 py-2 focus:ring-0 focus:ring-offset-0 focus:outline-none"
              >
                <option value="" disabled hidden>
                  Selecciona acción
                </option>
                <option value="Aumentar">Aumentar</option>
                <option value="Descontar">Descontar</option>
              </select>
            </div>

            {/* Calcular button */}
            <div className="flex items-end">
              <button
                onClick={handleCalculate}
                disabled={!isFormValid}
                className={`flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  isFormValid
                    ? 'bg-electric-blue border-electric-blue cursor-pointer text-white hover:bg-blue-500'
                    : 'text-sky-glimmer border-sky-glimmer bg-ice-glimmer cursor-not-allowed'
                }`}
              >
                <Calculator size={16} />
                Calcular
              </button>
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-3">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Errores de validación:</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc space-y-1 pl-5">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preview Table */}
          <div className="mb-6">
            <div className="border-pastel-blue overflow-hidden border-2">
              <table className="w-full">
                <thead className="bg-polar-mist">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide">
                      Nombre de Producto
                    </th>
                    <th className="border-l-2 border-white px-4 py-3 text-left text-xs font-medium tracking-wide">
                      Categoría
                    </th>
                    <th className="border-l-2 border-white px-4 py-3 text-left text-xs font-medium tracking-wide">
                      Precio Anterior
                    </th>
                    <th className="border-l-2 border-white px-4 py-3 text-left text-xs font-medium tracking-wide">
                      Precio Nuevo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-pastel-blue divide-y bg-white">
                  {selectedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className={
                        calculatedPrices &&
                        !calculatedPrices.find((p) => p.id === product.id)?.isValid
                          ? 'bg-red-50'
                          : ''
                      }
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">{product.name}</td>
                      <td className="border-pastel-blue border-l-2 px-4 py-3 text-sm text-gray-900">
                        {product.category}
                      </td>
                      <td className="border-pastel-blue border-l-2 px-4 py-3 text-sm text-gray-900">
                        ${Number(product.sellPrice).toFixed(2)}
                      </td>
                      <td
                        className={`border-pastel-blue border-l-2 px-4 py-3 text-sm ${
                          calculatedPrices &&
                          calculatedPrices.find((p) => p.id === product.id)?.isValid
                            ? 'text-deep-teal'
                            : ''
                        } `}
                      >
                        {calculatedPrices &&
                        calculatedPrices.find((p) => p.id === product.id)?.newPrice !== null &&
                        calculatedPrices.find((p) => p.id === product.id)?.newPrice !== undefined
                          ? `$${calculatedPrices.find((p) => p.id === product.id)?.newPrice?.toFixed(2)}`
                          : '$00.000'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex justify-end gap-3 px-6 py-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || !calculatedPrices || errors.length > 0}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AdjustPricesModal;
