import { usePagination } from "@/hooks/usePagination";
import { Product, productApi } from "@/requests/product";
import { ProductStatus } from "@/types/product";
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
} from "@heroui/react";
import { useCallback, useEffect, useState } from "react";

const columns = [
  {
    label: "产品名称",
    key: "name",
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
      getList();
    });
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

  const renderCell = useCallback((product: Product, columnKey: string) => {
    const cellValue = getKeyValue(product, columnKey);

    switch (columnKey) {
      case "updatedAt":
        return <div>{moment(cellValue).format("YYYY-MM-DD HH:mm:ss")}</div>;
      case "actions":
        return (
          <div className="flex gap-2 justify-end">
            <Button color="primary" size="sm" onPress={() => changeStatus(product.id)}>
              {status === ProductStatus.ONLINE ? "下架" : "上架"}
            </Button>
            <Button color="primary" size="sm">更改价格</Button>
          </div>
        );
        case "price":
          return (
            <div>
              {new Intl.NumberFormat().format(cellValue)} 元

            </div>
          )

      default:
        return <div>{cellValue}</div>;
    }
  }, []);

  useEffect(() => {
    getList();
  }, [status]);

  return (
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
          <TableColumn key={column.key} width={column.width} align={column.align ?? 'start' as any}>
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
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey as any)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
