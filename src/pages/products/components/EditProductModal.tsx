import { Product, productApi } from "@/requests/product";
import { ProductStatus, ProductType } from "@/types/product";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  Textarea,
  Select,
  SelectItem,
  Card,
  addToast,
  Form,
} from "@heroui/react";
import { useState, useEffect } from "react";

const statusOptions = [
  { label: "下架", value: ProductStatus.OFFLINE },
  { label: "上架", value: ProductStatus.ONLINE },
];

const typeOptions = [
  { label: "金卡套餐", value: ProductType.Gold },
  { label: "铂金套餐", value: ProductType.Platinum },
  { label: "钻石套餐", value: ProductType.Diamond },
  { label: "其他", value: ProductType.Other },
];

export default function EditProductModal({
  isOpen,
  onOpenChange,
  product,
  onSuccess,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  product: Product;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  // 表单数据
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [status, setStatus] = useState(ProductStatus.OFFLINE);
  const [type, setType] = useState(ProductType.Gold);
  // 当产品数据变化时更新表单
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price.toString());
      setUnit(product.unit || "");
      setStatus(product.status);
      setType(product.type);
    }
  }, [product]);

  const validForm = () => {
    const newErrors: string[] = [];

    // 验证产品名称
    if (!name) {
      newErrors.push("产品名称不能为空");
    }

    // 验证产品描述
    if (!description) {
      newErrors.push("产品简介不能为空");
    }


    // 验证价格
    if (!price || Number.isNaN(parseFloat(price))) {
      newErrors.push("请检查价格");
    }

    // 验证单位
    if (!unit) {
      newErrors.push("单位不能为空");
    }

    // 验证产品类型
    if (type === undefined || type === null) {
      newErrors.push("产品类型不能为空");
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validForm();
    if (newErrors.length > 0) {
      addToast({
        title: "错误",
        description: newErrors[0],
        color: "danger",
      });
      return;
    }

    try {
      setLoading(true);
      const productData = {
        name,
        description,
        price: parseFloat(price),
        unit,
        status,
        type,
      };
      const res = await productApi.updateProduct(
        product.id,
        productData as any
      );
      console.log("create product res", res);

      addToast({
        title: "成功",
        description: "产品更新成功",
        color: "success",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("更新产品失败", error);
      addToast({
        title: "错误",
        description: "产品更新失败",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>编辑产品</ModalHeader>
          <ModalBody>
            <div className="max-w-2xl mt-4">
              <Card className="p-4">
                <div className="flex flex-col gap-4">
                  <div>
                    <Input
                      label="产品名称"
                      labelPlacement="outside"
                      isRequired
                      placeholder="请输入产品名称"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      variant="bordered"
                      className="w-full"
                      type="text"
                      validate={(value) => {
                        if (!value) {
                          return "产品名称不能为空";
                        }
                        return true;
                      }}
                    />
                  </div>

                  <div>
                    <Textarea
                      label="产品简介"
                      labelPlacement="outside"
                      isRequired
                      placeholder="请输入产品简介"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      variant="bordered"
                      className="w-full"
                      validate={(value) => {
                        if (!value) {
                          return "产品简介不能为空";
                        }
                        return true;
                      }}
                    />
                  </div>

                  <div className="">
                    <Select
                      placeholder="请选择产品类型"
                      label="产品类型"
                      labelPlacement="outside"
                      selectedKeys={[type.toString()]}
                      onChange={(e) => {
                        setType(parseInt(e.target.value));
                      }}
                      variant="bordered"
                    >
                      {typeOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          textValue={option.label}
                          className="hover:!bg-gray-100"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        label="价格"
                        isRequired
                        labelPlacement="outside"
                        type="number"
                        placeholder="请输入价格"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        variant="bordered"
                        className="w-full"
                        validate={(value) => {
                          if (!value) {
                            return "价格不能为空";
                          } else if (
                            Number.isNaN(parseFloat(value)) ||
                            parseFloat(value) <= 0
                          ) {
                            return "价格不正确";
                          }
                          return true;
                        }}
                      />
                    </div>

                    <div className="flex-1">
                      <Input
                        label="单位"
                        labelPlacement="outside"
                        placeholder="请输入单位，如：次、节、天"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        variant="bordered"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <Select
                      placeholder="请选择状态"
                      label="状态"
                      labelPlacement="outside"
                      selectedKeys={[status.toString()]}
                      onChange={(e) => {
                        setStatus(parseInt(e.target.value));
                      }}
                      variant="bordered"
                    >
                      {statusOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          textValue={option.label}
                          className="hover:!bg-gray-100"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>
              </Card>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={() => onOpenChange(false)}>
              取消
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={loading}
              onPress={handleSubmit}
              isDisabled={loading}
            >
              保存
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  );
}
