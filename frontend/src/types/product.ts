import type { ChangeEvent } from 'react';
import type { ProviderFormData } from './provider';

export interface ProductProps {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export type FormDataProps = Omit<ProductProps, 'id' | 'price'> & {
  price: string;
};

export interface ProductModalProps {
  showModal: boolean;
  editingProduct: ProductProps | null;
  formData: FormDataProps;
  actionLoading: boolean;
  closeModal: () => void;
  handleSubmit: () => Promise<boolean>;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  amount: number;
  sellPrice: number;
  buyDate: string;
  expiration: string;
  providers: string[];
  isActive?: boolean;
}

export interface ProductUpdateFormData extends Omit<Product, 'id' | 'providers'> {
  id?: number;
  description: string;
  providers?: string[];
  providerIds?: string[];
}

export type ProductWithOptionalId = Omit<ProductUpdateFormData, 'id'> & {
  id?: number;
  description: string;
  providerIds?: string[];
};

export interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: ProductWithOptionalId) => void;
  product?: ProductWithOptionalId | null;
  isLoading?: boolean;
  providers: ProviderFormData[] | undefined;
  categories: string[];
  isSaving: boolean;
}

export interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export interface ProductUpdateData extends Omit<Product, 'id' | 'providers'> {
  description: string;
  providersIds?: string[];
}

export interface ProductValidationErrors {
  name?: string;
  description?: string;
  category?: string;
  sellPrice?: string;
  expiration?: string;
}

export type ProductValidatableFields = keyof ProductValidationErrors;

export interface AdjustProductPriceData {
  value: number;
  adjustType: string;
  adjustValue: string;
  IDs: number[];
}

export interface ProductPriceToAdjust extends Product {
  isValid?: boolean;
  newPrice?: number | null;
}
