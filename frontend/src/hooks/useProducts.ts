import { useState, useEffect } from "react";
import { useAuthQuery } from "./useAuthQuery";
import { useAuthApi } from "./useAuthApi";
import { API_BASE_URL, createProductService } from "../api/productService";
import type { ProductProps, FormDataProps } from "../types/product";

export const useProducts = (token: string | null) => {
  const [productList, setProductList] = useState<ProductProps[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<ProductProps | null>(
    null
  );
  const [formData, setFormData] = useState<FormDataProps>({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const {
    data: products,
    loading: fetchLoading,
    error: fetchError,
  } = useAuthQuery<ProductProps[]>(API_BASE_URL, token);
  const {
    makeRequest,
    loading: actionLoading,
    error: actionError,
  } = useAuthApi(token);

  const productService = createProductService(makeRequest);

  useEffect(() => {
    if (products) {
      setProductList(products);
    }
  }, [products]);

  const openModal = (product: ProductProps | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        price: product.price.toString(),
        description: product.description,
        category: product.category,
        image: product.image,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        title: "",
        price: "",
        description: "",
        category: "",
        image: "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      title: "",
      price: "",
      description: "",
      category: "",
      image: "",
    });
  };

  const handleSubmit = async (): Promise<boolean> => {
    try {
      if (editingProduct) {
        const updatedProduct = await productService.updateProduct(
          editingProduct.id,
          formData
        );
        setProductList((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
        );
      } else {
        const newProduct = await productService.createProduct(formData);
        setProductList((prev) => [...prev, newProduct]);
      }

      closeModal();
      return true;
    } catch (error) {
      console.error("Error al guardar producto:", error);
      return false;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openDeleteModal = (productId: number) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setProductToDelete(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async (): Promise<boolean> => {
    if (!productToDelete) {
      return false;
    }

    try {
      await productService.deleteProduct(productToDelete);
      setProductList((prev) => prev.filter((p) => p.id !== productToDelete));
      closeDeleteModal();
      return true;
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      return false;
    }
  };

  return {
    productList,
    showModal,
    editingProduct,
    formData,
    fetchLoading,
    fetchError,
    actionLoading,
    actionError,
    openModal,
    closeModal,
    handleSubmit,
    handleInputChange,
    showDeleteModal,
    productToDelete,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
  };
};
