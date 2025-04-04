import { http } from "./http";

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// API endpoints
export const userApi = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    const response = await http.get<User[]>('/users');
    return response.data;
  },

  // Get user by id
  getUserById: async (id: number): Promise<User> => {
    const response = await http.get<User>(`/users/${id}`);
    return response.data;
  },

  // Create new user
  createUser: async (user: Omit<User, 'id'>): Promise<User> => {
    const response = await http.post<User>('/users', user);
    return response.data;
  },

  // Update user
  updateUser: async (id: number, user: Partial<User>): Promise<User> => {
    const response = await http.put<User>(`/users/${id}`, user);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    await http.delete(`/users/${id}`);
  }
};
