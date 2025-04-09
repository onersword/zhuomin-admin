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

  // Create new user
  createUser: async (user: Omit<User, 'id'>): Promise<User> => {
    const response = await http.post<User>('/users', user);
    return response;
  },

  // Update user
  updateUser: async (id: number, user: Partial<User>): Promise<User> => {
    const response = await http.put<User>(`/users/${id}`, user);
    return response;
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    await http.delete(`/users/${id}`);
  }
};
