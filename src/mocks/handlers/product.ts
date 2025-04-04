import { http, HttpResponse } from 'msw';
import { mockProducts } from '../data/product';

const baseUrl = import.meta.env.VITE_API_BASE_URL;
export const productHandlers = [
  // Get all products
  http.get(`${baseUrl}/products`, () => {
    return HttpResponse.json({
      code: 0,
      data: mockProducts,
      message: 'success'
    });
  }),
];
