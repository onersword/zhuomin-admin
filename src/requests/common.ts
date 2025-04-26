import { http } from "./http";

export interface UploadImageResponse {
  file_id: string;
  download_url: string;
}

export const commonApi = {
  login: async (data: any): Promise<{token: string}> => {
    return http.post('/api/login', data);
  },
  
  uploadImage: async (file: File): Promise<UploadImageResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    return http.post('/api/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
