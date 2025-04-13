import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";

import { useAuthStore } from "@/store/auth";
import { commonApi } from "@/requests/common";

export default function LoginPage() {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    commonApi.login(formData).then((res) => {
      // Save token to store
      setToken(res.token);
      // Redirect to home page
      navigate("/");
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            管理后台
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="sr-only" htmlFor="username">
                用户名
              </label>
              <input
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                id="username"
                name="username"
                placeholder="用户名"
                type="text"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="password">
                密码
              </label>
              <input
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                id="password"
                name="password"
                placeholder="密码"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Button
              className="w-full"
              color="primary"
              type="submit"
              variant="solid"
            >
              登录
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
