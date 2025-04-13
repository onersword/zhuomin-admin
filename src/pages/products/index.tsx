import { Tab, Tabs } from "@heroui/react";
import { useState } from "react";

import ProductList from "./productList";

import DefaultLayout from "@/layouts/default";
import { ProductStatus } from "@/types/product";
export default function ProductsPage() {
  const [status, setStatus] = useState<ProductStatus>(ProductStatus.ONLINE);
  const getKeyString = (state: ProductStatus) => {
    return state === ProductStatus.ONLINE ? "online" : "offline";
  };

  return (
    <DefaultLayout>
      <Tabs
        selectedKey={getKeyString(status)}
        variant="underlined"
        onSelectionChange={(key) => {
          setStatus(
            key === "online" ? ProductStatus.ONLINE : ProductStatus.OFFLINE,
          );
        }}
      >
        <Tab key={"online"} title="已上架产品">
          {/* <div className="flex items-center gap-2">已上架产品</div> */}
        </Tab>
        <Tab key={"offline"} title="已下架产品" />
      </Tabs>

      <ProductList status={status} />
    </DefaultLayout>
  );
}
