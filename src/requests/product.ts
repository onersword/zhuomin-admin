import { ProductStatus } from "@/types/product";
import { http } from "./http";

// Types
export interface Product {
  id: number;
  name: string;
  price: number;
  status: number;
  updatedAt: string;
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
}; 