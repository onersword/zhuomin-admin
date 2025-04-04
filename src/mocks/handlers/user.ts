import { http, HttpResponse } from 'msw';
import { mockUsers } from '../data/user';
import type { User } from '@/requests/user';

// 创建一个可变的用户列表用于模拟数据操作
let users = [...mockUsers];

export const userHandlers = [
  // Get all users
  http.get('/users', () => {
    return HttpResponse.json(users);
  }),
  
  // Get user by id
  http.get('/users/:id', ({ params }) => {
    const user = users.find(u => u.id === Number(params.id));
    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(user);
  }),

  // Create user
  http.post('/users', async ({ request }) => {
    const newUser = await request.json() as Omit<User, 'id'>;
    const id = Math.max(...users.map(u => u.id)) + 1;
    const createdUser = { ...newUser, id };
    users.push(createdUser);
    return HttpResponse.json(createdUser);
  }),

  // Update user
  http.put('/users/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const updates = await request.json() as Partial<User>;
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    users[index] = { ...users[index], ...updates };
    return HttpResponse.json(users[index]);
  }),

  // Delete user
  http.delete('/users/:id', ({ params }) => {
    const id = Number(params.id);
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    users = users.filter(u => u.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),
]; 