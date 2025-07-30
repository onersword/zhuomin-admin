import { Route, Routes } from "react-router-dom";
import { ModalProvider } from "heroui-modal-provider";

import CreateUser from "./pages/createUser/createUser";
import Login from "./pages/login/login";
import UserInfoPage from "./pages/userInfo/userInfo.page";
import RouteGuard from "./components/RouteGuard";

import UsersPage from "@/pages/users";
import ProductsPage from "@/pages/products";

function App() {
  return (
    <div className="light">
      <ModalProvider>
        <Routes>
          {/* Public routes */}
          <Route element={<Login />} path="/login" />

          {/* Protected routes */}
          <Route
            element={
              <RouteGuard>
                <UsersPage />
              </RouteGuard>
            }
            path="/"
          />
          <Route
            element={
              <RouteGuard>
                <UsersPage />
              </RouteGuard>
            }
            path="/users"
          />
          <Route
            element={
              <RouteGuard>
                <ProductsPage />
              </RouteGuard>
            }
            path="/products"
          />
          <Route
            element={
              <RouteGuard>
                <CreateUser />
              </RouteGuard>
            }
            path="/users/create"
          />
          <Route
            element={
              <RouteGuard>
                <UserInfoPage />
              </RouteGuard>
            }
            path="/users/:id"
          />
        </Routes>
      </ModalProvider>
    </div>
  );
}

export default App;
