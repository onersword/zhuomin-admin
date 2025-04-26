import { ProductStatus } from "@/types/product";
import { http } from "./http";

// Types
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  unit?: string;
  status: number;
  type: number;
  images?: string[];
  createdAt?: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  unit: string;
  status: number;
  type: number;
  images: string[];
}

// API endpoints
export const productApi = {
  // Get all products
  getProducts: async (): Promise<Product[]> => {
    const response = await http.get<Product[]>('/api/products');
    return response;
  },
  changeStatus: async (id: number, status: ProductStatus) => {
    const response = await http.patch(`/api/products/${id}`, {
      status,
    });
    return response;
  },
  updatePrice: async (id: number, price: number) => {
    const response = await http.patch(`/api/products/${id}`, {
      price,
    });
    return response;
  },
  // Create a new product
  createProduct: async (data: CreateProductData) => {
    const response = await http.post('/api/products', data);
    return response;
  },
  deleteProduct: async (id: number) => {
    const response = await http.delete(`/api/products/${id}`);
    return response;
  },
  updateProduct: async (id: number, data: CreateProductData) => {
    const response = await http.patch(`/api/products/${id}`, data);
    return response;
  },
}; 