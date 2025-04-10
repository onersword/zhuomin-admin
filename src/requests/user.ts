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

  getUserNotes: async (id: string): Promise<any> => {
    const response = await http.get<any>(`/api/users/${id}/notes`);
    return response;
  },

  createUserNote: async (userId: string, data: { content: string }): Promise<any> => {
    const response = await http.post<any>(`/api/users/${userId}/notes`, data);
    return response;
  },

  updateUserNote: async (userId: string, noteId: string, data: { content: string }): Promise<any> => {
    const response = await http.patch<any>(`/api/users/${userId}/notes/${noteId}`, data);
    return response;
  },

  deleteUserNote: async (userId: string, noteId: string): Promise<any> => {
    const response = await http.delete<any>(`/api/users/${userId}/notes/${noteId}`);
    return response;
  },
};
