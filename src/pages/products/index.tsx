import { Button, Tab, Tabs } from "@heroui/react";
import { createContext, useEffect, useState } from "react";

import ProductList from "./productList";

import DefaultLayout from "@/layouts/default";
import { ProductStatus } from "@/types/product";
import { useNavigate } from "react-router-dom";
import { AddProductModal } from "./components/AddProductModal";
import { Product, productApi } from "@/requests/product";

// 创建Context
export const ProductContext = createContext<{
  products: Product[];
  loading: boolean;
  getList: () => void;
}>({
  products: [],
  loading: false,
  getList: () => {},
});

export default function ProductsPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<ProductStatus>(ProductStatus.ONLINE);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const getKeyString = (state: ProductStatus) => {
    return state === ProductStatus.ONLINE ? "online" : "offline";
  };

  const getList = () => {
    setLoading(true);
    productApi.getProducts().then((res: Product[]) => {
      console.log("product list", res);
      if (res.length) {
        setProducts(res);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <DefaultLayout>
      <div>
        <div className=" pb-3">
          <Button
            color="primary"
            radius="sm"
            onPress={() => setAddModalOpen(true)}
          >
            创建产品
          </Button>
        </div>
      </div>

      <ProductContext.Provider value={{ products, loading, getList }}>
        <ProductList />
      </ProductContext.Provider>
      <AddProductModal
        isOpen={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSuccess={() => {
          getList();
          setAddModalOpen(false);
        }}
      />
    </DefaultLayout>
  );
}
