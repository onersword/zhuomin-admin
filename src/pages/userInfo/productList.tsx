import NoData from "@/components/noData";
import { useEffect, useState } from "react";
import LoadingData from "@/components/loadingData";
import { userApi } from "@/requests/user";
export default function ProductList({ userId }: { userId: string }) {
  const [productList, setProductList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    userApi.getUserProducts(userId).then((res) => {
      setProductList(res);
      setLoading(false);
    });
  }, []);
  const renderProduct = () => {
    if (loading) {
      return <LoadingData />;
    }
    if (productList.length === 0) {
      return <NoData />;
    }
    return (
      <>
        {productList.map((product) => (
          <div className="bg-[#F4F4F4] shadow-md rounded-md p-5 w-[360px] " key={product.id}>
            <div className="text-gray-600">{product.name}</div>
          </div>
        ))}
      </>
    );
  };
  return (
    <div>
      <div className="flex justify-start gap-5 flex-wrap items-center rounded-md  border border-[#E5E5E5] p-5">
        {renderProduct()}
      </div>
    </div>
  );
}
