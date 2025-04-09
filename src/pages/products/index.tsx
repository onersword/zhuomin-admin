import DefaultLayout from "@/layouts/default";
import { Tab, Tabs } from "@heroui/react";
import ProductList from "./productList";
import { useState } from "react";
export default function ProductsPage() {
  const [status, setStatus] = useState<"online" | "offline">("online");
  return (
    <DefaultLayout>
      <Tabs
        variant="underlined"
        selectedKey={status}
        onSelectionChange={(key) => setStatus(key as "online" | "offline")}
      >
        <Tab key="online" title="已上架产品">
          {/* <div className="flex items-center gap-2">已上架产品</div> */}
        </Tab>
        <Tab key="offline" title="已下架产品"></Tab>
      </Tabs>

      <ProductList status={status} />
    </DefaultLayout>
  );
}
