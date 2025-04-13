import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  addToast,
  Select,
  SelectItem,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { userApi } from "@/requests/user";
import { productApi } from "@/requests/product";

interface AddProductModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
  userId: string;
}

export default function AddProductModal({
  isOpen,
  onOpenChange,
  onSuccess,
  userId,
}: AddProductModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [value, setValue] = useState<any>(null);
  const handleConfirm = async () => {
    console.log("selectedProduct",value);
    if (!value) {
      addToast({
        title: "错误",
        description: "请选择产品",
        color: "danger",
      });
      return;
    }

    setIsLoading(true);
    try {
      await userApi.addUserProduct(userId, value);
      addToast({
        title: "成功",
        description: "产品添加成功",
        color: "success",
      });
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Failed to add product:", error);
      addToast({
        title: "错误",
        description: "产品添加失败",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getProducts = () => {
    productApi.getProducts().then((res: any) => {
      setProducts(res.filter((item: any) => item.status === 1));
    });
  };

  const handleSelectionChange = (e: any) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    setValue(null);
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>添加已购产品</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Select label="产品名称" placeholder="请选择产品" selectedKeys={[value]}
                onChange={handleSelectionChange}>
                  {products.map((product) => (
                    <SelectItem key={product.id} textValue={product.name}>
                      <p>{product.name}</p>
                    </SelectItem>
                  ))}
                </Select>

              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                取消
              </Button>
              <Button
                color="primary"
                onPress={handleConfirm}
                isLoading={isLoading}
              >
                确定
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
