import { Route, Routes } from "react-router-dom";

import UsersPage from "@/pages/users";
import ProductsPage from "@/pages/products";
import CreateUser from "./pages/createUser/createUser";
import Login from "./pages/login/login";
import UserInfoPage from "./pages/userInfo/userInfo.page";

function App() {
  return (
    <Routes>
      <Route element={<UsersPage/>} path="/" />
      <Route element={<UsersPage />} path="/users" />
      <Route element={<ProductsPage />} path="/products" />
      <Route element={<CreateUser />} path="/users/create" />
      <Route element={<UserInfoPage />} path="/users/:id" />
      <Route element={<Login />} path="/login" />
    </Routes>
  );
}

export default App;
