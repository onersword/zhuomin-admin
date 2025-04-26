import { Product } from "@/requests/product";
import { ProductStatus, ProductType, ProductTypeMap, typeColorMap } from "@/types/product";
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalBody,
  Card,
  Divider,
  ModalFooter,
  Button,
} from "@heroui/react";
import moment from "moment";

const statusMap = {
  [ProductStatus.ONLINE]: "已上架",
  [ProductStatus.OFFLINE]: "已下架",
};

export function ViewProductModal({
  isOpen,
  onOpenChange,
  product,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  product: Product;
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="text-xl font-bold">产品详情</ModalHeader>
        <ModalBody>
          <Card className="px-6 py-4">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-12 items-center">
                <div className="col-span-3">
                  <span className="text-sm font-medium text-gray-500">
                    产品名称
                  </span>
                </div>
                <div className="col-span-9">
                  <p className="text-base font-semibold">{product.name}</p>
                </div>
              </div>

              <Divider className="my-1" />

              <div className="grid grid-cols-12 items-center">
                <div className="col-span-3">
                  <span className="text-sm font-medium text-gray-500">
                    产品价格
                  </span>
                </div>
                <div className="col-span-9">
                  <p className="text-base font-medium text-primary">
                    ¥{product.price}
                    {product.unit && `/${product.unit}`}
                  </p>
                </div>
              </div>

              <Divider className="my-1" />

              <div className="grid grid-cols-12 items-center">
                <div className="col-span-3">
                  <span className="text-sm font-medium text-gray-500">
                    产品类型
                  </span>
                </div>
                <div className="col-span-9">
                  <div className="flex items-center gap-2">
                    <label
                      className={`text-white rounded-[4px] text-sm px-2 py-1`}
                      style={{
                        backgroundColor: typeColorMap[product.type as ProductType],
                      }}
                    >
                      {ProductTypeMap[product.type as ProductType]}
                    </label>
                  </div>
                </div>
              </div>

              <Divider className="my-1" />

              <div className="grid grid-cols-12 items-center">
                <div className="col-span-3">
                  <span className="text-sm font-medium text-gray-500">
                    产品状态
                  </span>
                </div>
                <div className="col-span-9">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${product.status === ProductStatus.ONLINE ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                  >
                    {statusMap[product.status as ProductStatus]}
                  </span>
                </div>
              </div>

              {product.description && (
                <>
                  <Divider className="my-1" />
                  <div className="grid grid-cols-12">
                    <div className="col-span-3">
                      <span className="text-sm font-medium text-gray-500">
                        产品描述
                      </span>
                    </div>
                    <div className="col-span-9">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {product.images && product.images.length > 0 && (
                <>
                  <Divider className="my-1" />
                  <div className="grid grid-cols-12">
                    <div className="col-span-3">
                      <span className="text-sm font-medium text-gray-500">
                        产品图片
                      </span>
                    </div>
                    <div className="col-span-9 flex flex-wrap gap-2">
                      {product.images.map((image, index) => (
                        <div
                          key={index}
                          className="w-20 h-20 rounded-md overflow-hidden border border-gray-200"
                        >
                          <img
                            src={image}
                            alt={`产品图片${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Divider className="my-1" />

              <div className="grid grid-cols-12 items-center">
                <div className="col-span-3">
                  <span className="text-sm font-medium text-gray-500">
                    创建时间
                  </span>
                </div>
                <div className="col-span-9">
                  <p className="text-sm text-gray-600">
                    {product.createdAt
                      ? moment(product.createdAt).format("YYYY-MM-DD HH:mm:ss")
                      : "无"}
                  </p>
                </div>
              </div>

              <Divider className="my-1" />

              <div className="grid grid-cols-12 items-center">
                <div className="col-span-3">
                  <span className="text-sm font-medium text-gray-500">
                    更新时间
                  </span>
                </div>
                <div className="col-span-9">
                  <p className="text-sm text-gray-600">
                    {product.updatedAt
                      ? moment(product.updatedAt).format("YYYY-MM-DD HH:mm:ss")
                      : "无"}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={() => onOpenChange(false)}>
            关闭
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
