import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Pagination,
  Button,
} from "@heroui/react";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";

import AddProductModal from "./components/AddProductModal";

import { userApi } from "@/requests/user";
import { usePagination } from "@/hooks/usePagination";

const columns = [
  {
    label: "产品名称",
    key: "name",
    align: "start" as const,
    width: 300,
  },
  {
    label: "描述",
    key: "description",
    align: "start" as const,
  },
  {
    label: "购买时间",
    key: "createdAt",
    width: 200,
    align: "end" as const,
  },
];

export default function ProductList({ userId }: { userId: string }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { currentPage, setCurrentPage, currentPageData, totalPages } =
    usePagination({
      data: products,
      pageSize: 20,
    });

  const renderCell = useCallback((item: any, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return <div>{item.name}</div>;
      case "description":
        return <div className="line-clamp-1">{item.description}</div>;

      case "createdAt":
        return (
          <div className="tabular-nums">
            {moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}
          </div>
        );
    }
  }, []);

  const getProducts = () => {
    setLoading(true);
    userApi.getUserProducts(userId).then((res) => {
      setProducts(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Table
        aria-label="已购产品列表"
        bottomContent={
          <div className="flex w-full justify-center">
            {!loading && products.length > 0 && (
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
        topContent={
          <div className="flex w-full justify-start">
            <Button
              color="primary"
              size="sm"
              onPress={() => setIsAddModalOpen(true)}
            >
              添加已购产品
            </Button>
          </div>
        }
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn
              key={column.key}
              align={column.align ?? ("start" as any)}
              width={column.width}
            >
              {column.label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody
          emptyContent="暂无数据"
          isLoading={loading}
          items={currentPageData}
        >
          {(item: any) => (
            <TableRow key={item.id} className="hover:bg-gray-100">
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey as any)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <AddProductModal
        isOpen={isAddModalOpen}
        userId={userId}
        onOpenChange={setIsAddModalOpen}
        onSuccess={getProducts}
      />
    </div>
  );
}
