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
import { useCallback, useContext, useEffect, useState } from "react";

import ChangePriceModal from "./components/ChangePriceModal";

import {
  ProductStatus,
  ProductType,
  ProductTypeMap,
  typeColorMap,
} from "@/types/product";
import { Product, productApi } from "@/requests/product";
import { usePagination } from "@/hooks/usePagination";
import EditProductModal from "./components/EditProductModal";
import { DeleteProductModal } from "./components/DeleteProductModal";
import { ProductContext } from "./index";
import { ViewProductModal } from "./components/ViewProductModal";

const columns = [
  {
    label: "产品名称",
    key: "name",
    width: 200,
  },
  {
    label: "产品描述",
    key: "description",
    // width: 200,
  },
  // {
  //   label: "产品类型",
  //   key: "type",
  //   width: 100,
  // },
  // {
  //   label: "产品价格",
  //   key: "price",
  //   align: "end",
  //   width: 150,
  // },
  // {
  //   label: "更新时间",
  //   key: "updatedAt",
  //   align: "end",
  //   width: 200,
  // },
  {
    label: "",
    align: "end",
    key: "actions",
  },
];

export default function ProductList() {
  const {
    products: allProducts,
    loading,
    getList,
  } = useContext(ProductContext);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const { currentPage, setCurrentPage, currentPageData, totalPages } =
    usePagination({
      data: allProducts,
      pageSize: 10,
    });

  const edit = (product: Product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };
  const deleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };
  const handleConfirmDelete = () => {
    getList();
  };
  const viewProduct = (product: Product) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
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

  const renderCell = useCallback((product: Product, columnKey: string) => {
    const cellValue = getKeyValue(product, columnKey);

    switch (columnKey) {
      case "updatedAt":
        return (
          <div className="tabular-nums">
            {moment(cellValue).format("YYYY-MM-DD HH:mm:ss")}
          </div>
        );
      case "type":
        return (
          <div className="flex items-center gap-2">
            <label
              className={`text-white rounded-[4px] text-sm px-2 py-1`}
              style={{
                backgroundColor: typeColorMap[cellValue as ProductType],
              }}
            >
              {ProductTypeMap[cellValue as ProductType]}
            </label>
          </div>
        );
      case "actions":
        return (
          <div className="flex gap-2 justify-end">
            <Button color="primary" size="sm" variant="light" onPress={() => edit(product)}>
              编辑
            </Button>
            <Button
              color="danger"
              size="sm"
              variant="light"
              onPress={() => deleteProduct(product)}
            >
              删除
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
  }, []);


  return (
    <>
      <Table
        aria-label="Example table with client side pagination"
        bottomContent={
          <div className="flex w-full justify-center">
            {!loading && allProducts.length > 0 && (
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
        <>
          <EditProductModal
            isOpen={editModalOpen}
            product={selectedProduct}
            onOpenChange={setEditModalOpen}
            onSuccess={getList}
          />
          <ChangePriceModal
            isOpen={isOpen}
            oldPrice={selectedProduct.price}
            onConfirm={handlePriceChange}
            onOpenChange={onOpenChange}
          />
          <DeleteProductModal
            isOpen={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            onConfirm={handleConfirmDelete}
            product={selectedProduct}
          />
          <ViewProductModal
            isOpen={viewModalOpen}
            onOpenChange={setViewModalOpen}
            product={selectedProduct}
          />
        </>
      )}
    </>
  );
}
