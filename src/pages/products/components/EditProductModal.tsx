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
      newErrors.push("产品描述不能为空");
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
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
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
                    label="产品描述"
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
