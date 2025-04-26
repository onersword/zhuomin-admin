import moment from "moment";
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
  addToast,
  useDisclosure,
} from "@heroui/react";
import { useCallback, useEffect, useState } from "react";

import ChangePriceModal from "./components/ChangePriceModal";

import { ProductStatus } from "@/types/product";
import { Product, productApi } from "@/requests/product";
import { usePagination } from "@/hooks/usePagination";

const columns = [
  {
    label: "产品名称",
    key: "name",
    width: 200,
  },
  {
    label: "产品简介",
    key: "description",
    width: 200,
  },
  {
    label: "产品价格",
    key: "price",
    align: "end",
    width: 150,
  },
  {
    label: "更新时间",
    key: "updatedAt",
    align: "end",
    width: 200,
  },
  {
    label: "",
    align: "end",
    width: 200,
    key: "actions",
  },
];

export default function ProductList({ status }: { status: ProductStatus }) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { currentPage, setCurrentPage, currentPageData, totalPages } =
    usePagination({
      data: products,
      pageSize: 10,
    });

  const changeStatus = (id: number) => {
    let tempStatus = status;

    if (status === ProductStatus.ONLINE) {
      tempStatus = ProductStatus.OFFLINE;
    } else {
      tempStatus = ProductStatus.ONLINE;
    }

    productApi.changeStatus(id, tempStatus).then(() => {
      const text = tempStatus === ProductStatus.ONLINE ? "上架" : "下架";

      addToast({
        title: "操作成功",
        description: `产品${text}成功`,
        color: "success",
      });
      getList();
    });
  };

  const changePrice = (product: Product) => {
    setSelectedProduct(product);
    onOpen();
  };

  const handlePriceChange = (newPrice: number) => {
    if (selectedProduct) {
      productApi.updatePrice(selectedProduct.id, newPrice).then(() => {
        addToast({
          title: "操作成功",
          description: "价格更新成功",
          color: "success",
        });
        getList();
      });
    }
  };

  const getList = () => {
    setLoading(true);
    console.log("status", status);
    productApi.getProducts().then((res: Product[]) => {
      console.log("product list", res);

      if (res.length) {
        setProducts(res.filter((item) => item.status === status));
      }
      setLoading(false);
    });
  };

  const renderCell = useCallback(
    (product: Product, columnKey: string) => {
      const cellValue = getKeyValue(product, columnKey);

      switch (columnKey) {
        case "updatedAt":
          return (
            <div className="tabular-nums">
              {moment(cellValue).format("YYYY-MM-DD HH:mm:ss")}
            </div>
          );
        case "actions":
          return (
            <div className="flex gap-2 justify-end">
              <Button
                color="primary"
                size="sm"
                onPress={() => changeStatus(product.id)}
              >
                {status === ProductStatus.ONLINE ? "下架" : "上架"}
              </Button>
              <Button
                color="primary"
                size="sm"
                onPress={() => changePrice(product)}
              >
                更改价格
              </Button>
            </div>
          );
        case "price":
          return (
            <div className="tabular-nums">
              {new Intl.NumberFormat().format(cellValue)} 元
            </div>
          );

        default:
          return <div>{cellValue}</div>;
      }
    },
    [status],
  );

  useEffect(() => {
    getList();
  }, [status]);

  return (
    <>
      <Table
        aria-label="Example table with client side pagination"
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
          {(item: Product) => (
            <TableRow key={item.id} className="hover:bg-gray-100">
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey as any)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {selectedProduct && (
        <ChangePriceModal
          isOpen={isOpen}
          oldPrice={selectedProduct.price}
          onConfirm={handlePriceChange}
          onOpenChange={onOpenChange}
        />
      )}
    </>
  );
}
