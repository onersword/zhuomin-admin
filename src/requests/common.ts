import { http } from "./http";

export const commonApi = {
  login: async (data: any): Promise<{token: string}> => {
    return http.post('/api/login', data);
  },
};
