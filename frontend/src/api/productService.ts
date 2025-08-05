import type { MakeRequestFunction } from "../types/api";
import type { ProductProps, FormDataProps } from "../types/product";

export const API_BASE_URL = "https://petshop-db4w.onrender.com/api/products";

export class ProductService {
  private makeRequest: MakeRequestFunction;

  constructor(makeRequest: MakeRequestFunction) {
    this.makeRequest = makeRequest;
  }

  async getAllProducts() {
    return this.makeRequest<ProductProps[]>(API_BASE_URL);
  }

  async createProduct(productData: FormDataProps) {
    const formattedData = {
      ...productData,
      price: parseFloat(productData.price),
    };

    return this.makeRequest<ProductProps>(API_BASE_URL, {
      method: "POST",
      body: JSON.stringify(formattedData),
    });
  }

  async updateProduct(productId: number, productData: FormDataProps) {
    const formattedData = {
      ...productData,
      price: parseFloat(productData.price),
    };

    return this.makeRequest<ProductProps>(`${API_BASE_URL}/${productId}`, {
      method: "PUT",
      body: JSON.stringify(formattedData),
    });
  }

  async deleteProduct(productId: number) {
    return this.makeRequest<void>(`${API_BASE_URL}/${productId}`, {
      method: "DELETE",
    });
  }
}

export const createProductService = (makeRequest: MakeRequestFunction) =>
  new ProductService(makeRequest);
