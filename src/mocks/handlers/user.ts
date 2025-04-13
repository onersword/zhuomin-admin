import type { User } from "@/requests/user";

import { http, HttpResponse } from "msw";

import { mockUsers } from "../data/user";

// 创建一个可变的用户列表用于模拟数据操作
let users = [...mockUsers];

export const userHandlers = [
  // Get all users
  http.get("http://localhost:3000/api/users", () => {
    console.log("Mock: GET /api/users");

    return HttpResponse.json({ data: users });
  }),

  // Get user by id
  http.get("http://localhost:3000/api/users/:id", ({ params }) => {
    console.log("Mock: GET /api/users/:id", params);
    const user = users.find((u) => u.id === Number(params.id));

    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(user);
  }),

  // Create user
  http.post("/api/users", async ({ request }) => {
    console.log("Mock: POST /api/users");
    const newUser = (await request.json()) as Omit<User, "id">;
    const id = Math.max(...users.map((u) => u.id)) + 1;
    const createdUser = { ...newUser, id };

    users.push(createdUser);

    return HttpResponse.json(createdUser);
  }),

  // Update user
  http.put("/api/users/:id", async ({ params, request }) => {
    console.log("Mock: PUT /api/users/:id", params);
    const id = Number(params.id);
    const updates = (await request.json()) as Partial<User>;
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    users[index] = { ...users[index], ...updates };

    return HttpResponse.json(users[index]);
  }),

  // Delete user
  http.delete("/api/users/:id", ({ params }) => {
    console.log("Mock: DELETE /api/users/:id", params);
    const id = Number(params.id);
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    users = users.filter((u) => u.id !== id);

    return new HttpResponse(null, { status: 204 });
  }),
];
