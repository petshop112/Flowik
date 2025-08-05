export interface ProductProps {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export type FormDataProps = Omit<ProductProps, "id" | "price"> & {
  price: string;
};

export interface ProductModalProps {
  showModal: boolean;
  editingProduct: ProductProps | null;
  formData: FormDataProps;
  actionLoading: boolean;
  closeModal: () => void;
  handleSubmit: () => Promise<boolean>;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}
