import { http } from "./http";

// Types
export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  status: number;
  wechatId: string;
  createdAt: string;
  updatedAt: string;
}

// API endpoints
export const userApi = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    const response = await http.get<User[]>('/api/users');
    console.log("get users", response);
    return response;
  },

  // Get user by id
  getUserById: async (id: number): Promise<User> => {
    const response = await http.get<User>(`/users/${id}`);
    return response;
  },

  getUserProducts: async (id: string): Promise<any> => {
    const response = await http.get<any>(`/api/users/${id}/products`);
    return response;
  },
};
