import { http } from "./http";

// Types
export interface Product {
  id: number;
  name: string;
  price: number;
  status: "online" | "offline";
}

// API endpoints
export const productApi = {
  // Get all products
  getProducts: async (): Promise<Product[]> => {
    const response = await http.get<Product[]>('/products');
    return response.data;
  },
}; 