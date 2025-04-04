import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import UsersPage from "@/pages/users";
import ProductsPage from "@/pages/products";
import CreateUser from "./pages/users/createUser";

function App() {
  return (
    <Routes>
      <Route element={<UsersPage/>} path="/" />
      <Route element={<UsersPage />} path="/users" />
      <Route element={<ProductsPage />} path="/products" />
      <Route element={<CreateUser />} path="/users/create" />
    </Routes>
  );
}

export default App;
