import { usePagination } from "@/hooks/usePagination";
import { Product, productApi } from "@/requests/product";
import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Button,
  Pagination,
} from "@heroui/react";
import { useEffect, useState } from "react";

const columns = [
  {
    label: "产品名称",
    key: "name",
    width: null,
  },
  {
    label: "产品价格",
    key: "price",
    width: null,
  },
  {
    label: "操作",
    width: 200,
    key: "actions",
  },
];

export default function ProductList({
  status,
}: {
  status: "online" | "offline";
}) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const { currentPage, setCurrentPage, currentPageData, totalPages } =
    usePagination({
      data: products,
      pageSize: 10,
    });

  useEffect(() => {
    setLoading(true);
    productApi.getProducts().then((res: Product[]) => {
      console.log("product list", res);
      if (res) {
        setProducts(res);
      }
      setLoading(false);
    });
  }, []);
  return (
    <Table
      aria-label="Example table with client side pagination"
      bottomContent={
        <div className="flex w-full justify-center">
          {!loading && (
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={currentPage}
              total={totalPages}
              onChange={(page: number) => setCurrentPage(page)}
            />
          )}
        </div>
      }
      classNames={{
        wrapper: "min-h-[222px]",
      }}
    >
      <TableHeader>
        {columns.map((column) => (
          <TableColumn key={column.key} width={column.width}>
            {column.label}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody
        items={currentPageData}
        isLoading={loading}
        emptyContent="暂无数据"
      >
        {(item: Product) => (
          <TableRow key={item.id}>
            {columns.map((column) => (
              <TableCell key={column.key}>
                {column.key === "actions" ? (
                  <div className="flex gap-2">
                    <Button color="primary">下架</Button>
                    <Button color="primary">更改价格</Button>
                  </div>
                ) : (
                  getKeyValue(item, column.key as keyof Product)
                )}
              </TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
