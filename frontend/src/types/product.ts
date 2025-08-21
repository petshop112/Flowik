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

export interface DeleteProductConfirmationModalProps {
  showDeleteModal: boolean;
  actionLoading: boolean;
  closeDeleteModal: () => void;
  handleDelete: () => Promise<boolean>;
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

export interface ProductSavedModalProps {
  description: string;
  isOpen: boolean;
  onClose: () => void;
}
