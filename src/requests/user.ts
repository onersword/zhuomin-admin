import { http } from "./http";

// Types
export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  status: number;
  wechatId: string;
  createdAt: string;
  forms: { label: string, value: string }[];
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
  getUserById: async (id:string): Promise<User> => {
    const response = await http.get<User>(`/api/users/${id}`);
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

  // Get user reminders
  getUserReminders: (userId: string) => {
    return http.get(`/api/users/${userId}/reminders`);
  },

  // Create user reminder
  createUserReminder: (userId: string, data: { title: string; description: string; remindAt: string }) => {
    return http.post(`/api/users/${userId}/reminders`, data);
  },

  // Delete user reminder
  deleteUserReminder: async (reminderId: string): Promise<any> => {
    const response = await http.delete<any>(`/api/reminders/${reminderId}`);
    return response;
  },

  // Get user files
  getUserFiles: async (userId: string): Promise<any> => {
    const response = await http.get<any>(`/api/users/${userId}/files`);
    return response;
  },

  // Upload user file
  uploadUserFile: async (userId: string, formData: FormData): Promise<any> => {
    const response = await http.post<any>(`/api/users/${userId}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },
  createRecord: async (data: any): Promise<any> => {
    const response = await http.post<any>('/api/records', data);
    return response;
  },
  uploadFile: async (formData: FormData): Promise<any> => {
    const response = await http.post<any>('/api/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },
  deleteUser: async (userId: string): Promise<any> => {
    const response = await http.delete<any>(`/api/users/${userId}`);
    return response;
  },
  addUserProduct: async (userId: string, productId: string): Promise<any> => {
    const response = await http.post<any>(`/api/users/${userId}/products`, { productId });
    return response;
  },

  updateUser: async (userId: string, data: any): Promise<any> => {
    const response = await http.patch<any>(`/api/users/${userId}`, data);
    return response;
  },
};
