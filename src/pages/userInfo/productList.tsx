import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Pagination,
  Button,
  addToast,
} from "@heroui/react";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";

import AddProductModal from "./components/AddProductModal";

import { userApi } from "@/requests/user";
import { usePagination } from "@/hooks/usePagination";
import { useModal } from "heroui-modal-provider";
import { ComfirmModal } from "@/components/comfirmModal";

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
    label: "操作",
    key: "actions",
    width: 100,
    align: "end" as const,
  },
];

export default function ProductList({ userId }: { userId: string }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { showModal } = useModal();

  const { currentPage, setCurrentPage, currentPageData, totalPages } =
    usePagination({
      data: products,
      pageSize: 20,
    });

  const onDelete = (id: string) => {
    showModal(ComfirmModal, {
      content: "确定要删除这条已购产品吗？此操作不可恢复。",
      onConfirm: async (props) => {
        try {
          await userApi.deleteUserProduct(userId, id);
          addToast({
            title: "成功",
            description: "删除成功",
            color: "success",
          });
          props.close();
          getProducts();
        } catch (error) {
          console.error("Failed to delete file:", error);
        }
      },
    });
  };

  const renderCell = useCallback((item: any, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return <div>{item.name}</div>;
      case "description":
        return <div>{item.description}</div>;
      case "actions":
        return (
          <div className="flex gap-2 justify-end">
            <Button
              color="danger"
              size="sm"
              variant="light"
              onPress={() => {
                onDelete(item.id);
              }}
            >
              删除
            </Button>
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
