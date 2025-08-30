import type { AdjustProductPriceData, Product } from './product';

export type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  id?: number | string;
};

export interface AdjustPricesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: AdjustProductPriceData) => Promise<void>;
  selectedProducts: Product[];
  isLoading: boolean;
}
